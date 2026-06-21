"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PLUS, type BillingInterval } from "@/lib/stripe/plans";

/** Monthly/yearly toggle + checkout. Sends non-subscribers to sign in first. */
export function UpgradeButton({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();
  const [interval, setInterval] = useState<BillingInterval>("yearly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  async function upgrade() {
    if (!loggedIn) {
      router.push("/signup");
      return;
    }
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data?.error ?? "Could not start checkout.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout.");
      setLoading(false);
    }
  }

  const plan = PLUS[interval];

  return (
    <div className="space-y-4">
      <div className="bg-secondary inline-flex rounded-full p-1 text-sm">
        {(["yearly", "monthly"] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setInterval(opt)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-medium transition-colors",
              interval === opt ? "bg-surface-raised text-ink shadow-sm" : "text-ink-subtle",
            )}
          >
            {opt === "yearly" ? "Yearly" : "Monthly"}
          </button>
        ))}
      </div>
      <p className="text-ink">
        <span className="font-display text-3xl font-semibold">{plan.display}</span>
        <span className="text-ink-subtle text-base">{plan.suffix}</span>
        {interval === "yearly" ? (
          <span className="text-optimal-strong ml-2 text-sm font-medium">Save 35%</span>
        ) : null}
      </p>
      <Button onClick={upgrade} disabled={loading} className="w-full" size="lg">
        {loading ? "Starting checkout…" : `Upgrade to ${PLUS.name}`}
      </Button>
      {error ? <p className="text-elevated-strong text-sm">{error}</p> : null}
    </div>
  );
}
