import { useState } from 'react'
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import ProviderModal from './components/ProviderModal'
import Sidebar from './components/Sidebar'
import { Toasts, useToasts } from './components/Toast'
import { AccountsProvider, useAccounts } from './lib/AccountsContext'
import { connectGoogleAccount } from './lib/api'
import type { ProviderId } from './types'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Landing from './pages/Landing'
import Photos from './pages/Photos'
import Setup from './pages/Setup'

export interface ShellContext {
  openAddDrive: () => void
}

// The app shell — sidebar, add-drive modal, and toasts — wraps every /app
// route. The landing page at / renders outside it, full-width.
function AppShell() {
  const [addDriveOpen, setAddDriveOpen] = useState(false)
  const { configured } = useAccounts()
  const { toasts, push } = useToasts()
  const navigate = useNavigate()

  async function pickProvider(id: ProviderId) {
    setAddDriveOpen(false)
    if (id !== 'google') return // only Google is live; other tiles are disabled anyway
    if (!configured) {
      navigate('/app/setup')
      return
    }
    await connectGoogleAccount((message) => push(message, 'err'))
  }

  return (
    <div className="shell">
      <Sidebar onAddDrive={() => setAddDriveOpen(true)} />
      <main className="content">
        <Outlet context={{ openAddDrive: () => setAddDriveOpen(true) } satisfies ShellContext} />
      </main>
      <ProviderModal open={addDriveOpen} onClose={() => setAddDriveOpen(false)} onPick={pickProvider} />
      <Toasts toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <AccountsProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="files" element={<Files />} />
          <Route path="photos" element={<Photos />} />
          <Route path="setup" element={<Setup />} />
        </Route>
      </Routes>
    </AccountsProvider>
  )
}
