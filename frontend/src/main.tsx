import '@fontsource-variable/inter'
import './styles.css'
import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { IS_PUBLIC_SITE } from './lib/site'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Public pages arrive prerendered (scripts/prerender.mjs). Attach to that
// markup only when it was rendered for this exact URL; app mode, and URLs that
// fall back to index.html, render from scratch instead.
const path = window.location.pathname.replace(/(.)\/$/, '$1')
if (IS_PUBLIC_SITE && container.dataset.page === path) hydrateRoot(container, app)
else createRoot(container).render(app)
