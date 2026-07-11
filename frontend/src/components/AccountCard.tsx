import { accountColor, formatBytes } from '../lib/format'
import { providerInfo } from '../lib/providers'
import type { Account } from '../types'
import { IconExternal, IconTrash, ProviderGlyph } from './Icons'

interface Props {
  account: Account
  index: number
  onDisconnect: (account: Account) => void
}

export default function AccountCard({ account, index, onDisconnect }: Props) {
  const color = accountColor(index)
  const used = Number(account.quota?.usage || 0)
  const limit = Number(account.quota?.limit || 0)
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
  const nearFull = pct > 90

  return (
    <div className="card card-hover">
      <div className="account-head">
        {account.picture ? (
          <img className="avatar" src={account.picture} alt="" referrerPolicy="no-referrer" />
        ) : (
          <div className="avatar avatar-fallback" style={{ background: color }}>
            {(account.name || account.email || '?')[0].toUpperCase()}
          </div>
        )}
        <div className="account-min">
          <div className="account-name">{account.name}</div>
          <div className="account-email">{account.email}</div>
        </div>
        <span className="provider-chip" style={{ color: providerInfo(account.provider).color }} title={providerInfo(account.provider).name}>
          <ProviderGlyph provider={account.provider} size={15} />
        </span>
      </div>

      {account.error ? (
        <p className="error-text">{account.error}</p>
      ) : (
        <>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: nearFull ? 'var(--danger)' : color }}
            />
          </div>
          <div className="quota-row">
            <span>
              <strong className="quota-used">{formatBytes(used)}</strong>{' '}
              {limit > 0 ? `of ${formatBytes(limit)}` : 'used'}
            </span>
            {limit > 0 && <span>{formatBytes(Math.max(0, limit - used))} free</span>}
          </div>
        </>
      )}

      <div className="account-actions">
        <a
          className="btn btn-ghost btn-sm"
          href={`https://drive.google.com/drive/?authuser=${encodeURIComponent(account.email)}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconExternal /> Open Drive
        </a>
        <button className="btn btn-ghost btn-danger btn-sm push-right" onClick={() => onDisconnect(account)}>
          <IconTrash /> Disconnect
        </button>
      </div>
    </div>
  )
}
