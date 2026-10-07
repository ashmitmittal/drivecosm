import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import GitHubButton from '../components/GitHubButton'
import {
  IconCloud,
  IconFolders,
  IconGrid,
  IconLink,
  IconLock,
  IconSearch,
  IconSparkles,
  IconTrash,
  IconUpload,
  LogoMark,
} from '../components/Icons'
import PricingCards from '../components/PricingCards'
import SiteLayout from '../components/SiteLayout'
import { PrimaryCta } from '../components/SiteNav'
import WaitlistForm from '../components/WaitlistForm'
import { GITHUB_URL, IS_PUBLIC_SITE } from '../lib/site'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const STREAM_PATHS = [
  'M160 78 C 360 95, 480 165, 588 204',
  'M160 210 C 340 210, 460 210, 584 210',
  'M160 342 C 360 325, 480 255, 588 216',
  'M1040 78 C 840 95, 720 165, 612 204',
  'M1040 210 C 860 210, 740 210, 616 210',
  'M1040 342 C 840 325, 720 255, 612 216',
]

// Chip positions/trajectories come from the design; names use our providers.
const CHIPS = [
  { name: 'Google Drive', dot: '#34a853', left: 0, top: 56, dx: 524, dy: 133 },
  { name: 'Telegram', dot: '#2aabee', left: 0, top: 188, dx: 524, dy: 1 },
  { name: 'OneDrive', dot: '#0078d4', left: 0, top: 320, dx: 524, dy: -131 },
  { name: 'Dropbox', dot: '#0061ff', left: 1032, top: 56, dx: -524, dy: 133 },
  { name: 'WebDAV', dot: '#8b5cf6', left: 1032, top: 188, dx: -524, dy: 1 },
  { name: 'S3 / R2', dot: '#f59e0b', left: 1032, top: 320, dx: -524, dy: -131 },
]

// Everything here ships today in the self-hosted app.
const FEATURES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <IconFolders size={20} />,
    title: 'One explorer, every drive',
    body: 'Browse the folders of every connected account as if they were one drive, in grid or list view with thumbnails.',
  },
  {
    icon: <IconSearch size={20} />,
    title: 'Search everything at once',
    body: 'One search bar queries every account in parallel. Results show which drive each file lives in.',
  },
  {
    icon: <IconUpload size={20} />,
    title: 'Smart uploads',
    body: 'Drop a file and DriveCosm sends it to whichever account has the most free space, automatically.',
  },
  {
    icon: <IconCloud size={20} />,
    title: 'Combined storage dashboard',
    body: 'See your total pooled space at a glance, with a per-account breakdown of what’s used and what’s free.',
  },
  {
    icon: <IconGrid size={20} />,
    title: 'File inspector',
    body: 'Select any file to see its details, open it in Drive, download it, or move it to the trash.',
  },
  {
    icon: <IconTrash size={20} />,
    title: 'Safe by default',
    body: 'DriveCosm never permanently deletes anything. Removed files go to Drive’s trash for 30 days.',
  },
]

const PROVIDER_CARDS = [
  { name: 'Google Drive', dot: '#34a853', live: true, storage: '15 GB × every account', used: '72%' },
  { name: 'Telegram', dot: '#2aabee', live: false, storage: 'Unlimited · 2 GB/file', used: '0%' },
  { name: 'OneDrive', dot: '#0078d4', live: false, storage: '5 GB free', used: '0%' },
  { name: 'Dropbox', dot: '#0061ff', live: false, storage: '2 GB free', used: '0%' },
  { name: 'WebDAV', dot: '#8b5cf6', live: false, storage: 'Nextcloud, Koofr, Yandex…', used: '0%' },
  { name: 'S3-compatible', dot: '#f59e0b', live: false, storage: 'R2, B2, Storj, MinIO…', used: '0%' },
]

const STEPS = [
  {
    num: '01',
    title: 'Pick your setup',
    body: 'Self-host the open-source app for free with one command, or join the waitlist for DriveCosm Cloud and skip setup entirely.',
    code: 'git clone … && npm install && npm run dev',
  },
  {
    num: '02',
    title: 'Connect',
    body: 'Sign in to every Google account you own. Each one adds its free space to your pool. Self-hosting? The built-in wizard helps you create your own API keys first.',
  },
  {
    num: '03',
    title: 'Flow',
    body: 'Browse, search and upload across all of them as one big drive. New files land wherever there’s room, and DriveCosm keeps track of what lives where.',
  },
]

