import { createClient } from "@supabase/supabase-js";
import { requirePublicSupabaseConfig, requireServiceRoleKey } from "@/lib/config/env";

// Hard guard: the service-role key must never reach the browser bundle (§5.1).
if (typeof window !== "undefined") {
  throw new Error("lib/data-access/supabase/admin must never be imported in the browser.");
}

/**
 * Service-role Supabase client, bypasses RLS. Server-only, for trusted
 * background/admin work in later phases. Never use to serve user requests where
 * RLS should apply; use the server client for that.
 */
export function createSupabaseAdminClient() {
  const { url } = requirePublicSupabaseConfig();
  return createClient(url, requireServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
