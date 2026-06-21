/**
 * Centralized environment access. Phase 1 runs with these unset, so reads are
 * tolerant; helpers throw a clear message only when a feature that needs them is
 * actually used. The service-role key is never read in client code.
 */

export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function hasPublicSupabaseConfig(): boolean {
  return Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);
}

export function requirePublicSupabaseConfig(): { url: string; anonKey: string } {
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example).",
    );
  }
  return { url: publicEnv.supabaseUrl, anonKey: publicEnv.supabaseAnonKey };
}

/** Server-only, non-throwing presence check. */
export function hasServiceRoleKey(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Server-only. Never call from client code. */
export function requireServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set (server-only).");
  }
  return key;
}

// ── Stripe ───────────────────────────────────────────────────────────────────

/** True when billing is fully configured (publishable + secret keys present). */
export function hasStripeConfig(): boolean {
  return Boolean(
    process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

/** Server-only. The Stripe secret key. */
export function requireStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set (server-only).");
  return key;
}

/** Server-only. The Stripe webhook signing secret. */
export function requireStripeWebhookSecret(): string {
  const key = process.env.STRIPE_WEBHOOK_SECRET;
  if (!key) throw new Error("STRIPE_WEBHOOK_SECRET is not set (server-only).");
  return key;
}

/** Server-only. The Stripe price id for a billing interval. */
export function requireStripePriceId(interval: "monthly" | "yearly"): string {
  const id =
    interval === "monthly" ? process.env.STRIPE_PRICE_MONTHLY : process.env.STRIPE_PRICE_YEARLY;
  if (!id) {
    throw new Error(
      `Stripe ${interval} price id is not set (run scripts/stripe-setup.ts, then set STRIPE_PRICE_${interval === "monthly" ? "MONTHLY" : "YEARLY"}).`,
    );
  }
  return id;
}
