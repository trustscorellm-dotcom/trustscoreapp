import { FiShield, FiCheckCircle } from "react-icons/fi";
import { cn } from "@/lib/utils";
import type { VerificationLevel } from "@/types/startup";
import { VERIFICATION_TIER_LABELS } from "@/utils/constants";

interface VerificationBadgeProps {
  level: VerificationLevel;
  className?: string;
}

const TIER_STYLES: Record<VerificationLevel, string> = {
  "self-reported": "border border-border bg-card text-muted-foreground",
  "gated-provided":
    "border border-brand-chart-blue-3/40 bg-brand-chart-blue-3/10 text-brand-chart-blue-1",
  "document-verified": "border border-primary/40 bg-primary/10 text-primary",
  "nda-verified":
    "border border-brand-success-solid/40 bg-brand-success-solid/10 text-brand-success-solid-dark",
  // The one badge permitted to use Verification Gold, per Section 10's usage rule.
  "investor-backed":
    "border border-brand-gold-end/50 bg-gradient-to-r from-brand-gold-start to-brand-gold-end text-white",
};

export function VerificationBadge({ level, className }: VerificationBadgeProps) {
  const Icon = level === "investor-backed" ? FiCheckCircle : FiShield;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        TIER_STYLES[level],
        className
      )}
    >
      <Icon size={13} aria-hidden="true" />
      {VERIFICATION_TIER_LABELS[level]}
    </span>
  );
}