const AI_FEATURES = [
  {
    title: 'Natural-language search',
    body: 'Ask for “the lease PDF I signed last spring” instead of guessing file names. Search understands names, metadata and contents across every drive.',
  },
  {
    title: 'Auto-organize & dedupe',
    body: 'Suggested folders and tags for the mess you already have, and duplicates flagged even when the copies live in different accounts.',
  },
  {
    title: 'Ask your drives',
    body: 'Ask questions about your documents and get answers that link back to the source files, wherever they’re stored.',
  },
  {
    title: 'Storage cleanup advisor',
    body: 'See what’s safe to delete, archive or move to free up space, explained in plain language. Nothing changes without your approval.',
  },
]

// Illustrative content for the concept mock-up; not real user data.
const PREVIEW_RESULTS = [
  { name: 'Tax_Return_2025.pdf', account: 'personal@gmail.com', dot: '#7c6cff', when: 'Mar 2026' },
  { name: 'Salary_Statement_2025.pdf', account: 'work@gmail.com', dot: '#34a853', when: 'Apr 2026' },
  { name: 'Donation_Receipts_2025.zip', account: 'college@gmail.com', dot: '#f59e0b', when: 'Jan 2026' },
]

const PRINCIPLES: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <IconCloud size={20} />,
    title: 'Your files stay in your drives',
    body: 'DriveCosm works on top of the accounts you already have, through Google’s official API. It doesn’t keep its own copy of your files.',
  },
  {
    icon: <IconLink size={20} />,
    title: 'Open-source core',
    body: 'Every line of the self-hosted app is public on GitHub under the MIT license. Read it, audit it, fork it.',
  },
  {
    icon: <IconLock size={20} />,
    title: 'Disconnect means disconnect',
    body: 'Removing an account revokes DriveCosm’s access with Google and deletes its stored credentials.',
  },
  {
    icon: <IconTrash size={20} />,
    title: 'Nothing is ever lost',
    body: 'DriveCosm only moves files to the trash, never deletes them permanently. You can always restore.',
  },
]

