import { TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import { REG } from "@/lib/content/regulatory";
import type { BiomarkerResult, CompositeSummary } from "@/lib/rules-engine";

/**
 * Print-only physician-facing summary: hidden on screen, shown by @media print
 * (the interactive dashboard is hidden in the same query). A clean values table
 * a doctor can scan in seconds, with sources and the full disclaimer.
 */
export function PrintReport({
  results,
  composite,
}: {
  results: BiomarkerResult[];
  composite: CompositeSummary;
}) {
  const date = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="hidden print:block">
      <h1 className="text-ink text-2xl">Cardia — lab value summary</h1>
      <p className="text-ink-muted mt-1 text-sm">
        Prepared {date} · guideline set {composite.guidelineVersion} ·{" "}
        {composite.withinRangeCount} of {composite.enteredCount} entered values within
        guideline-recommended ranges.
      </p>

      <table className="mt-6 w-full border-collapse text-sm">
        <thead>
          <tr className="border-ink/30 border-b text-left">
            <th className="py-2 pr-3 font-semibold">Biomarker</th>
            <th className="py-2 pr-3 font-semibold">Value</th>
            <th className="py-2 pr-3 font-semibold">Guideline category</th>
            <th className="py-2 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r.key} className="border-ink/10 border-b align-top">
              <td className="py-2 pr-3">
                {r.label} ({r.shortLabel})
              </td>
              <td className="py-2 pr-3 tabular-nums">
                {r.value} {r.unit}
              </td>
              <td className="py-2 pr-3">
                <span
                  className={cn("mr-1.5 inline-block size-2 rounded-full", TIER_META[r.tier].dotClass)}
                  aria-hidden="true"
                />
                {r.categoryLabel}
              </td>
              <td className="text-ink-muted py-2 text-xs">
                {r.source.name}, {r.source.body} ({r.source.year})
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-ink-muted mt-6 text-xs leading-relaxed">{REG.disclaimerFull}</p>
      <p className="text-ink-muted mt-2 text-xs">{REG.notADevice}</p>
    </div>
  );
}
