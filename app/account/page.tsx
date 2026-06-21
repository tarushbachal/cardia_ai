import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ManageBillingButton } from "@/components/billing/manage-billing-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const isPlus = session.plan === "plus";
  const renews = session.currentPeriodEnd
    ? new Date(session.currentPeriodEnd).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:py-20">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-ink text-3xl">Your account</h1>
        <SignOutButton />
      </div>

      <div className="border-border-hair bg-surface-raised mt-6 rounded-2xl border p-6">
        <p className="text-ink-subtle text-xs font-medium tracking-wider uppercase">Signed in as</p>
        <p className="text-ink mt-1 text-base font-medium">{session.email}</p>
      </div>

      <div className="border-border-hair bg-surface-raised mt-4 rounded-2xl border p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-ink-subtle text-xs font-medium tracking-wider uppercase">Plan</p>
            <p className="text-ink mt-1 flex items-center gap-2 text-base font-medium">
              {isPlus ? "Cardia Plus" : "Free"}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isPlus ? "bg-accent-soft text-accent-strong" : "bg-secondary text-ink-subtle",
                )}
              >
                {isPlus ? "Active" : "Free"}
              </span>
            </p>
            {isPlus && renews ? (
              <p className="text-ink-subtle mt-1 text-sm">
                {session.status === "canceled" ? "Access until" : "Renews"} {renews}
              </p>
            ) : null}
          </div>
          {isPlus ? (
            <ManageBillingButton />
          ) : (
            <Button asChild>
              <Link href="/pricing">Upgrade to Plus</Link>
            </Button>
          )}
        </div>
      </div>

      <p className="text-ink-subtle mt-6 text-sm">
        <Link href="/assessment" className="text-accent-strong font-medium">
          Start a new assessment
        </Link>
      </p>
    </div>
  );
}
