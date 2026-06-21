import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { assess } from "@/lib/rules-engine";
import { toAssessmentContext, toBiomarkerInputs } from "@/lib/schemas";
import { explainRequestSchema } from "@/lib/schemas/explain";
import { EXPLANATION_SYSTEM_PROMPT, buildExplanationPayload } from "@/lib/ai/prompt";
import { scanExplanation } from "@/lib/ai/guardrails";

export const runtime = "nodejs";

/**
 * AI explanation layer (§7.3), the single highest-risk feature, so every
 * safeguard is structural:
 * - Server-only: the API key never reaches the client.
 * - Closed-world input: the model sees ONLY rules-engine output (re-derived
 *   here from validated raw inputs, client categories are never trusted).
 * - Output is buffered and scanned BEFORE anything is returned; a violation
 *   discards it. The client always has the deterministic walkthrough as
 *   fallback, so every non-200 here degrades gracefully.
 * - Spec-mandated model: Claude Sonnet (bounded translation task).
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new NextResponse(null, { status: 501 }); // not configured → client falls back
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const parsed = explainRequestSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(null, { status: 400 });
  }

  const { results, composite } = assess(
    toBiomarkerInputs(parsed.data.values),
    toAssessmentContext(parsed.data),
  );
  if (results.length === 0) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const client = new Anthropic({ timeout: 25_000, maxRetries: 1 });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: EXPLANATION_SYSTEM_PROMPT,
          // Prompt caching: static prefix, per-user payload stays uncached.
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: buildExplanationPayload(results, composite) }],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    const guard = scanExplanation(text);
    if (!guard.ok) {
      // Discard untrusted output; the client renders the deterministic fallback.
      return new NextResponse(null, { status: 502 });
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
