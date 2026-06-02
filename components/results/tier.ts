import type { SeverityTier } from "@/lib/rules-engine";

/** Muted, mature visual treatment per tier. `attention` never reads as an alarm. */
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
    dotClass: "bg-optimal",
    chipClass: "bg-optimal-soft text-optimal-strong",
    softClass: "bg-optimal-soft",
    textClass: "text-optimal-strong",
    ringVar: "var(--optimal)",
  },
  borderline: {
    groupLabel: "Slightly outside the optimal range",
    dotClass: "bg-borderline",
    chipClass: "bg-borderline-soft text-borderline-strong",
    softClass: "bg-borderline-soft",
    textClass: "text-borderline-strong",
    ringVar: "var(--borderline)",
  },
  attention: {
    groupLabel: "Outside guideline range — worth a conversation",
    dotClass: "bg-elevated",
    chipClass: "bg-elevated-soft text-elevated-strong",
    softClass: "bg-elevated-soft",
    textClass: "text-elevated-strong",
    ringVar: "var(--elevated)",
  },
};

/** Order tiers so "within range" reads first — calm before anything else. */
export const TIER_DISPLAY_ORDER: SeverityTier[] = ["optimal", "borderline", "attention"];
