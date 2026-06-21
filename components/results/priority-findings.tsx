import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import type { BiomarkerResult } from "@/lib/rules-engine";

/**
 * The lead panel on the results page — clinical practice leads with what is
 * abnormal, so this surfaces the values outside guideline range first
 * (attention before borderline), each with its value, category, and the
 * guideline note. When everything is within range it states that plainly.
 */
export function PriorityFindings({ results }: { results: BiomarkerResult[] }) {
  const attention = results.filter((r) => r.tier === "attention");
  const borderline = results.filter((r) => r.tier === "borderline");
  const flagged = [...attention, ...borderline];

  if (flagged.length === 0) {
    return (
      <section className="border-optimal/40 bg-optimal-soft/50 flex items-center gap-3 rounded-2xl border px-6 py-5">
        <CheckCircle2 className="text-optimal-strong size-5 shrink-0" aria-hidden="true" />
        <div>
          <h2 className="text-ink text-lg font-semibold">
            All entered values are within guideline range
          </h2>
          <p className="text-ink-muted mt-0.5 text-sm">
            No values require attention. The full breakdown is below.
          </p>
        </div>
      </section>
    );
  }

  const heading =
    attention.length > 0
      ? `${attention.length} value${attention.length > 1 ? "s" : ""} outside guideline range`
      : `${borderline.length} value${borderline.length > 1 ? "s" : ""} to monitor`;

  return (
    <section
      aria-labelledby="priority-title"
      className="border-elevated/40 bg-surface-raised overflow-hidden rounded-2xl border"
    >
      <div className="border-border-hair flex items-center gap-3 border-b px-6 py-4">
        <span className="bg-elevated-soft text-elevated-strong inline-flex size-9 shrink-0 items-center justify-center rounded-xl">
          <AlertTriangle className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="priority-title" className="text-ink text-lg font-semibold">
            {heading}
          </h2>
          <p className="text-ink-subtle text-sm">Prioritized for discussion with your physician.</p>
        </div>
      </div>
      <ul className="divide-border-hair divide-y">
        {flagged.map((r) => {
          const meta = TIER_META[r.tier];
          return (
            <li key={r.key} className="flex items-start gap-3 px-6 py-4">
              <span
                className={cn("mt-1.5 size-2.5 shrink-0 rounded-full", meta.dotClass)}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="text-ink font-medium">
                    {r.label}{" "}
                    <span className="text-ink-subtle text-sm font-normal">({r.shortLabel})</span>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <span className="text-ink text-sm tabular-nums">
                      {r.value} <span className="text-ink-subtle">{r.unit}</span>
                    </span>
                    <span
                      className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", meta.chipClass)}
                    >
                      {r.categoryLabel}
                    </span>
                  </span>
                </div>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">{r.note}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
