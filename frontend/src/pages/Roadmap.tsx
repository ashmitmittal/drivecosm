import { Link } from 'react-router-dom'
import SiteLayout, { PageHero } from '../components/SiteLayout'
import { GITHUB_URL } from '../lib/site'

const COLUMNS: { title: string; tag: string; live?: boolean; items: { title: string; body: string }[] }[] = [
  {
    title: 'Shipped',
    tag: 'LIVE',
    live: true,
    items: [
      { title: 'Multiple Google accounts', body: 'Connect as many Google Drive accounts as you own and pool their storage.' },
      { title: 'Unified file explorer', body: 'Browse every drive as one, in grid or list view, with thumbnails.' },
      { title: 'Search across drives', body: 'One search bar that queries every connected account at once.' },
      { title: 'Smart uploads', body: 'New files go to the account with the most free space.' },
      { title: 'Storage dashboard', body: 'Combined usage ring plus a per-account breakdown.' },
      { title: 'Safe deletes', body: 'Files only ever go to Drive’s trash, restorable for 30 days.' },
    ],
  },
  {
    title: 'Next',
    tag: 'UP NEXT',
    items: [
      { title: 'DriveCosm Cloud', body: 'The hosted version: sign in and go, from any device, no API keys.' },
      { title: 'Natural-language search', body: 'Find files by describing them, powered by Claude.' },
      { title: 'Auto-organize & dedupe', body: 'Folder and tag suggestions; duplicates found across accounts.' },
      { title: 'Photos', body: 'One photo timeline across every connected drive.' },
    ],
  },
  {
    title: 'Later',
    tag: 'PLANNED',
    items: [
      { title: 'More providers', body: 'OneDrive, Dropbox, Telegram, WebDAV and S3-compatible storage.' },
      { title: 'Ask your drives', body: 'Questions and summaries over your documents, with source links.' },
      { title: 'Storage cleanup advisor', body: 'What to delete, archive or move, explained in plain language.' },
      { title: 'Teams', body: 'Shared storage pools, admin console, Workspace SSO and audit log.' },
    ],
  },
]

export default function Roadmap() {
  return (
    <SiteLayout title="Roadmap">
      <PageHero kicker="ROADMAP" title="Where DriveCosm is going">
        What&apos;s live, what we&apos;re building next, and what comes after. Priorities move with what people ask
        for, so tell us what you need.
      </PageHero>

      <section className="dc-section dc-section-tight">
        <div className="dc-roadmap">
          {COLUMNS.map((col) => (
            <div key={col.title} className="dc-roadmap-col">
              <div className="dc-roadmap-head">
                <h2>{col.title}</h2>
                <span className={`dc-pill${col.live ? ' live' : ''}`}>{col.tag}</span>
              </div>
              {col.items.map((item) => (
                <div key={item.title} className="dc-roadmap-item">
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="dc-note">
          Want something on this list sooner? <a href={`${GITHUB_URL}/issues`}>Open an issue on GitHub</a> or{' '}
          <Link to="/about#contact">get in touch</Link>.
        </p>
      </section>
    </SiteLayout>
  )
}
