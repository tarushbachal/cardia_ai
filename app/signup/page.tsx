import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <div className="mx-auto w-full max-w-md px-5 py-16 sm:py-24">
      <h1 className="text-ink text-3xl">Create your account</h1>
      <p className="text-ink-muted mt-2 mb-6 text-base">
        Save your assessments and unlock Cardia Plus.
      </p>
      <AuthForm mode="signup" />
    </div>
  );
}
