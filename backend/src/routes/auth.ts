import crypto from 'crypto'
import { Router } from 'express'
import type { Response } from 'express'
import { google } from 'googleapis'
import { oauthClient, SCOPES } from '../google'
import { getAccount, saveAccount } from '../store'

const router = Router()

// Anti-CSRF `state` nonces for in-flight OAuth attempts: issued with the auth
// URL, verified (and consumed) by the callback. In-memory is fine — a nonce
// only needs to outlive one trip to Google's consent screen.
const STATE_TTL_MS = 10 * 60 * 1000
const pendingStates = new Map<string, number>()

function issueState(): string {
  const now = Date.now()
  for (const [state, expiry] of pendingStates) {
    if (expiry < now) pendingStates.delete(state)
  }
  const state = crypto.randomBytes(16).toString('hex')
  pendingStates.set(state, now + STATE_TTL_MS)
  return state
}

function consumeState(state: string | undefined): boolean {
  if (!state || !pendingStates.has(state)) return false
  const valid = pendingStates.get(state)! > Date.now()
  pendingStates.delete(state)
  return valid
}

// The OAuth flow ends with a browser redirect, so errors are reported back to
// the dashboard as a query param (shown there as a toast) rather than as JSON.
function failToDashboard(res: Response, message: string): void {
  res.redirect(`/?error=${encodeURIComponent(message)}`)
}

router.get('/url', (_req, res) => {
  const client = oauthClient()
  const url = client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent select_account',
    scope: SCOPES,
    state: issueState(),
  })
  res.json({ url })
})

router.get('/callback', async (req, res) => {
  const code = typeof req.query.code === 'string' ? req.query.code : null
  const state = typeof req.query.state === 'string' ? req.query.state : undefined
  const error = typeof req.query.error === 'string' ? req.query.error : null
  if (error) return failToDashboard(res, error)
  if (!consumeState(state)) return failToDashboard(res, 'This sign-in attempt is stale or invalid — please try connecting again.')
  if (!code) return failToDashboard(res, 'No authorization code returned by Google.')

  try {
    const client = oauthClient()
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)

    const oauth2 = google.oauth2({ version: 'v2', auth: client })
    const { data: me } = await oauth2.userinfo.get()
    if (!me.id || !me.email) throw new Error('Google did not return an account id/email.')

    const drive = google.drive({ version: 'v3', auth: client })
    const { data: about } = await drive.about.get({ fields: 'storageQuota' })

    const existing = getAccount(me.id)
    saveAccount({
      id: me.id,
      provider: 'google',
      email: me.email,
      name: me.name || me.email,
      picture: me.picture || null,
      refreshToken: tokens.refresh_token || existing?.refreshToken,
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      quota: about.storageQuota || null,
      connectedAt: existing?.connectedAt || new Date().toISOString(),
    })

    res.redirect(`/?connected=${encodeURIComponent(me.email)}`)
  } catch (e) {
    failToDashboard(res, e instanceof Error ? e.message : 'Could not connect the account.')
  }
})

export default router
