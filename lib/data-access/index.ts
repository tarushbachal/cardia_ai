/**
 * Data-access layer (§5, §6.3). Centralized Supabase access for Phase 2+.
 * The service-role admin client is intentionally NOT re-exported here so it can
 * never be pulled into a client bundle; import it directly on the server.
 */
export type { ReadingRow, ProfileRow, StoredReadingPayload } from "./types";
export {
  getReadingsRepository,
  assertPersistenceEnabled,
  type ReadingsRepository,
  type SaveReadingInput,
} from "./readings";
export { createSupabaseBrowserClient } from "./supabase/client";
export { createSupabaseServerClient } from "./supabase/server";
