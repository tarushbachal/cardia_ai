import { describe, it, expect } from "vitest";
import { categorizeBiomarker } from "@/lib/rules-engine";

/** HDL-C uses sex-specific low thresholds (men <40, women <50). */
describe("HDL-C sex-specific thresholds", () => {
  it("male: <40 below range, 40–59 acceptable, ≥60 protective", () => {
    expect(categorizeBiomarker({ key: "hdl", value: 39 }, { sex: "male" })).toMatchObject({
      tier: "attention",
      categoryLabel: "Below guideline range",
    });
    expect(categorizeBiomarker({ key: "hdl", value: 40 }, { sex: "male" })).toMatchObject({
      tier: "optimal",
      categoryLabel: "Acceptable",
    });
    expect(categorizeBiomarker({ key: "hdl", value: 60 }, { sex: "male" })).toMatchObject({
      tier: "optimal",
      categoryLabel: "Protective",
    });
  });

  it("female: <50 below range, 50–59 acceptable, ≥60 protective", () => {
    expect(categorizeBiomarker({ key: "hdl", value: 49 }, { sex: "female" })).toMatchObject({
      tier: "attention",
      categoryLabel: "Below guideline range",
    });
    expect(categorizeBiomarker({ key: "hdl", value: 50 }, { sex: "female" })).toMatchObject({
      tier: "optimal",
      categoryLabel: "Acceptable",
    });
  });

  it("the same value categorizes differently by sex (45 mg/dL)", () => {
    expect(categorizeBiomarker({ key: "hdl", value: 45 }, { sex: "male" }).tier).toBe("optimal");
    expect(categorizeBiomarker({ key: "hdl", value: 45 }, { sex: "female" }).tier).toBe(
      "attention",
    );
  });

  it("unknown sex falls back to the neutral (<40) band set", () => {
    expect(categorizeBiomarker({ key: "hdl", value: 39 }).tier).toBe("attention");
    expect(categorizeBiomarker({ key: "hdl", value: 45 }).tier).toBe("optimal");
    expect(categorizeBiomarker({ key: "hdl", value: 60 }).categoryLabel).toBe("Protective");
  });
});
