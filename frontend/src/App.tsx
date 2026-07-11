import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ProviderModal from './components/ProviderModal'
import Sidebar from './components/Sidebar'
import { Toasts, useToasts } from './components/Toast'
import { AccountsProvider, useAccounts } from './lib/AccountsContext'
import { connectGoogleAccount } from './lib/api'
import type { ProviderId } from './types'
import Dashboard from './pages/Dashboard'
import Files from './pages/Files'
import Photos from './pages/Photos'
import Setup from './pages/Setup'

function Shell() {
  const [addDriveOpen, setAddDriveOpen] = useState(false)
  const { configured } = useAccounts()
  const { toasts, push } = useToasts()
  const navigate = useNavigate()

  async function pickProvider(id: ProviderId) {
    setAddDriveOpen(false)
    if (id !== 'google') return // only Google is live; other tiles are disabled anyway
    if (!configured) {
      navigate('/setup')
      return
    }
    await connectGoogleAccount((message) => push(message, 'err'))
  }

  const openAddDrive = () => setAddDriveOpen(true)

  return (
    <div className="shell">
      <Sidebar onAddDrive={openAddDrive} />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard onAddDrive={openAddDrive} />} />
          <Route path="/files" element={<Files />} />
          <Route path="/photos" element={<Photos />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </main>
      <ProviderModal open={addDriveOpen} onClose={() => setAddDriveOpen(false)} onPick={pickProvider} />
      <Toasts toasts={toasts} />
    </div>
  )
}

export default function App() {
  return (
    <AccountsProvider>
      <Shell />
    </AccountsProvider>
  )
}
