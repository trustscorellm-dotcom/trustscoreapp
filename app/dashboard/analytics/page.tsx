import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { calculateTrustScore, MIN_DISPLAYABLE_CONFIDENCE } from "@/lib/trustscore/calculator";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
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

  if ((profile?.role ?? "founder") !== "founder") {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Category-level TrustScore analytics are available for founder accounts.
        </p>
      </div>
    );
  }

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!company) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Set up your startup profile from the dashboard to see analytics.
        </p>
      </div>
    );
  }

  const [{ data: gated }, { data: nda }] = await Promise.all([
    supabase.from("startup_gated_data").select("*").eq("startup_id", company.id).maybeSingle(),
    supabase.from("startup_nda_data").select("*").eq("startup_id", company.id).maybeSingle(),
  ]);

  const result = calculateTrustScore(
    company as Company,
    (gated as GatedData | null) ?? null,
    (nda as NdaData | null) ?? null
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How each category contributes to {company.name}&apos;s TrustScore.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              TrustScore
            </p>
            {result.confidence < MIN_DISPLAYABLE_CONFIDENCE ? (
              <p className="mt-1 text-sm text-muted-foreground">Insufficient verified data</p>
            ) : (
              <p className="mt-1 text-4xl font-semibold text-foreground">
                {Math.round(result.score)}
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {Math.round(result.confidence)}% confidence
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Category breakdown</h2>
        <div className="mt-6">
          <AnalyticsChart breakdown={result.breakdown} />
        </div>
      </div>
    </div>
  );
}
