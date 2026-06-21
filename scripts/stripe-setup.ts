/**
 * One-time Stripe setup: creates the "Cardia Plus" product with monthly ($5) and
 * yearly ($39) prices, then prints the price ids to paste into .env.local.
 *
 * Run once after pasting STRIPE_SECRET_KEY into .env.local:
 *   npx tsx --env-file=.env.local scripts/stripe-setup.ts
 *
 * Safe to re-run: it reuses an existing "Cardia Plus" product if found.
 */
import Stripe from "stripe";

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set. Paste it into .env.local first.");
  const stripe = new Stripe(key);

  const existing = await stripe.products.search({ query: 'name:"Cardia Plus"' });
  const product =
    existing.data[0] ??
    (await stripe.products.create({
      name: "Cardia Plus",
      description: "Saved history, trends, AI walkthrough, and the doctor report.",
    }));

  const monthly = await stripe.prices.create({
    product: product.id,
    unit_amount: 500,
    currency: "usd",
    recurring: { interval: "month" },
    nickname: "Cardia Plus monthly",
  });
  const yearly = await stripe.prices.create({
    product: product.id,
    unit_amount: 3900,
    currency: "usd",
    recurring: { interval: "year" },
    nickname: "Cardia Plus yearly",
  });

  process.stdout.write(
    `\nProduct: ${product.id}\n\nAdd these to .env.local (and Vercel):\n` +
      `STRIPE_PRICE_MONTHLY=${monthly.id}\n` +
      `STRIPE_PRICE_YEARLY=${yearly.id}\n\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
