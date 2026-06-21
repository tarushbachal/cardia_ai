import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { requireStripeWebhookSecret } from "@/lib/config/env";
import { setSubscriptionByCustomer } from "@/lib/data-access/billing";

export const runtime = "nodejs";

function periodEndISO(sub: Stripe.Subscription): string | null {
  const end = (sub as unknown as { current_period_end?: number }).current_period_end;
  return typeof end === "number" ? new Date(end * 1000).toISOString() : null;
}

async function syncFromSubscription(stripe: Stripe, customer: string | Stripe.Customer | Stripe.DeletedCustomer, sub: Stripe.Subscription) {
  const customerId = typeof customer === "string" ? customer : customer.id;
  const active = sub.status === "active" || sub.status === "trialing";
  await setSubscriptionByCustomer(customerId, {
    plan: active ? "plus" : "free",
    subscription_status: sub.status,
    current_period_end: periodEndISO(sub),
  });
}

/**
 * Stripe webhook: the source of truth for subscription state. Signature-verified,
 * and tolerant to retries (updates are idempotent upserts by customer id).
 */
export async function POST(request: Request): Promise<NextResponse> {
  const sig = request.headers.get("stripe-signature");
  if (!sig) return new NextResponse(null, { status: 400 });

  const raw = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, requireStripeWebhookSecret());
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncFromSubscription(stripe, sub.customer, sub);
        break;
      }
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription && session.customer) {
          const subId = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
          const sub = await stripe.subscriptions.retrieve(subId);
          await syncFromSubscription(stripe, session.customer, sub);
        }
        break;
      }
      default:
        break;
    }
  } catch {
    return new NextResponse(null, { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}
