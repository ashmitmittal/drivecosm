import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Account, ApiResult, ConfigInfo } from '../types'
import { api } from './api'
import { IS_PUBLIC_SITE } from './site'

// Accounts are shown in the sidebar as well as on the pages, so they live in
// one shared context instead of being fetched by every screen separately.
interface AccountsState {
  accounts: Account[] | null // null = first load still in flight
  configured: boolean | null
  error: string | null
  refresh: () => Promise<void>
}

const AccountsContext = createContext<AccountsState | null>(null)

export function AccountsProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    // The public website has no backend — don't fire doomed requests.
    if (IS_PUBLIC_SITE) {
      setConfigured(false)
      setAccounts([])
      return
    }
    const [cfg, acc] = await Promise.all([
      api.get<ConfigInfo & ApiResult>('/api/config'),
      api.get<{ accounts?: Account[] } & ApiResult>('/api/accounts'),
    ])
    setError(cfg.error || acc.error || null)
    setConfigured(Boolean(cfg.configured))
    setAccounts(acc.accounts || [])
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AccountsContext.Provider value={{ accounts, configured, error, refresh }}>
      {children}
    </AccountsContext.Provider>
  )
}

export function useAccounts(): AccountsState {
  const state = useContext(AccountsContext)
  if (!state) throw new Error('useAccounts must be used inside <AccountsProvider>')
  return state
}
