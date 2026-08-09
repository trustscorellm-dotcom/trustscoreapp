"use client";

import { useState } from "react";
import {
  FiGrid,
  FiUser,
  FiBriefcase,
  FiInbox,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardSidebar, type DashboardSectionConfig } from "@/components/DashboardSidebar";
import { TagListInput } from "@/components/TagListInput";
import { Field, SectionCard, SaveButton } from "@/components/DashboardFormElements";
import { LazyImage } from "@/components/LazyImage";
import { useOptimisticSave } from "@/hooks/useOptimisticSave";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import type { Company } from "@/types/startup";
import type { InvestorProfile, PortfolioEntry } from "@/types/investor";

type InvestorSection = "overview" | "profile" | "portfolio" | "requests";

const INVESTOR_SECTIONS: DashboardSectionConfig<InvestorSection>[] = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "profile", label: "Profile", icon: FiUser },
  { id: "portfolio", label: "Portfolio", icon: FiBriefcase },
  { id: "requests", label: "Access Requests", icon: FiInbox },
];

interface InvestorDashboardProps {
  profile: InvestorProfile;
  portfolio: PortfolioEntry[];
}

export function InvestorDashboard({
  profile: initialProfile,
  portfolio: initialPortfolio,
}: InvestorDashboardProps) {
  const [section, setSection] = useState<InvestorSection>("overview");
  const [profile, setProfile] = useState<InvestorProfile>(initialProfile);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(initialPortfolio);

  const profileSave = useOptimisticSave(
    "investor_profiles",
    { user_id: profile.user_id },
    profile,
    setProfile
  );

  async function handleProfileSave() {
    const ok = await profileSave.save(profile);
    if (ok) toast.success("Profile updated");
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <DashboardNav title="Investor Dashboard" />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar sections={INVESTOR_SECTIONS} active={section} onChange={setSection} />

        <div className="flex-1">
          {section === "overview" && (
            <div className="flex flex-col gap-6">
              <SectionCard title="Your profile">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                    {(profile.full_name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {profile.full_name ?? "Unnamed investor"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {[profile.job_title, profile.firm_name].filter(Boolean).join(" at ") ||
                        "Complete your profile to build credibility with founders"}
                    </p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Portfolio">
                <p className="text-sm text-muted-foreground">
                  {portfolio.length === 0
                    ? "You haven't added any portfolio startups yet."
                    : `${portfolio.length} startup${portfolio.length === 1 ? "" : "s"} in your portfolio.`}
                </p>
              </SectionCard>
            </div>
          )}

          {section === "profile" && (
            <SectionCard title="Investor Profile">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  value={profile.full_name}
                  onChange={(v) => setProfile((prev) => ({ ...prev, full_name: v || null }))}
                />
                <Field
                  label="Company / firm name"
                  value={profile.firm_name}
                  onChange={(v) => setProfile((prev) => ({ ...prev, firm_name: v || null }))}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Job title / role"
                  value={profile.job_title}
                  onChange={(v) => setProfile((prev) => ({ ...prev, job_title: v || null }))}
                />
                <Field
                  label="Headquarters location"
                  value={profile.hq_location}
                  onChange={(v) => setProfile((prev) => ({ ...prev, hq_location: v || null }))}
                />
              </div>
              <Field
                label="LinkedIn URL"
                type="url"
                value={profile.linkedin_url}
                onChange={(v) => setProfile((prev) => ({ ...prev, linkedin_url: v || null }))}
              />
              <TagListInput
                label="Investment focus sectors"
                values={profile.focus_sectors ?? []}
                onChange={(values) => setProfile((prev) => ({ ...prev, focus_sectors: values }))}
                placeholder="e.g. Fintech"
              />
              <TagListInput
                label="Investment focus stages"
                values={profile.focus_stages ?? []}
                onChange={(values) => setProfile((prev) => ({ ...prev, focus_stages: values }))}
                placeholder="e.g. Seed"
              />
              <TagListInput
                label="Investment focus geographies"
                values={profile.focus_geographies ?? []}
                onChange={(values) =>
                  setProfile((prev) => ({ ...prev, focus_geographies: values }))
                }
                placeholder="e.g. North America"
              />
              <div className="grid gap-5 sm:grid-cols-3">
                <Field
                  label="Typical ticket size — min (USD)"
                  type="number"
                  value={profile.ticket_size_min}
                  onChange={(v) =>
                    setProfile((prev) => ({ ...prev, ticket_size_min: v ? Number(v) : null }))
                  }
                />
                <Field
                  label="Typical ticket size — max (USD)"
                  type="number"
                  value={profile.ticket_size_max}
                  onChange={(v) =>
                    setProfile((prev) => ({ ...prev, ticket_size_max: v ? Number(v) : null }))
                  }
                />
                <Field
                  label="Years of experience"
                  type="number"
                  value={profile.years_experience}
                  onChange={(v) =>
                    setProfile((prev) => ({ ...prev, years_experience: v ? Number(v) : null }))
                  }
                />
              </div>
              <SaveButton saving={profileSave.saving} onClick={handleProfileSave} />
            </SectionCard>
          )}

          {section === "portfolio" && (
            <PortfolioSection
              investorId={profile.user_id}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
            />
          )}

          {section === "requests" && (
            <SectionCard title="Access Requests">
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <FiInbox size={28} className="text-muted-foreground" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">
                  Access requests aren&apos;t available yet
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Requesting gated or NDA-tier data from founders is still being finalized.
                  Check back soon.
                </p>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioSection({
  investorId,
  portfolio,
  setPortfolio,
}: {
  investorId: string;
  portfolio: PortfolioEntry[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioEntry[]>>;
}) {
  const [supabase] = useState(() => createClient());
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Company[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleSearch(value: string) {
    setQuery(value);
    if (!value.trim()) {
      setResults([]);
      return;
    }
    setSearching(true);
    const { data } = await supabase
      .from("companies")
      .select("*")
      .ilike("name", `%${value.trim()}%`)
      .limit(5);
    setResults((data as Company[] | null) ?? []);
    setSearching(false);
  }

  async function addToPortfolio(company: Company) {
    if (portfolio.some((entry) => entry.company_id === company.id)) return;

    const tempId = `temp-${company.id}`;
    const previous = portfolio;
    setPortfolio((prev) => [
      ...prev,
      {
        id: tempId,
        investor_id: investorId,
        company_id: company.id,
        company,
        created_at: new Date().toISOString(),
      },
    ]);

    const { data, error } = await supabase
      .from("portfolio")
      .insert({ investor_id: investorId, company_id: company.id })
      .select("id")
      .single();

    if (error) {
      setPortfolio(previous);
      toast.error("Couldn't add to portfolio", "Please try again.");
      return;
    }

    setPortfolio((prev) =>
      prev.map((entry) => (entry.id === tempId ? { ...entry, id: data.id as string } : entry))
    );
    toast.success(`${company.name} added to your portfolio`);
  }

  async function removeFromPortfolio(entry: PortfolioEntry) {
    const previous = portfolio;
    setPortfolio((prev) => prev.filter((item) => item.id !== entry.id));

    const { error } = await supabase.from("portfolio").delete().eq("id", entry.id);

    if (error) {
      setPortfolio(previous);
      toast.error("Couldn't remove from portfolio", "Please try again.");
    }
  }

  return (
    <SectionCard title="Portfolio">
      <p className="-mt-2 text-xs text-muted-foreground">
        Mark startups you&apos;ve invested in to build credibility with founders.
      </p>

      <div className="relative">
        <FiSearch
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          size={16}
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => handleSearch(event.target.value)}
          placeholder="Search startups to add..."
          aria-label="Search startups to add to portfolio"
          className="w-full rounded-md border border-border bg-background py-2 pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
        />
      </div>

      {query.trim() && (
        <div className="flex flex-col gap-2">
          {searching ? (
            <p className="text-sm text-muted-foreground">Searching...</p>
          ) : results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No startups found.</p>
          ) : (
            results.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => addToPortfolio(company)}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm hover:bg-muted"
              >
                <span className="text-foreground">{company.name}</span>
                <span className="text-xs text-muted-foreground">Add</span>
              </button>
            ))
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        {portfolio.length === 0 ? (
          <p className="text-sm text-muted-foreground">No portfolio startups yet.</p>
        ) : (
          portfolio.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <LazyImage
                  src={entry.company?.logo_url ?? "/images/logo.png"}
                  alt={`${entry.company?.name ?? "Startup"} logo`}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md object-cover"
                />
                <span className="text-sm font-medium text-foreground">
                  {entry.company?.name ?? "Unknown startup"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFromPortfolio(entry)}
                aria-label={`Remove ${entry.company?.name ?? "startup"} from portfolio`}
                className="text-muted-foreground hover:text-foreground"
              >
                <FiX size={16} aria-hidden="true" />
              </button>
            </div>
          ))
        )}
      </div>
    </SectionCard>
  );
}
