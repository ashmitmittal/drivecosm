// Writes a fully rendered HTML file for every public page into dist/, so the
// content is readable without running JavaScript (crawlers, link previews,
// reviewers). Runs after the client and SSR builds: see "build" in package.json.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const SITE = 'https://drivecosm.com'

const PAGES = [
  {
    url: '/',
    file: 'index.html',
    title: 'DriveCosm: all your cloud storage, one place',
    description:
      'DriveCosm pools every Google Drive account you own into one drive with one search bar. Free to self-host; DriveCosm Cloud with AI search built on Claude is coming soon.',
  },
  {
    url: '/pricing',
    file: 'pricing.html',
    title: 'Pricing · DriveCosm',
    description: 'Free to self-host. DriveCosm Cloud from $4/month with AI search. Teams plan planned.',
  },
  {
    url: '/roadmap',
    file: 'roadmap.html',
    title: 'Roadmap · DriveCosm',
    description: 'What is live in DriveCosm today, what is next, and what comes after.',
  },
  {
    url: '/about',
    file: 'about.html',
    title: 'About · DriveCosm',
    description: 'Why DriveCosm exists, who builds it, and how to get in touch.',
  },
  {
    url: '/privacy',
    file: 'privacy.html',
    title: 'Privacy Policy · DriveCosm',
    description: 'What DriveCosm collects, how it is used, and your rights.',
  },
  {
    url: '/terms',
    file: 'terms.html',
    title: 'Terms of Service · DriveCosm',
    description: 'The terms for using drivecosm.com and the DriveCosm waitlist.',
  },
  {
    url: '/app',
    file: 'app.html',
    title: 'Get DriveCosm · DriveCosm',
    description: 'Join the DriveCosm Cloud waitlist, or run the free self-hosted edition today.',
  },
]

const escape = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const { render } = await import(pathToFileURL(path.join(root, 'dist-server', 'entry-server.js')).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

for (const page of PAGES) {
  const pageUrl = SITE + (page.url === '/' ? '/' : page.url)
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escape(page.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${pageUrl}$2`)
  const body = render(page.url)
  if (!body || body.length < 500) throw new Error(`prerender: ${page.url} rendered almost nothing`)
  html = html.replace('<div id="root"></div>', `<div id="root" data-page="${page.url}">${body}</div>`)
  fs.writeFileSync(path.join(dist, page.file), html)
  console.log(`prerendered ${page.url.padEnd(9)} -> dist/${page.file} (${Math.round(body.length / 1024)} KB)`)
}
