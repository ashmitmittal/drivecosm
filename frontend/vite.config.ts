import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // The backend owns /api — including the Google OAuth callback, so the
    // whole app lives behind one origin and CORS never comes up. 127.0.0.1
    // (not localhost) because the backend binds IPv4 loopback only.
    proxy: {
      '/api': 'http://127.0.0.1:4000',
    },
  },
})
