# Cardia AI

> Understand your cardiovascular biomarker numbers — calmly. Cardia AI presents
> **educational information that references published clinical guidelines.** It is
> not medical advice, does not diagnose or treat, and is not a substitute for
> professional care.

Cardia AI helps people understand their cardiovascular lab values without the fear
that makes most of us avoid them. It is **rules-based, not model-based**: a pure,
fully-sourced clinical rules engine categorizes each value against current,
named guidelines, wrapped in an anxiety-aware interface built around
**progressive disclosure** — one calm signal first, opt-in detail second, a
doctor-conversation framing third.

This repo is **Phase 1** (see [`docs/CARDIA_AI_BUILD_PLAN.md`](docs/CARDIA_AI_BUILD_PLAN.md)):
a beautiful, single-session assessment on production-grade Next.js, the complete
rules engine, and the backend / auth / AI architecture scaffolded but not yet
user-facing.

---

## Stack

| Layer         | Choice                                                                |
| ------------- | --------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Server Components by default) · **Node ≥ 20** |
| Language      | TypeScript (`strict`)                                                 |
| Styling       | Tailwind CSS v4 (CSS-first `@theme` tokens)                           |
| UI primitives | shadcn/ui pattern on Radix + CVA, restyled to the design system       |
| Animation     | Motion (used sparingly; reduced-motion aware)                         |
| Validation    | Zod (every input + boundary)                                          |
| Database      | Supabase (Postgres + RLS) — **scaffolded, off in Phase 1**            |
| Auth          | Supabase Auth via the `proxy.ts` session scaffold — **no login wall** |
| Testing       | Vitest (rules engine + schemas + DAL) · Playwright (critical flows)   |
| Hosting       | Vercel                                                                |

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Phase 1 needs **no environment variables** — nothing is sent to a server.

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run dev`       | Dev server                                                          |
| `npm run build`     | Production build                                                    |
| `npm run lint`      | ESLint                                                              |
| `npm run typecheck` | `tsc --noEmit`                                                      |
| `npm test`          | Unit tests (Vitest)                                                 |
| `npm run test:e2e`  | E2E (Playwright) — run `npx playwright install chromium` once first |
| `npm run format`    | Prettier                                                            |

---

## Project structure

```
app/                      Routes: / (hero), /assessment, /results
components/
  ui/                     Restyled shadcn-pattern primitives (button, input, switch, …)
  layout/                 Header, footer, disclaimer, wordmark
  assessment/             Multi-step assessment flow
  results/                Progressive-disclosure results (composite → breakdown → doctor panel)
