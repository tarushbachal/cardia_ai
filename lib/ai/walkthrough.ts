import type { BiomarkerResult, CompositeSummary } from "@/lib/rules-engine";
import { REG } from "@/lib/content/regulatory";

/**
 * Deterministic plain-language walkthrough, composed purely from the rules
 * engine's own categories and labels — no model involved. This is the
 * always-available fallback for the AI explanation layer (§7.3): if the model
 * is unconfigured, fails, or trips the output guard, the user still gets a
 * coherent, compliant explanation. Leads with values outside range. Client-safe.
 */
export function buildWalkthrough(results: BiomarkerResult[], composite: CompositeSummary): string {
  const inRange = results.filter((r) => r.tier === "optimal");
  const borderline = results.filter((r) => r.tier === "borderline");
  const attention = results.filter((r) => r.tier === "attention");

  const parts: string[] = [];

  if (composite.enteredCount === inRange.length) {
    parts.push(
      `All ${composite.enteredCount} of the values you entered fall within the ranges the cited guidelines describe.`,
    );
  } else {
    parts.push(
      `${inRange.length} of the ${composite.enteredCount} values you entered fall within the ranges the cited guidelines describe.`,
    );
  }

  if (attention.length > 0) {
    const items = attention.map((r) => `${r.label} ("${r.categoryLabel}")`).join(", ");
    parts.push(
      `${attention.length === 1 ? "One value falls" : "Several values fall"} outside the guideline range — ${items}. Review these with your physician; each is traced to its source guideline above.`,
    );
  }

  if (borderline.length > 0) {
    const items = borderline.map((r) => `${r.label} ("${r.categoryLabel}")`).join(", ");
    parts.push(
      `${borderline.length === 1 ? "One value is" : "Several values are"} borderline — ${items}. These warrant monitoring.`,
    );
  }

  parts.push(REG.physicianRouting);

  return parts.join(" ");
}
