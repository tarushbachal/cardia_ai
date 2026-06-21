"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/data-access/supabase/client";
import { Button } from "@/components/ui/button";

/** Client-side auth state in the header (keeps the marketing pages static). */
export function HeaderAuth() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      return; // Supabase not configured — show "Sign in" by default.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    supabase.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setAuthed(Boolean(session)),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
      <Link href={authed ? "/account" : "/login"}>{authed ? "Account" : "Sign in"}</Link>
    </Button>
  );
}
