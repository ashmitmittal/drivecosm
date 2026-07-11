import { pipeline } from 'stream'
import { Router } from 'express'
import { driveFor } from '../google'
import { getAccount, listAccounts } from '../store'
import type { DriveFileSummary } from '../types'

const router = Router()

const FOLDER_MIME = 'application/vnd.google-apps.folder'

/** Escapes a user-typed search term for embedding in a Drive query literal. */
function escapeQueryTerm(term: string): string {
  return term.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

// Unified listing with two modes:
//   - browse (default): children of `parent` (a folder id, scoped to one
//     account) or, with no parent, the merged root of every drive
//   - search (`q`): flat results across everything, ignoring folders' nesting
// Folders are included and sorted first, like any file explorer. Accounts
// that can't be reached are reported in `errors` so their files don't just
// silently vanish.
router.get('/', async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const accountFilter = typeof req.query.accountId === 'string' ? req.query.accountId : ''
  const parent = typeof req.query.parent === 'string' ? req.query.parent : ''

  let accounts = listAccounts()
  if (accountFilter) accounts = accounts.filter((a) => a.id === accountFilter)

  const parts = ['trashed = false']
  if (q) parts.push(`name contains '${escapeQueryTerm(q)}'`)
  else parts.push(`'${escapeQueryTerm(parent || 'root')}' in parents`)
  const query = parts.join(' and ')

  const results = await Promise.all(
    accounts.map(async (account) => {
      try {
        const { data } = await driveFor(account).files.list({
          q: query,
          pageSize: 100,
          orderBy: 'folder,modifiedTime desc',
          fields: 'files(id,name,mimeType,size,modifiedTime,webViewLink,thumbnailLink)',
        })
        // Map fields explicitly so the response provably matches the contract.
        const files = (data.files || []).map(
          (f): DriveFileSummary => ({
            id: f.id ?? '',
            name: f.name ?? 'Untitled',
            mimeType: f.mimeType ?? '',
            size: f.size ?? undefined,
            modifiedTime: f.modifiedTime ?? undefined,
            webViewLink: f.webViewLink ?? undefined,
            thumbnailLink: f.thumbnailLink ?? undefined,
            accountId: account.id,
            accountEmail: account.email,
          })
        )
        return { files }
      } catch {
        return { error: { accountEmail: account.email, message: 'Could not reach this account.' } }
      }
    })
  )

  const files = results
    .flatMap((r) => r.files || [])
    .sort(
      (a, b) =>
        Number(b.mimeType === FOLDER_MIME) - Number(a.mimeType === FOLDER_MIME) ||
        new Date(b.modifiedTime || 0).getTime() - new Date(a.modifiedTime || 0).getTime()
    )
  const errors = results.flatMap((r) => (r.error ? [r.error] : []))
  res.json({ files, errors })
})

router.get('/download', async (req, res) => {
  const accountId = typeof req.query.accountId === 'string' ? req.query.accountId : ''
  const fileId = typeof req.query.id === 'string' ? req.query.id : ''
  const account = getAccount(accountId)
  if (!account || !fileId) {
    res.status(404).send('Not found')
    return
  }

  try {
    const drive = driveFor(account)
    const { data: meta } = await drive.files.get({ fileId, fields: 'name,mimeType,size' })
    if (meta.mimeType?.startsWith('application/vnd.google-apps')) {
      res.status(400).send('Google Docs, Sheets and Slides can only be opened in Drive.')
      return
    }
    const driveRes = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'stream' })
    res.setHeader('Content-Type', meta.mimeType || 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(meta.name || 'download')}`)
    if (meta.size) res.setHeader('Content-Length', meta.size)
    // pipeline (unlike .pipe) handles mid-transfer failures on either side —
    // without it, a dropped Drive stream would crash the whole process.
    pipeline(driveRes.data, res, (err) => {
      if (err) res.destroy()
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Download failed'
    if (!res.headersSent) res.status(500).send(message)
    else res.end()
  }
})

// Moves a file to that account's Drive trash (recoverable for 30 days) —
// DriveCosm never permanently deletes anything.
router.post('/trash', async (req, res) => {
  const account = getAccount(req.body?.accountId)
  const fileId = typeof req.body?.fileId === 'string' ? req.body.fileId : ''
  if (!account || !fileId) {
    res.status(404).json({ error: 'File not found.' })
    return
  }
  try {
    await driveFor(account).files.update({ fileId, requestBody: { trashed: true } })
    res.json({ ok: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Could not move the file to trash.'
    res.status(500).json({ error: message })
  }
})

export default router
