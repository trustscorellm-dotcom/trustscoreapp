import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/VerificationBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

interface AdminCompanyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Review Startup",
};

export default async function AdminCompanyPage({ params }: AdminCompanyPageProps) {
  const { id } = await params;
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
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: company }, { data: gated }, { data: nda }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", id).maybeSingle(),
    supabase.from("startup_gated_data").select("*").eq("startup_id", id).maybeSingle(),
    supabase.from("startup_nda_data").select("*").eq("startup_id", id).maybeSingle(),
  ]);

  if (!company) notFound();

  const typedCompany = company as Company;
  const typedGated = gated as GatedData | null;
  const typedNda = nda as NdaData | null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <FiArrowLeft size={14} aria-hidden="true" />
        Back to admin panel
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{typedCompany.name}</h1>
        <VerificationBadge level={typedCompany.verification_level} />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <DetailCard
          title="Public"
          rows={[
            ["Sector", typedCompany.sector ?? "—"],
            ["City", typedCompany.city ?? "—"],
            ["Country", typedCompany.country ?? "—"],
            ["Founded", formatDate(typedCompany.founded_date)],
            [
              "TrustScore",
              typedCompany.trust_score !== null
                ? String(Math.round(typedCompany.trust_score))
                : "—",
            ],
          ]}
        />
        <DetailCard
          title="Gated"
          rows={
            typedGated
              ? [
                  [
                    "Revenue",
                    formatCurrency(typedGated.revenue, typedGated.revenue_currency ?? "USD"),
                  ],
                  [
                    "Profit after tax",
                    formatCurrency(
                      typedGated.profit_after_tax,
                      typedGated.revenue_currency ?? "USD"
                    ),
                  ],
                  [
                    "Investors",
                    typedGated.number_of_investors !== null
                      ? String(typedGated.number_of_investors)
                      : "—",
                  ],
                  [
                    "Founding team",
                    typedGated.founding_team?.length
                      ? `${typedGated.founding_team.length} member(s)`
                      : "—",
                  ],
                ]
              : [["Status", "No gated data submitted"]]
          }
        />
        <DetailCard
          title="NDA"
          rows={
            typedNda
              ? [
                  [
                    "Total investment",
                    formatCurrency(
                      typedNda.total_investment,
                      typedNda.total_investment_currency ?? "USD"
                    ),
                  ],
                  [
                    "Total loans",
                    formatCurrency(typedNda.total_loans, typedNda.total_loans_currency ?? "USD"),
                  ],
                  ["Assets", formatCurrency(typedNda.assets, typedNda.assets_currency ?? "USD")],
                  ["IP count", typedNda.ip_count !== null ? String(typedNda.ip_count) : "—"],
                ]
              : [["Status", "No NDA data submitted"]]
          }
        />
      </div>
    </div>
  );
}

function DetailCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <dl className="mt-4 flex flex-col gap-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
