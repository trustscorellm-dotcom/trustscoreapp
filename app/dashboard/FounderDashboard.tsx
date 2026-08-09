"use client";

import { useEffect, useState } from "react";
import { FiGrid, FiUser, FiLock, FiShield, FiRefreshCw } from "react-icons/fi";
import { DashboardNav } from "@/components/DashboardNav";
import { DashboardSidebar, type DashboardSectionConfig } from "@/components/DashboardSidebar";
import { VerificationBadge } from "@/components/VerificationBadge";
import { TagListInput } from "@/components/TagListInput";
import { Field, SectionCard, SaveButton } from "@/components/DashboardFormElements";
import { useOptimisticSave } from "@/hooks/useOptimisticSave";
import { toast } from "@/components/ui/toast";
import { MIN_DISPLAYABLE_CONFIDENCE } from "@/lib/trustscore/calculator";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

interface FounderDashboardProps {
  company: Company;
  gated: GatedData | null;
  nda: NdaData | null;
}

function emptyGated(startupId: string): GatedData {
  return {
    id: "",
    startup_id: startupId,
    accelerator: null,
    founding_team: null,
    angel_investors: null,
    vc_rounds: null,
    gov_funding: null,
    revenue: null,
    revenue_currency: "USD",
    profit_after_tax: null,
    employee_compensation: null,
    number_of_investors: null,
    monthly_burn_rate: null,
    runway_months: null,
    valuation: null,
    updated_at: null,
  };
}

function emptyNda(startupId: string): NdaData {
  return {
    id: "",
    startup_id: startupId,
    ip_count: null,
    trademark_count: null,
    patents: null,
    trade_secrets: null,
    latest_round: null,
    total_investment: null,
    total_investment_currency: "USD",
    total_loans: null,
    total_loans_currency: "USD",
    assets: null,
    assets_currency: "USD",
    financing_agencies: null,
    competitors: null,
    updated_at: null,
  };
}

type FounderSection = "overview" | "profile" | "gated" | "nda";

const FOUNDER_SECTIONS: DashboardSectionConfig<FounderSection>[] = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "profile", label: "Public Profile", icon: FiUser },
  { id: "gated", label: "Gated Data", icon: FiLock },
  { id: "nda", label: "NDA Data", icon: FiShield },
];

