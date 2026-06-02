"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SourceLink } from "./source-link";
import { TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import type { BiomarkerResult } from "@/lib/rules-engine";

/** Layer 2 unit (§3.5): value + calm category, expandable to the note + source. */
export function BiomarkerCard({ result }: { result: BiomarkerResult }) {
  const [open, setOpen] = useState(false);
  const meta = TIER_META[result.tier];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-border-hair bg-surface-raised rounded-xl border"
    >
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <span className={cn("size-2 shrink-0 rounded-full", meta.dotClass)} aria-hidden="true" />
        <span className="text-ink min-w-0 flex-1 text-sm font-medium">
          {result.label} <span className="text-ink-subtle font-normal">({result.shortLabel})</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="text-ink text-sm tabular-nums">
            {result.value} <span className="text-ink-subtle">{result.unit}</span>
          </span>
          <span
            className={cn(
              "hidden rounded-full px-2.5 py-1 text-xs font-medium sm:inline-block",
              meta.chipClass,
            )}
          >
            {result.categoryLabel}
          </span>
          <ChevronDown
            className={cn("text-ink-subtle size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down overflow-hidden">
        <div className="border-border-hair space-y-3 border-t px-4 py-4">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-1 text-xs font-medium sm:hidden",
              meta.chipClass,
            )}
          >
            {result.categoryLabel}
          </span>
          <p className="text-ink-muted text-sm leading-relaxed">{result.note}</p>
          <div className="space-y-1.5 pt-1">
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
