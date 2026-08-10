import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FounderDashboard } from "./FounderDashboard";
import { InvestorDashboard } from "./InvestorDashboard";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";
import type { InvestorProfile, PortfolioEntry } from "@/types/investor";
import type { ProfileUnlock } from "@/types/nda";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  // No profile yet = brand new signup that hasn't picked founder/investor.
  // Send them to onboarding instead of silently defaulting to "founder".
  if (!profile) redirect("/onboarding");

  const role = profile.role ?? "founder";

  if (role === "admin") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">
          This dashboard experience isn&apos;t ready yet. Check back soon.
        </p>
      </div>
    );
  }

  if (role === "investor") {
    const { data: investorProfile } = await supabase
      .from("investor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Profile role says "investor" but they haven't finished registration yet.
    if (!investorProfile) redirect("/investor/register");

    const [{ data: portfolio }, { data: unlocks }] = await Promise.all([
      supabase.from("portfolio").select("*, company:companies(*)").eq("investor_id", user.id),
      supabase
        .from("profile_unlocks")
        .select("*, company:companies(*)")
        .eq("investor_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    return (
      <InvestorDashboard
        profile={investorProfile as InvestorProfile}
        portfolio={(portfolio as PortfolioEntry[] | null) ?? []}
        unlocks={(unlocks as (ProfileUnlock & { company: Company | null })[] | null) ?? []}
      />
    );
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  // Profile role says "founder" but they haven't finished registration yet.
  if (!company) redirect("/register");

  const [{ data: gated }, { data: nda }] = await Promise.all([
    supabase.from("startup_gated_data").select("*").eq("startup_id", company.id).maybeSingle(),
    supabase.from("startup_nda_data").select("*").eq("startup_id", company.id).maybeSingle(),
  ]);

  return (
    <FounderDashboard
      company={company as Company}
      gated={(gated as GatedData | null) ?? null}
      nda={(nda as NdaData | null) ?? null}
    />
  );
}
