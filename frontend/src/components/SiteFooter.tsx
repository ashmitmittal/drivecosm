import { Link } from 'react-router-dom'
import { LogoMark } from './Icons'
import { CONTACT_EMAIL, COUNTRY, GITHUB_URL } from '../lib/site'

export default function SiteFooter() {
  return (
    <footer className="dc-footer">
      <div className="dc-footer-grid">
        <div className="dc-footer-about">
          <Link to="/" className="dc-nav-brand">
            <LogoMark size={22} />
            <span>
              Drive<span className="dc-accent">Cosm</span>
            </span>
          </Link>
          <p>All your cloud storage, one place. Free to self-host, with DriveCosm Cloud on the way.</p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <div className="dc-footer-col">
          <h4>Product</h4>
          <Link to="/#features">Features</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/roadmap">Roadmap</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            Self-host
          </a>
        </div>
        <div className="dc-footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/about#contact">Contact</Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
        <div className="dc-footer-col">
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            MIT License
          </a>
        </div>
      </div>
      <div className="dc-footer-bar">
        <span>
          © {new Date().getFullYear()} DriveCosm · Built in {COUNTRY}
        </span>
        <span className="dc-footer-fine">
          Google Drive is a trademark of Google LLC. Claude is a trademark of Anthropic, PBC. DriveCosm is an
          independent product, not affiliated with or endorsed by either.
        </span>
      </div>
    </footer>
  )
}
