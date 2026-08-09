"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiFileText, FiCheck } from "react-icons/fi";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import type { Company } from "@/types/startup";

interface NDASignerProps {
  company: Company;
  alreadyUnlocked: boolean;
}

export function NDASigner({ company, alreadyUnlocked }: NDASignerProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(alreadyUnlocked);

  async function handleUnlock() {
    if (!user) {
      toast.error("Please log in to continue");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // Step 16.2: no approval state machine — insert a row and the data is
    // unlocked immediately, no blocking wait.
    const { error } = await supabase
      .from("profile_unlocks")
      .insert({ investor_id: user.id, startup_id: company.id });

    setSubmitting(false);

    if (error) {
      toast.error("Couldn't unlock this profile", "Please try again.");
      return;
    }

    setUnlocked(true);
    toast.success(`${company.name}'s gated data is now unlocked`);

    // Fire-and-forget notification email — informational only, must not block
    // or gate the unlock (Section 16.2). Failure is intentionally ignored.
    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "profile-unlock", startupId: company.id }),
    }).catch(() => {});
  }

  if (unlocked) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-success-solid/10 text-brand-success-solid">
          <FiCheck size={22} aria-hidden="true" />
        </span>
        <h2 className="text-lg font-semibold text-foreground">Unlocked</h2>
        <p className="text-sm text-muted-foreground">
          You now have access to {company.name}&apos;s gated data.
        </p>
        <button
          type="button"
          onClick={() => router.push(`/startup/${company.id}`)}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          View {company.name}&apos;s profile
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FiFileText size={22} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Unlock {company.name}&apos;s gated data
          </h2>
          <p className="text-sm text-muted-foreground">
            Founding team, funding, and financial details beyond the public profile.
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        By continuing, you agree to keep this information confidential and use it only to
        evaluate {company.name} as a potential investment. NDA-tier data (used only to
        compute {company.name}&apos;s TrustScore) is never shared with investors, even after
        unlocking.
      </p>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => setAgreed(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-ring"
        />
        <span className="text-foreground">
          I agree to keep {company.name}&apos;s gated data confidential.
        </span>
      </label>

      <button
        type="button"
        onClick={handleUnlock}
        disabled={!agreed || submitting}
        className="self-start rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Unlocking..." : "Sign & unlock"}
      </button>
    </div>
  );
}
