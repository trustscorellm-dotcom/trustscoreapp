interface ProfileUnlockEmailParams {
  founderEmail: string;
  startupName: string;
  investorName: string | null;
  investorFirm: string | null;
}

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function profileUnlockEmail({
  founderEmail,
  startupName,
  investorName,
  investorFirm,
}: ProfileUnlockEmailParams): EmailPayload {
  const investorLabel = [investorName, investorFirm].filter(Boolean).join(" from ") || "An investor";

  return {
    to: founderEmail,
    subject: `${investorLabel} unlocked ${startupName}'s gated data on TrustScore AI`,
    html: `<p>${investorLabel} just unlocked ${startupName}'s gated-tier data on TrustScore AI.</p><p>This is an informational notice — no action is required on your end.</p>`,
    text: `${investorLabel} just unlocked ${startupName}'s gated-tier data on TrustScore AI. This is an informational notice — no action is required on your end.`,
  };
}
