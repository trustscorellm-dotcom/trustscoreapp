export type UserRole = "founder" | "investor" | "admin";

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string | null;
  email: string;
  created_at: string;
}
