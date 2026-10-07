import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '../pages/Landing.css'
import '../pages/Site.css'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import SiteFooter from './SiteFooter'
import SiteNav from './SiteNav'

const DEFAULT_TITLE = 'DriveCosm: all your cloud storage, one place'

/** Shell for every public page: nav, content, footer, in the landing's dark palette. */
export default function SiteLayout({ title, children }: { title?: string; children: ReactNode }) {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    document.title = title ? `${title} · DriveCosm` : DEFAULT_TITLE
  }, [title])

  // React Router doesn't scroll on navigation. Runs after the page's own
  // layout effects, so the landing's pinned sections already have their final
  // height when we measure.
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const raf = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return (
    <div className="landing">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}

/** Title block at the top of the inner pages. */
export function PageHero({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="dc-page-hero">
      <div className="dc-hero-glow" />
      <div className="dc-kicker">{kicker}</div>
      <h1 className="dc-page-title">{title}</h1>
      {children && <p className="dc-lede">{children}</p>}
    </header>
  )
}
