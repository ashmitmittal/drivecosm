# DriveCosm

**All your Google Drive space. One beautiful place.**

Everyone hits the 15 GB wall eventually. But most of us also have more than one Google account —
personal, work, that old one from college. DriveCosm connects them all into a single dashboard so
you can see your combined storage, browse every file in one list, and upload new files to
whichever account has the most free space — automatically.

- 🔗 **Connect multiple Google accounts** and pool their storage
- 📊 **One dashboard** — a segmented storage ring plus a per-drive breakdown
- 🗂️ **A real file explorer** — browse folders across every drive as one, grid and list views with
  thumbnails, global search, and an inspector panel with file details and actions
- 🎯 **Smart uploads** — files are routed to the drive with the most free space
- 🌗 **Liquid-glass UI** — a macOS-inspired frosted design with switchable light & dark themes
- 🔒 **100% local & private** — runs on your machine, with your own Google credentials; tokens never leave your computer

> DriveCosm is self-hosted by design. There is no server, no account, no telemetry — your files
> talk only to Google, straight from your machine.

## Quick start

You need [Node.js](https://nodejs.org) 20.19 or newer.

```bash
git clone https://github.com/YOUR_USERNAME/drivecosm.git
cd drivecosm
npm install
npm run dev
```

That single command starts both servers — the API on port 4000 and the web app on port 3000.
Open **http://localhost:3000** — the built-in setup wizard takes it from there.

## One-time Google setup (~2 minutes)

Because DriveCosm is open source and self-hosted, it doesn't ship with Google API keys — you
create your own free ones. The in-app wizard at **http://localhost:3000/setup** walks you through
it step by step, but here is the same guide:

1. **Create a Google Cloud project** (free, no credit card) at
   [console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate).
   Name it anything, e.g. `DriveCosm`.

2. **Enable the Google Drive API** for that project:
   [console.cloud.google.com/apis/library/drive.googleapis.com](https://console.cloud.google.com/apis/library/drive.googleapis.com)
   → click **Enable**.

3. **Configure the consent screen** at
   [console.cloud.google.com/auth/overview](https://console.cloud.google.com/auth/overview):
   click **Get started**, pick any app name, choose **External** as the audience, and accept the
   defaults. Then under **Audience → Test users**, add **every Google email you plan to connect**.

4. **Create OAuth credentials** at
   [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials):
   **Create credentials → OAuth client ID → Web application**, and add this authorized redirect URI
   exactly:

   ```
   http://localhost:3000/api/auth/callback
   ```

5. **Paste the Client ID and Client Secret** into the wizard at
   [localhost:3000/setup](http://localhost:3000/setup). Done — now click **Connect an account**
   as many times as you have accounts. 🎉

### “Google hasn’t verified this app”?

Expected. Your OAuth app is in *testing* mode, which is exactly right for personal use — only the
test users you added can sign in. Click **Continue** past the warning. It's your own app,
accessing your own accounts.

## How it works

The project is a TypeScript monorepo with a cleanly separated backend and frontend:

```
drivecosm/
├── backend/    # Node.js + Express API (port 4000) — OAuth, Drive calls, token storage
└── frontend/   # React + Vite web app (port 3000) — proxies /api/* to the backend
```

- Everything runs locally on your machine; the browser only ever talks to the backend, and the
  backend only ever talks to Google.
- Each account is connected via Google OAuth with offline access; DriveCosm stores the refresh
  tokens in a local, gitignored file (`backend/data/drivecosm.json`).
- The file list and storage stats are fetched live from the Drive API across all accounts in
  parallel and merged.
- Uploads go through `POST /api/upload`, which picks the connected account with the most free
  space, stages the file in a temp directory, and streams it to that Drive.
- Deleting a file moves it to that account's Drive **trash** (recoverable for 30 days) — DriveCosm
  never permanently deletes anything.

## Good to know

- **Keep your accounts healthy.** Google may delete accounts that stay inactive for ~2 years, and
  its terms discourage creating accounts purely to stack free storage. DriveCosm is built to
  manage accounts you genuinely have — treat it that way and keep recovery info on each account.
- **A file lives in exactly one account.** DriveCosm routes each upload to a single Drive — it
  does not split files across accounts.
- **Uploads are capped at 2 GB per file** in this version, and are staged to your temp directory
  on the way to Drive.
- **v1 runs in dev mode.** `npm run dev` is the supported way to run DriveCosm for now; a packaged
  single-command production mode is on the roadmap.

## Roadmap

- **v1 (this)** — multi-account connect, unified dashboard, folder-aware file explorer, smart upload routing, liquid-glass light/dark UI
- **v2** — photos section: face recognition and semantic search across every account ("find photos of A and B together"), powered by local AI models
- Later — more providers (Telegram, OneDrive, Dropbox, WebDAV, S3), cross-account move, resumable uploads, shared-link manager

## Contributing

Issues and PRs are very welcome. The stack is intentionally small: an Express + TypeScript
backend, a React (Vite) + TypeScript frontend, hand-written CSS (no framework), and `googleapis`.
`npm install && npm run dev` at the repo root is the whole development setup; `npm run typecheck`
checks both workspaces.

## License

[MIT](LICENSE)
