import type { Company } from "@/types/startup";
import type { CategoryBreakdown, GatedData, NdaData, TrustScoreResult } from "@/types/trustscore";

// Confidence multipliers by data source — Section 11.1. Locked.
export const CONFIDENCE = {
  PUBLIC: 0.4,
  GATED: 0.65,
  GATED_VERIFIED: 0.85,
  NDA: 0.95,
  NDA_CONFIRMED: 1.0,
} as const;

// Category weights — Section 11.2. Locked; sum to 1.0 (100%).
const CATEGORY_WEIGHTS = {
  COMPANY_FOUNDATION: 0.2,
  TEAM_LEADERSHIP: 0.15,
  FUNDING_INVESTMENT: 0.2,
  FINANCIAL_PERFORMANCE: 0.2,
  INTELLECTUAL_PROPERTY: 0.1,
  INVESTOR_CONFIDENCE: 0.15,
} as const;

type CategoryKey = keyof typeof CATEGORY_WEIGHTS;

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  COMPANY_FOUNDATION: "Company Foundation",
  TEAM_LEADERSHIP: "Team & Leadership",
  FUNDING_INVESTMENT: "Funding & Investment",
  FINANCIAL_PERFORMANCE: "Financial Performance",
  INTELLECTUAL_PROPERTY: "Intellectual Property",
  INVESTOR_CONFIDENCE: "Investor Confidence",
};

// No single metric may contribute more than 15% of its category's total — Section 11.3/11.5.
const METRIC_CONTRIBUTION_CAP_RATIO = 0.15;

