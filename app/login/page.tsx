import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-16 sm:py-24">
      <h1 className="text-ink text-3xl">Welcome back</h1>
      <p className="text-ink-muted mt-2 mb-6 text-base">Sign in to your Cardia account.</p>
      <AuthForm mode="login" />
    </div>
  );
}
