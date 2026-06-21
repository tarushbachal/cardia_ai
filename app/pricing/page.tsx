import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { PLUS, FREE_FEATURES } from "@/lib/stripe/plans";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Cardia is free to use. Cardia Plus adds saved history, trends, and more.",
};

export default async function PricingPage() {
  const session = await getSession();
  const loggedIn = Boolean(session);
  const isPlus = session?.plan === "plus";

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-ink text-4xl sm:text-5xl">Simple, honest pricing.</h1>
        <p className="text-ink-muted mt-4 text-lg leading-relaxed">
          The core assessment and the full reference library are free, always. Cardia Plus adds the
          features that make it something you return to.
        </p>
      </div>

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-2">
        {/* Free */}
        <div className="border-border-hair bg-surface-raised rounded-3xl border p-7">
          <h2 className="text-ink text-xl font-semibold">Free</h2>
          <p className="text-ink mt-3">
            <span className="font-display text-3xl font-semibold">$0</span>
            <span className="text-ink-subtle text-base"> / forever</span>
          </p>
          <ul className="mt-6 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="text-ink-subtle mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="text-ink-muted text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant="outline" className="mt-7 w-full">
            <Link href="/assessment">Start an assessment</Link>
          </Button>
        </div>

        {/* Plus */}
        <div className="border-accent/40 bg-surface-raised relative rounded-3xl border-2 p-7 shadow-[0_20px_50px_-30px_rgba(17,36,48,0.35)]">
          <span className="bg-accent-soft text-accent-strong absolute -top-3 right-6 rounded-full px-3 py-1 text-xs font-semibold">
            Most popular
          </span>
          <h2 className="text-ink text-xl font-semibold">{PLUS.name}</h2>
          <ul className="mt-6 mb-7 space-y-3">
            {PLUS.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="text-accent-strong mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span className="text-ink-muted text-sm leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
          {isPlus ? (
            <div className={cn("rounded-xl border p-4 text-center", "border-optimal/40 bg-optimal-soft/50")}>
              <p className="text-ink text-sm font-medium">You’re on Cardia Plus.</p>
              <Button asChild variant="ghost" size="sm" className="mt-1">
                <Link href="/account">Manage in your account</Link>
              </Button>
            </div>
          ) : (
            <UpgradeButton loggedIn={loggedIn} />
          )}
        </div>
      </div>

      <p className="text-ink-subtle mt-8 text-center text-sm">
        Cancel anytime. Cardia is a general wellness tool, not a medical device.
      </p>
    </div>
  );
}
