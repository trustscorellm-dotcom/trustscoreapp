export type VerificationLevel =
  | "self-reported"
  | "gated-provided"
  | "document-verified"
  | "nda-verified"
  | "investor-backed";

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  founded_date: string | null;
  city: string | null;
  country: string | null;
  sector: string | null;
  subsector: string | null;
  description: string | null;
  focus_area: string | null;
  incubator_accelerator: string | null;
  products: string | null;
  logo_url: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  age: number | null;
  status: string | null;
  verification_level: VerificationLevel;
  trust_score: number | null;
  show_score: boolean;
  created_at: string;
  updated_at: string;
}
