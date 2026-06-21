import type { SeverityTier } from "@/lib/rules-engine";

/** Clinical visual treatment per tier. `attention` reads clearly as out-of-range. */
export const TIER_META: Record<
  SeverityTier,
  {
    /** Section heading when grouping the breakdown by status. */
    groupLabel: string;
    dotClass: string;
    chipClass: string;
    softClass: string;
    textClass: string;
    ringVar: string;
  }
> = {
  optimal: {
    groupLabel: "Within guideline range",
    // (order/labels tuned below)
    dotClass: "bg-optimal",
    chipClass: "bg-optimal-soft text-optimal-strong",
    softClass: "bg-optimal-soft",
    textClass: "text-optimal-strong",
    ringVar: "var(--optimal)",
  },
  borderline: {
    groupLabel: "Borderline, monitor",
    dotClass: "bg-borderline",
    chipClass: "bg-borderline-soft text-borderline-strong",
    softClass: "bg-borderline-soft",
    textClass: "text-borderline-strong",
    ringVar: "var(--borderline)",
  },
  attention: {
    groupLabel: "Outside guideline range, discuss with your physician",
    dotClass: "bg-elevated",
    chipClass: "bg-elevated-soft text-elevated-strong",
    softClass: "bg-elevated-soft",
    textClass: "text-elevated-strong",
    ringVar: "var(--elevated)",
  },
};

/** Order tiers so values outside range read first, lead with what needs attention. */
export const TIER_DISPLAY_ORDER: SeverityTier[] = ["attention", "borderline", "optimal"];
