import SiteLayout, { PageHero } from '../components/SiteLayout'
import WaitlistForm from '../components/WaitlistForm'
import { CLONE_COMMAND, GITHUB_URL } from '../lib/site'

// Shown at /app on the public website, where the app itself doesn't exist yet.
export default function PublicAppNotice() {
  return (
    <SiteLayout title="Get DriveCosm">
      <PageHero kicker="GET DRIVECOSM" title="Two ways to get started">
        DriveCosm Cloud isn&apos;t open yet. You can join the waitlist, or run the free open-source edition on your
        own computer today.
      </PageHero>

      <section className="dc-section dc-section-tight">
        <div className="dc-cards dc-cards-2">
          <div className="dc-card">
            <div className="dc-card-head">
              <div className="dc-card-title">DriveCosm Cloud</div>
              <span className="dc-pill dc-pill-accent">WAITLIST</span>
            </div>
            <p className="dc-card-body">Hosted for you, no setup, AI built in. We&apos;ll email you when it opens.</p>
            <WaitlistForm />
          </div>
          <div className="dc-card">
            <div className="dc-card-head">
              <div className="dc-card-title">Self-hosted</div>
              <span className="dc-pill live">FREE · AVAILABLE NOW</span>
            </div>
            <p className="dc-card-body">
              Needs Node.js 20.19+. Your tokens never leave your computer. Paste this into a terminal:
            </p>
            <code className="dc-hcode dc-code-block">{CLONE_COMMAND}</code>
            <a className="dc-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
