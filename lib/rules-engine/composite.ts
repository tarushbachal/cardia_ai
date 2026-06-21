import type { BiomarkerResult, CompositeSignal, CompositeSummary, SeverityTier } from "./types";
import { GUIDELINE_VERSION } from "./version";

/**
 * Educational composite summary (§4.4). This is explicitly a count of how many
 * entered values fall within guideline ranges, with a
 * severity-aware signal. It is NEVER a clinical risk prediction or diagnosis
 * (§1.5). "Weighting" here means severity-awareness, an out-of-range value
 * weighs the signal more than a borderline one, not a hidden risk formula.
 */
export function computeComposite(results: BiomarkerResult[]): CompositeSummary {
  const byTier: Record<SeverityTier, number> = {
    optimal: 0,
    borderline: 0,
    attention: 0,
  };
  for (const r of results) byTier[r.tier] += 1;

  const enteredCount = results.length;
  const withinRangeCount = byTier.optimal;
  const proportionInRange = enteredCount === 0 ? 0 : withinRangeCount / enteredCount;

  const signal = deriveSignal(byTier);

  return {
    enteredCount,
    withinRangeCount,
    byTier,
    proportionInRange,
    signal,
    signalLabel: signalLabel(signal, enteredCount),
    headline: buildHeadline(enteredCount, withinRangeCount, signal),
    guidelineVersion: GUIDELINE_VERSION,
  };
}

function deriveSignal(byTier: Record<SeverityTier, number>): CompositeSignal {
  if (byTier.attention >= 2) return "review";
  if (byTier.attention === 1 || byTier.borderline >= 2) return "mixed";
  return "steady";
}

function signalLabel(signal: CompositeSignal, enteredCount: number): string {
  if (enteredCount === 0) return "Nothing entered yet";
  switch (signal) {
    case "steady":
      return "Within guideline ranges";
    case "mixed":
      return "Some values outside range";
    case "review":
      return "Multiple values outside range";
  }
}

function buildHeadline(
  enteredCount: number,
  withinRangeCount: number,
  signal: CompositeSignal,
): string {
  if (enteredCount === 0) {
    return "Enter at least one value to see your summary.";
  }

  const valuesWord = enteredCount === 1 ? "value" : "values";
  const verb = withinRangeCount === 1 ? "falls" : "fall";
  const fact = `${withinRangeCount} of ${enteredCount} ${valuesWord} ${verb} within guideline ranges.`;

  const framing: Record<CompositeSignal, string> = {
    steady:
      "Continue current management and review these at your next appointment.",
    mixed:
      "The values outside the optimal range warrant discussion with your physician.",
    review:
      "Several values fall outside guideline ranges and should be reviewed with your physician. This is a screening reference, not a diagnosis.",
  };

  return `${fact} ${framing[signal]}`;
}
