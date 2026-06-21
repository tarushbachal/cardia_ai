/**
 * Client-safe plan metadata (no secrets, no price ids). Price ids live in
 * server env and are read only in the checkout route. Update these labels in
 * lockstep with the prices created by scripts/stripe-setup.ts.
 */
export type BillingInterval = "monthly" | "yearly";
export type Plan = "free" | "plus";

export const PLUS = {
  name: "Cardia Plus",
  monthly: { amount: 5, display: "$5", suffix: "/month" },
  yearly: { amount: 39, display: "$39", suffix: "/year" },
  /** What a Plus subscription unlocks. */
  features: [
    "Save and revisit every assessment",
    "Track each biomarker as a trend over time",
    "The plain language AI walkthrough, always on",
    "The doctor ready report, anytime",
    "Priority support",
  ],
} as const;

export const FREE_FEATURES = [
  "One full, guideline sourced assessment",
  "The complete biomarker reference library",
  "Results that lead with what needs attention, every source linked",
] as const;