const STATEMENT =
  'Your files live in five different drives. Scattered, duplicated, impossible to search. DriveCosm makes them one universe.'

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Landing() {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageWrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  // Twinkling starfield behind the hero.
  useEffect(() => {
    const canvas = canvasRef.current
    const hero = heroRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !hero || !ctx) return

    let stars: { x: number; y: number; r: number; p: number; s: number }[] = []
    const build = () => {
      canvas.width = hero.clientWidth
      canvas.height = hero.clientHeight
      stars = Array.from({ length: 170 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.3,
        p: Math.random() * Math.PI * 2,
        s: 0.4 + Math.random() * 1.2,
      }))
    }
    build()
    const obs = new ResizeObserver(build)
    obs.observe(hero)

    let raf = 0
    const tick = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const st of stars) {
        ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(st.p + t * 0.001 * st.s))
        ctx.fillStyle = '#C9CCDD'
        ctx.beginPath()
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  // The stage is authored at 1200×420 and scaled to fit the viewport.
  useEffect(() => {
    const wrap = stageWrapRef.current
    const stage = stageRef.current
    const hero = heroRef.current
    if (!wrap || !stage || !hero) return

    // Whatever height the copy leaves (minus the hero's padding and the stage's
    // top margin) is what the stage gets, so nothing tucks under the nav.
    const copy = hero.querySelector<HTMLElement>('[data-hero-copy]')
    const fit = () => {
      const hAvail = Math.max(160, hero.clientHeight - (copy?.offsetHeight ?? 340) - 150)
      const s = Math.min(1, wrap.clientWidth / 1200, hAvail / 420)
      stage.style.transform = `translateX(-50%) scale(${s})`
      wrap.style.height = `${Math.round(420 * s)}px`
    }
    fit()
    const obs = new ResizeObserver(fit)
    obs.observe(wrap)
    return () => obs.disconnect()
  }, [])

  // Scroll choreography. Selectors are scoped to this page by gsap.context.
  useLayoutEffect(() => {
    const subtle = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      gsap.from('[data-hero-copy] > *', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1 })
      gsap.from(stageWrapRef.current, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          y: subtle ? 14 : 44,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })
      gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
        gsap.from(group.children, {
          y: subtle ? 14 : 48,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: group, start: 'top 82%' },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((bar) => {
        gsap.fromTo(
          bar,
          { width: '0%' },
          {
            width: bar.dataset.used,
            ease: 'power1.out',
            scrollTrigger: { trigger: bar, start: 'top 92%', end: 'top 55%', scrub: 0.4 },
          }
        )
      })

      if (subtle) {
        gsap.set('[data-w]', { opacity: 1 })
        return
      }

      // Pinned hero: the drives converge into the core.
      const heroTl = gsap.timeline({
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '+=1800', pin: true, scrub: 0.6 },
      })
      heroTl.to('[data-hero-copy]', { y: -70, opacity: 0, duration: 0.22, ease: 'power1.in' }, 0.04)
      gsap.utils.toArray<HTMLElement>('[data-chip]').forEach((chip, i) => {
        heroTl.to(
          chip,
          { x: Number(chip.dataset.dx), y: Number(chip.dataset.dy), scale: 0.08, opacity: 0, duration: 0.42, ease: 'power2.in' },
          0.16 + i * 0.05
        )
      })
      heroTl.to('[data-stage-lines]', { opacity: 0.25, duration: 0.3 }, 0.5)
      // The diagram label hands over to the counter — fading it avoids the two colliding.
      heroTl.to('.dc-core-label', { opacity: 0, duration: 0.18 }, 0.55)
      heroTl.to('[data-core]', { scale: 1.45, duration: 0.5, ease: 'power1.inOut' }, 0.3)
      heroTl.fromTo('[data-burst]', { scale: 0.3, opacity: 0.9 }, { scale: 2.8, opacity: 0, duration: 0.32, ease: 'power2.out' }, 0.6)
      heroTl.to('[data-core]', { y: -46, duration: 0.3 }, 0.68)
      heroTl.fromTo('[data-hero-final]', { opacity: 0, y: 50 }, { opacity: 1, y: 132, duration: 0.3 }, 0.68)

      const counter = { v: 0 }
      heroTl.to(
        counter,
        {
          v: 75,
          duration: 0.3,
          onUpdate: () => {
            const el = rootRef.current?.querySelector('[data-count-gb]')
            if (el) el.textContent = String(Math.round(counter.v))
          },
        },
        0.68
      )

      // Pinned statement: word-by-word reveal.
      gsap
        .timeline({
          scrollTrigger: { trigger: '[data-statement]', start: 'top top', end: '+=1100', pin: true, scrub: 0.5 },
        })
        .to('[data-w]', { opacity: 1, stagger: 0.06, duration: 0.12, ease: 'none' })

      // Pinned horizontal how-it-works.
      const howTl = gsap.timeline({
        scrollTrigger: { trigger: '[data-hwrap]', start: 'top top', end: '+=1800', pin: true, scrub: 0.5 },
      })
      howTl.to('[data-htrack]', { xPercent: -66.6667, ease: 'none', duration: 1 }, 0)
      howTl.to('[data-hprogress]', { width: '100%', ease: 'none', duration: 1 }, 0)

      // CTA orb rising.
      gsap.fromTo(
        '[data-orb]',
        { y: 300, scale: 0.8 },
        { y: 40, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '[data-cta]', start: 'top 95%', end: 'bottom bottom', scrub: 0.4 } }
      )
      gsap.from('[data-cta-inner]', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-cta]', start: 'top 75%' },
      })

      // Starfield parallax while the hero is pinned.
      gsap.to(canvasRef.current, {
        y: 120,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: '+=1800', scrub: true },
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <SiteLayout>
      <div ref={rootRef}>
        <section ref={heroRef} className="dc-hero">
          <canvas ref={canvasRef} className="dc-stars" />
          <div className="dc-hero-glow" />

          <div data-hero-copy className="dc-hero-copy">
            <div className="dc-badge">UNIFIED CLOUD STORAGE</div>
            <h1 className="dc-h1">
              Every drive.
              <br />
              <span className="dc-grad">One cosmos.</span>
            </h1>
            <p className="dc-sub">
              Pool every Google account you own into one drive with one search bar. Free to self-host today.
              DriveCosm Cloud, with AI built on Claude, is coming soon.
            </p>
            <div className="dc-ctas">
              {IS_PUBLIC_SITE ? (
                <>
                  <Link to="#waitlist" className="dc-btn dc-btn-primary">
                    Join the Cloud waitlist
                  </Link>
                  <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="dc-btn">
                    Self-host for free
                  </a>
                </>
              ) : (
                <>
                  <Link to="/app" className="dc-btn dc-btn-primary">
                    Connect your drives
                  </Link>
                  <a href="#how" className="dc-btn">
                    See how it works
                  </a>
                </>
              )}
            </div>
          </div>

          <div ref={stageWrapRef} className="dc-stage-wrap">
            <div ref={stageRef} className="dc-stage">
              <svg data-stage-lines width="1200" height="420" viewBox="0 0 1200 420" fill="none">
                {STREAM_PATHS.map((d) => (
                  <path key={d} className="dc-stream" d={d} fill="none" strokeDasharray="4 10" strokeLinecap="round" />
                ))}
              </svg>
              <div className="dc-stage-layer">
                {STREAM_PATHS.flatMap((path, i) => [0, 1.6].map((extra) => (
                  <div
                    key={`${i}-${extra}`}
                    className="dc-particle"
                    style={{ offsetPath: `path('${path}')`, animationDelay: `${(i * 0.45 + extra).toFixed(2)}s` }}
                  />
                )))}

                {CHIPS.map((chip) => (
                  <div
                    key={chip.name}
                    data-chip
                    data-dx={chip.dx}
                    data-dy={chip.dy}
                    className="dc-chip"
                    style={{ left: chip.left, top: chip.top }}
                  >
                    <span className="dc-chip-dot" style={{ background: chip.dot }} />
                    <span className="dc-chip-name">{chip.name}</span>
                  </div>
                ))}

                <div className="dc-ring-pulse">
                  <div />
                </div>
                <div className="dc-ring-spin">
                  <div />
                </div>
                <div data-burst className="dc-burst" />
                <div data-core className="dc-core">
                  <LogoMark size={44} core="#05060E" style={{ color: '#05060E' }} />
                </div>
                <div className="dc-core-label">DRIVECOSM CORE</div>
              </div>
            </div>

            <div data-hero-final className="dc-final">
              <div className="dc-final-num">
                <span data-count-gb>0</span>
                <span className="dc-accent"> GB</span>
              </div>
              <div className="dc-final-sub">FIVE FREE ACCOUNTS. ONE COSMOS.</div>
            </div>
          </div>
        </section>

        <section data-statement className="dc-statement">
          <div className="dc-circle dc-circle-a" />
          <div className="dc-circle dc-circle-b" />
          <p>
            {STATEMENT.split(' ').map((w, i) => (
              <span key={i} data-w>
                {w}{' '}
              </span>
            ))}
          </p>
        </section>

        <section id="features" className="dc-section">
          <div data-reveal className="dc-section-head">
            <div className="dc-kicker">01 / FEATURES</div>
            <h2 className="dc-h2">One drive, made of all of yours</h2>
            <p className="dc-lede">
              Everything below works today in the free, open-source edition. No more signing in and out of accounts to
              find one file.
            </p>
          </div>
          <div data-reveal-group className="dc-cards">
            {FEATURES.map((f) => (
              <div key={f.title} className="dc-card">
                <span className="dc-icon-box">{f.icon}</span>
                <div className="dc-card-title">{f.title}</div>
                <p className="dc-card-body">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="connect" className="dc-section">
          <div data-reveal className="dc-section-head">
            <div className="dc-kicker">02 / CONNECT</div>
            <h2 className="dc-h2">Connect your drives</h2>
            <p className="dc-lede">
              Link each account through Google&apos;s own secure sign-in in seconds. Google Drive is live now; the
              rest are next on the roadmap.
            </p>
          </div>
          <div data-reveal-group className="dc-cards">
            {PROVIDER_CARDS.map((prov) => (
              <div key={prov.name} className="dc-card">
                <div className="dc-card-head">
                  <div className="dc-card-title">
                    <span className="dc-chip-dot" style={{ background: prov.dot }} />
                    {prov.name}
                  </div>
                  <span className={`dc-pill${prov.live ? ' live' : ''}`}>{prov.live ? 'LIVE' : 'SOON'}</span>
                </div>
                <div>
                  <div className="dc-bar-track">
                    <div data-bar data-used={prov.used} className="dc-bar" />
                  </div>
                  <div className="dc-bar-meta" style={{ marginTop: 8 }}>
                    <span>{prov.storage}</span>
                    <span>{prov.live ? prov.used : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how" data-hwrap className="dc-hwrap">
          <div className="dc-hhead">
            <div className="dc-hhead-copy">
              <div className="dc-kicker">03 / HOW IT WORKS</div>
              <h2 className="dc-h2">Three steps to one universe</h2>
            </div>
            <div className="dc-hprogress-track">
              <div data-hprogress className="dc-hprogress" />
            </div>
          </div>
          <div data-htrack className="dc-htrack">
            {STEPS.map((step) => (
              <div key={step.num} className="dc-hslide">
                <div className="dc-hslide-inner">
                  <div className="dc-hnum">{step.num}</div>
                  <div className="dc-hbody">
                    <div className="dc-htitle">{step.title}</div>
                    <div className="dc-htext">{step.body}</div>
                    {step.code && <code className="dc-hcode">{step.code}</code>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="ai" className="dc-section">
          <div className="dc-split">
            <div data-reveal className="dc-section-head">
              <div className="dc-kicker">04 / INTELLIGENCE</div>
              <h2 className="dc-h2">Your drives, understood</h2>
              <p className="dc-lede">
                Pooling storage is step one. Next, DriveCosm Cloud adds AI built on Claude by Anthropic, so you can
                find, organize and clean up files across every account by just asking.
              </p>
              <span className="dc-pill dc-pill-accent">IN DEVELOPMENT · CLOUD PRO</span>
              <ul className="dc-ai-list">
                {AI_FEATURES.map((f) => (
                  <li key={f.title}>
                    <IconSparkles size={18} />
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="dc-preview" aria-label="Concept preview of natural-language search">
              <div className="dc-preview-tag">CONCEPT PREVIEW</div>
              <div className="dc-preview-search">
                <IconSearch size={16} />
                <span>my tax documents from last year</span>
              </div>
              <div className="dc-preview-answer">
                <IconSparkles size={15} />
                <span>Found 3 files from 2025 across 3 of your drives.</span>
              </div>
              <ul className="dc-preview-results">
                {PREVIEW_RESULTS.map((r) => (
                  <li key={r.name}>
                    <span className="dc-preview-file">{r.name}</span>
                    <span className="dc-preview-meta">
                      <span className="dc-chip-dot" style={{ background: r.dot }} />
                      {r.account} · {r.when}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="dc-preview-foot">Opt-in. Files are only sent to Claude when you use an AI feature.</p>
            </div>
          </div>
        </section>

        <section id="privacy-first" className="dc-section">
          <div data-reveal className="dc-section-head">
            <div className="dc-kicker">05 / PRIVATE BY DESIGN</div>
            <h2 className="dc-h2">Built to be trusted with your files</h2>
            <p className="dc-lede">
              A tool that sees all your drives has to earn that access. These are the rules DriveCosm is built on.
            </p>
          </div>
          <div data-reveal-group className="dc-cards dc-cards-4">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="dc-card">
                <span className="dc-icon-box">{p.icon}</span>
                <div className="dc-card-title">{p.title}</div>
                <p className="dc-card-body">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="dc-section">
          <div data-reveal className="dc-section-head">
            <div className="dc-kicker">06 / PRICING</div>
            <h2 className="dc-h2">Free to self-host. Simple when hosted.</h2>
            <p className="dc-lede">
              Run the open-source app yourself for free, forever. Or let us host it, with AI features included.
            </p>
          </div>
          <div data-reveal>
            <PricingCards waitlistHref="#waitlist" />
          </div>
          <div className="dc-more">
            <Link to="/pricing">Compare plans in detail →</Link>
          </div>
        </section>

        <section id="waitlist" data-cta className="dc-cta">
          <div data-orb className="dc-orb" />
          <div data-cta-inner className="dc-cta-inner">
            <h2>Bring your universe together.</h2>
            {IS_PUBLIC_SITE ? (
              <>
                <p className="dc-lede">
                  DriveCosm Cloud is coming. Join the waitlist to get access as soon as it opens.
                </p>
                <WaitlistForm />
                <a className="dc-text-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
                  Or self-host it for free today →
                </a>
              </>
            ) : (
              <div className="dc-ctas">
                <PrimaryCta className="dc-btn dc-btn-primary" />
                <GitHubButton />
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteLayout>
  )
}
