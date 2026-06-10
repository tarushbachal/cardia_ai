import type { BiomarkerResult, CompositeSummary } from "@/lib/rules-engine";
import { REG } from "@/lib/content/regulatory";

/**
 * Deterministic plain-language walkthrough, composed purely from the rules
 * engine's own categories and labels — no model involved. This is the
 * always-available fallback for the AI explanation layer (§7.3): if the model
 * is unconfigured, fails, or trips the output guard, the user still gets a
 * coherent, compliant explanation. Client-safe (no server deps).
 */
export function buildWalkthrough(
  results: BiomarkerResult[],
  composite: CompositeSummary,
): string {
  const inRange = results.filter((r) => r.tier === "optimal");
  const borderline = results.filter((r) => r.tier === "borderline");
  const attention = results.filter((r) => r.tier === "attention");

  const parts: string[] = [];

  // Opening — mirror the calm composite, never restate it as a verdict.
  if (composite.enteredCount === inRange.length) {
    parts.push(
      `All ${composite.enteredCount} of the values you entered fall within the ranges the cited guidelines describe — a steady picture worth keeping up.`,
    );
  } else {
    parts.push(
      `${inRange.length} of the ${composite.enteredCount} values you entered fall within the ranges the cited guidelines describe.`,
    );
  }

  if (borderline.length > 0) {
    const items = borderline.map((r) => `${r.label} ("${r.categoryLabel}")`).join(", ");
    parts.push(
      `${borderline.length === 1 ? "One sits" : "A few sit"} just outside the optimal range — ${items}. Categories like these are common, and they read as starting points for a conversation rather than conclusions.`,
    );
  }

  if (attention.length > 0) {
    const items = attention.map((r) => `${r.label} ("${r.categoryLabel}")`).join(", ");
    parts.push(
      `${attention.length === 1 ? "One value falls" : "Some values fall"} outside the guideline range — ${items}. Each card above explains what its guideline says and links the exact source, so you can read the context behind every category.`,
    );
  }

  parts.push(REG.physicianRouting);

  return parts.join(" ");
}