export function FounderDashboard({
  company: initialCompany,
  gated: initialGated,
  nda: initialNda,
}: FounderDashboardProps) {
  const [section, setSection] = useState<FounderSection>("overview");
  const [company, setCompany] = useState<Company>(initialCompany);
  const [gated, setGated] = useState<GatedData>(initialGated ?? emptyGated(initialCompany.id));
  const [nda, setNda] = useState<NdaData>(initialNda ?? emptyNda(initialCompany.id));
  const [confidence, setConfidence] = useState<number | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  const companySave = useOptimisticSave("companies", { id: company.id }, company, setCompany);
  const gatedSave = useOptimisticSave(
    "startup_gated_data",
    { startup_id: company.id },
    gated,
    setGated,
    { upsert: true, onConflict: "startup_id" }
  );
  const ndaSave = useOptimisticSave(
    "startup_nda_data",
    { startup_id: company.id },
    nda,
    setNda,
    { upsert: true, onConflict: "startup_id" }
  );

  async function recalculate() {
    setRecalculating(true);
    try {
      const response = await fetch("/api/calculate-trustscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: company.id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to calculate score");
      setCompany((prev) => ({ ...prev, trust_score: data.score }));
      setConfidence(data.confidence);
    } catch (error) {
      toast.error(
        "Couldn't recalculate your TrustScore",
        error instanceof Error ? error.message : undefined
      );
    } finally {
      setRecalculating(false);
    }
  }

  // Recompute once on load so the Overview tab has a live confidence value,
  // not just the last-persisted score (Section 11's Confidence Index is
  // additive/derived, not itself stored on `companies`).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount to hydrate the live confidence value; state updates happen in the async continuation, not synchronously during render.
    recalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleProfileSave() {
    const ok = await companySave.save(company);
    if (ok) {
      toast.success("Profile updated");
      recalculate();
    }
  }

  async function handleGatedSave() {
    const ok = await gatedSave.save(gated);
    if (ok) {
      toast.success("Gated data updated");
      recalculate();
    }
  }

  async function handleNdaSave() {
    const ok = await ndaSave.save(nda);
    if (ok) {
      toast.success("NDA data updated");
      recalculate();
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <DashboardNav title="Founder Dashboard" />

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar sections={FOUNDER_SECTIONS} active={section} onChange={setSection} />

        <div className="flex-1">
          {section === "overview" && (
            <div className="flex flex-col gap-6">
              <SectionCard title="Your TrustScore">
                <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    {confidence !== null && confidence < MIN_DISPLAYABLE_CONFIDENCE ? (
                      <p className="text-sm text-muted-foreground">
                        Insufficient verified data — add more profile, gated, or NDA
                        information to generate a score.
                      </p>
                    ) : (
                      <>
                        <p className="text-4xl font-semibold text-foreground">
                          {company.trust_score !== null ? Math.round(company.trust_score) : "—"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {confidence !== null
                            ? `${Math.round(confidence)}% confidence`
                            : "Calculating confidence..."}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <VerificationBadge level={company.verification_level} />
                    <button
                      type="button"
                      onClick={recalculate}
                      disabled={recalculating}
                      aria-label="Recalculate TrustScore"
                      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
                    >
                      <FiRefreshCw
                        size={14}
                        aria-hidden="true"
                        className={recalculating ? "animate-spin" : undefined}
                      />
                      Recalculate
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Profile completeness">
                <ul className="flex flex-col gap-3 text-sm">
                  <li className="flex items-center justify-between">
                    <span className="text-foreground">Public profile</span>
                    <span className="text-muted-foreground">
                      {company.description && company.sector ? "Complete" : "Needs attention"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-foreground">Gated data</span>
                    <span className="text-muted-foreground">
                      {gated.revenue !== null || gated.founding_team ? "Started" : "Not started"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-foreground">NDA data</span>
                    <span className="text-muted-foreground">
                      {nda.total_investment !== null || nda.ip_count !== null
                        ? "Started"
                        : "Not started"}
                    </span>
                  </li>
                </ul>
              </SectionCard>
            </div>
          )}

          {section === "profile" && (
            <SectionCard title="Public Profile">
              <Field
                label="Startup name"
                value={company.name}
                onChange={(v) => setCompany((prev) => ({ ...prev, name: v }))}
              />
              <Field
                label="Founded date"
                type="date"
                value={company.founded_date}
                onChange={(v) => setCompany((prev) => ({ ...prev, founded_date: v || null }))}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="City"
                  value={company.city}
                  onChange={(v) => setCompany((prev) => ({ ...prev, city: v || null }))}
                />
                <Field
                  label="Country"
                  value={company.country}
                  onChange={(v) => setCompany((prev) => ({ ...prev, country: v || null }))}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Sector"
                  value={company.sector}
                  onChange={(v) => setCompany((prev) => ({ ...prev, sector: v || null }))}
                />
                <Field
                  label="Sub-sector"
                  value={company.subsector}
                  onChange={(v) => setCompany((prev) => ({ ...prev, subsector: v || null }))}
                />
              </div>
              <Field
                label="Description"
                textarea
                value={company.description}
                onChange={(v) => setCompany((prev) => ({ ...prev, description: v || null }))}
              />
              <Field
                label="Focus area"
                value={company.focus_area}
                onChange={(v) => setCompany((prev) => ({ ...prev, focus_area: v || null }))}
              />
              <Field
                label="Incubator / accelerator"
                value={company.incubator_accelerator}
                onChange={(v) =>
                  setCompany((prev) => ({ ...prev, incubator_accelerator: v || null }))
                }
              />
              <Field
                label="Products"
                textarea
                value={company.products}
                onChange={(v) => setCompany((prev) => ({ ...prev, products: v || null }))}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Website"
                  type="url"
                  value={company.website}
                  onChange={(v) => setCompany((prev) => ({ ...prev, website: v || null }))}
                />
                <Field
                  label="Contact email"
                  type="email"
                  value={company.contact_email}
                  onChange={(v) => setCompany((prev) => ({ ...prev, contact_email: v || null }))}
                />
              </div>
              <Field
                label="Contact phone"
                type="tel"
                value={company.contact_phone}
                onChange={(v) => setCompany((prev) => ({ ...prev, contact_phone: v || null }))}
              />
              <SaveButton saving={companySave.saving} onClick={handleProfileSave} />
            </SectionCard>
          )}

          {section === "gated" && (
            <SectionCard title="Gated Data">
              <p className="-mt-2 text-xs text-muted-foreground">
                Shown only to investors who&apos;ve requested and been granted access.
              </p>
              <Field
                label="Accelerator (if separate from public one)"
                value={gated.accelerator}
                onChange={(v) => setGated((prev) => ({ ...prev, accelerator: v || null }))}
              />
              <TagListInput
                label="Founding team"
                values={(gated.founding_team ?? []).map((m) => m.name)}
                onChange={(names) =>
                  setGated((prev) => ({ ...prev, founding_team: names.map((name) => ({ name })) }))
                }
                placeholder="Add a founder's name"
              />
              <TagListInput
                label="Angel investors"
                values={(gated.angel_investors ?? []).map((a) => a.name)}
                onChange={(names) =>
                  setGated((prev) => ({
                    ...prev,
                    angel_investors: names.map((name) => ({ name })),
                  }))
                }
                placeholder="Add an angel investor's name"
              />
              <TagListInput
                label="VC firms / rounds"
                values={(gated.vc_rounds ?? []).map((v) => v.firm)}
                onChange={(names) =>
                  setGated((prev) => ({
                    ...prev,
                    vc_rounds: names.map((firm) => ({ firm })),
                  }))
                }
                placeholder="Add a VC firm's name"
              />
              <TagListInput
                label="Government funding received"
                values={(gated.gov_funding ?? []).map((g) => g.agency)}
                onChange={(names) =>
                  setGated((prev) => ({
                    ...prev,
                    gov_funding: names.map((agency) => ({ agency })),
                  }))
                }
                placeholder="Add a funding agency's name"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Revenue (USD)"
                  type="number"
                  value={gated.revenue}
                  onChange={(v) => setGated((prev) => ({ ...prev, revenue: v ? Number(v) : null }))}
                />
                <Field
                  label="Profit after tax (USD)"
                  type="number"
                  value={gated.profit_after_tax}
                  onChange={(v) =>
                    setGated((prev) => ({ ...prev, profit_after_tax: v ? Number(v) : null }))
                  }
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Employee compensation (USD)"
                  type="number"
                  value={gated.employee_compensation}
                  onChange={(v) =>
                    setGated((prev) => ({
                      ...prev,
                      employee_compensation: v ? Number(v) : null,
                    }))
                  }
                />
                <Field
                  label="Number of investors"
                  type="number"
                  value={gated.number_of_investors}
                  onChange={(v) =>
                    setGated((prev) => ({
                      ...prev,
                      number_of_investors: v ? Number(v) : null,
                    }))
                  }
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Monthly burn rate (USD)"
                  type="number"
                  value={gated.monthly_burn_rate}
                  onChange={(v) =>
                    setGated((prev) => ({ ...prev, monthly_burn_rate: v ? Number(v) : null }))
                  }
                />
                <Field
                  label="Runway (months)"
                  type="number"
                  value={gated.runway_months}
                  onChange={(v) =>
                    setGated((prev) => ({ ...prev, runway_months: v ? Number(v) : null }))
                  }
                />
              </div>
              <Field
                label="Valuation (USD)"
                type="number"
                value={gated.valuation}
                onChange={(v) => setGated((prev) => ({ ...prev, valuation: v ? Number(v) : null }))}
              />
              <SaveButton saving={gatedSave.saving} onClick={handleGatedSave} />
            </SectionCard>
          )}

          {section === "nda" && (
            <SectionCard title="NDA Data">
              <p className="-mt-2 text-xs text-muted-foreground">
                Used only to compute your TrustScore — never shown directly to investors.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="IP count"
                  type="number"
                  value={nda.ip_count}
                  onChange={(v) => setNda((prev) => ({ ...prev, ip_count: v ? Number(v) : null }))}
                />
                <Field
                  label="Trademark count"
                  type="number"
                  value={nda.trademark_count}
                  onChange={(v) =>
                    setNda((prev) => ({ ...prev, trademark_count: v ? Number(v) : null }))
                  }
                />
              </div>
              <TagListInput
                label="Patents"
                values={(nda.patents ?? []).map((p) => p.title)}
                onChange={(titles) =>
                  setNda((prev) => ({ ...prev, patents: titles.map((title) => ({ title })) }))
                }
                placeholder="Add a patent title"
              />
              <TagListInput
                label="Trade secrets"
                values={(nda.trade_secrets ?? []).map((s) => s.description)}
                onChange={(descriptions) =>
                  setNda((prev) => ({
                    ...prev,
                    trade_secrets: descriptions.map((description) => ({ description })),
                  }))
                }
                placeholder="Add a short description"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Latest round"
                  value={nda.latest_round?.round ?? null}
                  onChange={(v) =>
                    setNda((prev) => ({
                      ...prev,
                      latest_round: { ...(prev.latest_round ?? {}), round: v },
                    }))
                  }
                />
                <Field
                  label="Latest round amount (USD)"
                  type="number"
                  value={nda.latest_round?.amount ?? null}
                  onChange={(v) =>
                    setNda((prev) => ({
                      ...prev,
                      latest_round: {
                        ...(prev.latest_round ?? { round: "" }),
                        amount: v ? Number(v) : undefined,
                      },
                    }))
                  }
                />
              </div>
              <Field
                label="Total investment raised (USD)"
                type="number"
                value={nda.total_investment}
                onChange={(v) =>
                  setNda((prev) => ({ ...prev, total_investment: v ? Number(v) : null }))
                }
              />
              <Field
                label="Total loans secured (USD)"
                type="number"
                value={nda.total_loans}
                onChange={(v) => setNda((prev) => ({ ...prev, total_loans: v ? Number(v) : null }))}
              />
              <Field
                label="Assets (USD)"
                type="number"
                value={nda.assets}
                onChange={(v) => setNda((prev) => ({ ...prev, assets: v ? Number(v) : null }))}
              />
              <TagListInput
                label="Financing agencies"
                values={(nda.financing_agencies ?? []).map((a) => a.name)}
                onChange={(names) =>
                  setNda((prev) => ({
                    ...prev,
                    financing_agencies: names.map((name) => ({ name })),
                  }))
                }
                placeholder="Add a financing agency's name"
              />
              <TagListInput
                label="Competitors"
                values={(nda.competitors ?? []).map((c) => c.name)}
                onChange={(names) =>
                  setNda((prev) => ({ ...prev, competitors: names.map((name) => ({ name })) }))
                }
                placeholder="Add a competitor's name"
              />
              <SaveButton saving={ndaSave.saving} onClick={handleNdaSave} />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
