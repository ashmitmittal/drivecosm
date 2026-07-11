import fs from 'fs'
import os from 'os'
import path from 'path'
import { Router } from 'express'
import multer from 'multer'
import { driveFor } from '../google'
import { listAccounts } from '../store'

const router = Router()

// Uploads are staged to a temp file on disk, then streamed to Drive — nothing
// is held in memory, so multi-GB files are fine.
const upload = multer({
  dest: path.join(os.tmpdir(), 'drivecosm-uploads'),
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
})

// Smart routing: the file goes to whichever account has the most free space.
router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file
  if (!file) {
    res.status(400).json({ error: 'No file was provided.' })
    return
  }

  try {
    const accounts = listAccounts()
    if (!accounts.length) {
      res.status(400).json({ error: 'Connect a Google account first.' })
      return
    }

    const withFree = await Promise.all(
      accounts.map(async (account) => {
        try {
          const { data } = await driveFor(account).about.get({ fields: 'storageQuota' })
          const quota = data.storageQuota || {}
          const free = quota.limit ? Number(quota.limit) - Number(quota.usage || 0) : Infinity
          return { account, free }
        } catch {
          return { account, free: -1 }
        }
      })
    )
    withFree.sort((a, b) => b.free - a.free)
    const target = withFree[0]

    if (target.free < 0) {
      res.status(502).json({ error: 'Could not reach any of your accounts. Try reconnecting them.' })
      return
    }
    if (target.free !== Infinity && target.free < file.size) {
      res.status(400).json({ error: 'No connected account has enough free space for this file.' })
      return
    }

    // Multer decodes filenames as latin1; recover the original UTF-8 name.
    const name = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const { data } = await driveFor(target.account).files.create({
      requestBody: { name },
      media: {
        mimeType: file.mimetype || 'application/octet-stream',
        body: fs.createReadStream(file.path),
      },
      fields: 'id,name',
    })
    res.json({ ok: true, file: data, accountEmail: target.account.email })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Upload failed.'
    res.status(500).json({ error: message })
  } finally {
    fs.unlink(file.path, () => {})
  }
})

export default router
