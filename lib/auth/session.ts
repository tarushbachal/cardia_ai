import { createSupabaseServerClient } from "@/lib/data-access/supabase/server";
import type { Plan } from "@/lib/stripe/plans";

export interface SessionInfo {
  userId: string;
  email: string | null;
  plan: Plan;
  status: string | null;
  currentPeriodEnd: string | null;
}

/**
 * The current signed-in user plus their plan, or null when logged out.
 * Server-only (reads request cookies). Plan defaults to "free".
 */
export async function getSession(): Promise<SessionInfo | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status, current_period_end")
    .eq("id", user.id)
    .single();

  const plan: Plan = profile?.plan === "plus" ? "plus" : "free";
  return {
    userId: user.id,
    email: user.email ?? null,
    plan,
    status: profile?.subscription_status ?? null,
    currentPeriodEnd: profile?.current_period_end ?? null,
  };
}
