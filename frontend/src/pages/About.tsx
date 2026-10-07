import SiteLayout, { PageHero } from '../components/SiteLayout'
import { CONTACT_EMAIL, COUNTRY, FOUNDER, GITHUB_URL } from '../lib/site'

const PRINCIPLES = [
  {
    title: 'Private by design',
    body: 'A tool that sees every drive you own has to earn that trust. We keep access to the minimum, never keep copies of your files, and make disconnecting real.',
  },
  {
    title: 'Open at the core',
    body: 'The self-hosted app is open source and free forever. The paid Cloud plan exists for people who would rather not run it themselves.',
  },
  {
    title: 'Honest about what exists',
    body: 'Our roadmap says what is live and what isn’t. Features are labeled “soon” until you can actually use them.',
  },
]

export default function About() {
  return (
    <SiteLayout title="About">
      <PageHero kicker="ABOUT" title="All your storage should feel like one place">
        DriveCosm is building one home for all the cloud storage you already have, starting with Google Drive.
      </PageHero>

      <section className="dc-section dc-section-tight dc-prose">
        <h2>Why DriveCosm exists</h2>
        <p>
          Almost everyone hits Google&apos;s 15 GB limit eventually. Most of us also have more than one account:
          personal, work, the old one from college. Together they hold plenty of free space, but it&apos;s scattered.
          Finding one file means signing in and out of accounts and remembering where you put it.
        </p>
        <p>
          DriveCosm connects those accounts into a single drive: one dashboard for your combined storage, one explorer
          for every file, one search bar, and uploads that go wherever there&apos;s room. The first version is open
          source and runs on your own computer. Next comes DriveCosm Cloud, a hosted version that needs no setup and
          adds AI built on Claude to search, organize and clean up across every account.
        </p>
      </section>

      <section className="dc-section dc-section-tight">
        <div className="dc-cards">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="dc-card">
              <div className="dc-card-title">{p.title}</div>
              <p className="dc-card-body">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dc-section dc-section-tight">
        <div className="dc-founder">
          <div className="dc-founder-avatar" aria-hidden="true">
            {FOUNDER.name
              .split(' ')
              .map((w) => w[0])
              .join('')}
          </div>
          <div>
            <div className="dc-kicker">TEAM</div>
            <h2 className="dc-h3">{FOUNDER.name}</h2>
            <p className="dc-founder-role">Founder · {COUNTRY}</p>
            <p className="dc-card-body">
              Designs and builds DriveCosm, from the open-source app to the upcoming Cloud service.
            </p>
            <a href={FOUNDER.github} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </div>
        </div>
      </section>

      <section id="contact" className="dc-section dc-section-tight">
        <div className="dc-panel">
          <div className="dc-kicker">CONTACT</div>
          <h2 className="dc-h2">Get in touch</h2>
          <p className="dc-lede">
            Questions, partnerships, press or feedback: email us and you&apos;ll hear back from the founder.
          </p>
          <div className="dc-ctas">
            <a className="dc-btn dc-btn-primary" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <a className="dc-btn" href={`${GITHUB_URL}/issues`} target="_blank" rel="noreferrer">
              Report a bug on GitHub
            </a>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
