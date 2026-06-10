import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/disclaimer";
import { RangeBar } from "@/components/biomarkers/range-bar";
import { SourceLink } from "@/components/results/source-link";
import { TIER_META } from "@/components/results/tier";
import { cn } from "@/lib/utils";
import {
  DEFINITIONS_BY_GROUP,
  GROUP_BLURBS,
  GROUP_LABELS,
  GUIDELINE_VERSION,
  isSexBands,
  type Band,
  type BiomarkerDefinition,
} from "@/lib/rules-engine";

export const metadata: Metadata = {
  title: "Biomarker library · Cardia AI",
  description:
    "A calm, fully-sourced reference for cardiovascular biomarkers — every range traced to a named, dated clinical guideline.",
};

/**
 * The biomarker reference library: every marker the engine understands, with
 * its guideline bands visualized and sourced. Statically rendered straight from
 * the rules-engine config, so it can never drift from what the assessment uses.
 */
export default function BiomarkersPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <header className="max-w-2xl">
        <h1 className="text-ink text-4xl sm:text-5xl">The biomarker library</h1>
        <p className="text-ink-muted mt-5 text-lg leading-relaxed">
          Every range Cardia AI references, in one place — each band traced to a named, dated
          clinical guideline. Educational reference, not medical advice; lab report ranges can
          differ by laboratory and assay.
        </p>
        <p className="text-ink-subtle mt-3 text-sm">Guideline set {GUIDELINE_VERSION}.</p>
      </header>

      <div className="mt-12 space-y-14">
        {DEFINITIONS_BY_GROUP.map((group) => (
          <section key={group.group} aria-labelledby={`group-${group.group}`}>
            <h2 id={`group-${group.group}`} className="text-ink text-2xl sm:text-3xl">
              {GROUP_LABELS[group.group]}
            </h2>
            <p className="text-ink-muted mt-2 max-w-2xl text-sm leading-relaxed">
              {GROUP_BLURBS[group.group]}
            </p>
            <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
              {group.items.map((def) => (
                <BiomarkerEntry key={def.key} def={def} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="border-border-hair mt-16 flex flex-col items-start gap-5 border-t pt-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-ink-muted max-w-md text-sm leading-relaxed">
          Curious where your own numbers sit? The assessment takes a few minutes and stays calm the
          whole way through.
        </p>
        <Button asChild size="pill">
          <Link href="/assessment">
            Start your assessment
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="mt-10 max-w-3xl">
        <Disclaimer />
      </div>
    </div>
  );
}

function BiomarkerEntry({ def }: { def: BiomarkerDefinition }) {
  const variants: { label: string | null; bands: Band[] }[] = isSexBands(def.bands)
    ? [
        { label: "Women", bands: def.bands.female },
        { label: "Men", bands: def.bands.male },
      ]
    : [{ label: null, bands: def.bands }];

  return (
    <article className="border-border-hair bg-surface-raised rounded-2xl border p-6">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-ink text-lg font-medium">
          {def.label} <span className="text-ink-subtle text-sm font-normal">({def.shortLabel})</span>
        </h3>
        <span className="text-ink-subtle shrink-0 text-xs">{def.unit}</span>
      </div>
      <p className="text-ink-muted mt-1.5 text-sm leading-relaxed">{def.description}</p>

      <div className="mt-4 space-y-3">
        {variants.map((variant) => (
          <div key={variant.label ?? "all"}>
            {variant.label ? (
              <p className="text-ink-subtle mb-1 text-xs font-medium tracking-wide uppercase">
                {variant.label}
              </p>
            ) : null}
            <RangeBar def={def} bands={variant.bands} />
            <ul className="mt-2 space-y-1">
              {variant.bands.map((band) => (
                <li key={`${band.label}-${band.min ?? "lo"}`} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn("size-1.5 shrink-0 rounded-full", TIER_META[band.tier].dotClass)}
                    aria-hidden="true"
                  />
                  <span className="text-ink-subtle w-24 shrink-0 tabular-nums">
                    {band.min === undefined
                      ? `< ${band.max}`
                      : band.max === undefined
                        ? `≥ ${band.min}`
                        : `${band.min} – ${band.max}`}
                  </span>
                  <span className="text-ink-muted">{band.label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border-hair mt-4 space-y-1.5 border-t pt-3">
        <p className="text-ink-subtle text-xs font-medium tracking-wide uppercase">
          {def.additionalSources?.length ? "Sources" : "Source"}
        </p>
        <SourceLink source={def.primarySource} />
        {def.additionalSources?.map((source) => <SourceLink key={source.url} source={source} />)}
      </div>
    </article>
  );
}
