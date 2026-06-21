"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/data-access/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Email + password sign in / sign up against Supabase Auth. */
export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          // Email confirmation is enabled — no session yet.
          setCheckEmail(true);
          setLoading(false);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="border-border-hair bg-surface-raised rounded-2xl border p-6 text-center">
        <h2 className="text-ink text-lg font-semibold">Check your email</h2>
        <p className="text-ink-muted mt-2 text-sm leading-relaxed">
          We sent a confirmation link to <span className="text-ink font-medium">{email}</span>. Click
          it to finish creating your account, then sign in.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="border-border-hair bg-surface-raised space-y-4 rounded-2xl border p-6"
    >
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? (
        <p
          role="alert"
          className="border-elevated-strong/30 bg-elevated-soft text-elevated-strong rounded-lg border px-3 py-2 text-sm"
        >
          {error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </Button>
      <p className="text-ink-subtle text-center text-sm">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent-strong font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Cardia?{" "}
            <Link href="/signup" className="text-accent-strong font-medium">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
