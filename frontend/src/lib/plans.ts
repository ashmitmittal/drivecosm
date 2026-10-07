// Plans shown on the landing page and /pricing. Prices for plans that haven't
// launched are planned prices, and the UI labels them that way.

export type PlanId = 'self-hosted' | 'cloud-pro' | 'teams'

export interface Plan {
  id: PlanId
  name: string
  price: string
  cadence: string
  blurb: string
  status: 'available' | 'waitlist' | 'planned'
  features: string[]
  highlight?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'self-hosted',
    name: 'Self-hosted',
    price: '$0',
    cadence: 'free forever',
    blurb: 'The open-source app, running on your own machine with your own Google API keys.',
    status: 'available',
    features: [
      'Unlimited Google accounts',
      'One file explorer across every drive',
      'Search across all connected drives',
      'Uploads routed to the drive with the most space',
      'Runs 100% locally, tokens never leave your computer',
      'MIT-licensed source code',
    ],
  },
  {
    id: 'cloud-pro',
    name: 'Cloud Pro',
    price: '$4',
    cadence: 'per month, billed yearly',
    blurb: 'DriveCosm, hosted for you. Sign in and go, from any device, with AI built in.',
    status: 'waitlist',
    highlight: true,
    features: [
      'Everything in Self-hosted',
      'No setup, no API keys to create',
      'Use it from any device',
      'Natural-language search, built on Claude',
      'Auto-organize, dedupe and cleanup advice',
      'Priority email support',
    ],
  },
  {
    id: 'teams',
    name: 'Teams',
    price: '$8',
    cadence: 'per user / month',
    blurb: 'Pooled storage and shared search for small teams that live in Google Drive.',
    status: 'planned',
    features: [
      'Everything in Cloud Pro',
      'Shared storage pools',
      'Admin console and roles',
      'Google Workspace SSO',
      'Audit log',
    ],
  },
]

/** Rows for the /pricing comparison table: label, then one cell per plan in PLANS order. */
export const COMPARISON: { group: string; rows: [string, ...(boolean | string)[]][] }[] = [
  {
    group: 'Storage',
    rows: [
      ['Google Drive accounts', 'Unlimited', 'Unlimited', 'Unlimited'],
      ['OneDrive, Dropbox & more', 'When released', 'When released', 'When released'],
      ['Smart upload routing', true, true, true],
      ['Shared team pools', false, false, true],
    ],
  },
  {
    group: 'Finding files',
    rows: [
      ['Unified explorer & search', true, true, true],
      ['Natural-language search (Claude)', false, true, true],
      ['Ask questions about your documents', false, true, true],
      ['Auto-organize & duplicate detection', false, true, true],
      ['Storage cleanup advisor', false, true, true],
    ],
  },
  {
    group: 'Running it',
    rows: [
      ['Where it runs', 'Your computer', 'DriveCosm Cloud', 'DriveCosm Cloud'],
      ['Setup', 'Your own Google API keys', 'Just sign in', 'Just sign in'],
      ['Access from any device', false, true, true],
      ['Admin console, SSO, audit log', false, false, true],
      ['Support', 'GitHub issues', 'Priority email', 'Priority email'],
    ],
  },
]
