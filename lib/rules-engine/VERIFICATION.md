# Rules Engine — Threshold Verification & Audit

This is the credibility ledger for Cardia AI. Every band boundary in the engine
is listed here with the guideline it comes from and a verification status. Where
a value could not be tied cleanly to a single primary source, it is **flagged for
human (clinician) review** rather than guessed (§4.2).

- **Guideline config version:** `2026.06.0` (`lib/rules-engine/version.ts`)
- **Editions policy:** newest available editions, per product-owner decision.
- **Status key:** ✅ verified against the cited source · ⚠️ flagged — see notes.

> The engine **categorizes** entered values against established reference ranges
> and **surfaces** what the current guideline says. It performs no personal risk
> calculation, makes no diagnosis, and never directs a medication change.

---

## Lipids

| Marker        | Bands (unit)                                                                                          | Source                                                                                  | Status          |
| ------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------- |
| LDL-C         | <100 optimal · 100–129 near optimal · 130–159 borderline high · 160–189 high · ≥190 very high (mg/dL) | NCEP ATP III categories; ≥190 therapy-discussion + goals from 2026 ACC/AHA Dyslipidemia | ✅ / ⚠️ see (1) |
| HDL-C         | men <40 low; women <50 low; ≥60 protective (mg/dL)                                                    | NCEP ATP III (sex-specific)                                                             | ✅ / ⚠️ see (2) |
| Total-C       | <200 desirable · 200–239 borderline high · ≥240 high (mg/dL)                                          | NCEP ATP III                                                                            | ✅              |
| Triglycerides | <150 normal · 150–199 borderline · 200–499 high · ≥500 very high (mg/dL)                              | AHA Triglycerides Scientific Statement                                                  | ✅ / ⚠️ see (3) |
| ApoB          | <90 desirable · 90–129 borderline · ≥130 risk-enhancing (mg/dL)                                       | 2019 ACC/AHA Primary Prevention (≥130)                                                  | ✅ / ⚠️ see (4) |
| Lp(a)         | <30 lower-risk · 30–50 grey zone · ≥50 risk-modifying (mg/dL)                                         | 2019 ESC/EAS Dyslipidaemia                                                              | ✅ / ⚠️ see (5) |

## Metabolic

| Marker          | Bands (unit)                                              | Source                           | Status |
| --------------- | --------------------------------------------------------- | -------------------------------- | ------ |
| HbA1c           | <5.7 normal · 5.7–6.4 prediabetes · ≥6.5 diabetes (%)     | ADA Standards of Care — 2026, §2 | ✅     |
| Fasting glucose | <100 normal · 100–125 prediabetes · ≥126 diabetes (mg/dL) | ADA Standards of Care — 2026, §2 | ✅     |

## Blood pressure

| Marker    | Bands (unit)                                                           | Source                           | Status |
| --------- | ---------------------------------------------------------------------- | -------------------------------- | ------ |
| Systolic  | <120 normal · 120–129 elevated · 130–139 stage 1 · ≥140 stage 2 (mmHg) | 2025 AHA/ACC High Blood Pressure | ✅     |
| Diastolic | <80 normal · 80–89 stage 1 · ≥90 stage 2 (mmHg)                        | 2025 AHA/ACC High Blood Pressure | ✅     |

## Inflammation

| Marker | Bands (unit)                                                                 | Source                              | Status          |
| ------ | ---------------------------------------------------------------------------- | ----------------------------------- | --------------- |
| hs-CRP | <1 lower · 1–3 average · 3–10 higher relative risk · ≥10 likely acute (mg/L) | 2003 AHA/CDC Inflammation Statement | ✅ / ⚠️ see (6) |

## Body

| Marker | Bands (unit)                                                                     | Source                       | Status |
| ------ | -------------------------------------------------------------------------------- | ---------------------------- | ------ |
| BMI    | <18.5 underweight · 18.5–24.9 healthy · 25–29.9 overweight · ≥30 obesity (kg/m²) | WHO adult BMI classification | ✅     |

---

## Flags for human (clinician) review

1. **LDL-C framing.** The familiar population cut-points (optimal/near-optimal/
   borderline-high/high/very-high) are **NCEP ATP III**, not the 2026 ACC/AHA
   dyslipidemia guideline, which is risk-goal-based (LDL-C <100 for borderline–
   intermediate risk, <70 for high risk) and keeps the ≥190 mg/dL therapy-
   discussion threshold. The engine categorizes against ATP III cut-points and
   surfaces the 2026 goals + ≥190 statement in the notes. **Confirm this dual
   framing reads acceptably for the product.**
2. **HDL-C, unknown sex.** Thresholds are sex-specific (men <40, women <50). When
   sex is not provided the engine uses the `unknown` band set (<40 low) with a
   note inviting the user to add their sex. **Confirm the neutral fallback.**
3. **Triglycerides edition.** The build plan named a "2021 AHA Triglycerides
   Scientific Statement." The canonical AHA statement carrying these categories is
   **2011** (Circulation). Categories are unchanged; citation corrected to 2011.
   **Confirm the citation correction.**
4. **ApoB <90 boundary.** The 2019 ACC/AHA guideline hard-defines only the ≥130
   mg/dL risk-enhancing threshold. The <90 "desirable" boundary is a commonly
   referenced level, not a hard guideline cut. **Confirm or replace the 90 cut.**
5. **Lp(a) units.** Bands are in **mg/dL** (<30 / 30–50 / ≥50). The mg/dL↔nmol/L
   conversion is not 1:1 and varies by assay; notes give approximate nmol/L
   equivalents. Reaffirmed in the 2025 ESC/EAS focused update. **Confirm the unit
   the intake collects (mg/dL).**
6. **hs-CRP >10 mg/L.** Added a fourth band (≥10) noting values this high usually
   reflect acute inflammation rather than cardiovascular risk — a clinical nuance
   beyond the original 3-category statement. **Confirm the added band/wording.**

## Citation URLs to re-confirm before launch

- 2026 ACC/AHA Dyslipidemia Guideline — using an ACC summary URL; substitute the
  permanent journal DOI when indexed.
- 2025 AHA/ACC High Blood Pressure Guideline — using the JACC guideline-at-a-glance DOI.
- ADA Standards of Care — 2026 — using the §2 (Diagnosis & Classification) article URL.
