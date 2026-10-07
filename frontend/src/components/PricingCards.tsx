import { Link } from 'react-router-dom'
import { IconCheck } from './Icons'
import { CONTACT_EMAIL, GITHUB_URL, IS_PUBLIC_SITE } from '../lib/site'
import { PLANS } from '../lib/plans'
import type { Plan } from '../lib/plans'

const STATUS_LABEL: Record<Plan['status'], string> = {
  available: 'AVAILABLE NOW',
  waitlist: 'JOIN WAITLIST',
  planned: 'PLANNED',
}

function PlanCta({ plan, waitlistHref }: { plan: Plan; waitlistHref: string }) {
  if (plan.status === 'available') {
    return IS_PUBLIC_SITE ? (
      <a className="dc-btn" href={GITHUB_URL} target="_blank" rel="noreferrer">
        Get it on GitHub
      </a>
    ) : (
      <Link className="dc-btn" to="/app">
        Open the app
      </Link>
    )
  }
  if (plan.status === 'waitlist') {
    return (
      <Link className="dc-btn dc-btn-primary" to={waitlistHref}>
        Join the waitlist
      </Link>
    )
  }
  return (
    <a className="dc-btn" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('DriveCosm Teams')}`}>
      Talk to us
    </a>
  )
}

export default function PricingCards({ waitlistHref }: { waitlistHref: string }) {
  return (
    <div className="dc-plans">
      {PLANS.map((plan) => (
        <div key={plan.id} className={`dc-plan${plan.highlight ? ' highlight' : ''}`}>
          <div className="dc-plan-head">
            <h3>{plan.name}</h3>
            <span className={`dc-pill${plan.status === 'available' ? ' live' : ''}`}>{STATUS_LABEL[plan.status]}</span>
          </div>
          <div className="dc-plan-price">
            <span className="dc-plan-amount">{plan.price}</span>
            <span className="dc-plan-cadence">{plan.cadence}</span>
          </div>
          <p className="dc-plan-blurb">{plan.blurb}</p>
          <PlanCta plan={plan} waitlistHref={waitlistHref} />
          <ul className="dc-plan-features">
            {plan.features.map((f) => (
              <li key={f}>
                <IconCheck size={15} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
