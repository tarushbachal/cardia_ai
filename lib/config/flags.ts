/**
 * Feature flags. Phase 1 ships with server persistence OFF; the data-access layer
 * exists and is tested but is never called from the UI. Phase 2 flips this on with
 * a single env change (§6.3).
 */
export const FLAGS = {
  /** Server-side persistence of assessments. Set NEXT_PUBLIC_PERSISTENCE_ENABLED=true to enable. */
  persistenceEnabled: process.env.NEXT_PUBLIC_PERSISTENCE_ENABLED === "true",
} as const;

export type Flags = typeof FLAGS;
