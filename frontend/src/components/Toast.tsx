import { useCallback, useRef, useState } from 'react'
import { IconCheck } from './Icons'

export interface ToastItem {
  id: number
  message: string
  type: 'ok' | 'err'
}

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const push = useCallback((message: string, type: 'ok' | 'err' = 'ok') => {
    const id = ++counter.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4500)
  }, [])

  return { toasts, push }
}

export function Toasts({ toasts }: { toasts: ToastItem[] }) {
  if (!toasts.length) return null
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'ok' && (
            <span className="toast-check">
              <IconCheck />
            </span>
          )}
          <div>{t.message}</div>
        </div>
      ))}
    </div>
  )
}
