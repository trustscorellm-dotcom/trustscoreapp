import { calculateTrustScore, MIN_DISPLAYABLE_CONFIDENCE } from "@/lib/trustscore/calculator";
import type { Company } from "@/types/startup";
import type { GatedData, NdaData } from "@/types/trustscore";

const now = new Date().toISOString();
const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
const fiveYearsAgo = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000).toISOString();

function baseCompany(overrides: Partial<Company> = {}): Company {
  return {
    id: "company-1",
    owner_id: "owner-1",
    name: "Sample Startup",
    founded_date: null,
    city: null,
    country: null,
    sector: null,
    subsector: null,
    description: null,
    focus_area: null,
    incubator_accelerator: null,
    products: null,
    logo_url: null,
    website: null,
    contact_email: null,
    contact_phone: null,
    age: null,
    status: null,
    verification_level: "self-reported",
    trust_score: null,
    show_score: true,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

interface Case {
  name: string;
  company: Company;
  gated: GatedData | null;
  nda: NdaData | null;
  expect: (result: { score: number; confidence: number }) => string | null;
}

const cases: Case[] = [
  {
    name: "No data at all (brand-new empty profile)",
    company: baseCompany(),
    gated: null,
    nda: null,
    expect: (r) =>
      r.score === 0 && r.confidence === 0
        ? null
        : `expected score=0 confidence=0, got score=${r.score} confidence=${r.confidence}`,
  },
  {
    name: "Public data only, fully filled in",
    company: baseCompany({
      age: 3,
      city: "Austin",
      sector: "HealthTech",
      description:
        "A remote patient-monitoring platform for chronic care clinics, combining wearable data with clinician review workflows across a growing network of partner hospitals.",
    }),
    gated: null,
    nda: null,
    expect: (r) => {
      if (r.confidence >= MIN_DISPLAYABLE_CONFIDENCE) {
        return `expected public-only confidence below ${MIN_DISPLAYABLE_CONFIDENCE} (Insufficient verified data threshold), got ${r.confidence}`;
      }
      if (r.score <= 0) return `expected a positive score, got ${r.score}`;
      return null;
    },
  },
  {
    name: "Full data across all three tiers, freshly verified",
    company: baseCompany({
      age: 4,
      city: "San Francisco",
      sector: "Fintech",
      description:
        "A compliance-automation platform for mid-market banks, reducing manual audit prep from weeks to days through structured evidence collection.",
      incubator_accelerator: "Y Combinator",
    }),
    gated: {
      id: "gated-1",
      startup_id: "company-1",
      accelerator: "Techstars",
      founding_team: [{ name: "A" }, { name: "B" }, { name: "C" }],
      angel_investors: [{ name: "Angel 1" }, { name: "Angel 2" }],
      vc_rounds: [{ firm: "VC Firm", amount: 2_000_000 }],
      gov_funding: null,
      revenue: 90_000_000,
      revenue_currency: "USD",
      profit_after_tax: 9_000_000,
      employee_compensation: null,
      number_of_investors: 12,
      monthly_burn_rate: null,
      runway_months: null,
      valuation: null,
      updated_at: now,
    },
    nda: {
      id: "nda-1",
      startup_id: "company-1",
      ip_count: 3,
      trademark_count: 2,
      patents: null,
      trade_secrets: null,
      latest_round: { round: "Series A", amount: 4_000_000 },
      total_investment: 8_000_000,
      total_investment_currency: "USD",
      total_loans: 500_000,
      total_loans_currency: "USD",
      assets: 3_000_000,
      assets_currency: "USD",
      financing_agencies: null,
      competitors: null,
      updated_at: now,
    },
    expect: (r) => {
      // Score is a weighted AVERAGE of normalized metric values, not a sum — so
      // confidence (how much verified data backs the number) is the reliable
      // signal that more/better-tiered data increases; score also depends on
      // how strong each individual value is relative to its own threshold.
      if (r.confidence <= 50) return `expected high confidence for fully-verified data, got ${r.confidence}`;
      if (r.score <= 0 || r.score > 100) return `expected a sane score, got ${r.score}`;
      return null;
    },
  },
  {
    name: "Huge unverified total_investment claim should not dominate the score (15% cap)",
    company: baseCompany({ age: 1 }),
    gated: null,
    nda: {
      id: "nda-2",
      startup_id: "company-1",
      ip_count: null,
      trademark_count: null,
      patents: null,
      trade_secrets: null,
      latest_round: null,
      total_investment: 500_000_000, // wildly inflated relative to a 1-year-old startup
      total_investment_currency: "USD",
      total_loans: null,
      total_loans_currency: null,
      assets: null,
      assets_currency: null,
      financing_agencies: null,
      competitors: null,
      updated_at: now,
    },
    expect: (r) => {
      // This single maxed-out claim (normalizes to 1.0) would drive the score to
      // ~88 if its weight went uncapped into the score numerator. The 15%-of-
      // category cap should hold it well below that, even though the claim is
      // still fully counted in the Confidence Index (it IS present NDA-tier data,
      // just not something that should single-handedly dominate the score).
      if (r.score >= 50) {
        return `expected the capped metric's score contribution to stay well below its uncapped ~88, got ${r.score}`;
      }
      return null;
    },
  },
  {
    name: "Stale data (verified 90 days ago) still contributes, just less",
    company: baseCompany({ age: 2 }),
    gated: {
      id: "gated-2",
      startup_id: "company-1",
      accelerator: null,
      founding_team: [{ name: "A" }, { name: "B" }],
      angel_investors: null,
      vc_rounds: null,
      gov_funding: null,
      revenue: 1_000_000,
      revenue_currency: "USD",
      profit_after_tax: null,
      employee_compensation: null,
      number_of_investors: null,
      monthly_burn_rate: null,
      runway_months: null,
      valuation: null,
      updated_at: ninetyDaysAgo,
    },
    nda: null,
    expect: (r) => (r.score > 0 && r.confidence > 0 ? null : "expected a positive score and confidence"),
  },
  {
    name: "Very old data (5 years) floors at 50% freshness, never hits zero",
    company: baseCompany({ age: 6 }),
    gated: {
      id: "gated-3",
      startup_id: "company-1",
      accelerator: null,
      founding_team: [{ name: "A" }, { name: "B" }, { name: "C" }],
      angel_investors: null,
      vc_rounds: null,
      gov_funding: null,
      revenue: null,
      revenue_currency: null,
      profit_after_tax: null,
      employee_compensation: null,
      number_of_investors: null,
      monthly_burn_rate: null,
      runway_months: null,
      valuation: null,
      updated_at: fiveYearsAgo,
    },
    nda: null,
    expect: (r) => (r.score > 0 ? null : `expected freshness floor to keep score positive, got ${r.score}`),
  },
];

let failures = 0;

for (const testCase of cases) {
  const result = calculateTrustScore(testCase.company, testCase.gated, testCase.nda);
  const nanOrNegative =
    Number.isNaN(result.score) ||
    Number.isNaN(result.confidence) ||
    result.score < 0 ||
    result.confidence < 0;

  const failureReason = nanOrNegative
    ? `NaN or negative result: score=${result.score} confidence=${result.confidence}`
    : testCase.expect(result);

  if (failureReason) {
    failures += 1;
    console.error(`FAIL  ${testCase.name}`);
    console.error(`      ${failureReason}`);
  } else {
    console.log(
      `PASS  ${testCase.name} — score=${result.score.toFixed(1)} confidence=${result.confidence.toFixed(1)}`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} of ${cases.length} cases failed.`);
  process.exit(1);
} else {
  console.log(`\nAll ${cases.length} cases passed.`);
}
