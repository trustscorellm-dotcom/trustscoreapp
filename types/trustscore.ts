export interface FoundingTeamMember {
  name: string;
  age?: number;
}

export interface AngelInvestor {
  name: string;
}

export interface VcRound {
  firm: string;
  amount?: number;
}

export interface GovFunding {
  agency: string;
  amount?: number;
}

export interface GatedData {
  id: string;
  startup_id: string;
  accelerator: string | null;
  founding_team: FoundingTeamMember[] | null;
  angel_investors: AngelInvestor[] | null;
  vc_rounds: VcRound[] | null;
  gov_funding: GovFunding[] | null;
  revenue: number | null;
  revenue_currency: string | null;
  profit_after_tax: number | null;
  employee_compensation: number | null;
  number_of_investors: number | null;
  monthly_burn_rate: number | null;
  runway_months: number | null;
  valuation: number | null;
  updated_at: string | null;
}

export interface Patent {
  title: string;
}

export interface TradeSecret {
  description: string;
}

export interface LatestRound {
  round: string;
  amount?: number;
  date?: string;
}

export interface FinancingAgency {
  name: string;
}

export interface Competitor {
  name: string;
}

export interface NdaData {
  id: string;
  startup_id: string;
  ip_count: number | null;
  trademark_count: number | null;
  patents: Patent[] | null;
  trade_secrets: TradeSecret[] | null;
  latest_round: LatestRound | null;
  total_investment: number | null;
  total_investment_currency: string | null;
  total_loans: number | null;
  total_loans_currency: string | null;
  assets: number | null;
  assets_currency: string | null;
  financing_agencies: FinancingAgency[] | null;
  competitors: Competitor[] | null;
  updated_at: string | null;
}

// Additive companion output alongside score/confidence — Section 11.6 explicitly
// allows this kind of extra, informational breakdown without altering the score
// formula itself. Powers the analytics category chart.
export interface CategoryBreakdown {
  category: string;
  label: string;
  score: number;
  weight: number;
}

export interface TrustScoreResult {
  score: number;
  confidence: number;
  breakdown: CategoryBreakdown[];
}
