import { formatBytes } from '../lib/format'

export interface RingSegment {
  value: number
  color: string
  label: string
}

// SVG donut where each connected drive is its own colored arc.
export default function StorageRing({ segments, total, size = 200 }: { segments: RingSegment[]; total: number; size?: number }) {
  const stroke = 14
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const used = segments.reduce((sum, s) => sum + s.value, 0)
  const gap = segments.length > 1 ? 4 : 0 // px of breathing room between arcs

  let prefix = 0
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const length = total > 0 ? (s.value / total) * c : 0
      const arc = { ...s, length: Math.max(0, length - gap), offset: -prefix }
      prefix += length
      return arc
    })

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${formatBytes(used)} used of ${formatBytes(total)}`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc.length} ${c - arc.length}`}
          strokeDashoffset={arc.offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
          <title>{`${arc.label}: ${formatBytes(arc.value)}`}</title>
        </circle>
      ))}
      <text x="50%" y="46%" textAnchor="middle" fill="var(--text)" fontSize={size * 0.13} fontWeight={700} letterSpacing="-0.5">
        {formatBytes(used)}
      </text>
      <text x="50%" y="58%" textAnchor="middle" fill="var(--muted)" fontSize={size * 0.066}>
        of {formatBytes(total)}
      </text>
    </svg>
  )
}
