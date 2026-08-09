"use client";

import { useState } from "react";
import Link from "next/link";
import { FiShield } from "react-icons/fi";
import { AdminNav } from "@/components/AdminNav";
import { AdminSidebar, type AdminSection } from "@/components/AdminSidebar";
import { SectionCard } from "@/components/DashboardFormElements";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { VERIFICATION_TIER_LABELS } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";
import type { Company, VerificationLevel } from "@/types/startup";
import type { Profile } from "@/types/user";
import type { ProfileUnlock } from "@/types/nda";

export type UnlockWithDetails = ProfileUnlock & {
  company: Company | null;
  investor: { full_name: string | null; firm_name: string | null } | null;
};

interface AdminPanelProps {
  profiles: Profile[];
  companies: Company[];
  unlocks: UnlockWithDetails[];
}

export function AdminPanel({
  profiles,
  companies: initialCompanies,
  unlocks,
}: AdminPanelProps) {
  const [section, setSection] = useState<AdminSection>("overview");
  const [companies, setCompanies] = useState(initialCompanies);
  const [supabase] = useState(() => createClient());

  const founderCount = profiles.filter((p) => p.role === "founder").length;
  const investorCount = profiles.filter((p) => p.role === "investor").length;
  const scoredCompanies = companies.filter((c) => c.trust_score !== null);
  const avgScore =
    scoredCompanies.length > 0
      ? Math.round(
          scoredCompanies.reduce((sum, c) => sum + (c.trust_score ?? 0), 0) /
            scoredCompanies.length
        )
      : null;

  async function updateVerification(company: Company, level: VerificationLevel) {
    const previous = companies;
    setCompanies((prev) =>
      prev.map((c) => (c.id === company.id ? { ...c, verification_level: level } : c))
    );

    const { error } = await supabase
      .from("companies")
      .update({ verification_level: level })
      .eq("id", company.id);

    if (error) {
      setCompanies(previous);
      toast.error("Couldn't update verification tier", "Please try again.");
      return;
    }
    toast.success(`${company.name}'s verification tier updated`);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <AdminNav />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <AdminSidebar active={section} onChange={setSection} />

        <div className="flex-1">
          {section === "overview" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Founders" value={founderCount} />
              <StatCard label="Investors" value={investorCount} />
              <StatCard label="Companies" value={companies.length} />
              <StatCard label="Avg TrustScore" value={avgScore ?? "—"} />
            </div>
          )}

          {section === "users" && (
            <SectionCard title="Users">
              <ResponsiveTable>
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-foreground">{p.full_name ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.email}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{p.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
            </SectionCard>
          )}

          {section === "companies" && (
            <SectionCard title="Companies — Review Queue">
              <ResponsiveTable>
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                    <th className="px-4 py-3 font-medium">Startup</th>
                    <th className="px-4 py-3 font-medium">TrustScore</th>
                    <th className="px-4 py-3 font-medium">Verification tier</th>
                    <th className="px-4 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-foreground">{company.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {company.trust_score !== null ? Math.round(company.trust_score) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={company.verification_level}
                          onChange={(event) =>
                            updateVerification(company, event.target.value as VerificationLevel)
                          }
                          className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          {Object.entries(VERIFICATION_TIER_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/${company.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ResponsiveTable>
            </SectionCard>
          )}

          {section === "nda-audit" && (
            <SectionCard title="NDA Audit">
              <p className="-mt-2 text-xs text-muted-foreground">
                A read-only log of gated-data unlocks. Unlocking is immediate and
                self-service (Section 16) — there&apos;s no approval step for admins to act on
                here.
              </p>
              {unlocks.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-10 text-center">
                  <FiShield size={28} className="text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm font-medium text-foreground">No unlocks yet</p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Investor unlocks of gated startup data will appear here as they happen.
                  </p>
                </div>
              ) : (
                <ResponsiveTable>
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                      <th className="px-4 py-3 font-medium">Investor</th>
                      <th className="px-4 py-3 font-medium">Startup</th>
                      <th className="px-4 py-3 font-medium">Unlocked at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unlocks.map((unlock) => (
                      <tr key={unlock.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 text-foreground">
                          {[unlock.investor?.full_name, unlock.investor?.firm_name]
                            .filter(Boolean)
                            .join(" · ") || "Unknown investor"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {unlock.company?.name ?? "Unknown startup"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(unlock.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </ResponsiveTable>
              )}
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
