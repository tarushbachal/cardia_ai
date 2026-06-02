/**
 * Cardia AI clinical rules engine — public API.
 *
 * Pure, typed, fully-tested, zero UI dependencies. Given biomarker values and
 * light context it returns calm, fully-sourced categorizations plus an
 * educational composite summary. It does not predict, diagnose, or direct
 * treatment. Every threshold is traceable to a cited guideline (see
 * ./VERIFICATION.md).
 */
export type {
  Sex,
  BiomarkerGroup,
  BiomarkerKey,
  Unit,
  SeverityTier,
  GuidelineSource,
  Band,
  SexBands,
  BandSet,
  BiomarkerDefinition,
  AssessmentContext,
  BiomarkerInput,
  BiomarkerResult,
  CompositeSignal,
  CompositeSummary,
} from "./types";
export { isSexBands } from "./types";

export { GUIDELINE_VERSION } from "./version";
export { categorizeBiomarker, categorizeAll } from "./categorize";
export { computeComposite } from "./composite";
export { assess, type Assessment } from "./assess";

export {
  BIOMARKERS,
  ALL_DEFINITIONS,
  BIOMARKER_ORDER,
  DEFINITIONS_BY_GROUP,
  GROUP_ORDER,
  GROUP_LABELS,
  GROUP_BLURBS,
} from "./guidelines";
export { SOURCES } from "./guidelines/sources";
