/**
 * Clinical rules engine — type system.
 *
 * Pure data + types, zero UI/runtime dependencies. The engine takes biomarker
 * values plus light context and returns calm, fully-sourced categorizations and
 * an educational composite summary. It never predicts, diagnoses, or directs
 * treatment (see lib/content/regulatory.ts and §1.5/§4 of the build plan).
 */

export type Sex = "male" | "female";

export type BiomarkerGroup = "lipids" | "inflammation" | "metabolic" | "blood-pressure" | "body";

export type BiomarkerKey =
  | "ldl"
  | "hdl"
  | "totalCholesterol"
  | "triglycerides"
  | "apoB"
  | "lpa"
  | "hsCRP"
  | "hba1c"
  | "fastingGlucose"
  | "systolicBP"
  | "diastolicBP"
  | "bmi";

export type Unit = "mg/dL" | "%" | "mg/L" | "mmHg" | "kg/m²";

/**
 * Visual + composite tier. Direction-neutral on purpose: for HDL a *low* value
 * is the concerning one, so "attention" means "worth attention," never literally
 * "elevated value." `optimal` is the only tier counted as within guideline range.
 */
export type SeverityTier = "optimal" | "borderline" | "attention";

/** A citable guideline — stored as data so the UI can surface it (§4.1). */
export interface GuidelineSource {
  /** Full guideline/statement name. */
  name: string;
  /** Publishing body/bodies. */
  body: string;
  /** Publication year of the cited edition. */
  year: number;
  /** Table/section/figure pointer within the source. */
  reference: string;
  /** Canonical URL. */
  url: string;
}

/**
 * A half-open numeric band `[min, max)`. `min` omitted = unbounded below,
 * `max` omitted = unbounded above. A value matches when
 * `(min === undefined || value >= min) && (max === undefined || value < max)`.
 */
export interface Band {
  min?: number;
  max?: number;
  tier: SeverityTier;
  /** Calm, precise category wording shown to the user. */
  label: string;
  /** Plain-language note: what the guideline says; routes to a physician; never a medication directive. */
  note: string;
  /** Optional per-band citation override (defaults to the definition's primarySource). */
  source?: GuidelineSource;
}

/** Sex-specific band sets (e.g., HDL-C). `unknown` is the neutral fallback. */
export interface SexBands {
  male: Band[];
  female: Band[];
  unknown: Band[];
}

export type BandSet = Band[] | SexBands;

export interface BiomarkerDefinition {
  key: BiomarkerKey;
  group: BiomarkerGroup;
  /** Full label, e.g. "LDL cholesterol". */
  label: string;
  /** Compact label for dense UI, e.g. "LDL-C". */
  shortLabel: string;
  unit: Unit;
  /** One plain sentence: what this marker is. */
  description: string;
  /** True when higher values are the concerning direction (false for HDL). */
  higherIsConcerning: boolean;
  /** Plausible input domain; Zod enforces this at the boundary too. */
  inputRange: { min: number; max: number };
  /** Step for numeric inputs (e.g. 1 for BP, 0.1 for A1c). */
  step: number;
  bands: BandSet;
  /** The headline citation shown for this marker. */
  primarySource: GuidelineSource;
  /** Additional context citations (e.g. current-guideline goals for LDL-C). */
  additionalSources?: GuidelineSource[];
}

export function isSexBands(bands: BandSet): bands is SexBands {
  return !Array.isArray(bands);
}

/** Light, non-scored context used for guideline-appropriate framing (§4.2). */
export interface AssessmentContext {
  age?: number;
  sex?: Sex;
  smoker?: boolean;
  /** Premature cardiovascular disease in a first-degree relative. */
  familyHistory?: boolean;
}

export interface BiomarkerInput {
  key: BiomarkerKey;
  value: number;
}

export interface BiomarkerResult {
  key: BiomarkerKey;
  group: BiomarkerGroup;
  label: string;
  shortLabel: string;
  unit: Unit;
  value: number;
  tier: SeverityTier;
  categoryLabel: string;
  note: string;
  higherIsConcerning: boolean;
  /** True when the value falls within the guideline-recommended (optimal) range. */
  withinGuidelineRange: boolean;
  source: GuidelineSource;
  additionalSources: GuidelineSource[];
}

export type CompositeSignal = "steady" | "mixed" | "review";

export interface CompositeSummary {
  enteredCount: number;
  withinRangeCount: number;
  byTier: Record<SeverityTier, number>;
  /** Fraction of entered markers within the optimal range, 0–1 (drives the calm ring). */
  proportionInRange: number;
  /** Calm, severity-aware signal. NOT a risk prediction or diagnosis (§1.5). */
  signal: CompositeSignal;
  /** Short calm label, e.g. "Mostly within guideline ranges". */
  signalLabel: string;
  /** One or two plain-language sentences framing the summary. */
  headline: string;
  /** Guideline configuration version that produced this summary (§4.5). */
  guidelineVersion: string;
}
