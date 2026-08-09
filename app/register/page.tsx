"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiMail, FiLock, FiBriefcase } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa6";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/FormField";
import { toast } from "@/components/ui/toast";

export default function RegisterPage() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [startupName, setStartupName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
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
      const [{ error: profileError }, { error: companyError }] = await Promise.all([
        supabase
          .from("profiles")
          .insert({ user_id: userId, role: "founder", full_name: fullName, email }),
        supabase.from("companies").insert({ owner_id: userId, name: startupName }),
      ]);

      if (profileError || companyError) {
        toast.error(
          "Account created, but your profile setup needs a retry",
          "You can finish setting up your startup profile from the dashboard."
        );
      }
    }

    setSubmitting(false);
    toast.success("Account created");
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        Create your founder account
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Start building your structured TrustScore profile.
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
          icon={FiUser}
          label="Full name"
          type="text"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
        />
        <FormField
          icon={FiBriefcase}
          label="Startup name"
          type="text"
          value={startupName}
          onChange={setStartupName}
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
        . Investing instead?{" "}
        <Link href="/investor/register" className="font-medium text-primary hover:underline">
          Register as an investor
        </Link>
        .
      </p>
    </div>
  );
}
