import type {
  AssessmentContext,
  BiomarkerInput,
  BiomarkerResult,
  CompositeSummary,
} from "@/lib/rules-engine";

/**
 * The full assessment snapshot stored as JSONB on `readings` (§5.2). Storing the
 * computed results + composite + guideline version alongside the raw inputs keeps
 * a historical reading interpretable even after a guideline update.
 *
 * Data-model note: a JSONB snapshot is chosen over a normalized child table for
 * Phase 1, it is simple, faithful, and stable across guideline-version changes.
 * A normalized `biomarker_values` table is the documented Phase 2 option if trend
 * queries need it; until then a JSONB-path index suffices.
 */
export interface StoredReadingPayload {
  context: AssessmentContext;
  inputs: BiomarkerInput[];
  results: BiomarkerResult[];
  composite: CompositeSummary;
}

export interface ReadingRow {
  id: string;
  user_id: string;
  payload: StoredReadingPayload;
  guideline_version: string;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  display_name: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
}
