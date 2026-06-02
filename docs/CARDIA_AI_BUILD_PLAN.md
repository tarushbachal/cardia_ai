# Cardia AI: Engineering Build Plan

**Document type:** Technical specification and phased implementation plan
**Audience:** AI coding agent (Claude Code, Cursor, or equivalent) and the human developer directing it
**Project owner:** Tarush (Data Scientist)
**Last updated:** May 2026
**Status:** Specification for build. Not yet implemented.

---

## How To Use This Document

This document is written to be executed by a large language model acting as a senior full-stack engineer, with a human developer reviewing and directing. Every phase is self-contained: an LLM should be able to read a single phase section and have enough context to implement it without guessing. Where a decision has already been made, this document states it as a constraint, not a suggestion. Where the LLM has latitude, this document says so explicitly.

**Critical instruction for any LLM reading this:** Do not reduce this to a prompt-generated prototype. This is a production application built to the standard of a professional development team. That means real folder structure, real typing, real error handling, real accessibility, real security. When in doubt, choose the more rigorous implementation. If you are tempted to stub something out or hardcode something that should be configurable, stop and implement it properly.

**Use the Claude `frontend-design` skill** for all UI work. This application is frontend-heavy and the interface quality is the core differentiator. The design must be best-in-class, not generic. Specific design direction is in the Design System section below and is reinforced in each phase.

---

## 1. Project Context and Background

### 1.1 What Cardia AI Is

Cardia AI is a consumer-facing web application that helps people understand their cardiovascular biomarker data without being frightened by it. The core insight driving the entire product is behavioral: most people who would benefit from understanding their cardiovascular risk actively avoid that information because it is presented in ways that feel clinical, alarming, or like a verdict. Research documents that roughly one in three adults avoid medical information they perceive as threatening (Offer et al., Annals of Behavioral Medicine, 2025, meta-analysis of 92 studies and 564,497 participants).

Cardia AI addresses this through interface design and information architecture, not through a new algorithm. The user enters their lab values (cholesterol panel, metabolic markers, inflammatory markers, blood pressure). The application categorizes each value against published clinical guidelines and presents the results using progressive disclosure: a single, calm, composite signal first, with the option to drill into per-biomarker detail only if the user chooses. Every threshold and every categorization is traceable to a specific, citable government or professional-society guideline. There is no machine learning model making predictions. There is no AI guessing. It is a rules engine built on published medicine, wrapped in an interface designed to reduce rather than amplify health anxiety.

### 1.2 Origin and Strategic Framing

This project originated from a brainstorm by a clinical fellow (referred to in internal discussion as Vikash) who initially proposed an "AI-powered" cardiovascular wellness platform built on a no-code platform (Base44). The data science team's assessment was that the original framing carried significant problems: the "AI-powered" label implied autonomous prediction that creates regulatory and liability exposure; a no-code platform cannot meet the security, auditability, or integration standards required for health software; and the consumer cardiovascular wellness category is a graveyard of failed apps precisely because the demand-side behavior (information avoidance, app abandonment) is brutal.

The redirect that produced this specification keeps the clinically sound instinct (lab-based cardiovascular awareness referencing legitimate guidelines) and rebuilds it on three principles:

1. **Rules-based, not model-based.** The application references published guideline thresholds. It does not train on user biomarker data and does not make probabilistic predictions. This is both more defensible and more honest.
2. **Built to development-team standards.** Real Next.js full-stack architecture, real database with proper security, real typing and testing, not a no-code scaffold.
3. **Anxiety-aware interface design.** The interface is the product. Progressive disclosure, calm visual language, non-alarmist framing, and source transparency are the differentiators.

### 1.3 The Differentiation From a Prompt-Generated App

A no-code or single-prompt-generated version of this idea produces a form with conditional logic and a UI skin, where the "rules" are whatever the generating model produced at prompt time: undocumented, unauditable, untraceable to any specific guideline version. This build is different in ways that matter:

