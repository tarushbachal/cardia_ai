# Cardia — Business Strategy: Monetization, Go-to-Market, Deployment & Run Cost

> Status: strategy memo (June 2026). Companion to the stakeholder pitch deck (`docs/Cardia_Pitch_Deck.pptx`).
> All financial figures are **benchmark-based estimates, not guarantees**. Cardia is positioned as a **general-wellness / educational tool, not a medical device.**

---

## 0. What Cardia is today (the asset)

A production web app, already deployed (Vercel + Supabase + GitHub):

- A **clinical rules engine** that categorizes 12 cardiovascular biomarkers against **named, dated published guidelines** (NCEP ATP III, 2026 ACC/AHA, 2025 AHA/ACC BP, ADA 2026, 2019 ESC/EAS, WHO) — every threshold traceable to its source. This is the **defensible IP / moat**: it is *not* a black-box model.
- A **danger-first results experience**, a fully-sourced **biomarker reference library** (an SEO asset), a **doctor-ready print report**, and an **optional, guardrailed AI explanation layer** (Claude Sonnet, server-side, with a deterministic fallback so it never fails or hallucinates a directive).
- **Privacy-first** capture: nothing is shared unless the user explicitly opts in (encrypted, anonymized).

The product is real and demonstrable. What it lacks to be *sold* is accounts, billing, and premium gating — all already designed (see §3).

---

## 1. Monetization — every path

### 1A. Consumer (B2C)

**Freemium subscription — "Cardia Plus" (the recommended core).**
- **Free:** one anonymous assessment + the full reference library. Drives acquisition and SEO.
- **Paid (~$6–9/mo or $49–59/yr):** saved history, **trends over time**, the **AI walkthrough on by default**, the **doctor-ready PDF**, retest reminders, and **family / multi-profile**.
- Benchmarks: consumer freemium converts **~2–5%**; **subscription apps earn ~4.6× the ARPU of ad-only apps**; **annual plans retain far better** (cheap annual plans keep up to ~36% of users at one year, vs ~30% of annual subs cancelled in month one). Health & Fitness is the **top-earning app category**.

**Pay-per-report (no-subscription option).** ~$4.99 for the detailed doctor PDF — captures one-time users who won't subscribe.

> Why not ads? Ads on a health-anxiety product erode trust and earn ~4.6× *less* per user. Avoid.

### 1B. Business (B2B / B2B2C) — the real revenue engine

Highest contract value, recurring, and most defensible. License the **rules engine + UI** as an embeddable **"lab-value interpretation layer"**:

- **At-home lab-test companies** — they sell the test but have no good results-interpretation layer. Natural fit.
- **Telehealth platforms, longevity / concierge clinics, primary care, corporate wellness / employers, pharmacies, insurers / payers.**
- Model: per-seat, per-API-call, or annual platform license. A handful of these contracts dwarfs thousands of consumer subs.

**Affiliate / referral.** Partner with at-home lab providers: *"Don't have your numbers? Order a test."* Paid per conversion — monetizes the large free-user base that lacks lab values.

**De-identified aggregate data** (uses the opt-in consent already built). *Optional, low priority* — carries privacy/regulatory and reputational risk; only with airtight consent and governance.

### 1C. Exit / "can we sell it?"

- **"Amazon One" is palm-payment biometrics — unrelated.** The realistic acquirers/partners are **Amazon Health / One Medical, lab companies (Labcorp, Quest, Function Health), telehealth (Hims & Hers, Teladoc), insurers (Optum), and wearables (Oura, Whoop, Apple/Samsung Health)** — all of whom want a trustworthy bloodwork-interpretation layer.
- **Path to a sale:** grow consumer usage + land **1–2 lighthouse B2B deals**, with the sourced rules engine as the IP moat and a clean "general wellness" regulatory posture. That combination is what makes a strategic acquisition or acqui-hire credible.

### Recommended primary model
**Freemium B2C** to build users, brand, and SEO, **while** pursuing **B2B licensing** as the revenue engine — classic *land and expand*.

---

## 2. Go-to-Market / Marketing

1. **SEO via the biomarker library = the #1 durable engine.** Every biomarker is already a guideline-sourced page that can rank for *"normal LDL range," "what is ApoB," "high Lp(a) meaning,"* etc. High-intent, compounding, near-zero marginal cost. **Top priority** — expand and optimize these pages.
2. **Short-form video (TikTok / Instagram Reels / YouTube Shorts) — yes, strong fit.** Health "edutainment" performs. Content pillars:
   - *"What your [HbA1c / ApoB / Lp(a)] number actually means."*
   - *"Most people misread their lab report — here's the one thing to check."*
   - Myth-busting; *"the 5 numbers a cardiologist actually looks at."*
   - Format: hook on a specific number → one crisp insight → CTA to Cardia. Founder-led or partnered with a clinician/creator for trust.
