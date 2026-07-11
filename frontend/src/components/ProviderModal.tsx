import { useEffect } from 'react'
import { PROVIDERS } from '../lib/providers'
import type { ProviderId } from '../types'
import { IconClose, ProviderGlyph } from './Icons'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (id: ProviderId) => void
}

export default function ProviderModal({ open, onClose, onPick }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-label="Add a drive" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Add a drive</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <p className="modal-sub">Every drive you add joins your storage pool.</p>
        <div className="provider-grid">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              className="provider-tile"
              disabled={p.status !== 'available'}
              onClick={() => onPick(p.id)}
            >
              <span className="provider-glyph" style={{ color: p.color }}>
                <ProviderGlyph provider={p.id} size={22} />
              </span>
              <span className="provider-name">
                {p.name}
                {p.status === 'soon' && <span className="soon-pill">soon</span>}
              </span>
              <span className="provider-tagline">{p.tagline}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
