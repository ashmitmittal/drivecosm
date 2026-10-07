import { Link } from 'react-router-dom'
import SiteLayout, { PageHero } from '../components/SiteLayout'
import { CONTACT_EMAIL, COUNTRY, FOUNDER, LEGAL_UPDATED } from '../lib/site'

export default function Privacy() {
  const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  return (
    <SiteLayout title="Privacy Policy">
      <PageHero kicker="LEGAL" title="Privacy Policy">
        Last updated {LEGAL_UPDATED}
      </PageHero>

      <article className="dc-section dc-section-tight dc-prose">
        <p>
          DriveCosm (&ldquo;DriveCosm&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is operated by {FOUNDER.name}, based
          in {COUNTRY}. This policy explains what information we collect through drivecosm.com and the DriveCosm
          software, and what we do with it. Questions go to {email}.
        </p>

        <h2>The short version</h2>
        <ul>
          <li>
            The self-hosted DriveCosm app runs on your computer. We never receive your files, your Google account data
            or your access tokens.
          </li>
          <li>On this website, the only personal information we ask for is the email you give us to join the waitlist.</li>
          <li>We don&apos;t sell personal information, and we don&apos;t use advertising trackers or tracking cookies.</li>
        </ul>

        <h2>1. Information we collect on drivecosm.com</h2>
        <p>
          <strong>Waitlist sign-ups.</strong> When you join the waitlist we store your email address, the plan you
          were interested in, and when you signed up.
        </p>
        <p>
          <strong>Technical data.</strong> Our hosting provider, Vercel, processes standard request data such as IP
          address, browser type and the pages requested, in order to deliver the site and protect it from abuse. We
          also use your IP address to limit repeated waitlist sign-ups; that record is deleted automatically within
          one hour.
        </p>
        <p>
          <strong>GitHub.</strong> Some pages show the project&apos;s public star count, which your browser loads
          directly from GitHub&apos;s API. GitHub receives that request under its own privacy statement.
        </p>
        <p>
          <strong>Cookies.</strong> This website doesn&apos;t set cookies. Your browser&apos;s local storage may hold
          your light or dark theme preference, which never leaves your device.
        </p>

        <h2>2. How we use it</h2>
        <ul>
          <li>To contact you about DriveCosm Cloud, including when it opens.</li>
          <li>To run, secure and improve the website.</li>
        </ul>
        <p>We don&apos;t sell, rent or share your email address with anyone for their own marketing.</p>

        <h2>3. The self-hosted app</h2>
        <p>When you run DriveCosm on your own computer:</p>
        <ul>
          <li>It talks directly to Google, using OAuth credentials you create in your own Google Cloud project.</li>
          <li>
            Those credentials, and the access and refresh tokens for each account you connect, are stored in a local
            file on your computer. They are never sent to us.
          </li>
          <li>File listings, uploads and downloads travel directly between your computer and Google.</li>
          <li>
            The app contains no analytics or telemetry. It only contacts us if you choose to join the waitlist from
            inside it.
          </li>
        </ul>
        <p>Because the app runs on hardware you control, keeping that computer secure is up to you.</p>

        <h2>4. Google user data</h2>
        <p>The DriveCosm app asks Google for these permissions, and uses them only for the purposes listed:</p>
        <ul>
          <li>
            <strong>See, edit, create and delete your Google Drive files</strong>: to list, search, upload and
            download files and move them to the trash when you ask it to.
          </li>
          <li>
            <strong>Your email address and basic profile info</strong>: to identify and label each connected account.
          </li>
        </ul>
        <p>
          DriveCosm uses Google user data only to provide these user-facing features. It doesn&apos;t use that data
          for advertising, doesn&apos;t sell it, and doesn&apos;t use it to train AI or machine-learning models.
          DriveCosm&apos;s use and transfer of information received from Google APIs adheres to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
        <p>
          Disconnecting an account in DriveCosm revokes its access with Google and deletes the stored credentials.
          You can also revoke access at any time from your{' '}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
            Google Account permissions
          </a>{' '}
          page.
        </p>

        <h2>5. DriveCosm Cloud and AI features</h2>
        <p>
          DriveCosm Cloud and its AI features are not available yet. Before they launch, we&apos;ll update this policy
          to describe exactly what they collect, where it&apos;s stored and how it&apos;s protected, including what is
          sent to Anthropic&apos;s Claude API when you use an AI feature. AI features will be opt-in.
        </p>

        <h2>6. Service providers and where data is stored</h2>
        <p>
          We use Vercel to host the website and Upstash (provided through Vercel) to store the waitlist. These
          providers may process data outside {COUNTRY}, including in the United States.
        </p>

        <h2>7. How long we keep it</h2>
        <p>
          We keep your waitlist email until you ask us to delete it or we no longer need it to tell you about DriveCosm
          Cloud. Rate-limiting records are deleted within one hour. Hosting logs are kept according to Vercel&apos;s
          retention settings.
        </p>

        <h2>8. Your rights</h2>
        <p>
          You can ask us to access, correct or delete the personal data we hold about you, or stop emailing you, by
          writing to {email}. Where applicable law, including India&apos;s Digital Personal Data Protection Act, 2023,
          gives you further rights, we&apos;ll honor them. You can send any privacy complaint to the same address and
          we&apos;ll respond promptly.
        </p>

        <h2>9. Children</h2>
        <p>DriveCosm isn&apos;t directed at children, and we don&apos;t knowingly collect data from anyone under 18.</p>

        <h2>10. Security</h2>
        <p>
          We take reasonable measures to protect the information we hold, but no method of transmission or storage is
          completely secure.
        </p>

        <h2>11. Changes to this policy</h2>
        <p>
          When we change this policy we&apos;ll update the date at the top. If a change is significant, we&apos;ll say
          so clearly on this page.
        </p>

        <h2>12. Contact</h2>
        <p>
          {FOUNDER.name}, DriveCosm · {email}. See also our <Link to="/terms">Terms of Service</Link>.
        </p>
      </article>
    </SiteLayout>
  )
}
