import Stripe from "stripe";
import { requireStripeSecretKey } from "@/lib/config/env";

// Server-only Stripe client. The secret key never reaches the browser bundle.
if (typeof window !== "undefined") {
  throw new Error("lib/stripe/server must never be imported in the browser.");
}

let cached: Stripe | null = null;

/** Lazily-constructed Stripe client (uses the SDK's pinned API version). */
export function getStripe(): Stripe {
  if (!cached) cached = new Stripe(requireStripeSecretKey());
  return cached;
}
