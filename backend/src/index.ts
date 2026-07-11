import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { APP_ORIGIN } from './google'
import accountsRouter from './routes/accounts'
import authRouter from './routes/auth'
import configRouter from './routes/config'
import filesRouter from './routes/files'
import uploadRouter from './routes/upload'

const PORT = Number(process.env.PORT) || 4000

// The browser may address us as either localhost or 127.0.0.1, directly or
// through the frontend dev-server proxy.
const allowedOrigins = new Set(
  [APP_ORIGIN, APP_ORIGIN.replace('localhost', '127.0.0.1'), APP_ORIGIN.replace('127.0.0.1', 'localhost')]
)
const allowedHosts = new Set([
  ...[...allowedOrigins].map((origin) => new URL(origin).host),
  `localhost:${PORT}`,
  `127.0.0.1:${PORT}`,
])

const app = express()

// CSRF / DNS-rebinding guard. A browser always reveals the site a request
// comes from (Origin, on cross-origin requests) and the server it believes
// it's talking to (Host) — anything that isn't DriveCosm itself is rejected.
app.use((req: Request, res: Response, next: NextFunction) => {
  const { origin, host } = req.headers
  if ((origin && !allowedOrigins.has(origin)) || !host || !allowedHosts.has(host)) {
    res.status(403).json({ error: 'Request blocked: it did not come from DriveCosm.' })
    return
  }
  next()
})

app.use(express.json())

app.use('/api/config', configRouter)
app.use('/api/auth', authRouter)
app.use('/api/accounts', accountsRouter)
app.use('/api/files', filesRouter)
app.use('/api/upload', uploadRouter)

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

// Express 5 forwards rejected promises here automatically. Errors we raised
// ourselves carry a friendly message and a < 500 status; anything else is
// unexpected, so log it and keep the details out of the browser.
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: 'That file is larger than the 2 GB upload limit.' })
    return
  }
  const status = err.status || 500
  if (status >= 500) console.error(err)
  res.status(status).json({
    error: status < 500 ? err.message : 'Something went wrong on the server — check its logs.',
  })
})

// Loopback only: the API holds Drive tokens for every connected account, so
// it must never be reachable from other machines on the network.
app.listen(PORT, '127.0.0.1', () => {
  console.log(`DriveCosm API running on http://127.0.0.1:${PORT}`)
})
