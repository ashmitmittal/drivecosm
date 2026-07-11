export interface OAuthConfig {
  clientId: string
  clientSecret: string
}

export interface StorageQuota {
  limit?: string | null
  usage?: string | null
}

export interface Account {
  id: string
  /** Storage provider this account belongs to. Only Google Drive for now. */
  provider: 'google'
  email: string
  name: string
  picture: string | null
  refreshToken?: string
  accessToken?: string | null
  expiryDate?: number | null
  quota?: StorageQuota | null
  connectedAt?: string
}

/** Account shape safe to send to the browser — no tokens. */
export type SafeAccount = Omit<Account, 'refreshToken' | 'accessToken' | 'expiryDate'> & {
  error?: string
}

export interface StoreData {
  config: OAuthConfig | null
  accounts: Account[]
}

/**
 * File shape sent over the wire. This is the contract with the frontend —
 * keep it in sync with DriveFile in frontend/src/types.ts.
 */
export interface DriveFileSummary {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime?: string
  webViewLink?: string
  /** Short-lived Google-hosted preview image, when Drive provides one. */
  thumbnailLink?: string
  accountId: string
  accountEmail: string
}
