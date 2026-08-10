"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiBriefcase } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/FormField";
import { toast } from "@/components/ui/toast";

export default function InvestorRegisterPage() {
  const { user, loading, signUpWithEmail } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const metaName = user?.user_metadata?.full_name as string | undefined;
    if (metaName) setFullName((prev) => prev || metaName);
  }, [user]);

  // Case A: already-authenticated (Google sign-in via onboarding) — just needs firm details.
  async function handleAuthenticatedSubmit(event: FormEvent) {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const supabase = createClient();
    const [{ error: profileError }, { error: investorError }] = await Promise.all([
      supabase
        .from("profiles")
        .upsert(
          { user_id: user.id, role: "investor", full_name: fullName },
          { onConflict: "user_id" }
        ),
      supabase
        .from("investor_profiles")
        .insert({ user_id: user.id, investor_name: fullName, firm_name: firmName }),
    ]);

    setSubmitting(false);

    if (profileError || investorError) {
      toast.error(
        "Couldn't save your investor details",
        investorError?.message || profileError?.message || "Please try again."
      );
      return;
    }

    toast.success("Investor profile created");
    router.push("/dashboard");
  }

  // Case B: brand new visitor — full email/password signup.
  async function handleSignupSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    const { error } = await signUpWithEmail(email, password);
    if (error) {
      toast.error("Couldn't create your account", error);
      setSubmitting(false);
      return;
    }

    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    if (userId) {
      const [{ error: profileError }, { error: investorError }] = await Promise.all([
        supabase
          .from("profiles")
          .insert({ user_id: userId, role: "investor", full_name: fullName }),
        supabase
          .from("investor_profiles")
          .insert({ user_id: userId, investor_name: fullName, firm_name: firmName }),
      ]);

      if (profileError || investorError) {
        toast.error(
          "Account created, but your profile setup needs a retry",
          "You can finish setting up your investor profile from the dashboard."
        );
      }
    }

    setSubmitting(false);
    toast.success("Account created");
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
        <h1 className="text-center text-3xl font-semibold text-foreground">
          Tell us about your firm
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          One last step to start browsing verified startup profiles.
        </p>

        <form onSubmit={handleAuthenticatedSubmit} className="mt-8 flex flex-col gap-4">
          <FormField
            icon={FiUser}
            label="Full name"
            type="text"
            value={fullName}
            onChange={setFullName}
            autoComplete="name"
          />
          <FormField
            icon={FiBriefcase}
            label="Company / firm name"
            type="text"
            value={firmName}
            onChange={setFirmName}
            autoComplete="organization"
          />

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        Create your investor account
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Browse explainable TrustScore profiles instead of raw pitch decks.
      </p>

      <form onSubmit={handleSignupSubmit} className="mt-8 flex flex-col gap-4">
        <FormField
          icon={FiUser}
          label="Full name"
          type="text"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
        />
        <FormField
          icon={FiBriefcase}
          label="Company / firm name"
          type="text"
          value={firmName}
          onChange={setFirmName}
          autoComplete="organization"
        />
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
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth" className="font-medium text-primary hover:underline">
          Log in
        </Link>
        . Building a startup instead?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register as a founder
        </Link>
        .
      </p>
    </div>
  );
}