3. **Communities.** r/PeterAttia, r/Cholesterol, r/longevity — people literally post lab values asking *"is this bad?"* Cardia is the precise answer. Be genuinely helpful, not spammy.
4. **Creator partnerships** in the longevity / Attia-adjacent audience — they already care about ApoB and Lp(a), which Cardia covers.
5. **Lab-company co-marketing.** Cross-promote with at-home test providers.
6. **Paid ads — later.** Health CAC is high; validate with organic + SEO first.

---

## 3. Deploy as a product — and does the stack need to change?

**Verdict: no rewrite. The current stack is already a fundable, scalable production SaaS stack.** Next.js 16 + Supabase (Postgres / RLS / Auth) + Vercel + Anthropic is exactly what venture-backed health startups run on, and it scales to **100k+ users** on the same architecture. The core value (the rules engine) is **free local compute**; only the optional AI has a per-use cost, and it is **gated to paid users and cached**.

**Work to go from "deployed demo" → "sellable product"** (already designed in the earlier Phase 2 plan):

- **Accounts** (Supabase Auth) so users can save history.
- **Stripe billing** + paywall + the premium features (history, trends, PDF, AI-by-default for paid).
- **Production hardening:** custom domain, error monitoring (Sentry, PHI-scrubbed), privacy-safe analytics.
- **Legal / compliance:** Privacy Policy, Terms, and adherence to the **FTC Health Breach Notification Rule** and **Washington My Health My Data Act**.
- **Stay "general wellness / educational, not a medical device."** This is load-bearing: it keeps Cardia out of **FDA SaMD** territory, which would add major cost, time, and risk. Any move toward *diagnosis* or *risk prediction* changes that calculus entirely.

---

## 4. Yearly run-cost estimate (2026 pricing)

*The AI explanation layer is out of scope for now, so it is not in this budget. The clinical rules engine that powers every result is free local compute and has no per-use cost.*

This is a product to be sold, so it runs on **paid tiers** from day one — not free tiers. Free tiers are excluded on purpose: Vercel's Hobby plan **prohibits commercial use**, and Supabase's free project **pauses after inactivity, has no daily backups, caps the database at 500 MB, and has no support**. For a real, sellable product you need the commercial license, automated backups, and uptime that the Pro tiers provide.

| Stage | Vercel | Supabase | Domain / Monitoring | Stripe | **~Total / yr** |
|---|---|---|---|---|---|
| **Launch** (0–2k users) | Pro, $20/mo | Pro, $25/mo | ~$15/yr domain, free monitoring | 2.9% + $0.30 on revenue only | **~$555–650** |
| **Growth** (10–50k MAU) | $20–80/mo (bandwidth) | $25–60/mo (compute / egress) | ~$15–40/mo | on revenue only | **~$1,000–2,400** |

- **Sources:** Vercel Pro **$20/seat** (incl. 1 TB transfer); Supabase Pro **$25/mo** (~100k MAU, 8 GB DB, daily backups, no pausing) — both required for commercial use, backups, and support. Domain ~$15/yr.
- **One-time / variable:** optional legal review ~$1–3k one-time; marketing spend variable.
- **Headline:** as a sellable product on proper paid infrastructure, Cardia runs for roughly **$550–650/yr at launch**, rising into the **low thousands** only at meaningful scale. It stays cheap because the clinical engine is free local compute and the AI layer is out of scope — so there is **no per-use cost to serve a result.** That is unusually lean for a health product.

---

## 5. The 90-day path to first revenue (suggested)

1. **Weeks 1–4:** Accounts + Stripe + paywall; turn on premium features (history, trends, PDF, AI-by-default). Custom domain + legal pages.
2. **Weeks 3–8:** Expand the SEO library; launch the short-form video channel; seed communities.
3. **Weeks 6–12:** Outbound to 5–10 at-home lab / telehealth partners for a licensing or affiliate pilot.
4. **Throughout:** instrument conversion; iterate pricing.

---

### Sources
- Vercel Pro pricing: https://vercel.com/pricing
- Supabase pricing: https://supabase.com/pricing
- Claude / Anthropic API pricing: https://platform.claude.com/docs/en/about-claude/pricing
- RevenueCat, *State of Subscription Apps 2025*: https://www.revenuecat.com/state-of-subscription-apps-2025/
- Statista, *Digital Health — Worldwide*: https://www.statista.com/outlook/hmo/digital-health/worldwide
- FTC Health Breach Notification Rule: https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule
