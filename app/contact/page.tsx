import type { Metadata } from "next";
import { FiMail, FiMessageSquare, FiBriefcase } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the TrustScore AI team.",
};

const REASONS = [
  {
    icon: FiMessageSquare,
    title: "General support",
    description: "Questions about your profile, score, or account.",
  },
  {
    icon: FiBriefcase,
    title: "Partnerships",
    description: "Incubators, accelerators, and ecosystem partners.",
  },
  {
    icon: FiMail,
    title: "Press & media",
    description: "Interview requests and press inquiries.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Get in touch
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
        Reach out and we&apos;ll route your message to the right person on the team.
      </p>

      <div className="mt-12 grid gap-6 text-left sm:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="rounded-xl border border-border bg-card p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <reason.icon size={18} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-base font-semibold text-foreground">{reason.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{reason.description}</p>
          </div>
        ))}
      </div>

      <a
        href="mailto:trustscore.llm@gmail.com"
        className="mt-12 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <FiMail size={16} aria-hidden="true" />
        trustscore.llm@gmail.com
      </a>
    </div>
  );
}
