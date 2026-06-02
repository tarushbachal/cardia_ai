import type { BiomarkerResult, CompositeSignal, CompositeSummary, SeverityTier } from "./types";
import { GUIDELINE_VERSION } from "./version";

/**
 * Educational composite summary (§4.4). This is explicitly a count of how many
 * entered values fall within guideline-recommended ranges, with a calm,
 * severity-aware signal. It is NEVER a clinical risk prediction or diagnosis
 * (§1.5). "Weighting" here means severity-awareness — an out-of-range value
 * weighs the signal more than a borderline one — not a hidden risk formula.
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
      return "Mostly within guideline ranges";
    case "mixed":
      return "A few values to look at";
    case "review":
      return "Several values worth discussing";
  }
}

function buildHeadline(
  enteredCount: number,
  withinRangeCount: number,
  signal: CompositeSignal,
): string {
  if (enteredCount === 0) {
    return "Enter at least one value to see your calm summary.";
  }

  const valuesWord = enteredCount === 1 ? "value" : "values";
  const verb = withinRangeCount === 1 ? "falls" : "fall";
  const fact = `${withinRangeCount} of ${enteredCount} ${valuesWord} you entered ${verb} within guideline-recommended ranges.`;

  const framing: Record<CompositeSignal, string> = {
    steady:
      "That's a steady overall picture — keep doing what's working, and bring these to your next check-up.",
    mixed:
      "Nothing here is a verdict — the ones outside the optimal range are simply worth a calm conversation with your doctor.",
    review:
      "This isn't a diagnosis; it's a useful starting point for a conversation with your physician about the values outside guideline ranges.",
  };

  return `${fact} ${framing[signal]}`;
}
