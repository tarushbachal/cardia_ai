import { describe, it, expect } from "vitest";
import { categorizeAll, assess } from "@/lib/rules-engine";
import type { BiomarkerInput } from "@/lib/rules-engine";

describe("categorizeAll", () => {
  it("returns results in canonical (group) order regardless of input order", () => {
    const out = categorizeAll([
      { key: "bmi", value: 22 },
      { key: "ldl", value: 90 },
      { key: "systolicBP", value: 118 },
    ]);
    expect(out.map((r) => r.key)).toEqual(["ldl", "systolicBP", "bmi"]);
  });

  it("skips non-finite values", () => {
    const out = categorizeAll([
      { key: "ldl", value: Number.NaN },
      { key: "hdl", value: Number.POSITIVE_INFINITY },
      { key: "bmi", value: 22 },
    ]);
    expect(out.map((r) => r.key)).toEqual(["bmi"]);
  });

  it("ignores unknown keys without throwing", () => {
    const out = categorizeAll([
      { key: "not_a_marker" as unknown as BiomarkerInput["key"], value: 5 },
      { key: "ldl", value: 90 },
    ]);
    expect(out.map((r) => r.key)).toEqual(["ldl"]);
  });

  it("de-duplicates by key (first value wins)", () => {
    const out = categorizeAll([
      { key: "ldl", value: 90 },
      { key: "ldl", value: 250 },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0]!.value).toBe(90);
  });

  it("attaches a resolvable, linked source to every result", () => {
    const out = categorizeAll([
      { key: "ldl", value: 200 },
      { key: "systolicBP", value: 145 },
    ]);
    for (const r of out) {
      expect(r.source.name.length).toBeGreaterThan(0);
      expect(r.source.url).toMatch(/^https?:\/\//);
    }
  });

  it("assess bundles results + composite + version", () => {
    const inputs: BiomarkerInput[] = [{ key: "ldl", value: 90 }];
    const out = assess(inputs);
    expect(out.results).toHaveLength(1);
    expect(out.composite.enteredCount).toBe(1);
    expect(out.guidelineVersion).toBe(out.composite.guidelineVersion);
  });
});
