import fs from 'fs'
import path from 'path'
import type { Account, OAuthConfig, StoreData } from './types'

// Everything DriveCosm knows lives in one local JSON file: your OAuth app
// credentials and the tokens for each connected account. It never leaves
// this machine and is gitignored. Anchored to this package (not cwd) so the
// file lands in backend/data/ no matter where the server is started from.
const DATA_DIR = path.join(__dirname, '..', 'data')
const DATA_FILE = path.join(DATA_DIR, 'drivecosm.json')
const LEGACY_DATA_FILE = path.join(DATA_DIR, 'spacesave.json')

// The project was born as "SpaceSave" — adopt an existing data file once, so
// accounts connected before the rename survive it.
if (fs.existsSync(LEGACY_DATA_FILE) && !fs.existsSync(DATA_FILE)) {
  fs.renameSync(LEGACY_DATA_FILE, DATA_FILE)
}

const defaults: StoreData = { config: null, accounts: [] }

export function readStore(): StoreData {
  try {
    return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }
  } catch {
    return { ...defaults }
  }
}

export function writeStore(store: StoreData): void {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2))
}

export function getConfig(): OAuthConfig | null {
  return readStore().config
}

export function setConfig(config: OAuthConfig): void {
  const store = readStore()
  store.config = config
  writeStore(store)
}

export function listAccounts(): Account[] {
  return readStore().accounts
}

export function getAccount(id: string): Account | undefined {
  return readStore().accounts.find((a) => a.id === id)
}

/** Adds a new account, or merges over an existing one with the same id. */
export function saveAccount(account: Account): void {
  const store = readStore()
  const i = store.accounts.findIndex((a) => a.id === account.id)
  if (i >= 0) store.accounts[i] = { ...store.accounts[i], ...account }
  else store.accounts.push(account)
  writeStore(store)
}

/** Updates a few fields of an already-connected account. No-op if unknown. */
export function patchAccount(id: string, patch: Partial<Account>): void {
  const store = readStore()
  const account = store.accounts.find((a) => a.id === id)
  if (!account) return
  Object.assign(account, patch)
  writeStore(store)
}

export function removeAccount(id: string): void {
  const store = readStore()
  store.accounts = store.accounts.filter((a) => a.id !== id)
  writeStore(store)
}
