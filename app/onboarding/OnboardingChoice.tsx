"use client";

import { useState, useTransition } from "react";
import { FiTrendingUp, FiBriefcase } from "react-icons/fi";
import { toast } from "@/components/ui/toast";
import { chooseRole } from "./actions";

export function OnboardingChoice() {
  const [isPending, startTransition] = useTransition();
  const [selecting, setSelecting] = useState<"founder" | "investor" | null>(null);

  function handleChoose(role: "founder" | "investor") {
    setSelecting(role);
    startTransition(async () => {
      const result = await chooseRole(role);
      // If chooseRole succeeds it redirects server-side and never returns here.
      // A returned value means it failed before redirecting.
      if (result?.error) {
        toast.error("Couldn't save your choice", result.error);
        setSelecting(null);
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        Welcome to TrustScore
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Tell us who you are so we can set up the right experience.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={isPending}
          onClick={() => handleChoose("founder")}
          className="flex flex-col items-start gap-3 rounded-lg border border-border p-6 text-left transition-colors hover:bg-muted disabled:opacity-60"
        >
          <FiBriefcase size={24} className="text-primary" aria-hidden="true" />
          <span className="text-lg font-medium text-foreground">
            {selecting === "founder" ? "Setting up..." : "I'm a Founder"}
          </span>
          <span className="text-sm text-muted-foreground">
            List your startup and build a TrustScore profile investors can trust.
          </span>
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => handleChoose("investor")}
          className="flex flex-col items-start gap-3 rounded-lg border border-border p-6 text-left transition-colors hover:bg-muted disabled:opacity-60"
        >
          <FiTrendingUp size={24} className="text-primary" aria-hidden="true" />
          <span className="text-lg font-medium text-foreground">
            {selecting === "investor" ? "Setting up..." : "I'm an Investor"}
          </span>
          <span className="text-sm text-muted-foreground">
            Browse verified startups and request access to gated data.
          </span>
        </button>
      </div>
    </div>
  );
}
