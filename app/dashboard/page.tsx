import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FounderDashboard } from "./FounderDashboard";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

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

  const role = profile?.role ?? "founder";

  if (role !== "founder") {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">
          {role === "investor" ? "Investor dashboard" : "Admin dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          This dashboard experience isn&apos;t ready yet. Check back soon.
        </p>
      </div>
    );
  }

  let { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!company) {
    const { data: created } = await supabase
      .from("companies")
      .insert({ owner_id: user.id, name: "Untitled Startup" })
      .select("*")
      .single();
    company = created;
  }

  if (!company) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard unavailable</h1>
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load your startup profile. Please try again shortly.
        </p>
      </div>
    );
  }

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
