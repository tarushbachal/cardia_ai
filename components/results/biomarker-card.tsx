"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RangeBar } from "@/components/biomarkers/range-bar";
import { SourceLink } from "./source-link";
import { TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import { BIOMARKERS, resolveBands, type BiomarkerResult, type Sex } from "@/lib/rules-engine";

/**
 * Layer 2 unit (§3.5): a compact, grid-friendly card, name + value + calm
 * category, expandable to the plain language note, a visual of where the value
 * sits across the guideline bands, and the source guideline.
 */
export function BiomarkerCard({ result, sex }: { result: BiomarkerResult; sex?: Sex }) {
  const [open, setOpen] = useState(false);
  const meta = TIER_META[result.tier];
  const def = BIOMARKERS[result.key];
  const bands = resolveBands(def.bands, sex);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-border-hair bg-surface-raised hover:border-border-strong rounded-xl border transition-[border-color,box-shadow] duration-200 hover:shadow-[0_10px_28px_-20px_rgba(20,36,47,0.28)] motion-reduce:transition-none"
    >
      <CollapsibleTrigger className="flex w-full flex-col gap-2 px-4 py-3.5 text-left">
        <div className="flex w-full items-center gap-2.5">
          <span className={cn("size-2 shrink-0 rounded-full", meta.dotClass)} aria-hidden="true" />
          <span className="text-ink min-w-0 flex-1 truncate text-sm font-medium">
            {result.label}
          </span>
          <ChevronDown
            className={cn("text-ink-subtle size-4 shrink-0 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </div>
        <div className="flex w-full items-center justify-between gap-2 pl-[1.125rem]">
          <span className="text-ink text-sm tabular-nums">
            {result.value} <span className="text-ink-subtle">{result.unit}</span>
          </span>
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", meta.chipClass)}>
            {result.categoryLabel}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down overflow-hidden">
        <div className="border-border-hair space-y-3 border-t px-4 py-4">
          <RangeBar def={def} bands={bands} value={result.value} />
          <p className="text-ink-muted text-sm leading-relaxed">{result.note}</p>
          <div className="space-y-1.5">
            <p className="text-ink-subtle text-xs font-medium tracking-wide uppercase">
              {result.additionalSources.length > 0 ? "Sources" : "Source"}
            </p>
            <SourceLink source={result.source} />
            {result.additionalSources.map((source) => (
              <SourceLink key={source.url} source={source} />
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
