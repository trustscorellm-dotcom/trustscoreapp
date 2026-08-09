"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa6";
import { useAuth } from "@/components/AuthProvider";
import { FormField } from "@/components/FormField";
import { toast } from "@/components/ui/toast";

export function AuthForm() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithEmail(email, password);
    setSubmitting(false);

    if (error) {
      toast.error("Couldn't log in", error);
      return;
    }

    toast.success("Welcome back");
    router.push(searchParams.get("redirectTo") || "/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-center text-3xl font-semibold text-foreground">Log in</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Welcome back. Log in to manage your TrustScore profile.
      </p>

      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="mt-8 flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <FaGoogle size={16} aria-hidden="true" />
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField
          icon={FiMail}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <FormField
          icon={FiLock}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          rightSlot={
            <Link
              href="/reset-password"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot password?
            </Link>
          }
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Sign up as a founder
        </Link>{" "}
        or{" "}
        <Link href="/investor/register" className="font-medium text-primary hover:underline">
          as an investor
        </Link>
        .
      </p>
    </div>
  );
}
