import { describe, it, expect } from "vitest";
import { parseAssessment, validateMeasurement, toBiomarkerInputs } from "@/lib/schemas";

describe("assessment schema", () => {
  it("coerces valid form strings into typed values", () => {
    const r = parseAssessment({
      age: "45",
      sex: "male",
      smoker: false,
      familyHistory: true,
      values: { ldl: "90", hba1c: "5.4" },
    });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.age).toBe(45);
    expect(r.data.sex).toBe("male");
    expect(r.data.values.ldl).toBe(90);
    expect(r.data.values.hba1c).toBe(5.4);
  });

  it("treats blank fields as omitted", () => {
    const r = parseAssessment({ age: "", sex: "", values: { ldl: "90", hdl: "" } });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.age).toBeUndefined();
    expect(r.data.sex).toBeUndefined();
    expect(r.data.values.hdl).toBeUndefined();
  });

  it("rejects an assessment with no values entered", () => {
    const r = parseAssessment({ values: { ldl: "", hdl: "" } });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(r.error.issues.some((i) => /at least one value/i.test(i.message))).toBe(true);
  });

  it("rejects out-of-range and non-numeric measurements", () => {
    const high = parseAssessment({ values: { ldl: "9999" } });
    expect(high.success).toBe(false);

    const nan = parseAssessment({ values: { ldl: "abc" } });
    expect(nan.success).toBe(false);
    if (nan.success) return;
    expect(nan.error.issues[0]!.message).toMatch(/must be a number/i);
  });

  it("rejects under-18 age", () => {
    const r = parseAssessment({ age: "15", values: { ldl: "90" } });
    expect(r.success).toBe(false);
  });

  it("validateMeasurement gives field-level feedback", () => {
    expect(validateMeasurement("ldl", "90")).toBeNull();
    expect(validateMeasurement("ldl", "")).toBeNull(); // blank is allowed per-field
    expect(validateMeasurement("ldl", "abc")).toMatch(/must be a number/i);
    expect(validateMeasurement("ldl", "9999")).toMatch(/above/i);
  });

  it("maps validated values to ordered engine inputs", () => {
    const inputs = toBiomarkerInputs({ bmi: 22, ldl: 90 });
    expect(inputs).toEqual([
      { key: "ldl", value: 90 },
      { key: "bmi", value: 22 },
    ]);
  });
});
