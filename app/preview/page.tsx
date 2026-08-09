import type { Metadata } from "next";
import Link from "next/link";
import { FiGlobe, FiMapPin, FiCalendar } from "react-icons/fi";
import { VerificationBadge } from "@/components/VerificationBadge";
import { LazyImage } from "@/components/LazyImage";

export const metadata: Metadata = {
  title: "Preview",
  description: "A sample TrustScore profile — see the format before creating an account.",
};

const SAMPLE_STARTUP = {
  name: "Aurora Health",
  sector: "HealthTech",
  city: "Austin",
  country: "United States",
  founded: "March 2022",
  description:
    "A remote patient-monitoring platform for chronic care clinics, combining wearable data with clinician review workflows.",
  trustScore: 82,
  verification: "document-verified" as const,
};

export default function PreviewPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="rounded-lg border border-dashed border-border bg-card px-4 py-2 text-center text-xs font-medium text-muted-foreground">
        Sample profile — for illustration only
      </div>

      <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <LazyImage
            src="/images/logo.png"
            alt="Sample startup logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl border border-border object-cover"
          />
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {SAMPLE_STARTUP.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {SAMPLE_STARTUP.sector} · {SAMPLE_STARTUP.city}, {SAMPLE_STARTUP.country}
            </p>
          </div>
        </div>
        <VerificationBadge level={SAMPLE_STARTUP.verification} />
      </div>

      <p className="mt-8 text-muted-foreground">{SAMPLE_STARTUP.description}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <FiCalendar className="text-primary" size={18} aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">Founded</p>
            <p className="text-sm font-medium text-foreground">{SAMPLE_STARTUP.founded}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <FiMapPin className="text-primary" size={18} aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">Location</p>
            <p className="text-sm font-medium text-foreground">
              {SAMPLE_STARTUP.city}, {SAMPLE_STARTUP.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <FiGlobe className="text-primary" size={18} aria-hidden="true" />
          <div>
            <p className="text-xs text-muted-foreground">Website</p>
            <p className="text-sm font-medium text-foreground">example.com</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            TrustScore
          </p>
          <p className="mt-1 text-4xl font-semibold text-foreground">
            {SAMPLE_STARTUP.trustScore}
          </p>
        </div>
        <Link
          href="/register"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Build your own profile
        </Link>
      </div>
    </div>
  );
}
