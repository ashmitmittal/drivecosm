// One source of truth for the project's public links.
export const GITHUB_REPO = 'ashmitmittal/drivecosm'
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

export const CLONE_COMMAND = `git clone ${GITHUB_URL}.git && cd drivecosm && npm install && npm run dev`

/**
 * True when this bundle is served from the public website (drivecosm.com)
 * rather than a locally running instance. The app itself only exists locally —
 * on the public site there is no backend, so the UI switches to marketing
 * mode: CTAs point to GitHub and /app shows a "runs on your machine" notice.
 */
export const IS_PUBLIC_SITE =
  typeof window !== 'undefined' && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)
