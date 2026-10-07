import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import GitHubButton from './GitHubButton'
import { IconClose, LogoMark } from './Icons'
import { useAccounts } from '../lib/AccountsContext'
import { IS_PUBLIC_SITE } from '../lib/site'

const LINKS = [
  { to: '/#features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/about', label: 'About' },
]

/** The primary call-to-action: the waitlist on the public site, the app when running locally. */
export function PrimaryCta({ className }: { className: string }) {
  const { pathname } = useLocation()
  const { accounts } = useAccounts()
  if (IS_PUBLIC_SITE) {
    // /pricing has its own waitlist section; everywhere else, use the landing page's.
    return (
      <Link to={pathname === '/pricing' ? '/pricing#waitlist' : '/#waitlist'} className={className}>
        Join the waitlist
      </Link>
    )
  }
  return (
    <Link to="/app" className={className}>
      {(accounts?.length ?? 0) > 0 ? 'Open your dashboard' : 'Launch app'}
    </Link>
  )
}

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location])

  return (
    <nav className={`dc-nav${open ? ' open' : ''}`}>
      <Link to="/" className="dc-nav-brand">
        <LogoMark size={26} />
        <span>
          Drive<span className="dc-accent">Cosm</span>
        </span>
      </Link>
      <div className="dc-nav-links">
        {LINKS.map((l) =>
          // NavLink ignores the hash, so it would mark "Features" active on every visit to /.
          l.to.includes('#') ? (
            <Link key={l.to} to={l.to} className="dc-nav-link">
              {l.label}
            </Link>
          ) : (
            <NavLink key={l.to} to={l.to} className="dc-nav-link">
              {l.label}
            </NavLink>
          )
        )}
        <span className="dc-nav-gh">
          <GitHubButton small />
        </span>
        <PrimaryCta className="dc-btn dc-btn-primary dc-btn-sm" />
      </div>
      <button className="dc-nav-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {open ? <IconClose size={20} /> : <span className="dc-burger" />}
      </button>
    </nav>
  )
}
