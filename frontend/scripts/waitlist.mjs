// Prints the DriveCosm Cloud waitlist, oldest first. Run from the repo root:
//   npm run waitlist -w frontend
// Needs the Upstash env vars in the repo-root .env.local (`npx vercel env pull`).
import { Redis } from '@upstash/redis'

const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
const entries = Object.entries((await redis.hgetall('waitlist')) ?? {}).sort(([, a], [, b]) =>
  a.joinedAt.localeCompare(b.joinedAt)
)

for (const [email, { plan, joinedAt }] of entries) {
  console.log(`${joinedAt.slice(0, 10)}  ${plan.padEnd(11)}  ${email}`)
}
console.log(`\n${entries.length} sign-up${entries.length === 1 ? '' : 's'}`)
