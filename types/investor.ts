import type { Company } from "./startup";

export interface InvestorProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  firm_name: string | null;
  job_title: string | null;
  linkedin_url: string | null;
  hq_location: string | null;
  focus_sectors: string[] | null;
  focus_stages: string[] | null;
  focus_geographies: string[] | null;
  ticket_size_min: number | null;
  ticket_size_max: number | null;
  years_experience: number | null;
  created_at: string;
}

export interface PortfolioEntry {
  id: string;
  investor_id: string;
  company_id: string;
  company: Company | null;
  created_at: string;
}
