import type { Metadata } from "next";
import Link from "next/link";
import {
  FiFileText,
  FiCpu,
  FiBarChart2,
  FiShield,
  FiLock,
  FiRefreshCw,
  FiUsers,
  FiUser,
} from "react-icons/fi";
import { LazyImage } from "@/components/LazyImage";
import { ResponsiveGrid } from "@/components/ResponsiveGrid";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "About",
  description:
    "TrustScore AI converts fragmented startup evidence into structured, explainable, investor-ready trust signals.",
};

const PROCESS_STEPS = [
  {
    icon: FiFileText,
    title: "Collect evidence",
    description:
      "Founders build a structured profile from business details, traction, and documents.",
  },
  {
    icon: FiCpu,
    title: "Analyze signals",
    description: "AI extracts and classifies what's present, missing, or still unverified.",
  },
  {
    icon: FiBarChart2,
    title: "Generate the score",
    description: "Evidence is weighted by confidence tier into one explainable TrustScore.",
  },
];

const FEATURES = [
  {
    icon: FiBarChart2,
    title: "Explainable scoring",
    description:
      "See exactly which categories and evidence drive your score — never a black-box number.",
  },
  {
    icon: FiShield,
    title: "Tiered verification",
    description:
      "Public, gated, and NDA-tier data each carry their own confidence weight in the score.",
  },
  {
    icon: FiLock,
    title: "Confidential by design",
    description:
      "NDA-tier data is used only for scoring — never shown to investors, even after unlocking.",
  },
  {
    icon: FiRefreshCw,
    title: "Real-time sync",
    description:
      "Edit your profile and see your TrustScore update immediately, backed by Supabase.",
  },
  {
    icon: FiFileText,
    title: "Structured evidence",
    description:
      "Turn scattered pitch decks and conversations into one organized trust profile.",
  },
  {
    icon: FiUsers,
    title: "Built for every founder",
    description:
      "No elite network required — credibility built on the strength of your evidence.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "TrustScore AI helped us organize eighteen months of scattered traction data into something an investor could actually parse in five minutes.",
    role: "Founder, seed-stage SaaS startup",
  },
  {
    quote:
      "I stopped asking for the same three spreadsheets from every founder I met. The tiered evidence model does that work for me.",
    role: "Angel investor",
  },
  {
    quote:
      "The confidence index changed how we present ourselves — a 70 backed by real financials reads completely differently than a 70 with no data behind it.",
    role: "Founder, early-stage fintech startup",
  },
];

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ count: startupCount }, { count: investorCount }, { count: scoredCount }] =
    await Promise.all([
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase.from("investor_profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .not("trust_score", "is", null),
    ]);

  const STATS = [
    { label: "Startups on the platform", value: startupCount ?? 0 },
    { label: "Investors on the platform", value: investorCount ?? 0 },
    { label: "TrustScores calculated", value: scoredCount ?? 0 },
    { label: "Weighted scoring categories", value: 6 },
  ];

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-16 text-center sm:px-6 lg:pt-24">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          A pre-due-diligence layer for entrepreneurial ecosystems
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          TrustScore AI organizes startup evidence into structured, explainable trust
          signals — helping founders build credibility and helping investors reduce
          due-diligence friction.
        </p>
        <LazyImage
          src="/images/about-hero.png"
          alt="TrustScore AI platform overview"
          width={960}
          height={480}
          priority
          className="w-full max-w-3xl rounded-xl border border-border object-cover"
        />
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Mission</h2>
            <p className="mt-3 text-muted-foreground">
              Convert fragmented startup evidence into structured, explainable, and
              investor-ready trust signals — so founders without elite networks or warm
              introductions can still build credibility on the strength of their evidence.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Vision</h2>
            <p className="mt-3 text-muted-foreground">
              A trusted intelligence layer for entrepreneurial ecosystems, where startups
              build credibility, investors reduce due-diligence friction, and institutions
              support ventures with greater transparency, speed, and confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
          How TrustScore works
        </h2>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
            {PROCESS_STEPS.map((step) => (
              <div key={step.title} className="flex flex-col items-center gap-3 text-center lg:flex-row lg:items-start lg:text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <step.icon size={22} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <LazyImage
            src="/images/trustscore-diagram.png"
            alt="Diagram of the TrustScore calculation pipeline"
            width={560}
            height={420}
            className="w-full rounded-xl border border-border object-cover"
          />
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
            Key features
          </h2>
          <ResponsiveGrid className="mt-10" columns={{ base: 1, sm: 2, lg: 3 }}>
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-background p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon size={18} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <ResponsiveGrid columns={{ base: 1, sm: 2, lg: 4 }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </ResponsiveGrid>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-2xl font-semibold text-foreground sm:text-3xl">
            What people are saying
          </h2>
          <ResponsiveGrid className="mt-10" columns={{ base: 1, sm: 1, lg: 3 }}>
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.role}
                className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6"
              >
                <blockquote className="text-sm text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <FiUser size={16} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{testimonial.role}</span>
                </figcaption>
              </figure>
            ))}
          </ResponsiveGrid>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Want the full picture?
          </h2>
          <p className="max-w-xl text-muted-foreground">
            See the verification tiers and scoring categories in detail on the How It Works
            page.
          </p>
          <Link
            href="/how-it-works"
            className="mt-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            See how it works
          </Link>
        </div>
      </section>
    </div>
  );
}
