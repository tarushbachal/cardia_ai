import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseConfig } from "@/lib/config/env";

/** Browser Supabase client (anon key, RLS-enforced). For Client Components. */
export function createSupabaseBrowserClient() {
  const { url, anonKey } = requirePublicSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
