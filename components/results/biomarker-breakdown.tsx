"use client";

import { useState } from "react";
import { ChevronDown, ListChecks } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BiomarkerCard } from "./biomarker-card";
import { TIER_DISPLAY_ORDER, TIER_META } from "./tier";
import { cn } from "@/lib/utils";
import type { BiomarkerResult } from "@/lib/rules-engine";

/**
 * Layer 2 (§3.5): opt-in per-biomarker detail. Collapsed by default — the user
 * chooses to see it. Grouped by status with "within range" first, so the calm
 * comes before anything that needs attention.
 */
export function BiomarkerBreakdown({ results }: { results: BiomarkerResult[] }) {
  const [open, setOpen] = useState(false);

  const groups = TIER_DISPLAY_ORDER.map((tier) => ({
    tier,
    items: results.filter((r) => r.tier === tier),
  })).filter((g) => g.items.length > 0);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="border-border-hair bg-surface rounded-2xl border"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
        <span className="flex items-center gap-3">
          <ListChecks className="text-accent-strong size-5 shrink-0" aria-hidden="true" />
          <span>
            <span className="text-ink block text-base font-medium">
              See your biomarker breakdown
            </span>
            <span className="text-ink-subtle block text-sm">
              {results.length} {results.length === 1 ? "marker" : "markers"} · each with its source
              guideline
            </span>
          </span>
        </span>
        <span className="text-accent-strong flex items-center gap-2 text-sm font-medium">
          <span className="hidden sm:inline">{open ? "Hide" : "Show"}</span>
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down overflow-hidden">
        <div className="border-border-hair space-y-6 border-t px-5 py-6">
          {groups.map((group) => (
            <section key={group.tier} className="space-y-2.5">
              <h3 className="text-ink-subtle flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                <span
                  className={cn("size-2 rounded-full", TIER_META[group.tier].dotClass)}
                  aria-hidden="true"
                />
                {TIER_META[group.tier].groupLabel} · {group.items.length}
              </h3>
              <div className="space-y-2">
                {group.items.map((result) => (
                  <BiomarkerCard key={result.key} result={result} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
