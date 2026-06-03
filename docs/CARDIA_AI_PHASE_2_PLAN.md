# Cardia AI: Phase 2 Plan (Simple & Focused)

**Companion to:** `docs/CARDIA_AI_BUILD_PLAN.md`
**Status:** Phase 1 complete. This is the scoped-down Phase 2.

---

## What Phase 2 is (and isn't)

Phase 2 is exactly **four things**:

1. **Store assessments in the database — no account, no login.** A user enters values, sees results, and we save the submission server-side (so the data is durable and usable for analysis).
2. **Encryption / decryption** of the stored values.
3. **UI polish** — move the results from one long single column to an intuitive **multi-column** layout (using the frontend-design skill).
4. **AI explanation layer** — fill the reserved slot with a calm, guardrailed plain-language explanation.

**Explicitly out of scope** (do not build): accounts / authentication / OAuth, history dashboards & trends, payments / Stripe, CI/CD, error monitoring (Sentry), privacy-policy / legal pages, the whole "launch hardening" suite. Keep it simple.

The only things that stay non-negotiable (because it's a health app): the **regulatory framing** (not medical advice, no medication directives, route to a physician) and the **calm, accessible (WCAG AA), anxiety-aware** design from Phase 1.

### Division

| Sub-phase | Focus | Maps to |
|---|---|---|
| **2.1** | Anonymous encrypted storage | items 1 + 2 |
| **2.2** | Multi-column UI polish | item 3 |
| **2.3** | AI explanation layer | item 4 |

Order is just dependency-light sequencing: get data captured, make the screen great, then drop AI into the polished screen. (If you'd rather see the visual win first, 2.1 and 2.2 can swap — they don't depend on each other.)

---

## Phase 2.1 — Anonymous Encrypted Storage

**Goal:** every completed assessment is saved to the database, with sensitive values encrypted, and **no account is ever created**.

**What we build**
- A **Server Action** (`saveAssessment`) that runs on the server, encrypts the payload, and inserts one row. The results page calls it once when results render (non-blocking — the user never waits). No login, no auth.
- **Schema** (new migration; don't edit the Phase 1 one): an `assessments` table with `id`, `anon_id` (a UUID the browser generates once and keeps in `localStorage` — lets us group one person's submissions for analysis without an account), `ciphertext`, `iv`, `guideline_version`, `created_at`. Remove the `auth.users` foreign key (no auth).
- **All DB access is server-side** via the service-role key (already scaffolded in `lib/data-access/supabase/admin.ts`). The browser never touches the database. RLS stays default-deny for the anon key, so there's no public read path — no data exposure.
- Reuse the existing `lib/data-access` layer; adapt the repository for anonymous writes (drop the `assertPersistenceEnabled` gate or flip the flag on).

**Key decisions**
- **Encryption:** application-layer **AES-256-GCM** with a 32-byte key from `ENCRYPTION_KEY` in server env (never committed, never in the client bundle). One small `lib/crypto/encrypt.ts` utility with `encrypt()` / `decrypt()`. (Supabase already encrypts at rest; this gives explicit field-level control, which is what you asked for.)
- **What's encrypted:** the sensitive payload (raw values + age/sex context). *Optionally* also store a few **de-identified** derived fields in plaintext (tier counts, composite signal, age band) so simple aggregate analysis works without decrypting. Recommended but optional — your call.
- **Decryption** happens only server-side, when reading data for analysis.

**Done when**
- Finishing an assessment writes an encrypted row; the value is unreadable in a raw DB dump; a server-side decrypt round-trips it; `ENCRYPTION_KEY` lives in env only; the client bundle has no key and no direct DB write.

---

## Phase 2.2 — Multi-Column UI Polish

**Goal:** the results page feels like a polished, intuitive product — a responsive **multi-column dashboard**, not one long single column.

**What we build**
- Use the **frontend-design skill** to redesign the results layout into a responsive **multi-column / bento grid**: the composite signal + key highlights up top, the biomarker breakdown in a multi-column grid, the doctor panel and the (reserved) AI slot placed where they read naturally. Collapses cleanly to a single column on mobile.
- Tighten the assessment flow layout where it helps (denser, multi-column field groups).
- Keep the **Warm Editorial** system, calm/anxiety-aware principles, WCAG AA, and reduced-motion — these don't change.

**Key decisions**
- Pure frontend — **no backend changes**. Reuse existing components, just re-lay them out with CSS grid.
- Make sure the redesign leaves a natural home for the AI explanation (2.3) so it drops in without another redesign.

**Done when**
- Results render as an intuitive multi-column dashboard on desktop and a clean single column on mobile; still calm, accessible, and on-brand.

---

## Phase 2.3 — AI Explanation Layer

**Goal:** the reserved AI slot becomes a working, calm, plain-language explanation of the user's results.

**What we build**
- A **server-side** call to **Claude Sonnet** (Anthropic SDK) — the API key is server-only, never sent to the browser. Use the **claude-api skill** to build it.
- **Input = rules-engine output only** (the categorized results + the guideline `note`/`source` text). The model translates what's already known; it computes nothing new.
- **Strict system prompt** (the build plan's §7.3 guardrails): never diagnose, never tell the user to start/stop/change a medication, always attribute to the cited guideline, always route decisions to the physician, calm and non-alarmist tone, never invent thresholds or facts.
- **Deterministic fallback:** if the call fails, times out, or the output trips a basic safety check, show the existing rules-engine `note`s. The user always gets a coherent, compliant explanation.
- **Stream** the text into the polished AI slot; show the "AI-generated · references published guidelines · not medical advice" line.
- **Basic cost control:** an Anthropic spend cap (console), prompt-cache the static system prompt, and cache identical inputs (same reading → same explanation).

**Key decisions**
- **Sonnet, not Opus** (bounded translation, much cheaper).
- Guardrails + fallback are **non-negotiable** even in a simple build — this is the one place a health app can't cut corners.

**Done when**
- A user sees a calm, sourced, non-directive AI explanation; forcing a failure shows the fallback; the key never reaches the client; the spend cap + caching are in place.

---

## Notes

- **Frontend-design skill:** the build plan asks for it on all UI work; use it for 2.2 (or apply its principles if it isn't available in the environment).
- **Phase 1 head start:** the data-access layer (`lib/data-access`), the admin (service-role) client, the reserved AI slot (`components/results/ai-explanation-slot.tsx`), and the rules-engine outputs (which are both the AI's input and its fallback) are already in place — Phase 2 mostly wires these together.