lib/
  rules-engine/           ★ Pure, typed, fully-tested clinical engine (see VERIFICATION.md)
  schemas/                Zod schemas (generated from the engine's input ranges)
  crypto/                 AES-256-GCM encrypt/decrypt (Phase 2.1, server-only)
  data-access/            Supabase DAL: readings (Phase 2) + anonymous capture (Phase 2.1)
  client/                 Browser capture (sendBeacon → /api/assessments)
  analytics/              Stable anonymous browser id
  persistence/            Phase 1 browser-only assessment store
  content/                Centralized regulatory copy
  config/                 Feature flags + env access
app/api/assessments/      Anonymous capture endpoint (Phase 2.1, server-only)
scripts/                  decrypt-assessment.ts (exact-value analysis)
supabase/
  migrations/             profiles + readings + assessments tables, RLS policies
  tests/rls.sql           Runnable RLS isolation test
proxy.ts                  Supabase session-refresh scaffold (Next 16 renamed middleware → proxy)
tests/                    unit/ (Vitest) and e2e/ (Playwright)
```

---

## The clinical rules engine (the defensible core)

`lib/rules-engine/` is a standalone, **pure** TypeScript module with zero UI
dependencies. Given biomarker values plus light context it returns calm,
fully-sourced categorizations and an **educational** composite summary (a count
of how many values fall within guideline ranges — never a risk prediction or
diagnosis).

- **Every threshold carries its citation as data** (name, body, year, reference,
  URL) so the UI can link it. The full per-threshold audit and source list is in
  [`lib/rules-engine/VERIFICATION.md`](lib/rules-engine/VERIFICATION.md).
- **Newest guideline editions** (2026 ACC/AHA Dyslipidemia, 2025 AHA/ACC Blood
  Pressure, ADA Standards of Care 2026, …), verified against primary sources.
- **Boundary-tested**: every band edge, sex-specific HDL, composite logic, and
  config integrity (contiguous bands, no medication-directive language) are
  covered by Vitest. The version is stamped on every result (`GUIDELINE_VERSION`).

Updating a guideline = editing a config file + bumping the version, never
reprompting a model.

---

## Design system — "Warm Editorial"

Calm, trustworthy, editorial, clinical-but-human. Tokens live in
[`app/globals.css`](app/globals.css) (Tailwind v4 `@theme`): warm-paper canvas,
deep ink-navy anchors, a single muted teal accent, and muted sage / amber / clay
status colors (no neon, no alarmist reds). Display **Fraunces** + body/data
**IBM Plex Sans**. WCAG AA contrast, full keyboard support, and
`prefers-reduced-motion` honored throughout.

---

## Security & privacy

- **Phase 1: nothing leaves the browser.** The assessment is held in
  `sessionStorage`, or — opt-in — mirrored to `localStorage` ("keep on my device").
- **Phase 2.1 (optional, off by default): anonymous encrypted capture.** With
  `NEXT_PUBLIC_CAPTURE_ENABLED=true`, a copy is also stored server-side with **no
  account** — exact values AES-256-GCM encrypted, only de-identified categories in
  plaintext. The browser never touches the DB (all writes are server-side via the
  service role against an RLS-locked table). See the setup section below.
- **RLS on every user table**, default-deny, policies keyed to `auth.uid()` so a
  user can only ever touch their own rows. Verify with `supabase/tests/rls.sql`.
- The **service-role key is server-only** (`lib/data-access/supabase/admin.ts`,
  with a runtime browser guard) and is never `NEXT_PUBLIC_`.
- All access is centralized in `lib/data-access` behind `FLAGS.persistenceEnabled`.
- Regulatory framing is a hard rule (no diagnosis, no medication directives,
  everything attributed + routed to a physician). Copy lives in
  [`lib/content/regulatory.ts`](lib/content/regulatory.ts).

---

## Testing

```bash
npm test                       # 148 unit tests: engine, schemas, DAL guards, crypto, de-identification
npx playwright install chromium
npm run test:e2e               # critical flow, empty state, validation, reduced-motion
```

Database RLS (after applying the migration to a real/local DB):

```bash
psql "$DATABASE_URL" -f supabase/tests/rls.sql      # rolls back; raises on any leak
```

---

## Deploy runbook (Supabase + Vercel)

Phase 1 deploys with no backend. To stand up the (still-inactive) backend and a
live URL:

1. **Create a Supabase project.** Copy the Project URL, the `anon` key, and the
   `service_role` key (Project Settings → API).
2. **Apply the schema.** Either paste each file in `supabase/migrations/` into the
   Supabase SQL editor, or with the CLI:
   ```bash
   supabase link --project-ref <ref>
   supabase db push
   ```
   Then run `supabase/tests/rls.sql` once to confirm isolation.
3. **Set environment variables** (copy `.env.example` → `.env.local` locally, and
   add the same in Vercel → Project → Settings → Environment Variables):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server-only, never NEXT_PUBLIC_
   NEXT_PUBLIC_PERSISTENCE_ENABLED=false   # keep false in Phase 1
   ```
4. **Deploy to Vercel:** `vercel` (or connect the Git repo). Build command and
   output are the Next.js defaults.
5. **Lighthouse:** run against the deployed URL (or `npm run build && npm start`)
   and confirm strong Performance / Accessibility / Best-Practices scores.

---

## Phase 2.1 — Anonymous encrypted capture (optional)

Off by default. When enabled, every completed assessment is also stored
server-side **with no account and no login** — exact values encrypted at rest
(AES-256-GCM), de-identified categories in plaintext for analysis. The browser
never touches the table; writes go through `/api/assessments` (server-only) via
the service role against an RLS-locked table.

**Enable it**

1. Apply the migration `supabase/migrations/20260615000000_assessments.sql`
   (SQL editor, or `supabase db push`).
2. Set the env (locally in `.env.local`, and in Vercel):
   ```
   ENCRYPTION_KEY=...                  # openssl rand -base64 32  — server-only, back it up
   NEXT_PUBLIC_CAPTURE_ENABLED=true
   # plus NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
   ```
   With the flag on, the privacy copy automatically switches from "nothing leaves
   your browser" to "anonymous & encrypted". The server re-checks the secrets — if
   any are missing it simply does nothing (`204`).

**Analyze it**

- **No decryption** for category-level questions — query the plaintext columns:
  ```sql
  select composite_signal, count(*) from assessments group by 1;
  select tiers->>'ldl' as ldl_tier, count(*) from assessments group by 1;
  select age_band, sex, avg(within_range::float / markers_entered) from assessments group by 1, 2;
  ```
- **Exact values** (when you need the numbers):
  ```bash
  npx tsx --env-file=.env.local scripts/decrypt-assessment.ts
  ```

**Anonymity** — a random `anon_id` (browser `localStorage`) groups repeat
submissions for cohort analysis. No name, email, IP, user-agent, or exact age is
ever stored; `tiers` carry categories only, never numbers.

---

## Phase 2 flip-on points (for the next engineer)

Everything below is scaffolded and one change away from active:

- **Persistence** — set `NEXT_PUBLIC_PERSISTENCE_ENABLED=true`
  (`lib/config/flags.ts`), then call `getReadingsRepository().save(...)`
  (`lib/data-access/readings.ts`) from a Server Action on results submit.
- **Auth** — the `proxy.ts` session refresh is in place; add the login/signup UX
  and decide gating (sensible default: assessment is free + anonymous, saving
  requires an account).
- **AI explanation** — the reserved, inactive slot is
  `components/results/ai-explanation-slot.tsx`; wire Claude Sonnet with the
  hard guardrails in build-plan §7.3 and a deterministic fallback.
- **Payments** — Stripe, Phase 3.

---

## Disclaimer

Cardia AI is a general wellness tool. It is not a medical device and does not
predict, diagnose, or rule out any disease. Always discuss your results — and any
decisions about medication or treatment — with your physician.
