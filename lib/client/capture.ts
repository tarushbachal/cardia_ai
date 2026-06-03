import { FLAGS } from "@/lib/config/flags";
import { getOrCreateAnonId } from "@/lib/analytics/anon-id";
import type { ParsedAssessment } from "@/lib/schemas";

/**
 * Fire-and-forget anonymous capture of a completed assessment. Uses sendBeacon
 * (fallback: keepalive fetch) so it never blocks navigation and survives the
 * page transition. Never throws into the UI — the local save already succeeded.
 * Skips entirely unless capture is enabled (the server still re-checks secrets).
 */
export function captureAssessment(parsed: ParsedAssessment): void {
  if (typeof window === "undefined") return;
  if (!FLAGS.captureEnabled) return;

  try {
    const body = JSON.stringify({
      submissionId: crypto.randomUUID(),
      anonId: getOrCreateAnonId(),
      age: parsed.age,
      sex: parsed.sex,
      smoker: parsed.smoker,
      familyHistory: parsed.familyHistory,
      values: parsed.values,
    });
    const blob = new Blob([body], { type: "application/json" });

    if (navigator.sendBeacon?.("/api/assessments", blob)) return;

    void fetch("/api/assessments", {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // best-effort
  }
}
