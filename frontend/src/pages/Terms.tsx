import { Link } from 'react-router-dom'
import SiteLayout, { PageHero } from '../components/SiteLayout'
import { CONTACT_EMAIL, COUNTRY, FOUNDER, GITHUB_URL, LEGAL_UPDATED } from '../lib/site'

export default function Terms() {
  return (
    <SiteLayout title="Terms of Service">
      <PageHero kicker="LEGAL" title="Terms of Service">
        Last updated {LEGAL_UPDATED}
      </PageHero>

      <article className="dc-section dc-section-tight dc-prose">
        <p>
          These Terms govern your use of drivecosm.com (the &ldquo;Site&rdquo;) and the DriveCosm waitlist. They are an
          agreement between you and {FOUNDER.name}, who operates DriveCosm (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By
          using the Site, you agree to them.
        </p>

        <h2>1. The open-source software</h2>
        <p>
          The self-hosted DriveCosm app is open-source software released under the{' '}
          <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            MIT License
          </a>
          . Your use, copying and modification of that code are governed by the license, not by these Terms. As the
          license says, the software is provided &ldquo;as is&rdquo;, without warranty of any kind.
        </p>

        <h2>2. Your accounts with other services</h2>
        <p>
          DriveCosm connects to third-party services such as Google Drive. Your use of those services is governed by
          their own terms, and you&apos;re responsible for following them. DriveCosm is an independent product and
          isn&apos;t affiliated with or endorsed by Google, Anthropic or any other provider it works with.
        </p>

        <h2>3. The waitlist and future paid plans</h2>
        <p>
          Joining the waitlist is free and doesn&apos;t commit you to anything. The prices and features shown for
          DriveCosm Cloud and Teams are planned, and may change before launch. Paid plans will come with their own
          terms, which you&apos;ll see and accept before you&apos;re ever charged. We won&apos;t charge you without your
          explicit agreement.
        </p>

        <h2>4. Acceptable use</h2>
        <p>
          Don&apos;t misuse the Site. That includes trying to disrupt or overload it, accessing it in unauthorized
          ways, submitting automated or fake waitlist sign-ups, or using it for anything unlawful.
        </p>

        <h2>5. Intellectual property</h2>
        <p>
          The DriveCosm name, logo and the design of this Site belong to us. Source code in the DriveCosm repository is
          available under the MIT License. Other names and marks belong to their respective owners.
        </p>

        <h2>6. Disclaimer</h2>
        <p>
          The Site and the software are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without
          warranties of any kind, to the fullest extent permitted by law.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, we aren&apos;t liable for any indirect, incidental, special,
          consequential or punitive damages, or for any loss of data, arising from your use of the Site or the
          software. You run the self-hosted app on your own systems, so keeping backups of your data is your
          responsibility.
        </p>

        <h2>8. Changes</h2>
        <p>
          We may update these Terms from time to time. When we do, we&apos;ll change the date at the top. Continuing to
          use the Site after an update means you accept the new Terms.
        </p>

        <h2>9. Governing law</h2>
        <p>These Terms are governed by the laws of {COUNTRY}.</p>

        <h2>10. Contact</h2>
        <p>
          Questions about these Terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </article>
    </SiteLayout>
  )
}
