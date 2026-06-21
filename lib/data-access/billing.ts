import { createSupabaseAdminClient } from "./supabase/admin";

/**
 * Billing writes go through the service role (the webhook has no user session),
 * keyed by the Stripe customer id. Server-only.
 */

export async function saveStripeCustomerId(userId: string, customerId: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({ stripe_customer_id: customerId })
    .eq("id", userId);
  if (error) throw error;
}

export async function setSubscriptionByCustomer(
  customerId: string,
  fields: { plan: "free" | "plus"; subscription_status: string | null; current_period_end: string | null },
): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("stripe_customer_id", customerId);
  if (error) throw error;
}
