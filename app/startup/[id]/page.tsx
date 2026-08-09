import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiGlobe, FiMapPin, FiCalendar } from "react-icons/fi";
import { createClient } from "@/lib/supabase/server";
import { VerificationBadge } from "@/components/VerificationBadge";
import { LazyImage } from "@/components/LazyImage";
import { formatDate } from "@/utils/formatters";
import type { Company } from "@/types/startup";

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
        <button
          type="button"
          disabled
          title="Investor access requests are coming soon"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground opacity-70"
        >
          View more (coming soon)
        </button>
      </div>
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
