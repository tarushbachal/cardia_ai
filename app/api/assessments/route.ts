import { NextResponse } from "next/server";
import { captureRequestSchema } from "@/lib/schemas/capture";
import {
  buildAssessmentRecord,
  insertAssessment,
  isServerCaptureConfigured,
  type CaptureInput,
} from "@/lib/data-access/capture";

// node:crypto + the service-role client require the Node.js runtime.
export const runtime = "nodejs";

/**
 * Anonymous assessment capture (Phase 2.1). No auth. Called fire-and-forget from
 * the client via sendBeacon. Quietly no-ops (204) until Supabase + the encryption
 * key are configured. Never trusts client-computed results, re-derives them.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!isServerCaptureConfigured()) {
    return new NextResponse(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const parsed = captureRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(null, { status: 400 });
  }

  const d = parsed.data;
  const input: CaptureInput = {
    submissionId: d.submissionId,
    anonId: d.anonId,
    age: d.age,
    sex: d.sex,
    smoker: d.smoker,
    familyHistory: d.familyHistory,
    values: d.values,
  };

  try {
    await insertAssessment(buildAssessmentRecord(input));
  } catch {
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
