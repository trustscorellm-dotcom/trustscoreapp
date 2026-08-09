import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiGlobe, FiMapPin, FiCalendar, FiUsers, FiTrendingUp } from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/VerificationBadge";
import { LazyImage } from "@/components/LazyImage";
import { formatCurrency, formatDate } from "@/utils/formatters";
import type { Company } from "@/types/startup";
import type { GatedData } from "@/types/trustscore";

interface StartupPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StartupPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!company) return { title: "Startup not found" };
  return { title: company.name, description: company.description ?? undefined };
}

export default async function StartupPage({ params }: StartupPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (!company) notFound();

  const startup = company as Company;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = user?.id === startup.owner_id;
  let unlocked = isOwner;
  let gated: GatedData | null = null;

  if (user && !isOwner) {
    const { data: unlock } = await supabase
      .from("profile_unlocks")
      .select("id")
      .eq("investor_id", user.id)
      .eq("startup_id", id)
      .maybeSingle();
    unlocked = Boolean(unlock);
  }

  if (unlocked) {
    const { data } = await supabase
      .from("startup_gated_data")
      .select("*")
      .eq("startup_id", id)
      .maybeSingle();
    gated = data as GatedData | null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LazyImage
            src={startup.logo_url ?? "/images/logo.png"}
            alt={`${startup.name} logo`}
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl border border-border object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {startup.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {[startup.sector, startup.city, startup.country].filter(Boolean).join(" · ") ||
                "Details not yet public"}
            </p>
          </div>
        </div>
        <VerificationBadge level={startup.verification_level} />
      </div>

      {startup.description && (
        <p className="mt-8 text-muted-foreground">{startup.description}</p>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <InfoRow icon={FiCalendar} label="Founded" value={formatDate(startup.founded_date)} />
        <InfoRow
          icon={FiMapPin}
          label="Location"
          value={[startup.city, startup.country].filter(Boolean).join(", ") || "—"}
        />
        <InfoRow
          icon={FiGlobe}
          label="Website"
          value={startup.website ?? "—"}
          href={startup.website ?? undefined}
        />
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            TrustScore
          </p>
          {startup.show_score && startup.trust_score !== null ? (
            <p className="mt-1 text-4xl font-semibold text-foreground">
              {Math.round(startup.trust_score)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Score not public</p>
          )}
        </div>
        {!isOwner && !unlocked && (
          <Link
            href={`/nda/${id}`}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            View more
          </Link>
        )}
      </div>

      {unlocked && (
        <div className="mt-6 rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Gated Data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {isOwner
              ? "Only visible to you and investors you've unlocked this for."
              : "Unlocked — visible only to you among investors."}
          </p>

          {gated ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={FiUsers}
                label="Founding team"
                value={
                  gated.founding_team?.length
                    ? gated.founding_team.map((m) => m.name).join(", ")
                    : "—"
                }
              />
              <InfoRow
                icon={FiUsers}
                label="Number of investors"
                value={
                  gated.number_of_investors !== null ? String(gated.number_of_investors) : "—"
                }
              />
              <InfoRow
                icon={FiTrendingUp}
                label="Revenue"
                value={formatCurrency(gated.revenue, gated.revenue_currency ?? "USD")}
              />
              <InfoRow
                icon={FiTrendingUp}
                label="Profit after tax"
                value={formatCurrency(gated.profit_after_tax, gated.revenue_currency ?? "USD")}
              />
              <InfoRow
                icon={FiTrendingUp}
                label="Valuation"
                value={formatCurrency(gated.valuation, gated.revenue_currency ?? "USD")}
              />
              <InfoRow
                icon={FiTrendingUp}
                label="Runway"
                value={gated.runway_months !== null ? `${gated.runway_months} months` : "—"}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              This startup hasn&apos;t submitted gated-tier data yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof FiCalendar;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <Icon className="text-primary" size={18} aria-hidden="true" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
