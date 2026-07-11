import { Router } from 'express'
import { getConfig, setConfig } from '../store'
import { REDIRECT_URI } from '../google'

const router = Router()

router.get('/', (_req, res) => {
  const config = getConfig()
  res.json({
    configured: Boolean(config?.clientId && config?.clientSecret),
    clientId: config?.clientId || null,
    redirectUri: REDIRECT_URI,
  })
})

router.post('/', (req, res) => {
  const clientId = typeof req.body?.clientId === 'string' ? req.body.clientId.trim() : ''
  // A blank secret on an already-configured app means "keep the saved one" —
  // the Setup form promises exactly that.
  const clientSecret =
    (typeof req.body?.clientSecret === 'string' ? req.body.clientSecret.trim() : '') ||
    getConfig()?.clientSecret ||
    ''
  if (!clientId || !clientSecret) {
    res.status(400).json({ error: 'Both the Client ID and Client Secret are required.' })
    return
  }
  if (!clientId.endsWith('.apps.googleusercontent.com')) {
    res.status(400).json({ error: 'That Client ID does not look right — it should end with .apps.googleusercontent.com' })
    return
  }
  setConfig({ clientId, clientSecret })
  res.json({ ok: true })
})

export default router
