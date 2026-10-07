import { useEffect, useState } from 'react'
import { IconStar } from './Icons'
import { GITHUB_REPO, GITHUB_URL } from '../lib/site'

export default function GitHubButton({ small }: { small?: boolean }) {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.stargazers_count === 'number') setStars(d.stargazers_count)
      })
      .catch(() => {})
  }, [])

  // "0 stars" is a sadder invitation than none — count only once it's non-zero.
  const label =
    !stars ? 'Star on GitHub' : `${stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars} stars on GitHub`

  return (
    <a className={`dc-btn${small ? ' dc-btn-sm' : ''}`} href={GITHUB_URL} target="_blank" rel="noreferrer">
      <IconStar size={15} /> {label}
    </a>
  )
}
