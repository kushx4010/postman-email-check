# Postman

**Is your email landing where it should?** — Instant spam risk check for your domain.

Minimal SaaS MVP: validate a domain’s email deliverability health (SPF, DKIM, DMARC) and send an automated spam risk report via email.

## Tech stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **Node DNS** for SPF/DKIM/DMARC lookups
- **Resend** for sending report emails
- In-memory only (no database)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set your Resend API key:

   ```bash
   cp .env.example .env.local
   ```

   Get an API key at [resend.com](https://resend.com). For the email list, create an **Audience** in the Resend dashboard and set `RESEND_AUDIENCE_ID` in `.env.local` (optional). Do not hardcode secrets.

3. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Features

- **Landing page** — Headline, email + domain form, “Check My Domain” CTA
- **Domain scan** — `POST /api/scan` checks SPF, DKIM, DMARC; returns score (0–100), risk level (Low/Medium/High), issues, and fixes
- **Results page** — Score, risk badge, issues list, recommended fixes
- **Email report** — Resend sends “Postman: Your Domain Spam Risk Report” to the submitted email

## Scoring

- Start at 100. No SPF −25, no DKIM −25, no DMARC −20, blacklist −40.
- **80–100** → Low risk · **50–79** → Medium · **&lt;50** → High

## Deploy on Vercel

1. Push to GitHub and import the repo in Vercel.
2. Add `RESEND_API_KEY` in Project → Settings → Environment Variables.
3. Deploy. Optional: use a subdomain (e.g. `postman.yourdomain.com`).

---

Postman — minimal, bold, no sign-up.
