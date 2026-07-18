import { Link } from 'react-router-dom'
import CopyRow from '../components/CopyRow'
import { LogoMark } from '../components/Icons'
import { CLONE_COMMAND, GITHUB_URL } from '../lib/site'

// Shown at /app on the public website, where the app itself doesn't exist.
export default function PublicAppNotice() {
  return (
    <div className="empty empty-tall">
      <div className="empty-icon">
        <LogoMark size={30} core="var(--accent)" />
      </div>
      <h3>DriveCosm runs on your machine</h3>
      <p>
        There is no hosted version — that&apos;s the point. Your drives connect on your own computer
        and your tokens never leave it. You&apos;ll be up and running in about two minutes:
      </p>
      <div style={{ maxWidth: 640, margin: '0 auto 20px', textAlign: 'left' }}>
        <CopyRow value={CLONE_COMMAND} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a className="btn btn-primary" href={GITHUB_URL} target="_blank" rel="noreferrer">
          Get it on GitHub
        </a>
        <Link className="btn" to="/">
          Back to the site
        </Link>
      </div>
    </div>
  )
}
