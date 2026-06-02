import { describe, it, expect } from "vitest";
import { assess, computeComposite, GUIDELINE_VERSION } from "@/lib/rules-engine";
import type { BiomarkerInput } from "@/lib/rules-engine";

const a = (...inputs: BiomarkerInput[]) => assess(inputs).composite;

describe("composite summary", () => {
  it("empty input → calm, zeroed summary that asks for a value", () => {
    const c = computeComposite([]);
    expect(c.enteredCount).toBe(0);
    expect(c.withinRangeCount).toBe(0);
    expect(c.proportionInRange).toBe(0);
    expect(c.signal).toBe("steady");
    expect(c.headline).toMatch(/enter at least one value/i);
  });

  it("all within range → steady, full proportion", () => {
    const c = a({ key: "ldl", value: 90 }, { key: "hba1c", value: 5.0 }, { key: "bmi", value: 22 });
    expect(c.byTier.optimal).toBe(3);
    expect(c.withinRangeCount).toBe(3);
    expect(c.proportionInRange).toBe(1);
    expect(c.signal).toBe("steady");
    expect(c.signalLabel).toMatch(/within guideline ranges/i);
    expect(c.headline).toContain("3 of 3 values");
  });

  it("one out-of-range marker → mixed", () => {
    const c = a({ key: "ldl", value: 200 }); // very high → attention
    expect(c.byTier.attention).toBe(1);
    expect(c.signal).toBe("mixed");
    expect(c.headline).toContain("0 of 1 value");
    expect(c.headline).toMatch(/\bfall\b/); // 0 → "fall"
  });

  it("two out-of-range markers → review", () => {
    const c = a({ key: "ldl", value: 200 }, { key: "fastingGlucose", value: 140 });
    expect(c.byTier.attention).toBe(2);
    expect(c.signal).toBe("review");
    expect(c.headline).toMatch(/diagnosis/i);
  });

  it("two borderline, none out-of-range → mixed", () => {
    const c = a({ key: "ldl", value: 110 }, { key: "triglycerides", value: 160 });
    expect(c.byTier.borderline).toBe(2);
    expect(c.byTier.attention).toBe(0);
    expect(c.signal).toBe("mixed");
  });

  it("single borderline → still steady", () => {
    const c = a({ key: "ldl", value: 110 });
    expect(c.byTier.borderline).toBe(1);
    expect(c.signal).toBe("steady");
  });

  it("headline subject-verb agreement for a single in-range value", () => {
    const c = a({ key: "ldl", value: 90 }, { key: "triglycerides", value: 160 });
    expect(c.withinRangeCount).toBe(1);
    expect(c.proportionInRange).toBe(0.5);
    expect(c.headline).toContain("1 of 2 values");
    expect(c.headline).toMatch(/\bfalls\b/); // 1 → "falls"
  });

  it("stamps the guideline version", () => {
    const c = a({ key: "ldl", value: 90 });
    expect(c.guidelineVersion).toBe(GUIDELINE_VERSION);
  });

  it("never describes itself as risk, prediction, or diagnosis in steady/mixed copy", () => {
    const steady = a({ key: "ldl", value: 90 });
    expect(steady.headline.toLowerCase()).not.toMatch(/your risk|we predict|you have/);
  });
});
