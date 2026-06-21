import { cn } from "@/lib/utils";
import { TIER_DISPLAY_ORDER, TIER_META } from "./tier";
import type { CompositeSummary, SeverityTier } from "@/lib/rules-engine";

const TIER_LABEL: Record<SeverityTier, string> = {
  optimal: "Within range",
  borderline: "Borderline",
  attention: "Outside range",
};

/**
 * At-a-glance tier breakdown beside the composite signal, the dashboard's
 * second summary tile. Ordered outside-range first.
 */
export function ResultsSnapshot({ composite }: { composite: CompositeSummary }) {
  return (
    <section
      aria-label="At a glance"
      className="border-border-hair bg-surface-raised rounded-3xl border p-6 sm:p-7"
    >
      <p className="text-ink-subtle text-xs font-medium tracking-wider uppercase">At a glance</p>
      <ul className="mt-5 space-y-3.5">
        {TIER_DISPLAY_ORDER.map((tier) => {
          const meta = TIER_META[tier];
          const count = composite.byTier[tier];
          return (
            <li key={tier} className="flex items-center justify-between gap-3">
              <span className="text-ink flex items-center gap-2.5 text-sm">
                <span
                  className={cn("size-2.5 rounded-full", meta.dotClass)}
                  aria-hidden="true"
                />
                {TIER_LABEL[tier]}
              </span>
              <span
                className={cn(
                  "font-display text-xl tabular-nums",
                  count > 0 ? meta.textClass : "text-ink-subtle",
                )}
              >
                {count}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="text-ink-subtle border-border-hair mt-5 border-t pt-4 text-xs leading-relaxed">
        {composite.enteredCount} {composite.enteredCount === 1 ? "marker" : "markers"} entered ·
        guideline set {composite.guidelineVersion}
      </p>
    </section>
  );
}
