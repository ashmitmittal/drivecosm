import { NavLink, useNavigate } from 'react-router-dom'
import { useAccounts } from '../lib/AccountsContext'
import { accountColor, formatBytes } from '../lib/format'
import ThemeToggle from './ThemeToggle'
import { IconFolders, IconGear, IconHome, IconPhotos, IconPlus, LogoMark } from './Icons'

function linkClass({ isActive }: { isActive: boolean }): string {
  return `side-link${isActive ? ' active' : ''}`
}

export default function Sidebar({ onAddDrive }: { onAddDrive: () => void }) {
  const { accounts } = useAccounts()
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <NavLink to="/app" className="sidebar-brand">
        <LogoMark size={24} core="var(--accent)" />
        <span className="brand-name">
          Drive<span className="brand-accent">Cosm</span>
        </span>
      </NavLink>

      <nav className="sidebar-nav">
        <NavLink to="/app" end className={linkClass}>
          <IconHome /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/app/files" className={linkClass}>
          <IconFolders /> <span>Files</span>
        </NavLink>
        <NavLink to="/app/photos" className={linkClass}>
          <IconPhotos /> <span>Photos</span> <span className="soon-pill">soon</span>
        </NavLink>
      </nav>

      <div className="sidebar-section-label">Drives</div>
      <div className="sidebar-drives">
        {(accounts || []).map((account, i) => {
          const used = Number(account.quota?.usage || 0)
          const limit = Number(account.quota?.limit || 0)
          const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
          return (
            <button
              key={account.id}
              className="side-drive"
              title={`${account.email} — open its files`}
              onClick={() => navigate(`/app/files?account=${account.id}`)}
            >
              {account.picture ? (
                <img className="side-drive-avatar" src={account.picture} alt="" referrerPolicy="no-referrer" />
              ) : (
                <span className="side-drive-avatar avatar-fallback" style={{ background: accountColor(i) }}>
                  {(account.name || account.email)[0].toUpperCase()}
                </span>
              )}
              <span className="side-drive-main">
                <span className="side-drive-name">{account.email}</span>
                <span className="side-drive-bar">
                  <span style={{ width: `${pct}%`, background: accountColor(i) }} />
                </span>
              </span>
              <span className="side-drive-free">{limit > 0 ? formatBytes(Math.max(0, limit - used)) : '—'}</span>
            </button>
          )
        })}
        <button className="side-add" onClick={onAddDrive}>
          <IconPlus size={15} /> <span>Add drive</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <NavLink to="/app/setup" className={linkClass}>
          <IconGear /> <span>Settings</span>
        </NavLink>
        <ThemeToggle />
      </div>
    </aside>
  )
}
