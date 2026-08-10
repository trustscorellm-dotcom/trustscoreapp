"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiShield, FiTrendingUp } from "react-icons/fi";
import { LazyImage } from "@/components/LazyImage";
import { VerificationBadge } from "@/components/VerificationBadge";
import type { VerificationLevel } from "@/types/startup";

const VERIFICATION_TIERS: VerificationLevel[] = [
  "self-reported",
  "gated-provided",
  "document-verified",
  "nda-verified",
  "investor-backed",
];

const FEATURES = [
  {
    icon: FiEye,
    title: "Full transparency",
    description:
      "Every score shows exactly which evidence it's built on and what's still missing — never a black-box number.",
    image: "/images/feature-transparency.png",
  },
  {
    icon: FiShield,
    title: "Tiered diligence",
    description:
      "Public, request-access, and NDA-protected data each carry their own confidence weight, so verified claims count more than self-reported ones.",
    image: "/images/feature-diligence.png",
  },
];

function AnimatedScore({ target = 87, className }: { target?: number; className?: string }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = 1400;
    const start = performance.now();

    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return <span className={className}>{value}</span>;
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pt-16 pb-20 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-1 flex-col gap-6 text-center lg:text-left"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Trust signals that hold up to due diligence
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground lg:mx-0">
            TrustScore AI converts fragmented startup evidence — pitch decks, traction,
            financials, team — into a structured, explainable score investors can actually
            rely on.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Build your TrustScore
            </Link>
            <Link
              href="/directory"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Browse the directory
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="relative flex flex-1 flex-col items-center gap-4"
        >
          <LazyImage
            src="/images/hero-mockup.png"
            alt="TrustScore AI dashboard preview"
            width={520}
            height={400}
            priority
            className="w-full max-w-md rounded-xl border border-border object-cover"
          />
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3">
            <FiTrendingUp className="text-brand-success-solid" size={20} aria-hidden="true" />
            <div>
              <p className="text-2xl leading-none font-semibold text-foreground">
                <AnimatedScore target={87} />
              </p>
              <p className="text-xs text-muted-foreground">Sample TrustScore</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-16 sm:px-6 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <LazyImage
              src="/images/problem-monitor.png"
              alt="Founders repeating due diligence across investors"
              width={480}
              height={360}
              className="w-full rounded-xl border border-border object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Startups aren&apos;t rejected for lacking potential — they&apos;re rejected for
              lacking verifiable credibility
            </h2>
            <p className="mt-4 text-muted-foreground">
              Claims about traction, team, and revenue stay scattered across decks and
              conversations, so every investor repeats the same due-diligence process from
              scratch. TrustScore AI organizes that evidence once, so it travels with the
              startup.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
            >
              <LazyImage
                src={feature.image}
                alt={feature.title}
                width={400}
                height={240}
                className="w-full rounded-lg border border-border object-cover"
              />
              <feature.icon className="text-primary" size={22} aria-hidden="true" />
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Five tiers of verification, one honest score
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Every data point is weighted by how it was verified — from a self-reported field
            to a fact confirmed by a third-party investor.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {VERIFICATION_TIERS.map((tier) => (
              <VerificationBadge key={tier} level={tier} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              NDA-tier data stays confidential — always
            </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Your confidential financial and IP data is used solely to generate a startup's TrustScore.
            <br />
            This score is the only output shared , the underlying data remains private and is never 
            exposed to any party, at any stage.
          </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <LazyImage
              src="/images/security-node-network.png"
              alt="Secure data network protecting confidential startup data"
              width={480}
              height={360}
              className="w-full rounded-xl border border-border object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-none px-4 py-16 text-center sm:px-6">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-brand-gold-start to-brand-gold-end" />
          <h2 className="mt-6 text-2xl font-semibold text-foreground sm:text-3xl">
            Ready to make your credibility legible?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Founders build a structured trust profile in minutes. Investors browse
            explainable scores, not raw pitch decks.
          </p>
          <div className="mx-auto mt-10 grid max-w-2xl gap-6 text-left sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <LazyImage
                src="/images/founder-flow-placeholder.png"
                alt="Founder onboarding flow"
                width={320}
                height={200}
                className="w-full rounded-lg border border-border object-cover"
              />
              <p className="text-sm font-medium text-foreground">For founders</p>
            </div>
            <div className="flex flex-col gap-3">
              <LazyImage
                src="/images/investor-flow-placeholder.png"
                alt="Investor matching flow"
                width={320}
                height={200}
                className="w-full rounded-lg border border-border object-cover"
              />
              <p className="text-sm font-medium text-foreground">For investors</p>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              I&apos;m a founder
            </Link>
            <Link
              href="/investor/register"
              className="rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              I&apos;m an investor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
