/**
 * Feature flags. Phase 1 ships with server persistence OFF; the data-access layer
 * exists and is tested but is never called from the UI. Phase 2 flips this on with
 * a single env change (§6.3).
 */
export const FLAGS = {
  /** Server-side persistence of assessments. Set NEXT_PUBLIC_PERSISTENCE_ENABLED=true to enable. */
  persistenceEnabled: process.env.NEXT_PUBLIC_PERSISTENCE_ENABLED === "true",
  /**
   * Phase 2.1 anonymous encrypted capture. Set NEXT_PUBLIC_CAPTURE_ENABLED=true
   * (and configure Supabase + ENCRYPTION_KEY) to store an anonymous, encrypted
   * copy of each assessment for analysis. Drives the client beacon AND the
   * privacy copy; the server additionally requires the secrets to be present.
   */
  captureEnabled: process.env.NEXT_PUBLIC_CAPTURE_ENABLED === "true",
} as const;

export type Flags = typeof FLAGS;
