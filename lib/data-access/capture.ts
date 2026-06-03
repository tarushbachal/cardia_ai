import { hasPublicSupabaseConfig, hasServiceRoleKey } from "@/lib/config/env";
import { hasEncryptionKey } from "@/lib/crypto/key";
import { encrypt } from "@/lib/crypto/encrypt";
import { assess } from "@/lib/rules-engine";
import { toAssessmentContext, toBiomarkerInputs, type ParsedAssessment } from "@/lib/schemas";
import { createSupabaseAdminClient } from "./supabase/admin";
import { toDeidentified } from "./deidentify";

/**
 * Server-side anonymous capture (§6.1, Phase 2.1). Encrypts the sensitive payload
 * and stores it alongside de-identified plaintext categories for analytics. No
 * auth, no account. All access is via the service role against an RLS-locked
 * table, so the browser can never read or write it.
 */

const ENC_VERSION = 1;

/** Capture only runs when Supabase AND the encryption key are configured. */
export function isServerCaptureConfigured(): boolean {
  return hasPublicSupabaseConfig() && hasServiceRoleKey() && hasEncryptionKey();
}

export interface CaptureInput extends ParsedAssessment {
  submissionId: string;
  anonId?: string;
}

export interface AssessmentRecord {
  submission_id: string;
  anon_id: string | null;
  ciphertext: string;
  enc_version: number;
  sex: "male" | "female" | null;
  age_band: string | null;
  markers_entered: number;
  within_range: number;
  composite_signal: string;
  tiers: Record<string, string>;
  guideline_version: string;
}

/** Pure: re-run the engine (never trust the client), encrypt, and de-identify. */
export function buildAssessmentRecord(input: CaptureInput): AssessmentRecord {
  const context = toAssessmentContext(input);
  const { results, composite, guidelineVersion } = assess(
    toBiomarkerInputs(input.values),
    context,
  );
  const deid = toDeidentified(results, composite, context);

  // Encrypt only the sensitive material: exact values + age/sex context.
  const ciphertext = encrypt(JSON.stringify({ context, values: input.values }));

  return {
    submission_id: input.submissionId,
    anon_id: input.anonId ?? null,
    ciphertext,
    enc_version: ENC_VERSION,
    sex: deid.sex,
    age_band: deid.ageBand,
    markers_entered: deid.markersEntered,
    within_range: deid.withinRange,
    composite_signal: deid.compositeSignal,
    tiers: deid.tiers,
    guideline_version: guidelineVersion,
  };
}

/** Idempotent insert (dedupes accidental re-sends on submission_id). */
export async function insertAssessment(record: AssessmentRecord): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("assessments")
    .upsert(record, { onConflict: "submission_id", ignoreDuplicates: true });
  if (error) throw error;
}