// Below this confidence, the UI shows "Insufficient verified data" instead of the score — Section 11.5.
export const MIN_DISPLAYABLE_CONFIDENCE = 15;

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function daysSince(date: Date): number {
  return Math.max(0, (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

// F = max(0.5, e^(-0.01 * days_since_verified)) — Section 11.3. Floors at 50% so
// old-but-still-valid facts (a patent, a founding date) never decay to zero.
function freshnessFor(verifiedAt: string | null): number {
  if (!verifiedAt) return 0.75;
  const date = new Date(verifiedAt);
  if (Number.isNaN(date.getTime())) return 0.75;
  return Math.max(0.5, Math.exp(-0.01 * daysSince(date)));
}

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

// --- Normalization functions — Section 11.3 ---

function normalizeAge(value: unknown): number {
  const age = toNumber(value);
  if (!Number.isFinite(age) || age <= 0) return 0;
  // Ten years of operating history is treated as "fully established."
  return clamp(age / 10, 0, 1);
}

function normalizeCity(value: unknown): number {
  return typeof value === "string" && value.trim().length > 0 ? 1 : 0;
}

function normalizeSector(value: unknown): number {
  return typeof value === "string" && value.trim().length > 0 ? 1 : 0;
}

function normalizeDescriptionQuality(value: unknown): number {
  const text = typeof value === "string" ? value.trim() : "";
  // A ~200-character description is treated as a complete, substantive summary.
  return clamp(text.length / 200, 0, 1);
}

function normalizeFoundingTeam(value: unknown): number {
  const team = Array.isArray(value) ? value : [];
  // Three or more named founders is treated as a fully-staffed founding team.
  return clamp(team.length / 3, 0, 1);
}

function hasIncubatorAccelerator(value: unknown): number {
  const [publicValue, gatedValue] = Array.isArray(value) ? value : [value, null];
  const has = (v: unknown) => typeof v === "string" && v.trim().length > 0;
  return has(publicValue) || has(gatedValue) ? 1 : 0;
}

function normalizeTotalInvestment(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return clamp(amount / 10_000_000, 0, 1);
}

function normalizeLatestRound(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return clamp(amount / 5_000_000, 0, 1);
}

function normalizeLoans(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return clamp(amount / 2_000_000, 0, 1);
}

function normalizeRevenue(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  // Per Section 11.3's own example: revenue >= 100M -> 1.0, linear below that.
  return clamp(amount / 100_000_000, 0, 1);
}

function normalizeProfit(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return clamp(amount / 10_000_000, 0, 1);
}

function normalizeAssets(value: unknown): number {
  const amount = toNumber(value);
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  return clamp(amount / 20_000_000, 0, 1);
}

function normalizeIP(value: unknown): number {
  const count = toNumber(value);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return clamp(count / 5, 0, 1);
}

function normalizeTrademarks(value: unknown): number {
  const count = toNumber(value);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return clamp(count / 3, 0, 1);
}

function normalizeInvestorCount(value: unknown): number {
  const count = toNumber(value);
  if (!Number.isFinite(count) || count <= 0) return 0;
  return clamp(count / 10, 0, 1);
}

function normalizeAngelVCQuality(value: unknown): number {
  const [angels, vcs] = Array.isArray(value) ? value : [value, null];
  const angelCount = Array.isArray(angels) ? angels.length : 0;
  const vcCount = Array.isArray(vcs) ? vcs.length : 0;
  return clamp((angelCount + vcCount) / 5, 0, 1);
}

function isEffectivelyMissing(rawValue: unknown): boolean {
  if (rawValue === null || rawValue === undefined) return true;
  if (Array.isArray(rawValue)) {
    return rawValue.every((v) => v === null || v === undefined);
  }
  return false;
}

export function calculateTrustScore(
  company: Company,
  gated: GatedData | null,
  nda: NdaData | null
): TrustScoreResult {
  let weightedScore = 0;
  let weightedConfidence = 0;
  let totalPossibleWeight = 0;

  // Per-category accumulators — purely additive bookkeeping alongside the
  // existing totals above, which are computed exactly as before. Powers the
  // breakdown output; does not feed back into score/confidence.
  const categoryTotals: Record<CategoryKey, { score: number; confidence: number }> = {
    COMPANY_FOUNDATION: { score: 0, confidence: 0 },
    TEAM_LEADERSHIP: { score: 0, confidence: 0 },
    FUNDING_INVESTMENT: { score: 0, confidence: 0 },
    FINANCIAL_PERFORMANCE: { score: 0, confidence: 0 },
    INTELLECTUAL_PROPERTY: { score: 0, confidence: 0 },
    INVESTOR_CONFIDENCE: { score: 0, confidence: 0 },
  };

  function scoreMetric(
    rawValue: unknown,
    normalizeFn: (v: unknown) => number,
    weight: number,
    confidence: number,
    verifiedAt: string | null,
    category: CategoryKey
  ) {
    const categoryWeight = CATEGORY_WEIGHTS[category];
    totalPossibleWeight += weight;
    if (isEffectivelyMissing(rawValue)) return;

    const normalized = clamp(normalizeFn(rawValue), 0, 1);
    const freshness = freshnessFor(verifiedAt);
    const effectiveWeight = weight * confidence * freshness;

    // Cap: no single metric may contribute more than 15% of its category's total
    // to the SCORE — this guards against one inflated/gamed field dominating the
    // 0-100 result. It intentionally does not cap the Confidence Index: a fully
    // NDA-verified startup should be able to reach a high confidence value, not
    // be capped at ~15% per metric with only 2-4 metrics per category.
    const cap = categoryWeight * METRIC_CONTRIBUTION_CAP_RATIO;
    const scoreWeight = Math.min(effectiveWeight, cap);

    weightedScore += normalized * scoreWeight;
    weightedConfidence += effectiveWeight;

    categoryTotals[category].score += normalized * scoreWeight;
    categoryTotals[category].confidence += effectiveWeight;
  }

  // 1. Company Foundation (20%)
  scoreMetric(company.age, normalizeAge, 0.05, CONFIDENCE.PUBLIC, null, "COMPANY_FOUNDATION");
  scoreMetric(company.city, normalizeCity, 0.05, CONFIDENCE.PUBLIC, null, "COMPANY_FOUNDATION");
  scoreMetric(company.sector, normalizeSector, 0.05, CONFIDENCE.PUBLIC, null, "COMPANY_FOUNDATION");
  scoreMetric(
    company.description,
    normalizeDescriptionQuality,
    0.05,
    CONFIDENCE.PUBLIC,
    null,
    "COMPANY_FOUNDATION"
  );

  // 2. Team & Leadership (15%)
  scoreMetric(
    gated?.founding_team ?? null,
    normalizeFoundingTeam,
    0.07,
    CONFIDENCE.GATED,
    gated?.updated_at ?? null,
    "TEAM_LEADERSHIP"
  );
  scoreMetric(
    [company.incubator_accelerator, gated?.accelerator ?? null],
    hasIncubatorAccelerator,
    0.08,
    CONFIDENCE.GATED,
    null,
    "TEAM_LEADERSHIP"
  );

  // 3. Funding & Investment (20%)
  scoreMetric(
    nda?.total_investment ?? null,
    normalizeTotalInvestment,
    0.1,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "FUNDING_INVESTMENT"
  );
  scoreMetric(
    nda?.latest_round?.amount ?? null,
    normalizeLatestRound,
    0.05,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "FUNDING_INVESTMENT"
  );
  scoreMetric(
    nda?.total_loans ?? null,
    normalizeLoans,
    0.05,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "FUNDING_INVESTMENT"
  );

  // 4. Financial Performance (20%)
  scoreMetric(
    gated?.revenue ?? null,
    normalizeRevenue,
    0.1,
    CONFIDENCE.GATED_VERIFIED,
    gated?.updated_at ?? null,
    "FINANCIAL_PERFORMANCE"
  );
  scoreMetric(
    gated?.profit_after_tax ?? null,
    normalizeProfit,
    0.05,
    CONFIDENCE.GATED_VERIFIED,
    gated?.updated_at ?? null,
    "FINANCIAL_PERFORMANCE"
  );
  scoreMetric(
    nda?.assets ?? null,
    normalizeAssets,
    0.05,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "FINANCIAL_PERFORMANCE"
  );

  // 5. Intellectual Property (10%)
  scoreMetric(
    nda?.ip_count ?? null,
    normalizeIP,
    0.06,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "INTELLECTUAL_PROPERTY"
  );
  scoreMetric(
    nda?.trademark_count ?? null,
    normalizeTrademarks,
    0.04,
    CONFIDENCE.NDA,
    nda?.updated_at ?? null,
    "INTELLECTUAL_PROPERTY"
  );

  // 6. Investor Confidence (15%)
  scoreMetric(
    gated?.number_of_investors ?? null,
    normalizeInvestorCount,
    0.1,
    CONFIDENCE.GATED,
    gated?.updated_at ?? null,
    "INVESTOR_CONFIDENCE"
  );
  scoreMetric(
    [gated?.angel_investors ?? null, gated?.vc_rounds ?? null],
    normalizeAngelVCQuality,
    0.05,
    CONFIDENCE.GATED,
    gated?.updated_at ?? null,
    "INVESTOR_CONFIDENCE"
  );

  const score =
    weightedConfidence > 0 ? clamp((weightedScore / weightedConfidence) * 100, 0, 100) : 0;

  const confidence =
    totalPossibleWeight > 0
      ? clamp((weightedConfidence / totalPossibleWeight) * 100, 0, 100)
      : 0;

  const breakdown: CategoryBreakdown[] = (
    Object.keys(CATEGORY_WEIGHTS) as CategoryKey[]
  ).map((key) => {
    const totals = categoryTotals[key];
    const categoryScore =
      totals.confidence > 0 ? clamp((totals.score / totals.confidence) * 100, 0, 100) : 0;
    return {
      category: key,
      label: CATEGORY_LABELS[key],
      score: categoryScore,
      weight: CATEGORY_WEIGHTS[key] * 100,
    };
  });

  return { score, confidence, breakdown };
}
