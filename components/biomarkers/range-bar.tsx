import { cn } from "@/lib/utils";
import { TIER_META } from "@/components/results/tier";
import type { Band, BiomarkerDefinition } from "@/lib/rules-engine";

/**
 * A calm, proportional visualization of a biomarker's guideline bands across
 * its plausible input range, with an optional marker for "your value". Muted
 * tier colors, no alarm reds; clipped to the definition's inputRange so
 * unbounded bands render sensibly. Server-safe (no client hooks).
 */
export function RangeBar({
  def,
  bands,
  value,
  className,
}: {
  def: BiomarkerDefinition;
  bands: Band[];
  value?: number;
  className?: string;
}) {
  const { min, max } = def.inputRange;
  const span = max - min;
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const pct = (v: number) => ((clamp(v) - min) / span) * 100;

  const segments = bands
    .map((band) => {
      const lo = band.min ?? min;
      const hi = band.max ?? max;
      return { band, left: pct(lo), width: Math.max(0, pct(hi) - pct(lo)) };
    })
    .filter((s) => s.width > 0);

  // Interior boundaries (skip the unbounded outer edges).
  const ticks = bands
    .map((b) => b.min)
    .filter((m): m is number => m !== undefined && m > min && m < max);

  return (
    <div className={cn("space-y-1", className)}>
      <div
        className="relative flex h-2 overflow-hidden rounded-full"
        role="img"
        aria-label={`${def.label} guideline ranges: ${bands
          .map((b) => b.label)
          .join(", ")}${value !== undefined ? `. Your value: ${value} ${def.unit}.` : ""}`}
      >
        {segments.map(({ band, width }) => (
          <div
            key={`${band.label}-${band.min ?? "lo"}`}
            style={{ width: `${width}%` }}
            className={cn("h-full opacity-70", TIER_META[band.tier].dotClass)}
          />
        ))}
        {value !== undefined ? (
          <span
            aria-hidden="true"
            style={{ left: `calc(${pct(value)}% - 5px)` }}
            className="border-ink bg-paper absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 shadow-sm"
          />
        ) : null}
      </div>
      <div className="text-ink-subtle relative h-4 text-[10px] tabular-nums" aria-hidden="true">
        {ticks.map((t) => (
          <span
            key={t}
            style={{ left: `${pct(t)}%` }}
            className="absolute -translate-x-1/2 whitespace-nowrap"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
