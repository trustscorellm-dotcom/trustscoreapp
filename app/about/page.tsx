import type { Metadata } from "next";
import Link from "next/link";
import { FiFileText, FiCpu, FiBarChart2 } from "react-icons/fi";
import { LazyImage } from "@/components/LazyImage";

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

export default function AboutPage() {
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
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {PROCESS_STEPS.map((step) => (
            <div key={step.title} className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <step.icon size={22} aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
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
