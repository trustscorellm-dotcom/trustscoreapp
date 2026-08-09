import type { VerificationLevel } from "@/types/startup";

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/directory", label: "Directory" },
  { href: "/demo", label: "Demo" },
  { href: "/contact", label: "Contact" },
] as const;

export const VERIFICATION_TIER_LABELS: Record<VerificationLevel, string> = {
  "self-reported": "Self-Reported",
  "gated-provided": "Gated Data Provided",
  "document-verified": "Document-Verified",
  "nda-verified": "NDA-Verified",
  "investor-backed": "Investor-Backed",
};
