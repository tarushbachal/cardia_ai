import type {
  AssessmentContext,
  Band,
  BandSet,
  BiomarkerInput,
  BiomarkerKey,
  BiomarkerResult,
  Sex,
} from "./types";
import { isSexBands } from "./types";
import { BIOMARKERS, BIOMARKER_ORDER } from "./guidelines";

function resolveBands(bands: BandSet, sex?: Sex): Band[] {
  if (!isSexBands(bands)) return bands;
  if (sex === "male") return bands.male;
  if (sex === "female") return bands.female;
  return bands.unknown;
}

/** Find the band whose half-open `[min, max)` interval contains `value`. */
function matchBand(bands: Band[], value: number): Band {
  for (const band of bands) {
    const aboveMin = band.min === undefined || value >= band.min;
    const belowMax = band.max === undefined || value < band.max;
    if (aboveMin && belowMax) return band;
  }
  // Bands are authored contiguous + unbounded at both ends, so this is a safety net.
  return bands[bands.length - 1]!;
}

/** Categorize a single biomarker value against its sourced guideline bands. Pure. */
export function categorizeBiomarker(
  input: BiomarkerInput,
  context: AssessmentContext = {},
): BiomarkerResult {
  const def = BIOMARKERS[input.key];
  if (!def) throw new Error(`Unknown biomarker key: ${String(input.key)}`);

  const bands = resolveBands(def.bands, context.sex);
  const band = matchBand(bands, input.value);

  return {
    key: def.key,
    group: def.group,
    label: def.label,
    shortLabel: def.shortLabel,
    unit: def.unit,
    value: input.value,
    tier: band.tier,
    categoryLabel: band.label,
    note: band.note,
    higherIsConcerning: def.higherIsConcerning,
    withinGuidelineRange: band.tier === "optimal",
    source: band.source ?? def.primarySource,
    additionalSources: def.additionalSources ?? [],
  };
}

/**
 * Categorize every entered marker. Ignores non-finite values, unknown keys, and
 * duplicate keys (first wins); returns results in canonical display order. Pure.
 */
export function categorizeAll(
  inputs: BiomarkerInput[],
  context: AssessmentContext = {},
): BiomarkerResult[] {
  const seen = new Set<BiomarkerKey>();
  const results: BiomarkerResult[] = [];

  for (const input of inputs) {
    if (!Number.isFinite(input.value)) continue;
    if (!(input.key in BIOMARKERS)) continue;
    if (seen.has(input.key)) continue;
    seen.add(input.key);
    results.push(categorizeBiomarker(input, context));
  }

  return results.sort((a, b) => BIOMARKER_ORDER.indexOf(a.key) - BIOMARKER_ORDER.indexOf(b.key));
}
