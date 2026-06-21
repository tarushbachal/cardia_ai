"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Opens the Stripe Customer Portal for an existing subscriber. */
export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  async function open() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch {
      // fall through
    }
    setLoading(false);
  }
  return (
    <Button variant="outline" onClick={open} disabled={loading}>
      {loading ? "Opening…" : "Manage billing"}
    </Button>
  );
}
