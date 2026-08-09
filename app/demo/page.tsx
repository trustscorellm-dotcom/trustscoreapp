import type { Metadata } from "next";
import Link from "next/link";
import { LazyImage } from "@/components/LazyImage";

export const metadata: Metadata = {
  title: "Demo",
  description: "See TrustScore AI's dashboard, insights, and verification badges in action.",
};

const SCREENS = [
  {
    src: "/images/demo-dashboard.png",
    title: "Founder dashboard",
    description: "Manage your TrustScore profile and track completeness across every tier.",
  },
  {
    src: "/images/demo-insights.png",
    title: "Score insights",
    description: "See exactly which categories are pulling your score up or down.",
  },
  {
    src: "/images/demo-data-viz.png",
    title: "Category breakdown",
    description: "Visualize how each scoring category contributes to the final TrustScore.",
  },
  {
    src: "/images/demo-badge.png",
    title: "Verification badges",
    description: "Every profile displays its current verification tier at a glance.",
  },
];

export default function DemoPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          See TrustScore AI in action
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A look at the founder dashboard, score breakdowns, and verification badges before
          you create an account.
        </p>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-2">
        {SCREENS.map((screen) => (
          <div key={screen.src} className="flex flex-col gap-3">
            <LazyImage
              src={screen.src}
              alt={screen.title}
              width={520}
              height={360}
              className="w-full rounded-xl border border-border object-cover"
            />
            <h3 className="text-base font-semibold text-foreground">{screen.title}</h3>
            <p className="text-sm text-muted-foreground">{screen.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <Link
          href="/preview"
          className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Preview a sample profile
        </Link>
        <Link href="/register" className="text-sm font-medium text-primary hover:underline">
          Or create your own TrustScore profile →
        </Link>
      </div>
    </div>
  );
}
