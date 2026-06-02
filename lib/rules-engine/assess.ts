import type { AssessmentContext, BiomarkerInput, BiomarkerResult, CompositeSummary } from "./types";
import { categorizeAll } from "./categorize";
import { computeComposite } from "./composite";
import { GUIDELINE_VERSION } from "./version";

export interface Assessment {
  results: BiomarkerResult[];
  composite: CompositeSummary;
  guidelineVersion: string;
}

/** One call: categorize every entered marker and build the composite summary. Pure. */
export function assess(inputs: BiomarkerInput[], context: AssessmentContext = {}): Assessment {
  const results = categorizeAll(inputs, context);
  const composite = computeComposite(results);
  return { results, composite, guidelineVersion: GUIDELINE_VERSION };
}
