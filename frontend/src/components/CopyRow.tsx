import { useState } from 'react'
import { IconCheck, IconCopy } from './Icons'

/** A monospace value with a copy-to-clipboard button. */
export default function CopyRow({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="code-row">
      <code>{value}</code>
      <button
        className="btn btn-ghost btn-icon"
        title="Copy"
        onClick={async () => {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        }}
      >
        {copied ? <IconCheck style={{ color: 'var(--ok)' }} /> : <IconCopy />}
      </button>
    </div>
  )
}
