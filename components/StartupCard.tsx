import Link from "next/link";
import { LazyImage } from "@/components/LazyImage";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { Company } from "@/types/startup";

interface StartupCardProps {
  company: Company;
}

export function StartupCard({ company }: StartupCardProps) {
  return (
    <Link
      href={`/startup/${company.id}`}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <LazyImage
          src={company.logo_url ?? "/images/logo.png"}
          alt={`${company.name} logo`}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {company.name}
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {[company.sector, company.city].filter(Boolean).join(" · ") ||
              "Sector & location not set"}
          </p>
        </div>
      </div>

      {company.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {company.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <VerificationBadge level={company.verification_level} />
        {company.show_score && company.trust_score !== null ? (
          <div className="text-right">
            <p className="text-lg leading-none font-semibold text-foreground">
              {Math.round(company.trust_score)}
            </p>
            <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
              TrustScore
            </p>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Score not public</p>
        )}
      </div>
    </Link>
  );
}
