import { describe, it, expect } from "vitest";
import { categorizeBiomarker } from "@/lib/rules-engine";
import type { BiomarkerKey, SeverityTier } from "@/lib/rules-engine";

/**
 * Boundary coverage for every threshold. Expected tier/label are written out
 * explicitly (not re-derived from the config) so the test proves the engine
 * matches the cited guidelines rather than merely matching itself.
 *
 * Bands are half-open [min, max): a value exactly equal to a boundary belongs to
 * the upper band.
 */
type Case = { value: number; tier: SeverityTier; label: string };

const CASES: Record<Exclude<BiomarkerKey, "hdl">, Case[]> = {
  ldl: [
    { value: 50, tier: "optimal", label: "Optimal" },
    { value: 99, tier: "optimal", label: "Optimal" },
    { value: 100, tier: "borderline", label: "Near optimal" },
    { value: 129, tier: "borderline", label: "Near optimal" },
    { value: 130, tier: "borderline", label: "Borderline high" },
    { value: 159, tier: "borderline", label: "Borderline high" },
    { value: 160, tier: "attention", label: "High" },
    { value: 189, tier: "attention", label: "High" },
    { value: 190, tier: "attention", label: "Very high" },
    { value: 260, tier: "attention", label: "Very high" },
  ],
  totalCholesterol: [
    { value: 199, tier: "optimal", label: "Desirable" },
    { value: 200, tier: "borderline", label: "Borderline high" },
    { value: 239, tier: "borderline", label: "Borderline high" },
    { value: 240, tier: "attention", label: "High" },
  ],
  triglycerides: [
    { value: 149, tier: "optimal", label: "Normal" },
    { value: 150, tier: "borderline", label: "Borderline high" },
    { value: 199, tier: "borderline", label: "Borderline high" },
    { value: 200, tier: "attention", label: "High" },
    { value: 499, tier: "attention", label: "High" },
    { value: 500, tier: "attention", label: "Very high" },
  ],
  apoB: [
    { value: 89, tier: "optimal", label: "Within desirable range" },
    { value: 90, tier: "borderline", label: "Borderline" },
    { value: 129, tier: "borderline", label: "Borderline" },
    { value: 130, tier: "attention", label: "At or above the risk-enhancing threshold" },
  ],
  lpa: [
    { value: 29, tier: "optimal", label: "Lower-risk range" },
    { value: 30, tier: "borderline", label: "Grey zone" },
    { value: 49, tier: "borderline", label: "Grey zone" },
    { value: 50, tier: "attention", label: "Risk-modifying range" },
  ],
  hsCRP: [
    { value: 0.9, tier: "optimal", label: "Lower relative risk" },
    { value: 1, tier: "borderline", label: "Average relative risk" },
    { value: 2.9, tier: "borderline", label: "Average relative risk" },
    { value: 3, tier: "attention", label: "Higher relative risk" },
    { value: 9.9, tier: "attention", label: "Higher relative risk" },
    { value: 10, tier: "attention", label: "Likely acute inflammation" },
  ],
  hba1c: [
    { value: 5.6, tier: "optimal", label: "Normal" },
    { value: 5.7, tier: "borderline", label: "Prediabetes range" },
    { value: 6.4, tier: "borderline", label: "Prediabetes range" },
    { value: 6.5, tier: "attention", label: "Diabetes range" },
  ],
  fastingGlucose: [
    { value: 99, tier: "optimal", label: "Normal" },
    { value: 100, tier: "borderline", label: "Prediabetes range" },
    { value: 125, tier: "borderline", label: "Prediabetes range" },
    { value: 126, tier: "attention", label: "Diabetes range" },
  ],
  systolicBP: [
    { value: 119, tier: "optimal", label: "Normal" },
    { value: 120, tier: "borderline", label: "Elevated" },
    { value: 129, tier: "borderline", label: "Elevated" },
    { value: 130, tier: "borderline", label: "Stage 1" },
    { value: 139, tier: "borderline", label: "Stage 1" },
    { value: 140, tier: "attention", label: "Stage 2" },
  ],
  diastolicBP: [
    { value: 79, tier: "optimal", label: "Normal" },
    { value: 80, tier: "borderline", label: "Stage 1" },
    { value: 89, tier: "borderline", label: "Stage 1" },
    { value: 90, tier: "attention", label: "Stage 2" },
  ],
  bmi: [
    { value: 18.4, tier: "borderline", label: "Underweight" },
    { value: 18.5, tier: "optimal", label: "Healthy weight" },
    { value: 24.9, tier: "optimal", label: "Healthy weight" },
    { value: 25, tier: "borderline", label: "Overweight" },
    { value: 29.9, tier: "borderline", label: "Overweight" },
    { value: 30, tier: "attention", label: "Obesity, class I" },
    { value: 34.9, tier: "attention", label: "Obesity, class I" },
    { value: 35, tier: "attention", label: "Obesity, class II" },
    { value: 39.9, tier: "attention", label: "Obesity, class II" },
    { value: 40, tier: "attention", label: "Obesity, class III" },
  ],
};

describe("threshold boundaries", () => {
  for (const [key, cases] of Object.entries(CASES)) {
    describe(key, () => {
      for (const c of cases) {
        it(`${c.value} → ${c.tier} / ${c.label}`, () => {
          const r = categorizeBiomarker({ key: key as BiomarkerKey, value: c.value });
          expect(r.tier).toBe(c.tier);
          expect(r.categoryLabel).toBe(c.label);
          expect(r.withinGuidelineRange).toBe(c.tier === "optimal");
          expect(r.value).toBe(c.value);
        });
      }
    });
  }
});
