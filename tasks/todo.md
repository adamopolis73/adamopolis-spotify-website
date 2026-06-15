# Task: Gate the site behind "Sign in with Google" (Cloudflare Access)

Goal: Only people I allow (by Google email) can view the site. Public link should
prompt a Google login first.

## Why this design
- GitHub Pages is static + public — no server to check a login, so it can't truly gate.
- Cloudflare Access sits at the edge and checks identity BEFORE serving the page.
- Free tier covers this. Works even on the free `*.pages.dev` domain (no custom domain needed).

## Architecture
GitHub repo (source, stays where it is)
  → Cloudflare Pages (hosting, auto-deploys on git push)
  → Cloudflare Access (Zero Trust) in front, policy = "email in {allowlist}"
  → Identity provider = Google login

## Plan

### A. Account setup — ONLY ADAM CAN DO (I can't create accounts or enter credentials)
- [ ] A1. Create / sign in to a Cloudflare account (free) at dash.cloudflare.com
- [ ] A2. Turn on Zero Trust (Access) — pick the Free plan when prompted
- [ ] A3. Decide the identity step (see "Decision" below)

### B. Hosting on Cloudflare Pages
- [ ] B1. In Cloudflare dash: Workers & Pages → Create → Pages → Connect to Git
       → authorize the `adamopolis73/adamopolis-spotify-website` repo
- [ ] B2. Build settings: framework = None, build command = (blank), output dir = `/`
- [ ] B3. First deploy → confirm site loads at the new `*.pages.dev` URL

### C. Access policy (I can do this for you via API token, OR guide the clicks)
- [ ] C1. Zero Trust → Access → Applications → Add a self-hosted app on the pages.dev host
- [ ] C2. Policy: Allow, rule = "Emails" → your allowlist of friends/family
- [ ] C3. Attach Google as the login method

### D. Verify (don't mark done until proven)
- [ ] D1. Open the pages.dev URL in a clean/incognito window → must hit Google login
- [ ] D2. Sign in with an allowed email → site loads
- [ ] D3. Try a non-allowed email → access denied

## DECIDED
- Login method = **Email one-time PIN** (no Google Cloud OAuth app needed).
- Tooling = **Cloudflare REST API via curl** (no Node/Wrangler install required).
- Hosting = Pages **Git integration** (push-to-deploy; keeps current workflow).

## What I need from Adam to do the Access config for you
1. The new **`*.pages.dev` URL** after B3.
2. A scoped **Cloudflare API token** with: Account → Access: Apps & Policies (Edit),
   Account → Cloudflare Zero Trust (Edit). Paste it here; I will NOT commit it.
3. The **allowlist emails** (yours + friends/family who should get in).

## RE-PLAN (blocker found 2026-06-15)
- Site was deployed as a **Worker** (`adamopolis-spotify-website.adam-ogorman.workers.dev`),
  not a Pages project. Verified live, serving correct content (HTTP 200, 5 playlists).
- **Blocker:** Cloudflare Access self-hosted apps require a custom domain in the user's
  own zone. They CANNOT protect a raw `*.workers.dev` host, and the Pages Access toggle
  only covers preview links, not the production domain. (Confirmed via CF docs.)
- **Unblock:** A Worker is server-side, so real auth can live in the Worker itself —
  no domain needed. Options presented to Adam:
    A) Username+password (HTTP Basic / form) in the Worker — free, current URL. [recommended]
    B) Register a custom domain (~$10/yr) + Cloudflare Access email-PIN — per-person allowlist.
    C) Google OAuth inside the Worker — literal Google button, needs GCP OAuth client.
- Status: awaiting Adam's choice (he dismissed the picker; do not proceed until he says).

## Review (DONE 2026-06-15)
- Pivoted from Cloudflare Access (needs custom domain) to in-Worker Basic Auth, since the
  site runs as a Git-connected static-assets Worker (server-side code is available).
- Implementation: `wrangler.jsonc` adds `main: src/index.js` + ASSETS binding with
  `run_worker_first: true`; the Worker checks `SITE_PASSWORD` (Cloudflare secret) before
  serving assets. Password is NOT in the public repo.
- Verified live via curl: no creds → 401, correct creds → 200 (site loads), wrong pw → 401.
- Login: user `music` / password stored as SITE_PASSWORD secret.
- Future option: per-person logins / "Sign in with Google" = custom domain + Cloudflare Access.
- Note: the API token Adam supplied never validated; finished entirely via Git + dashboard
  secret instead, verifying through the public URL.
