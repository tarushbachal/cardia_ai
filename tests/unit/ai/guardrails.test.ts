import { describe, it, expect } from "vitest";
import { scanExplanation } from "@/lib/ai/guardrails";
import { buildWalkthrough } from "@/lib/ai/walkthrough";
import { assess } from "@/lib/rules-engine";

const CALM_SAMPLE =
  "Most of the values you entered sit within the ranges the cited guidelines describe. Your HbA1c falls in the range the ADA Standards of Care label as the diabetes range, which is worth bringing to your physician. Any decision about next steps is between you and your doctor.";

describe("scanExplanation (output guardrails)", () => {
  it("passes calm, guideline-descriptive text (including 'diabetes range')", () => {
    expect(scanExplanation(CALM_SAMPLE).ok).toBe(true);
  });

  it.each([
    ["start taking a statin to bring this down", "medication-directive"],
    ["you should stop your medication immediately", "medication-directive"],
    ["consider increasing the dose of insulin", "medication-directive"],
    ["a statin should be started given these values", "medication-directive-passive"],
    ["this means you have diabetes", "diagnosis-claim"],
    ["you are diabetic based on this HbA1c", "diagnosis-claim"],
    ["you likely have heart disease", "diagnosis-claim"],
    ["your risk of a heart attack is 24%", "risk-prediction"],
    ["this is a dangerous level that needs urgent attention", "alarmist-language"],
  ])("blocks: %s", (snippet, expectedViolation) => {
    const text = `${CALM_SAMPLE} Also, ${snippet}.`;
    const result = scanExplanation(text);
    expect(result.ok).toBe(false);
    expect(result.violations).toContain(expectedViolation);
  });

  it("rejects empty or trivially short output", () => {
    expect(scanExplanation("").ok).toBe(false);
    expect(scanExplanation("Looks fine.").ok).toBe(false);
  });
});

describe("buildWalkthrough (deterministic fallback)", () => {
  const { results, composite } = assess(
    [
      { key: "ldl", value: 96 },
      { key: "hba1c", value: 6.1 },
      { key: "hsCRP", value: 4.2 },
    ],
    { age: 50, sex: "female" },
  );
  const text = buildWalkthrough(results, composite);

  it("mentions counts, categories, and routes to a physician", () => {
    expect(text).toContain("1 of the 3 values");
    expect(text).toContain("physician");
  });

  it("itself passes the output guardrails", () => {
    expect(scanExplanation(text).ok).toBe(true);
  });

  it("handles the all-in-range case", () => {
    const steady = assess([{ key: "ldl", value: 80 }], {});
    const t = buildWalkthrough(steady.results, steady.composite);
    expect(t).toContain("All 1");
    expect(scanExplanation(t).ok).toBe(true);
  });
});
