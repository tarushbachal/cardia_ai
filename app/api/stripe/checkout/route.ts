import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/data-access/supabase/server";
import { getStripe } from "@/lib/stripe/server";
import { requireStripePriceId } from "@/lib/config/env";
import { saveStripeCustomerId } from "@/lib/data-access/billing";

export const runtime = "nodejs";

/** Creates a Stripe Checkout Session for a Cardia Plus subscription. Auth required. */
export async function POST(request: Request): Promise<NextResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let interval: "monthly" | "yearly" = "monthly";
  try {
    const body = await request.json();
    if (body?.interval === "yearly") interval = "yearly";
  } catch {
    // default monthly
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const stripe = getStripe();
  let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await saveStripeCustomerId(user.id, customerId);
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: requireStripePriceId(interval), quantity: 1 }],
    allow_promotion_codes: true,
    success_url: `${origin}/account?upgraded=1`,
    cancel_url: `${origin}/pricing`,
  });

  return NextResponse.json({ url: session.url });
}
