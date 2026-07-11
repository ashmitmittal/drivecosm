import { IconMoon, IconSun } from './Icons'

// The current theme lives on <html data-theme> — set before first paint by the
// inline script in index.html, so there's nothing to hydrate here.
export default function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // localStorage unavailable — the theme still applies for this session.
    }
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle light / dark theme" title="Toggle theme">
      <IconSun className="icon-sun" />
      <IconMoon className="icon-moon" />
    </button>
  )
}
