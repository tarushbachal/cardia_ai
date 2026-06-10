"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { buildWalkthrough } from "@/lib/ai/walkthrough";
import type { BiomarkerResult, CompositeSummary } from "@/lib/rules-engine";
import type { ParsedAssessment } from "@/lib/schemas";

type SlotState = { status: "loading" } | { status: "ready"; text: string; source: "ai" | "local" };

const CACHE_KEY = "cardia.aiExplanation.v1";

/** Stable hash so identical inputs reuse the cached explanation (no re-billing). */
function hashInput(input: ParsedAssessment, version: string): string {
  const s = JSON.stringify(input) + version;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return h.toString(36);
}

/**
 * The AI explanation layer (§7.3), live. Requests a guardrailed, server-side
 * Claude Sonnet walkthrough; on ANY failure (unconfigured, timeout, output-scan
 * violation) it renders the deterministic walkthrough built from the rules
 * engine's own notes — the user always gets a coherent, compliant explanation.
 */
export function AiExplanationSlot({
  input,
  results,
  composite,
}: {
  input: ParsedAssessment;
  results: BiomarkerResult[];
  composite: CompositeSummary;
}) {
  const [state, setState] = useState<SlotState>({ status: "loading" });

  useEffect(() => {
    const hash = hashInput(input, composite.guidelineVersion);
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
      if (cached?.hash === hash && typeof cached.text === "string") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({ status: "ready", text: cached.text, source: cached.source });
        return;
      }
    } catch {
      // ignore cache parse issues
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(input),
          signal: AbortSignal.timeout(28_000),
        });
        if (res.ok) {
          const text = (await res.text()).trim();
          if (text && !cancelled) {
            setState({ status: "ready", text, source: "ai" });
            try {
              sessionStorage.setItem(CACHE_KEY, JSON.stringify({ hash, text, source: "ai" }));
            } catch {
              // storage unavailable — fine
            }
            return;
          }
        }
      } catch {
        // network/timeout — fall through to deterministic
      }
      if (!cancelled) {
        setState({ status: "ready", text: buildWalkthrough(results, composite), source: "local" });
      }
    })();
    return () => {
      cancelled = true;
    };
    // The stored assessment is immutable for the life of this view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-labelledby="ai-slot-title"
      className="border-border-hair bg-surface rounded-2xl border p-5"
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className="bg-accent-soft text-accent-strong inline-flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <Sparkles className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id="ai-slot-title" className="text-ink text-sm font-semibold">
            Plain-language walkthrough
          </h3>

          {state.status === "loading" ? (
            <div aria-hidden="true" className="mt-3 space-y-1.5">
              <div className="bg-secondary/70 h-2.5 w-full animate-pulse rounded-full" />
              <div className="bg-secondary/70 h-2.5 w-4/5 animate-pulse rounded-full" />
              <div className="bg-secondary/50 h-2.5 w-2/3 animate-pulse rounded-full" />
            </div>
          ) : (
            <>
              <p className="text-ink-muted mt-2 text-sm leading-relaxed whitespace-pre-line">
                {state.text}
              </p>
              <p className="text-ink-subtle border-border-hair mt-3 border-t pt-2.5 text-[11px] leading-relaxed">
                {state.source === "ai"
                  ? "AI-generated · references the cited guidelines · not medical advice."
                  : "Generated from your results and the cited guidelines · not medical advice."}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
