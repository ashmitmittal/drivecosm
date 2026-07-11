import { Router } from 'express'
import { authFor, driveFor, sanitizeAccount } from '../google'
import { getAccount, listAccounts, patchAccount, removeAccount } from '../store'

const router = Router()

router.get('/', async (_req, res) => {
  const accounts = listAccounts()
  const results = await Promise.all(
    accounts.map(async (account) => {
      try {
        const { data } = await driveFor(account).about.get({ fields: 'storageQuota' })
        patchAccount(account.id, { quota: data.storageQuota })
        return sanitizeAccount({ ...account, quota: data.storageQuota })
      } catch {
        // Null the quota too — stale numbers must not sneak into the totals.
        return sanitizeAccount({
          ...account,
          quota: null,
          error: 'Could not reach this account. Try reconnecting it.',
        })
      }
    })
  )
  res.json({ accounts: results })
})

router.delete('/:id', async (req, res) => {
  const account = getAccount(req.params.id)
  if (!account) {
    res.status(404).json({ error: 'Account not found.' })
    return
  }
  // Best effort: revoke the refresh token with Google so access is truly cut
  // off — revoking it also invalidates any access tokens minted from it.
  try {
    if (account.refreshToken) await authFor(account).revokeToken(account.refreshToken)
  } catch {
    // Already revoked or expired — removing our copy is all that's left to do.
  }
  removeAccount(account.id)
  res.json({ ok: true })
})

export default router
