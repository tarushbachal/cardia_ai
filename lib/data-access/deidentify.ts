import type {
  AssessmentContext,
  BiomarkerResult,
  CompositeSignal,
  CompositeSummary,
  SeverityTier,
  Sex,
} from "@/lib/rules-engine";

/**
 * De-identified, non-sensitive projection of an assessment, stored in PLAINTEXT
 * alongside the encrypted payload so aggregate SQL analytics work without ever
 * decrypting (§5.1). Carries only categories — never a raw value, never an exact
 * age. (Phase 2.1 "hybrid" decision.)
 */
export interface DeidentifiedFields {
  sex: Sex | null;
  ageBand: string | null;
  markersEntered: number;
  withinRange: number;
  compositeSignal: CompositeSignal;
  /** { [biomarkerKey]: tier } — categories only, no numbers. */
  tiers: Record<string, SeverityTier>;
}

/** Bucket an exact age into a coarse decade band (or null when not provided). */
export function ageBand(age: number | undefined): string | null {
  if (age === undefined || !Number.isFinite(age)) return null;
  if (age < 30) return "18-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  if (age < 70) return "60-69";
  if (age < 80) return "70-79";
  return "80+";
}

export function toDeidentified(
  results: BiomarkerResult[],
  composite: CompositeSummary,
  context: AssessmentContext,
): DeidentifiedFields {
  const tiers: Record<string, SeverityTier> = {};
  for (const r of results) tiers[r.key] = r.tier;

  return {
    sex: context.sex ?? null,
    ageBand: ageBand(context.age),
    markersEntered: composite.enteredCount,
    withinRange: composite.withinRangeCount,
    compositeSignal: composite.signal,
    tiers,
  };
}
