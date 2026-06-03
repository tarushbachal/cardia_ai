import { describe, it, expect } from "vitest";
import { assess } from "@/lib/rules-engine";
import { ageBand, toDeidentified } from "@/lib/data-access/deidentify";

describe("ageBand", () => {
  it("buckets into decades, or null when absent", () => {
    expect(ageBand(undefined)).toBeNull();
    expect(ageBand(18)).toBe("18-29");
    expect(ageBand(29)).toBe("18-29");
    expect(ageBand(30)).toBe("30-39");
    expect(ageBand(59)).toBe("50-59");
    expect(ageBand(60)).toBe("60-69");
    expect(ageBand(79)).toBe("70-79");
    expect(ageBand(80)).toBe("80+");
    expect(ageBand(95)).toBe("80+");
  });
});

describe("toDeidentified", () => {
  const { results, composite } = assess(
    [
      { key: "ldl", value: 163 },
      { key: "hba1c", value: 5.2 },
    ],
    { age: 47, sex: "male" },
  );
  const deid = toDeidentified(results, composite, { age: 47, sex: "male" });

  it("projects only categories + coarse demographics", () => {
    expect(deid).toEqual({
      sex: "male",
      ageBand: "40-49",
      markersEntered: 2,
      withinRange: 1,
      compositeSignal: "mixed",
      tiers: { ldl: "attention", hba1c: "optimal" },
    });
  });

  it("never leaks a raw biomarker value", () => {
    // 163 is a distinctive entered value; it must not appear in the plaintext projection.
    expect(JSON.stringify(deid)).not.toContain("163");
  });
});
