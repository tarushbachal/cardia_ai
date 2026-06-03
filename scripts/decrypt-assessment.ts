/**
 * Example: decrypt stored assessments for exact-value analysis (server-side only).
 *
 * Most analytics need NO decryption — query the plaintext category columns
 * directly (sex, age_band, composite_signal, tiers, within_range, ...). Use this
 * only when you need the precise numbers.
 *
 * Run with the env loaded (Node 20+ supports --env-file; tsx resolves the "@/" alias):
 *
 *   npx tsx --env-file=.env.local scripts/decrypt-assessment.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and ENCRYPTION_KEY.
 */
import { createSupabaseAdminClient } from "@/lib/data-access/supabase/admin";
import { decrypt } from "@/lib/crypto/encrypt";

async function main() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;

  const rows = (data ?? []).map((row) => {
    const { ciphertext, ...rest } = row as Record<string, unknown> & { ciphertext: string };
    return { ...rest, decrypted: JSON.parse(decrypt(ciphertext)) };
  });

  process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
