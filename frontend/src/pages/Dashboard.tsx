import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountCard from '../components/AccountCard'
import { IconCloud, IconPlus } from '../components/Icons'
import StorageRing from '../components/StorageRing'
import { Toasts, useToasts } from '../components/Toast'
import { useAccounts } from '../lib/AccountsContext'
import { api } from '../lib/api'
import { accountColor, formatBytes } from '../lib/format'
import type { Account, ApiResult } from '../types'

export default function Dashboard({ onAddDrive }: { onAddDrive: () => void }) {
  const { accounts, configured, error, refresh } = useAccounts()
  const { toasts, push } = useToasts()

  useEffect(() => {
    // Toast feedback after the OAuth redirect lands back here.
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected')) {
      push(`Connected ${params.get('connected')} 🎉`)
      window.history.replaceState({}, '', '/')
      refresh()
    } else if (params.get('error')) {
      push(params.get('error')!, 'err')
      window.history.replaceState({}, '', '/')
    }
  }, [push, refresh])

  async function disconnect(account: Account) {
    if (!confirm(`Disconnect ${account.email}?\n\nDriveCosm will forget this account and revoke its access. Nothing in the Drive itself is touched.`)) return
    const result = await api.delete<ApiResult>(`/api/accounts/${account.id}`)
    if (result.ok) {
      push(`Disconnected ${account.email}`)
      refresh()
    } else {
      push(result.error || 'Could not disconnect the account.', 'err')
    }
  }

  const totals = (accounts || []).reduce(
    (t, a) => ({
      used: t.used + Number(a.quota?.usage || 0),
      limit: t.limit + Number(a.quota?.limit || 0),
    }),
    { used: 0, limit: 0 }
  )

  const segments = (accounts || []).map((a, i) => ({
    value: Number(a.quota?.usage || 0),
    color: accountColor(i),
    label: a.email,
  }))

  // First load
  if (accounts === null) {
    return (
      <>
        <div className="skeleton" style={{ height: 230, marginBottom: 32 }} />
        <div className="grid-accounts">
          <div className="skeleton" style={{ height: 190 }} />
          <div className="skeleton" style={{ height: 190 }} />
        </div>
      </>
    )
  }

  // Not configured yet → point to the setup wizard.
  if (!configured && accounts.length === 0) {
    return (
      <div className="empty empty-tall">
        <div className="empty-icon">
          <IconCloud size={30} />
        </div>
        <h3>Welcome to DriveCosm</h3>
        <p>
          All your drives, one cosmos. A two-minute, one-time setup connects DriveCosm to
          Google — the wizard walks you through every step.
        </p>
        <Link to="/setup" className="btn btn-primary btn-lg">
          Start setup
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-sub">
            {accounts.length > 0
              ? `${accounts.length} drive${accounts.length === 1 ? '' : 's'} in your pool`
              : 'Add your first drive to get started'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={onAddDrive}>
          <IconPlus size={16} /> Add drive
        </button>
      </div>

      {error && <div className="notice">{error}</div>}

      {accounts.length > 0 && (
        <div className="card hero">
          <StorageRing segments={segments} total={totals.limit} />
          <div className="stats">
            <div>
              <div className="stat-label">Total space</div>
              <div className="stat-value">{formatBytes(totals.limit)}</div>
            </div>
            <div>
              <div className="stat-label">Used</div>
              <div className="stat-value">{formatBytes(totals.used)}</div>
            </div>
            <div>
              <div className="stat-label">Free</div>
              <div className="stat-value text-ok">{formatBytes(Math.max(0, totals.limit - totals.used))}</div>
            </div>
            <div>
              <div className="stat-label">Drives</div>
              <div className="stat-value">{accounts.length}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid-accounts">
        {accounts.map((a, i) => (
          <AccountCard key={a.id} account={a} index={i} onDisconnect={disconnect} />
        ))}
        <button className="card card-dashed" onClick={onAddDrive}>
          <IconPlus size={26} />
          <div style={{ fontWeight: 600 }}>Add a drive</div>
          <div style={{ fontSize: '0.83rem' }}>Every drive grows your storage pool</div>
        </button>
      </div>

      <Toasts toasts={toasts} />
    </>
  )
}
