import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: 'Is DriveCosm really free?',
    a: (
      <>
        The self-hosted edition is free and open source under the MIT license, and it will stay that way. It runs
        on your own computer. DriveCosm Cloud, the hosted version, will be a paid plan.
      </>
    ),
  },
  {
    q: 'When does DriveCosm Cloud launch?',
    a: (
      <>
        We&apos;re building it now. Join the waitlist and we&apos;ll email you when it opens. Until then, you
        can use every core feature today by <Link to="/app">self-hosting</Link>.
      </>
    ),
  },
  {
    q: 'Does DriveCosm store my files?',
    a: (
      <>
        No. Your files stay in your own Google Drive accounts. DriveCosm reads and writes them through Google&apos;s
        official Drive API, and in the self-hosted edition everything happens on your machine.
      </>
    ),
  },
  {
    q: 'Can DriveCosm delete my files?',
    a: (
      <>
        DriveCosm never permanently deletes anything. When you remove a file, it goes to that account&apos;s Google
        Drive trash, where it can be restored for 30 days.
      </>
    ),
  },
  {
    q: 'How will the AI features use my files?',
    a: (
      <>
        AI features are opt-in and built on Claude by Anthropic. When you use one, only the content needed for that
        request is sent to the Claude API to produce the result. The full details will be in our{' '}
        <Link to="/privacy">Privacy Policy</Link> before they launch.
      </>
    ),
  },
  {
    q: 'Which storage providers are supported?',
    a: (
      <>
        Google Drive today, with as many accounts as you like. OneDrive, Dropbox, Telegram, WebDAV and
        S3-compatible storage are on the <Link to="/roadmap">roadmap</Link>.
      </>
    ),
  },
  {
    q: 'What happens when I disconnect an account?',
    a: (
      <>
        DriveCosm revokes its access with Google and deletes the stored credentials for that account. Your files
        aren&apos;t touched.
      </>
    ),
  },
]

export default function Faq() {
  return (
    <div className="dc-faq">
      {FAQS.map((item) => (
        <details key={item.q}>
          <summary>{item.q}</summary>
          <div className="dc-faq-a">{item.a}</div>
        </details>
      ))}
    </div>
  )
}
