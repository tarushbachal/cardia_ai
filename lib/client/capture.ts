import { FLAGS } from "@/lib/config/flags";
import { getOrCreateAnonId } from "@/lib/analytics/anon-id";
import type { ParsedAssessment } from "@/lib/schemas";

/**
 * Fire-and-forget anonymous capture of a completed assessment. Only runs when
 * the user has EXPLICITLY opted in (consent), sharing is never the default.
 * Uses sendBeacon (fallback: keepalive fetch) so it never blocks navigation and
 * survives the page transition. Never throws into the UI. The server still
 * re-checks its secrets; the build flag must also be on.
 */
export function captureAssessment(parsed: ParsedAssessment, consent: boolean): void {
  if (typeof window === "undefined") return;
  if (!consent) return; // explicit opt in required, no silent collection
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
