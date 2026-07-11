// These interfaces are the wire contract with the backend — keep them in
// sync with backend/src/types.ts.

export interface StorageQuota {
  limit?: string | null
  usage?: string | null
}

export type ProviderId = 'google' | 'telegram' | 'onedrive' | 'dropbox' | 'webdav' | 's3'

export interface Account {
  id: string
  provider: ProviderId
  email: string
  name: string
  picture: string | null
  quota?: StorageQuota | null
  connectedAt?: string
  error?: string
}

export interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime?: string
  webViewLink?: string
  thumbnailLink?: string
  accountId: string
  accountEmail: string
}

export interface ConfigInfo {
  configured: boolean
  clientId: string | null
  redirectUri: string
}

/** Shape of every mutating endpoint's response. */
export interface ApiResult {
  ok?: boolean
  error?: string
}
