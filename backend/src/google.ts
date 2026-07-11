import { google } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'
import { getConfig, patchAccount } from './store'
import type { Account, SafeAccount } from './types'

export const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
]

// The frontend origin — Google redirects the browser back here, and the Vite
// dev server proxies /api/* through to this backend.
export const APP_ORIGIN = process.env.APP_ORIGIN || 'http://localhost:3000'
export const REDIRECT_URI = `${APP_ORIGIN}/api/auth/callback`

export function oauthClient(): OAuth2Client {
  const config = getConfig()
  if (!config?.clientId || !config?.clientSecret) {
    throw Object.assign(
      new Error('DriveCosm is not set up yet. Add your Google OAuth credentials on the Setup page.'),
      { status: 400 }
    )
  }
  return new google.auth.OAuth2(config.clientId, config.clientSecret, REDIRECT_URI)
}

// Auth client for an already-connected account. googleapis refreshes the
// access token automatically from the refresh token; we persist rotations.
export function authFor(account: Account): OAuth2Client {
  const client = oauthClient()
  client.setCredentials({
    refresh_token: account.refreshToken,
    access_token: account.accessToken ?? undefined,
    expiry_date: account.expiryDate ?? undefined,
  })
  client.on('tokens', (tokens) => {
    patchAccount(account.id, {
      accessToken: tokens.access_token,
      expiryDate: tokens.expiry_date,
      ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
    })
  })
  return client
}

export function driveFor(account: Account) {
  return google.drive({ version: 'v3', auth: authFor(account) })
}

// Strip secrets before anything is sent to the browser.
export function sanitizeAccount(account: Account & { error?: string }): SafeAccount {
  const { refreshToken, accessToken, expiryDate, ...safe } = account
  return safe
}