- **Every threshold is sourced to a named document with a citation and a link.** Not "guidelines say LDL should be low" but "LDL-C below 100 mg/dL is optimal per the 2018 ACC/AHA Cholesterol Guidelines, Table 4" with a URL.
- **The rules engine is human-readable, version-controlled, and modifiable.** When a guideline updates, you change a config file, not reprompt a model.
- **Data handling meets a real security standard** (Supabase with Row Level Security, encryption, proper auth) rather than routing health data through an opaque no-code backend.
- **The codebase is owned, deployable on infrastructure you control, and extensible** through deliberate engineering decisions with known vendors and known compliance postures.

### 1.4 Business and Deployment Context (Future Scope, Do Not Over-Engineer)

The long-term commercial hypothesis is that this could be deployed into or acquired by a large consumer health platform (the prospective target discussed internally is Amazon's health subscription offering). This is a future-scope consideration. The build should not be over-engineered around an acquisition that has not happened. What it means concretely for the architecture today: keep the code clean, keep data export possible, avoid vendor lock-in where avoidable, and keep a clear separation between the rules engine (the defensible IP) and the presentation layer. Do not build FHIR interoperability, SOC2 tooling, or enterprise SSO in the early phases. Note these as future scope and move on.

### 1.5 Regulatory Posture (Must Be Softly Met Throughout)

This application must stay within FDA "general wellness" / enforcement-discretion territory and must not drift into being a regulated medical device (Software as a Medical Device, SaMD). This is a soft constraint that shapes copy, framing, and feature decisions throughout the build. The relevant principles, drawn from FDA's General Wellness guidance and the Clinical Decision Support guidance:

- The application presents educational information referencing published guidelines. It does not diagnose, does not treat, and does not claim to.
- Every output is framed as information to discuss with a physician, never as a directive or a verdict.
- The application must always enable the user to understand the basis for any categorization (the source guideline), which aligns with the CDS transparency criterion.
- Disclaimer language must be present, clear, and repeated at the appropriate moments (on results, in the footer, at onboarding).
- The application must never tell a user to start, stop, or change a medication. It may state what a guideline says (e.g., "the 2018 ACC/AHA guideline recommends discussing statin therapy when LDL-C exceeds 190 mg/dL") but must always attribute that to the guideline and route the decision to a clinician.

**Important nuance the team has already debated:** a composite "cardiovascular wellness score" sits closer to the regulated line than a pure per-biomarker reference tool. The team has decided to keep a composite score for product reasons. To keep this defensible, the score must be explicitly framed as an educational summary of how many entered values fall within guideline-recommended ranges, never as a clinical risk prediction, a diagnosis, or a medical assessment. The word "risk" should be used carefully and always in the context of what a specific guideline says, never as Cardia AI's own prediction. This framing requirement is a hard rule for all copy.

---

## 2. Technical Stack (Decided. These Are Constraints)

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15+ (App Router) | Server Components by default. Client Components only for interactivity. No Pages Router. |
| Language | TypeScript (strict mode) | `strict: true` in tsconfig. No `any` without justification. |
| Styling | Tailwind CSS v4 | CSS-first config. Use design tokens defined in Phase 1. |
| UI components | shadcn/ui + custom | Use shadcn/ui as the primitive layer, heavily customized per the design system. Do not ship default shadcn aesthetics. |
| Animation | Motion (Framer Motion successor) | For page-load orchestration and micro-interactions. Used sparingly and purposefully. |
| Database | Supabase (Postgres) | Row Level Security on every table. See security section. |
| Auth | Supabase Auth | Architected in Phase 1, implemented in Phase 2. |
| Payments | Stripe | Phase 3. Architected (not implemented) earlier. |
| AI layer | Anthropic Claude API (Sonnet) | Phase 2+. A clearly-bounded space is reserved in Phase 1. Sonnet, not Opus: the explanation task does not need Opus-level reasoning and Sonnet is materially cheaper per call. |
| Hosting | Vercel | Native Next.js deployment. Edge where appropriate. |
| Validation | Zod | All user inputs and all API boundaries validated with Zod schemas. |
| Testing | Vitest + Playwright | Unit tests for the rules engine (non-negotiable), E2E for critical flows. |

**On model choice for the AI layer:** Do not use Opus for the biomarker explanation feature. The task is bounded plain-language translation of a known input against known guidelines. Sonnet handles this well at roughly one-fifth the per-call cost. Opus would only be warranted for genuinely open-ended multi-step clinical reasoning, which this consumer wellness application must specifically avoid doing anyway for regulatory reasons.

---

## 3. Design System (Apply via the `frontend-design` Skill)

This is a frontend-heavy product and the interface is the entire differentiator. Use the Claude `frontend-design` skill for all UI work. The aesthetic direction below is a starting point; execute it with precision and refinement.

### 3.1 Aesthetic Direction

The emotional design brief is: **calm, trustworthy, editorial, clinical-but-human.** This is the opposite of an alarmist health app with red warning klaxons and giant risk percentages. Think closer to a beautifully designed health magazine or a premium financial dashboard than to a hospital chart or a fitness tracker.

- **Not:** aggressive reds, big scary percentages, skull icons, "HIGH RISK" in bold caps, anxiety-inducing gauges in the danger zone.
- **Yes:** muted, sophisticated palette; generous whitespace; calm typography; soft transitions; results that feel like a knowledgeable friend explaining something, not a machine delivering a verdict.

### 3.2 Color

Commit to a cohesive, restrained palette. A recommended direction (the implementing agent may refine, but must stay in the calm/editorial register):

- A deep, calm base (deep navy or charcoal, not pure black) for primary surfaces and the hero.
- A single sophisticated accent (a considered blue or teal) used sparingly for emphasis and interactive elements.
- Status colors that are muted and mature, never neon. Optimal states in a soft sage/teal-green. Borderline states in a warm amber/ochre, not a screaming yellow. Elevated states in a muted terracotta/clay, never fire-engine red. The goal is that even an "elevated" result feels like calm information, not an alarm.
- Use CSS variables / Tailwind tokens for everything. No hardcoded hex outside the token definition.

### 3.3 Typography

Avoid generic fonts (Inter, Roboto, Arial, system defaults). Pair a distinctive display face with a refined body face. A direction that fits the calm-editorial brief: a characterful but trustworthy display serif or a refined geometric sans for headings, paired with a highly legible humanist sans for body and data. Whatever is chosen must render well for dense numeric data (the biomarker values) and feel premium.

### 3.4 Interaction and Motion

- One well-orchestrated page-load reveal on the results screen (staggered, calm, not bouncy) is worth more than scattered micro-interactions.
- The score reveal should feel like a gentle settling-in, not a slot-machine spin or a dramatic countdown. No suspense-building animation on a health result; that amplifies anxiety.
- Progressive disclosure transitions (expanding a biomarker for detail) should be smooth and immediate.

### 3.5 Information Architecture: The Core Anxiety-Reducing Pattern

This is the most important design requirement in the entire document. The results experience uses **progressive disclosure** in this specific order:

1. **Calm summary first.** The user first sees a single, gentle composite signal and one sentence of plain-language framing. Nothing alarming. No wall of red. No list of everything wrong.
2. **Opt-in detail second.** Below or behind a clear interaction, the user can choose to see the per-biomarker breakdown. Each biomarker shows its value, its category (calm language), and its source guideline.
3. **Context and action third.** Only after the user has engaged with their data do they see guideline-referenced observations, always framed as "here is what the guideline says and here is a conversation to have with your doctor," never as a directive.

The user must always feel in control of how much they see. Never dump the full clinical picture on first render.

### 3.6 Accessibility

WCAG AA minimum. Proper semantic HTML, keyboard navigation, focus states, screen-reader labels, sufficient contrast (verify the calm palette still meets contrast ratios), respect `prefers-reduced-motion` (disable the orchestrated animations for users who request it, which is doubly important for a health-anxiety-aware product).

---

## 4. The Clinical Rules Engine (Shared Across All Phases)

This is the defensible core of the product and must be implemented identically in spirit across phases. It is a pure, well-typed, fully-tested, version-controlled module. It must have zero UI dependencies so it can be unit-tested in isolation and reused anywhere (server, client, future API).

### 4.1 Architecture Principles

- The rules engine is a standalone TypeScript module (e.g., `lib/rules-engine/`).
- Guideline data lives in typed, structured configuration objects, each annotated with its source (guideline name, publishing body, year, table/section reference, and a canonical URL).
- The engine exposes pure functions: given biomarker inputs, return categorizations and a composite summary. No side effects, no network calls, no UI.
- Every threshold in the configuration carries its citation inline. The citation is data, not a comment, so it can be surfaced in the UI.
- The engine is covered by comprehensive unit tests (Vitest). Every threshold boundary is tested. This is non-negotiable: the rules engine is the product's credibility and must be provably correct against the cited guidelines.

### 4.2 Biomarkers and Source Guidelines

The following biomarkers and guideline sources are in scope. The implementing agent must verify each threshold against the cited primary source during implementation and must not invent or approximate thresholds. If a threshold cannot be verified against the cited source, flag it for human review rather than guessing.

| Biomarker | Unit | Source Guideline (verify during build) |
|---|---|---|
| LDL-C | mg/dL | 2018 ACC/AHA Cholesterol Guidelines (Grundy et al., JACC) |
| HDL-C | mg/dL | 2018 ACC/AHA Cholesterol Guidelines; sex-specific thresholds |
| Total Cholesterol | mg/dL | 2018 ACC/AHA Cholesterol Guidelines |
| Triglycerides | mg/dL | 2021 AHA Triglycerides Scientific Statement |
| ApoB | mg/dL | 2018/2022 ACC/AHA Prevention Guidelines (risk enhancer) |
| Lp(a) | mg/dL | 2019 ESC/EAS Dyslipidaemia Guidelines |
| hsCRP | mg/L | 2003 AHA/CDC Scientific Statement on Inflammatory Markers |
| HbA1c | % | ADA Standards of Care (current year) |
| Fasting glucose | mg/dL | ADA Standards of Care (current year) |
| Systolic BP | mmHg | 2017 ACC/AHA Hypertension Guidelines |
| Diastolic BP | mmHg | 2017 ACC/AHA Hypertension Guidelines |
| BMI | kg/m² | WHO classification; AHA Life's Essential 8 |

Additional context inputs (not scored as biomarkers but used for guideline-appropriate framing): age, biological sex (drives sex-specific thresholds such as HDL-C), smoking status, family history of premature cardiovascular disease (a recognized risk enhancer in the ACC/AHA framework).

### 4.3 Categorization Output

For each entered biomarker, the engine returns: the value, the matched category (using calm, non-alarmist language, for example "within optimal range," "borderline," "above guideline range"), a severity tier (used internally for ordering and styling, kept muted in the UI), the source guideline object (name, body, year, reference, URL), and a plain-language note describing what the guideline says about this range. The plain-language note must never instruct a medication change; it states what the guideline says and routes to a physician conversation.

### 4.4 Composite Summary

The engine returns a composite summary (the "wellness signal"). Per the regulatory framing rule in section 1.5, this is explicitly an educational summary of how many entered values fall within guideline-recommended ranges, weighted sensibly across the entered markers. It is never labeled or described as a clinical risk prediction or diagnosis. The summary includes the count of markers entered (so the user understands the summary is only as complete as their input) and a calm overall framing sentence.

### 4.5 Versioning

The guideline configuration carries a version identifier. When guidelines are updated, the configuration is updated and the version is bumped. Stored user results (Phase 1+) should record which guideline version produced them, so historical results remain interpretable after a guideline update.

---

## 5. Data Model and Security (Supabase)

This product handles health-related personal data. Even though a standalone consumer wellness app operating outside a covered-entity relationship is generally outside HIPAA's direct scope, the team's decision is to build to a high security standard from day one, because (a) it is the right thing to do with sensitive data, (b) the FTC Health Breach Notification Rule and state health-privacy laws (e.g., Washington My Health My Data) apply to consumer health apps regardless of HIPAA, and (c) a future acquisition would require it anyway.

### 5.1 Security Requirements (Apply From Phase 1)

- **Row Level Security (RLS) on every table containing user data.** Default-deny, then allow via precise policies keyed to `auth.uid()`. A user can only ever read or write their own rows. This is enforced at the database level so it cannot be bypassed by an application bug.
- **Never expose the Supabase service-role key to the client.** Server-side only. The client uses the anon key with RLS enforced.
- **Encryption:** Supabase encrypts at rest (AES-256) and in transit (TLS) by default. For the most sensitive fields, consider application-layer encryption before storage as a future enhancement; note it but do not necessarily implement in Phase 1.
- **Auth:** Supabase Auth with email/password and at least one OAuth provider. MFA capability should be available. Architect the schema and policies in Phase 1 even though full auth UX lands in Phase 2.
- **Input validation:** Every input validated with Zod at the boundary, both client and server. Never trust client input server-side.
- **Audit-friendly:** Design tables so that a future audit log (who accessed/modified what, when) can be added without restructuring. Note as future scope; do not build full audit logging in early phases.
- **No PHI in public storage buckets. No analytics that leak biomarker values to third parties.** If using any analytics, it must be configured to never transmit the actual health values.

### 5.2 Core Tables (Conceptual, implement with proper migrations)

- `profiles`: one row per authenticated user, keyed to the Supabase auth user id. Holds non-sensitive profile context (display name, created date, preferences). Sex/age used for thresholds: decide carefully whether these live here or with each reading; storing with each reading preserves historical accuracy.
- `readings`: one row per saved assessment. Holds the entered biomarker values, the computed categorizations, the composite summary, the guideline version used, and a timestamp. RLS: user sees only their own readings.
- `biomarker_values`: optionally normalized per-value rows linked to a reading, if a normalized structure better serves trend charting later. The implementing agent may choose embedded JSON on `readings` versus a normalized child table; document the choice and its tradeoffs.

Architect these in Phase 1. In Phase 1, the app can function without requiring login (see phase scope), but the schema, the Supabase project, the RLS policies, and the data-access layer should be built and ready so that Phase 2 turns on persistence without rearchitecting.

---

## 6. PHASE 1: Foundation, Rules Engine, and the Core Experience

**Goal of Phase 1:** Ship a beautiful, fully-functional, single-session assessment experience built on production-grade Next.js architecture, with the complete clinical rules engine, the anxiety-aware results UI, and the entire backend/auth/AI architecture scaffolded and ready (but not yet user-facing). At the end of Phase 1, a user can complete an assessment and see a gorgeous, calm, fully-sourced result. They cannot yet create an account, save history, get AI explanations, or pay. But the codebase is structured so that each of those turns on cleanly in later phases.

### 6.1 Phase 1 Scope: In

- Full Next.js 15 App Router project, TypeScript strict, Tailwind v4, shadcn/ui customized to the design system, Motion installed.
- The complete clinical rules engine (section 4) with full unit-test coverage. All in-scope biomarkers, all sourced thresholds, verified against primary sources.
- The multi-step assessment input flow (the data-entry experience), beautifully designed, accessible, with Zod validation on every field.
- The results experience implementing the progressive-disclosure pattern (section 3.5): calm composite summary first, opt-in per-biomarker detail, guideline-referenced observations with full source attribution and links.
- All regulatory framing and disclaimer copy (section 1.5) correctly placed.
- The Supabase project provisioned, schema and RLS policies created and tested, and a typed data-access layer written, but the app runs in a no-persistence mode for end users in Phase 1 (state held in session/client; optionally allow an explicit "this stays in your browser" local persistence).
- The auth architecture scaffolded: Supabase Auth configured, middleware for session handling in place, protected-route structure defined, but no login wall on the core experience yet.
- A clearly-bounded, visually-present-but-inactive space in the results UI reserved for the future AI explanation layer (e.g., a tasteful "Plain-language explanation, coming soon" affordance, or a disabled component with the correct layout). This reserves the design real estate so Phase 2 drops the feature in without a redesign.
- Responsive, mobile-first. Looks like an app on a phone.
- Deployed to Vercel on a real URL.

### 6.2 Phase 1 Scope: Out (Reserve, Do Not Build)

- No live user accounts / login requirement (architected, not activated).
- No saved history or trend charts (schema ready, not surfaced).
- No working AI explanations (space reserved, not wired).
- No payments (not architected beyond keeping the door open).
- No FHIR, no SOC2 tooling, no enterprise features.

### 6.3 Phase 1 Implementation Notes for the LLM

- Start with project scaffolding and the design-token foundation. Establish the palette, typography, and spacing tokens before building screens, so everything is consistent.
- Build the rules engine early and test it before building the UI on top of it. The UI consumes the engine's typed outputs. Engine correctness is the foundation; do not build UI against an unverified engine.
- Use Server Components for static structure and layout. Use Client Components only for the interactive assessment form and the interactive results disclosure. Keep client bundles lean.
- The assessment flow should save nothing to a server in Phase 1. Hold state in the client (and optionally offer explicit local-only persistence with clear user messaging that the data never leaves their device). This keeps Phase 1 free of any data-handling risk while the architecture for proper storage sits ready underneath.
- Write the Supabase data-access layer as if persistence were on, behind a feature flag or an interface, so Phase 2 flips it on. Do not scatter Supabase calls through components; centralize them.
- Every piece of copy that touches a health result must pass the regulatory framing rule. When generating result text, never produce a directive to change medication. Always attribute to the guideline and route to a physician.
- Accessibility and `prefers-reduced-motion` from the start, not retrofitted.

### 6.4 Phase 1 Definition of Done

- A user can open the deployed URL, complete the full assessment, and see a calm, beautiful, fully-sourced result implementing progressive disclosure.
- Every biomarker categorization links to its real source guideline.
- The rules engine has passing unit tests covering every threshold boundary.
- Lighthouse scores are strong (performance, accessibility, best practices). Accessibility is not negotiable.
- The Supabase schema, RLS policies, and data-access layer exist and are tested, even though end-user persistence is off.
- The auth and AI-explanation extension points exist as reserved, non-active scaffolding.
- The codebase is clean, typed (strict), linted, and documented enough that Phase 2 can begin without reverse-engineering anything.

---

## 7. PHASE 2: Accounts, Persistence, History, and the AI Explanation Layer

**Goal of Phase 2:** Turn on identity and memory. Users can now create accounts, securely save their assessments, return to see their history and trends over time, and receive a plain-language AI explanation of their results. This is where Cardia AI becomes something a user comes back to, not a one-time calculator. Monetization is architected here but not switched on.

### 7.1 Phase 2 Scope: In

- **Authentication, activated.** Supabase Auth fully wired into the UX: sign up, log in, log out, password reset, at least one OAuth provider, session persistence via middleware. The core experience can now optionally gate saving behind an account while still allowing an anonymous one-off assessment (decide the exact gating with the product owner; a sensible default is: assessment is free and anonymous, saving/history requires an account).
- **Persistence, activated.** The Phase 1 data-access layer is switched on. Completing an assessment while logged in saves it to `readings` with the guideline version. RLS verified end-to-end: a user can never see another user's data.
- **History and trends.** A dashboard where a logged-in user sees their past assessments and, where they have multiple readings of the same biomarker over time, a calm trend visualization. Trends must use the same anxiety-aware design language: gentle, contextual, never alarmist. Show movement toward or away from guideline ranges in a supportive frame.
- **The AI explanation layer, activated.** The reserved space from Phase 1 now holds a working feature. Using the Anthropic Claude API (Sonnet), generate a plain-language, calm, personalized-but-non-directive explanation of the user's results. Strict guardrails (section 7.3).
- **Monetization architected.** Stripe integrated at the plumbing level (customer creation, the notion of a subscription tier in the data model, feature-flagging premium features) but the paywall is not yet enforced. The app should be one configuration change away from charging.

### 7.2 Phase 2 Scope: Out (Reserve for Phase 3)

- No enforced paywall yet (architected, not switched on).
- No PDF export / shareable reports yet (can be Phase 2 stretch or Phase 3).
- Still no FHIR, no enterprise SSO, no SOC2 program.

### 7.3 AI Explanation Layer: Hard Guardrails

The AI explanation feature is the single highest-risk feature in the product from a regulatory and safety standpoint. It must be tightly bounded:

- **Model:** Anthropic Claude Sonnet. Not Opus. The task is bounded translation, not open clinical reasoning.
- **Input to the model:** the user's categorized results and the relevant guideline statements from the rules engine. The model explains what is already known; it does not compute new conclusions.
- **System prompt constraints:** The model must be instructed, in a strict system prompt, to (a) never diagnose, (b) never tell the user to start/stop/change any medication, (c) always attribute statements to the cited guideline, (d) always route decisions to the user's physician, (e) maintain a calm, supportive, non-alarmist tone, (f) never invent thresholds or facts not present in the provided guideline data, (g) never speculate about conditions the user might have. The explanation supports understanding; it does not practice medicine.
- **Output handling:** Treat model output as untrusted. Validate/scan it before display. Keep a deterministic fallback (the rules-engine plain-language notes) if the AI call fails or produces anything outside bounds.
- **No training on user data.** User biomarker values are never used to train any model. This is both a privacy commitment and a product-positioning truth.
- **Disclosure:** The user is told this explanation is AI-generated, references published guidelines, and is not medical advice.

### 7.4 Phase 2 Definition of Done

- A user can create an account, log in, complete an assessment, save it, log out, return, and see their saved results and trends.
- RLS is verified: attempting to access another user's data fails at the database level.
- The AI explanation produces calm, sourced, non-directive plain-language text within the guardrails, with a working deterministic fallback.
- Stripe plumbing exists; flipping one flag would enable subscriptions.
- All Phase 1 quality bars (accessibility, performance, typing, tests) are maintained or improved. New critical flows (auth, save, AI explanation) have tests.

---

## 8. PHASE 3: Monetization, Polish, and Acquisition-Readiness

**Goal of Phase 3:** Turn Cardia AI into a commercial product and prepare it for the strategic outcomes discussed (subscription revenue and/or acquisition by a large consumer health platform). This phase switches on monetization, adds the features that justify a subscription, and addresses the operational maturity an acquirer would expect.

### 8.1 Phase 3 Scope: In

- **Subscription monetization, activated.** Enforce the paywall on premium features via Stripe. A sensible free/premium split (decide with product owner): free tier gives a single-session assessment and basic categorization; premium gives saved history, trends over time, the AI explanation layer, and report export. Implement subscription lifecycle (upgrade, downgrade, cancel, billing portal) using Stripe's hosted components where possible.
- **Report export / shareable summary.** Let a user generate a clean, well-designed PDF or shareable summary of their results to bring to a physician. This directly serves the product's "starting point for a doctor conversation" thesis and is a strong premium feature. Apply the same calm, sourced design language. Include the disclaimer.
- **Engagement and retention features** consistent with the anxiety-aware ethos: gentle reminders to re-test after an appropriate interval, calm progress framing, optional educational content explaining each biomarker in depth (all guideline-sourced). Retention features must never use anxiety or fear as a hook.
- **Operational maturity for acquisition-readiness (selective).** This is where the previously-deferred enterprise concerns get addressed, but only as far as is genuinely useful: a real audit log of data access/modification; a documented data-export capability (a clean export of a user's own data, which also serves data-portability laws); hardening and a documented security posture. Consider, and document the path to, FHIR export and a formal compliance program (SOC2, BAA-readiness) as the concrete next step for an acquisition, but implement only what is justified.

### 8.2 Phase 3 Notes

- By Phase 3 the acquisition angle can legitimately shape priorities, because there is a real product with real users. The earlier instruction not to over-engineer for acquisition expires here. Even so, build maturity in response to actual need (a real security review, a real audit requirement, a real enterprise conversation), not speculatively.
- Keep the rules engine, the defensible IP, cleanly separated and exceptionally well-documented. In an acquisition, the sourced, version-controlled, fully-tested clinical rules engine is a meaningful asset; its clarity and provability are part of the value.

### 8.3 Phase 3 Definition of Done

- Subscriptions work end-to-end: a user can subscribe, access premium features, manage billing, and cancel.
- Report export produces a clean, calm, fully-sourced, disclaimer-bearing summary suitable for a physician visit.
- Retention features are live and consistent with the anxiety-aware ethos.
- An audit log and a user-data-export capability exist.
- The path to FHIR, SOC2, and BAA-readiness is documented as the acquisition runway, with components implemented only as justified by real need.

---

## 9. Cross-Cutting Requirements (All Phases)

- **Regulatory framing is a hard rule, always on.** No output ever diagnoses, directs a medication change, or presents Cardia AI's own risk prediction. Everything attributes to a cited guideline and routes decisions to a physician. Disclaimers are present and clear.
- **Source transparency, always.** Every threshold and categorization is traceable to a named, dated, linked guideline. This is both a regulatory asset and the core trust differentiator.
- **Anxiety-aware design, always.** Calm over alarming, progressive disclosure over data-dumping, supportive framing over verdicts. This survives every phase and every feature.
- **Security and privacy, always.** RLS on all user data, no service-role key on the client, validated inputs, no leaking health values to third parties, no training on user data.
- **Accessibility, always.** WCAG AA, keyboard, screen-reader, reduced-motion.
- **Quality bar, always.** TypeScript strict, Zod at boundaries, rules-engine unit tests non-negotiable, E2E tests on critical flows, strong Lighthouse scores, clean and documented code at development-team standard.
- **Use the `frontend-design` skill for all UI**, and keep the result best-in-class and distinctive, never generic.

---

## 10. Explicit Future Scope (Acknowledged, Deliberately Deferred)

The following are real future possibilities. They are noted so the architecture stays open to them, but they must NOT be built early or allowed to bloat the initial phases:

- Deployment into or acquisition by a large consumer health platform (the internally-discussed target is Amazon's health subscription offering). Keep code clean and data exportable; do not pre-build their integration.
- FHIR / HL7 interoperability for clinical-system integration.
- Formal compliance program: SOC2, HIPAA BAA-readiness, enterprise SSO/SAML.
- Wearable / Apple Health / Google Fit ingestion to auto-populate values (note: this materially raises the privacy and possibly the regulatory bar; treat as a significant future project, not a quick add).
- Aggregated, fully de-identified, opt-in data products for research partners (only ever with explicit consent, rigorous de-identification, and legal review).
- Native mobile apps (the web app is responsive and sufficient until app-store distribution becomes strategically necessary, at which point the app-store health-app review process becomes its own workstream).

---

## 11. Open Questions for the Product Owner (Resolve Before or During Phase 1)

- Exact free-versus-account gating: is the one-off assessment fully anonymous with only saving/history behind an account? (Recommended default: yes.)
- Exact free-versus-premium split for Phase 3.
- Final palette and typography selection within the calm/editorial brief.
- Whether to offer explicit local-only ("stays on your device") persistence in Phase 1 as a privacy-forward feature.
- Confirmation of the precise guideline editions to cite where a body has multiple recent versions (the implementing agent must verify each against the primary source and surface any ambiguity).
