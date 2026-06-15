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

## Review
(to be filled in after completion)
