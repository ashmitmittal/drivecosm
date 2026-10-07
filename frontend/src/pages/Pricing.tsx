import { IconCheck } from '../components/Icons'
import Faq from '../components/Faq'
import PricingCards from '../components/PricingCards'
import SiteLayout, { PageHero } from '../components/SiteLayout'
import WaitlistForm from '../components/WaitlistForm'
import { COMPARISON, PLANS } from '../lib/plans'

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <IconCheck size={16} className="dc-yes" aria-label="Included" />
  if (value === false) return <span className="dc-no" aria-label="Not included">—</span>
  return <>{value}</>
}

export default function Pricing() {
  return (
    <SiteLayout title="Pricing">
      <PageHero kicker="PRICING" title="Free to self-host. Simple when hosted.">
        The open-source app is free forever. DriveCosm Cloud is the same product, hosted for you, with AI features
        built on Claude. Cloud prices are planned launch prices; nothing is billed until you sign up for a paid plan.
      </PageHero>

      <section className="dc-section dc-section-tight">
        <PricingCards waitlistHref="/pricing#waitlist" />
      </section>

      <section className="dc-section dc-section-tight">
        <h2 className="dc-h3">Compare plans</h2>
        <div className="dc-table-wrap">
          <table className="dc-table">
            <thead>
              <tr>
                <th />
                {PLANS.map((p) => (
                  <th key={p.id}>{p.name}</th>
                ))}
              </tr>
            </thead>
            {COMPARISON.map((group) => (
              <tbody key={group.group}>
                <tr className="dc-table-group">
                  <th colSpan={PLANS.length + 1}>{group.group}</th>
                </tr>
                {group.rows.map(([label, ...cells]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {cells.map((c, i) => (
                      <td key={i}>
                        <Cell value={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="dc-section dc-section-tight">
        <h2 className="dc-h3">Questions</h2>
        <Faq />
      </section>

      <section id="waitlist" className="dc-section dc-section-tight">
        <div className="dc-panel">
          <div className="dc-kicker">EARLY ACCESS</div>
          <h2 className="dc-h2">Get DriveCosm Cloud first</h2>
          <p className="dc-lede">Join the waitlist and we&apos;ll email you as soon as Cloud opens.</p>
          <WaitlistForm />
        </div>
      </section>
    </SiteLayout>
  )
}
