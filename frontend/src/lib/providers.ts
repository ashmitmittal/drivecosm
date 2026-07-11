import type { ProviderId } from '../types'

// The provider registry drives every provider-aware piece of UI: the picker
// modal, sidebar glyphs, and account badges. Shipping a new integration
// should mostly mean flipping `status` here once its backend adapter exists.
export interface ProviderInfo {
  id: ProviderId
  name: string
  tagline: string
  color: string
  status: 'available' | 'soon'
}

export const PROVIDERS: ProviderInfo[] = [
  { id: 'google', name: 'Google Drive', tagline: '15 GB free per account', color: '#34a853', status: 'available' },
  { id: 'telegram', name: 'Telegram', tagline: 'Unlimited storage, 2 GB per file', color: '#2aabee', status: 'soon' },
  { id: 'onedrive', name: 'OneDrive', tagline: '5 GB free per account', color: '#0078d4', status: 'soon' },
  { id: 'dropbox', name: 'Dropbox', tagline: '2 GB free per account', color: '#0061ff', status: 'soon' },
  { id: 'webdav', name: 'WebDAV', tagline: 'Nextcloud, Koofr, Yandex & more', color: '#8b5cf6', status: 'soon' },
  { id: 's3', name: 'S3-compatible', tagline: 'R2, B2, Storj, MinIO & more', color: '#f59e0b', status: 'soon' },
]

export function providerInfo(id: ProviderId): ProviderInfo {
  return PROVIDERS.find((p) => p.id === id) ?? PROVIDERS[0]
}
