// Section 16.2 (Version B, auto-save/no-approval): a "profile unlock" is the only
// record this flow needs — one row per investor-startup pair, no approval state.
export interface ProfileUnlock {
  id: string;
  investor_id: string;
  startup_id: string;
  created_at: string;
}
