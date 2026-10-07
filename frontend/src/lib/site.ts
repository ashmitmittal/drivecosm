// One source of truth for the project's public links and company details.
export const GITHUB_REPO = 'ashmitmittal/drivecosm'
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export const CLONE_COMMAND = `git clone ${GITHUB_URL}.git && cd drivecosm && npm install && npm run dev`

export const SITE_URL = 'https://drivecosm.com'
export const CONTACT_EMAIL = 'support@drivecosm.com'
export const FOUNDER = { name: 'Ashmit Mittal', github: 'https://github.com/ashmitmittal' }
export const COUNTRY = 'India'

/** Date the Privacy Policy and Terms last changed — bump it when editing either. */
export const LEGAL_UPDATED = 'October 7, 2026'

/**
 * True when this bundle is served from the public website (drivecosm.com)
 * rather than a locally running instance. The app itself only exists locally —
 * on the public site there is no backend, so the UI switches to marketing
 * mode: CTAs point to the waitlist and GitHub, and /app explains how to get it.
 */
export const IS_PUBLIC_SITE =
  typeof window !== 'undefined' && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
