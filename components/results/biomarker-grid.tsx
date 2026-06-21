import { BiomarkerCard } from "./biomarker-card";
import { TIER_DISPLAY_ORDER, TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import type { BiomarkerResult, Sex } from "@/lib/rules-engine";

/**
 * Layer 2 (§3.5): per-biomarker detail as a calm multi-column grid, grouped by
 * status with "within range" first so the calm reads before anything else. Each
 * card expands to its plain language note, a guideline range bar, and its
 * source. Collapses to one column on mobile.
 */
export function BiomarkerGrid({ results, sex }: { results: BiomarkerResult[]; sex?: Sex }) {
  const groups = TIER_DISPLAY_ORDER.map((tier) => ({
    tier,
    items: results.filter((r) => r.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <section aria-label="Your biomarkers" className="space-y-7">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-ink font-display text-xl sm:text-2xl">Your biomarkers</h2>
        <span className="text-ink-subtle text-sm">
          {results.length} {results.length === 1 ? "marker" : "markers"} · each sourced
        </span>
      </div>

      {groups.map((group) => (
        <div key={group.tier} className="space-y-3">
          <h3 className="text-ink-subtle flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
            <span
              className={cn("size-2 rounded-full", TIER_META[group.tier].dotClass)}
              aria-hidden="true"
            />
            {TIER_META[group.tier].groupLabel} · {group.items.length}
          </h3>
          <div className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map((result) => (
              <BiomarkerCard key={result.key} result={result} sex={sex} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
