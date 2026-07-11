import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { IconCheck, IconCopy, IconLink } from '../components/Icons'
import { Toasts, useToasts } from '../components/Toast'
import { api, connectGoogleAccount } from '../lib/api'
import type { ApiResult, ConfigInfo } from '../types'

/** External link to a Google Cloud Console page, with the little link icon. */
function ConsoleLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <IconLink size={13} className="inline-icon" />
    </a>
  )
}

function CopyRow({ value }: { value: string }) {
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

export default function Setup() {
  const [config, setConfig] = useState<ConfigInfo | null>(null)
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [saving, setSaving] = useState(false)
  const { toasts, push } = useToasts()

  useEffect(() => {
    api.get<ConfigInfo>('/api/config').then((c) => {
      setConfig(c)
      if (c.clientId) setClientId(c.clientId)
    })
  }, [])

  async function save(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    const data = await api.post<ApiResult>('/api/config', { clientId, clientSecret })
    setSaving(false)
    if (data.ok) {
      push('Credentials saved — you can connect accounts now 🎉')
      setConfig((c) => (c ? { ...c, configured: true } : c))
      setClientSecret('')
    } else {
      push(data.error || 'Could not save the credentials.', 'err')
    }
  }

  function connect() {
    connectGoogleAccount((message) => push(message, 'err'))
  }

  const redirectUri = config?.redirectUri || 'http://localhost:3000/api/auth/callback'

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">Setup</h1>
          <p className="page-sub">
            A one-time, ~2 minute setup. DriveCosm runs entirely on your machine, so it uses{' '}
            <strong>your own</strong> free Google credentials — no third party ever sees your files.
          </p>
        </div>
      </div>

      {config?.configured && (
        <div className="card card-success">
          <span className="text-ok">
            <IconCheck />
          </span>
          <div className="grow">
            <strong>You&apos;re all set.</strong>{' '}
            <span className="muted">Credentials are saved locally. Connect as many accounts as you like.</span>
          </div>
          <button className="btn btn-primary" onClick={connect}>
            Connect an account
          </button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="step">
          <div className="step-num">1</div>
          <div>
            <h3>Create a (free) Google Cloud project</h3>
            <p>
              Open the{' '}
              <ConsoleLink href="https://console.cloud.google.com/projectcreate">Google Cloud Console</ConsoleLink>{' '}
              and create a project — name it anything, e.g. <kbd className="pill">DriveCosm</kbd>. No billing or credit card needed.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-num">2</div>
          <div>
            <h3>Enable the Google Drive API</h3>
            <p>
              Go to{' '}
              <ConsoleLink href="https://console.cloud.google.com/apis/library/drive.googleapis.com">
                the Drive API page
              </ConsoleLink>{' '}
              (make sure your new project is selected in the top bar) and click <kbd className="pill">Enable</kbd>.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-num">3</div>
          <div>
            <h3>Set up the consent screen</h3>
            <p>
              Open{' '}
              <ConsoleLink href="https://console.cloud.google.com/auth/overview">Google Auth Platform</ConsoleLink>{' '}
              and click <kbd className="pill">Get started</kbd>. Pick any app name, choose{' '}
              <kbd className="pill">External</kbd> as the audience, and accept the rest of the defaults.
            </p>
            <p>
              Then, under <strong>Audience → Test users</strong>, click <kbd className="pill">Add users</kbd> and add{' '}
              <strong>every Google email you want to connect</strong>. Google only lets test users sign in to
              your app — this is what keeps it private to you.
            </p>
          </div>
        </div>

        <div className="step">
          <div className="step-num">4</div>
          <div>
            <h3>Create the OAuth credentials</h3>
            <p>
              Go to{' '}
              <ConsoleLink href="https://console.cloud.google.com/apis/credentials">Credentials</ConsoleLink> →{' '}
              <kbd className="pill">Create credentials</kbd> → <kbd className="pill">OAuth client ID</kbd>. Choose{' '}
              <kbd className="pill">Web application</kbd>, and under <strong>Authorized redirect URIs</strong> add exactly:
            </p>
            <CopyRow value={redirectUri} />
          </div>
        </div>

        <div className="step">
          <div className="step-num">5</div>
          <div className="grow">
            <h3>Paste your credentials here</h3>
            <p>
              Google shows you a <strong>Client ID</strong> and <strong>Client Secret</strong> — copy them into the
              form below. They are stored only in a local file on this machine (<span className="mono">backend/data/drivecosm.json</span>).
            </p>
            <form onSubmit={save} style={{ marginTop: 14 }}>
              <div className="field">
                <label htmlFor="cid">Client ID</label>
                <input
                  id="cid"
                  className="input mono"
                  placeholder="1234567890-xxxxx.apps.googleusercontent.com"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="csec">Client Secret</label>
                <input
                  id="csec"
                  className="input mono"
                  type="password"
                  placeholder={config?.configured ? '•••••••• (saved — paste again only to change it)' : 'GOCSPX-…'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  required={!config?.configured}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Saving…' : config?.configured ? 'Update credentials' : 'Save credentials'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <p className="muted" style={{ fontSize: '0.85rem' }}>
        Heads-up: because the app is in “testing” mode, Google shows an <em>“unverified app”</em> screen when you
        connect an account. That&apos;s expected for personal OAuth apps — click <em>Continue</em> to proceed. It&apos;s{' '}
        <strong>your own</strong> app, talking only to <strong>your own</strong> accounts.
      </p>

      <Toasts toasts={toasts} />
    </>
  )
}
