import type { Metadata } from "next";
import {
  FiFileText,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiAward,
  FiUserCheck,
} from "react-icons/fi";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How TrustScore AI weighs evidence across confidence tiers into one explainable score.",
};

const CATEGORIES = [
  {
    icon: FiFileText,
    title: "Company Foundation",
    weight: "20%",
    description: "Age, sector, city, and description quality.",
  },
  {
    icon: FiUsers,
    title: "Team & Leadership",
    weight: "15%",
    description: "Founding team depth and incubator/accelerator backing.",
  },
  {
    icon: FiDollarSign,
    title: "Funding & Investment",
    weight: "20%",
    description: "Total investment, latest round, and secured loans.",
  },
  {
    icon: FiTrendingUp,
    title: "Financial Performance",
    weight: "20%",
    description: "Revenue, profit after tax, and assets.",
  },
  {
    icon: FiAward,
    title: "Intellectual Property",
    weight: "10%",
    description: "Patents and trademarks on record.",
  },
  {
    icon: FiUserCheck,
    title: "Investor Confidence",
    weight: "15%",
    description: "Number and quality of angel and VC backers.",
  },
];

const CONFIDENCE_TIERS = [
  { label: "Public / self-reported", value: "0.40" },
  { label: "Gated (AI-extracted or provided on request)", value: "0.65" },
  { label: "Gated + document-verified", value: "0.85" },
  { label: "NDA data", value: "0.95" },
  { label: "NDA data + third-party/investor-confirmed", value: "1.00" },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          How TrustScore works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A composite score from 0–100, built from six weighted categories and adjusted by
          how confidently each data point was verified.
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold text-foreground">Scoring categories</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <div key={category.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <category.icon size={18} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {category.weight}
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {category.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Confidence multipliers</h2>
          <p className="mt-3 text-muted-foreground">
            Not all data is equally trustworthy just because it&apos;s present. Each source
            carries its own confidence multiplier before it contributes to the score.
          </p>
          <ul className="mt-6 space-y-3">
            {CONFIDENCE_TIERS.map((tier) => (
              <li
                key={tier.label}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
              >
                <span className="text-sm text-foreground">{tier.label}</span>
                <span className="text-sm font-semibold text-primary">{tier.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Freshness & fairness</h2>
          <p className="mt-3 text-muted-foreground">
            Every metric&apos;s contribution decays gently with age — a fact verified 90 days
            ago still counts for roughly 60% of a freshly verified one, with a 50% floor so
            old-but-valid facts never collapse to zero.
          </p>
          <p className="mt-4 text-muted-foreground">
            No single metric can contribute more than 15% of its category&apos;s score, so one
            inflated or gamed field can never dominate the result. When confidence in the
            underlying data is too low, TrustScore AI shows &ldquo;Insufficient verified
            data&rdquo; instead of a number that looks more authoritative than it is.
          </p>
        </div>
      </div>
    </div>
  );
}
