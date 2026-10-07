import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { IconCheck } from './Icons'
import { IS_PUBLIC_SITE, SITE_URL } from '../lib/site'
import type { PlanId } from '../lib/plans'

// The waitlist API is a Vercel Function that only exists on the public site,
// so locally running copies post to it cross-origin.
const ENDPOINT = IS_PUBLIC_SITE ? '/api/waitlist' : `${SITE_URL}/api/waitlist`

type State = { kind: 'idle' } | { kind: 'sending' } | { kind: 'done'; email: string } | { kind: 'error'; message: string }

export default function WaitlistForm({ plan = 'cloud-pro' }: { plan?: PlanId }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Bots fill every field; people never see this one.
    const trap = new FormData(e.currentTarget).get('company')
    setState({ kind: 'sending' })
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plan, company: trap }),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }
      if (data.ok) setState({ kind: 'done', email })
      else setState({ kind: 'error', message: data.error || 'Something went wrong. Please try again.' })
    } catch {
      setState({ kind: 'error', message: 'Could not reach the server. Check your connection and try again.' })
    }
  }

  if (state.kind === 'done') {
    return (
      <div className="dc-waitlist-done" role="status">
        <span className="dc-waitlist-check">
          <IconCheck size={18} />
        </span>
        <div>
          <strong>You&apos;re on the list.</strong>
          <p>We&apos;ll email {state.email} as soon as DriveCosm Cloud opens.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="dc-waitlist" onSubmit={submit}>
      <div className="dc-waitlist-row">
        <input
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="dc-trap" aria-hidden="true" />
        <button className="dc-btn dc-btn-primary" disabled={state.kind === 'sending'}>
          {state.kind === 'sending' ? 'Joining…' : 'Join the waitlist'}
        </button>
      </div>
      {state.kind === 'error' ? (
        <p className="dc-waitlist-note dc-waitlist-error" role="alert">
          {state.message}
        </p>
      ) : (
        <p className="dc-waitlist-note">
          We&apos;ll only email you about DriveCosm Cloud. See our <Link to="/privacy">Privacy Policy</Link>.
        </p>
      )}
    </form>
  )
}
