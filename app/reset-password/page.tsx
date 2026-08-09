"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { FormField } from "@/components/FormField";
import { toast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const [supabase] = useState(() => createClient());
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("update");
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleRequest(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Couldn't send reset email", error.message);
      return;
    }
    toast.success("Check your inbox", "We've sent a password reset link to your email.");
  }

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error("Couldn't update password", error.message);
      return;
    }
    toast.success("Password updated");
    router.push("/dashboard");
  }

  if (mode === "update") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
        <h1 className="text-center text-3xl font-semibold text-foreground">
          Set a new password
        </h1>
        <form onSubmit={handleUpdate} className="mt-8 flex flex-col gap-4">
          <FormField
            icon={FiLock}
            label="New password"
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
            {submitting ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        Reset your password
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        We&apos;ll email you a link to set a new password.
      </p>
      <form onSubmit={handleRequest} className="mt-8 flex flex-col gap-4">
        <FormField
          icon={FiMail}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
