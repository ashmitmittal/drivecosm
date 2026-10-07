import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// DriveCosm Cloud waitlist. Every sign-up is one field in a single Redis hash
// keyed by email, so duplicates collapse on their own and HLEN is the count.
// Env vars come from the Upstash for Redis integration on the Vercel project.

const WAITLIST_KEY = 'waitlist'
const PLANS = new Set(['self-hosted', 'cloud-pro', 'teams'])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Locally running self-hosted copies post here cross-origin. The endpoint
// takes no cookies or credentials, so any origin may call it.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

let clients: { redis: Redis; limiter: Ratelimit } | null = null

// Created on first use rather than at import, so a missing env var fails one
// request with a clear log line instead of the whole function.
function getClients() {
  if (!clients) {
    const redis = new Redis({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! })
    // Fixed one-hour windows: the per-IP counter expires with its window, which
    // is the "deleted within one hour" promise in the Privacy Policy.
    const limiter = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(5, '1 h'), prefix: 'waitlist:ratelimit' })
    clients = { redis, limiter }
  }
  return clients
}

function reply(body: object, status = 200): Response {
  return Response.json(body, { status, headers: CORS })
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: CORS })
}

export async function POST(request: Request): Promise<Response> {
  let body: { email?: unknown; plan?: unknown; company?: unknown }
  try {
    body = await request.json()
  } catch {
    return reply({ error: 'Invalid request.' }, 400)
  }

  // Honeypot field: people never see it, bots fill it. Pretend it worked.
  if (typeof body.company === 'string' && body.company !== '') return reply({ ok: true })

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (email.length > 254 || !EMAIL.test(email)) {
    return reply({ error: 'Please enter a valid email address.' }, 400)
  }
  const plan = typeof body.plan === 'string' && PLANS.has(body.plan) ? body.plan : 'cloud-pro'

  try {
    const { redis, limiter } = getClients()
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
    const { success } = await limiter.limit(ip)
    if (!success) return reply({ error: 'Too many sign-ups from your network. Please try again in an hour.' }, 429)

    // HSETNX keeps the original sign-up if someone joins twice. Either way the
    // answer is the same, so the form never reveals who is already on the list.
    await redis.hsetnx(WAITLIST_KEY, email, { plan, joinedAt: new Date().toISOString() })
    return reply({ ok: true })
  } catch (err) {
    console.error('waitlist: could not save sign-up', err)
    return reply({ error: 'We could not save your sign-up just now. Please try again in a minute.' }, 500)
  }
}
