"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BackgroundPaths } from "@/components/ui/background-paths";
import {
  ArrowRight,
  Activity,
  BarChart2,
  Brain,
  CheckCircle,
  Heart,
  HeartHandshake,
  Lock,
  Microscope,
  Shield,
  Play,
  Sparkles,
  Stethoscope,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const STATS = [
  { value: 96.4, label: "signal confidence", suffix: "%", decimals: 1 },
  { value: 24, label: "monitoring cadence", suffix: "/7", decimals: 0 },
  { value: 38000, label: "health events mapped", suffix: "+", decimals: 0 },
  { value: 120, label: "alert latency", suffix: "ms", decimals: 0 },
];

const FEATURES = [
  {
    icon: Brain,
    title: "Predictive intelligence",
    text: "AI scoring turns symptoms, device streams, and history into ranked care actions.",
  },
  {
    icon: Activity,
    title: "Always-on telemetry",
    text: "Vitals, sensor noise, and change points are tracked in real time without manual refresh.",
  },
  {
    icon: Shield,
    title: "Secure by default",
    text: "Every signal path is encrypted so clinicians can move fast without losing trust.",
  },
  {
    icon: Microscope,
    title: "Clinical clarity",
    text: "Compact charts and decision cards keep the signal visible instead of hiding it in dashboards.",
  },
  {
    icon: Lock,
    title: "Offline resilience",
    text: "Critical workflows keep working when connectivity drops, then sync cleanly when it returns.",
  },
  {
    icon: Zap,
    title: "Fast escalation",
    text: "Risk spikes can trigger alerts, routing, and next-step guidance in one motion.",
  },
];

const WORKFLOW = [
  {
    step: "01",
    title: "Collect the signal",
    text: "Pull symptoms, device readings, and user context into a single experience.",
  },
  {
    step: "02",
    title: "Score what matters",
    text: "Rank the probable outcomes and surface the most urgent paths first.",
  },
  {
    step: "03",
    title: "Act with confidence",
    text: "Guide the user toward the next best action without making them hunt for it.",
  },
];

const TRUST_PILLS = ["AI triage", "IoT sync", "Offline mode", "Care routing", "Encrypted data"];

const SIGNAL_STEPS = [
  { label: "Signals in", value: "Vitals, symptoms, context" },
  { label: "AI score", value: "Ranked by urgency" },
  { label: "Action out", value: "Escalate, monitor, educate" },
];

function AnimatedNumber({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / 1400, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    };

    frame = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frame);
  }, [reduceMotion, value]);

  return <span>{displayValue.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}{suffix}</span>;
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.45em] text-cyan-200/80">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
    </div>
  );
}

function GlowOrb({ className, delay = 0 }: { className: string; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={className}
      animate={reduceMotion ? undefined : { y: [0, -18, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

export default function HomePage() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.24),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_24%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.16),_transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <GlowOrb className="absolute left-[-10rem] top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" delay={0} />
      <GlowOrb className="absolute right-[-8rem] top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" delay={2} />
      <GlowOrb className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" delay={4} />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10 shadow-2xl shadow-cyan-500/10">
              <img src="/logo.png" alt="MedIoT logo" className="h-8 w-8 rounded-lg object-cover" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.45em] text-cyan-200/70">MedIoT</span>
              <span className="block text-sm text-slate-300">AI + IoT care console</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#platform" className="transition-colors hover:text-white">Platform</a>
            <a href="#workflow" className="transition-colors hover:text-white">Workflow</a>
            <a href="#impact" className="transition-colors hover:text-white">Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white hover:text-slate-950">
              <Link href="/demo">
                <Sparkles className="mr-2 h-4 w-4" />
                Demo
              </Link>
            </Button>
            <Button asChild className="bg-white text-slate-950 hover:bg-cyan-200">
              <Link href="/auth">
                Launch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-4 shadow-[0_0_120px_rgba(8,145,178,0.12)] backdrop-blur-2xl">
          <BackgroundPaths
            subtitle="MedIoT turns raw health signals into a cleaner workflow for monitoring, triage, and next-step guidance."
            ctaLabel="Open the workspace"
            ctaHref="/auth"
            heroImageSrc="/logo.png"
            heroImageAlt="MedIoT photo"
          />
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-12">
        <div className="relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100"
          >
            <Heart className="h-3.5 w-3.5" />
            Predictive care, reimagined
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Turn raw vitals into
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
              care that moves before the crisis.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
          >
            MedIoT blends AI triage, connected sensors, and clinician-friendly dashboards into one high-clarity system for earlier detection, faster routing, and calmer decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="bg-cyan-300 text-slate-950 hover:bg-white">
              <Link href="/auth">
                <HeartHandshake className="mr-2 h-5 w-5" />
                Start the experience
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white hover:text-slate-950">
              <Link href="/demo">
                <TrendingUp className="mr-2 h-5 w-5" />
                Explore the demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {TRUST_PILLS.map((pill) => (
              <span key={pill} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur">
                {pill}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 grid gap-3 rounded-[1.6rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl sm:grid-cols-3"
          >
            {SIGNAL_STEPS.map((step, index) => (
              <div
                key={step.label}
                className={`rounded-2xl border border-white/8 px-4 py-4 ${index === 1 ? "bg-white/10" : "bg-slate-950/30"}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-cyan-200/70">{step.label}</p>
                <p className="mt-3 text-sm leading-6 text-white/90">{step.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.48 }}
            className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl">
                <div className="text-2xl font-semibold text-white sm:text-3xl">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative rounded-[2rem] border border-white/10 bg-white/7 p-5 shadow-[0_0_120px_rgba(8,145,178,0.18)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.14),_transparent_22%)]" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">Live signal map</p>
                  <h2 className="mt-3 text-2xl font-semibold text-white">Bedside to browser in one pulse.</h2>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                  synced now
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  { label: "Cardiac rhythm", value: 92, tone: "from-cyan-300 to-sky-500" },
                  { label: "Respiratory trend", value: 78, tone: "from-emerald-300 to-cyan-400" },
                  { label: "Stress load", value: 61, tone: "from-amber-300 to-rose-400" },
                ].map((row) => (
                  <div key={row.label} className="rounded-2xl border border-white/8 bg-white/5 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{row.label}</span>
                      <span>{row.value}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.value}%` }}
                        transition={{ duration: 1.1, delay: 0.1 }}
                        className={`h-full rounded-full bg-gradient-to-r ${row.tone}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-emerald-300" />
                    Risk funnel
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    {[46, 68, 82, 59, 91, 74].map((height, index) => (
                      <motion.span
                        key={height}
                        initial={{ height: 8, opacity: 0.35 }}
                        animate={{ height: `${height}px`, opacity: 1 }}
                        transition={{ duration: 0.7, delay: index * 0.08 }}
                        className="w-full rounded-full bg-gradient-to-t from-cyan-400 via-sky-300 to-emerald-300"
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Star className="h-4 w-4 text-amber-300" />
                    Recommended next step
                  </div>
                  <p className="mt-3 text-lg font-medium text-white">Escalate remote review and keep monitoring active.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">The system has enough confidence to guide a next action without asking the user to decode the data.</p>
                </div>
              </div>
            </div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-5 top-12 hidden rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-cyan-950/20 backdrop-blur md:block"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">AI lens</p>
              <p className="mt-1 text-sm text-white">Triaged in 120ms</p>
            </motion.div>

            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -right-4 bottom-10 hidden rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-3 shadow-2xl shadow-cyan-950/20 backdrop-blur md:block"
            >
              <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-200/70">Offline ready</p>
              <p className="mt-1 text-sm text-white">Core workflows stay live</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="platform" className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Platform"
          title="Built to make the next step obvious."
          description="Every panel is designed to reduce noise. The result is a homepage that feels like an instrument, not a brochure."
        />

        <div className="mx-auto mt-10 max-w-5xl rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["Inputs", "Symptoms, sensors, notes"],
              ["Processing", "Fusion, scoring, routing"],
              ["Outputs", "Alerts, guidance, follow-up"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-2xl border border-white/8 bg-slate-950/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">{title}</p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="group rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{feature.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="workflow" className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Workflow"
              title="A tighter loop from signal to action."
              description="The experience is intentionally linear: capture, score, act. That structure makes it easier for users to trust what happens next."
            />

            <div className="mt-10 space-y-4">
              {WORKFLOW.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex gap-4 rounded-[1.5rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl"
          >
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Impact snapshot</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Signal quality with less friction.</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">stable release</div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Users, label: "Users guided", value: 12400 },
                  { icon: BarChart2, label: "Triage accuracy", value: 97.8, suffix: "%", decimals: 1 },
                  { icon: Stethoscope, label: "Clinical reviews", value: 8600 },
                  { icon: TrendingUp, label: "Response lift", value: 42, suffix: "%", decimals: 0 },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <metric.icon className="h-5 w-5 text-cyan-200" />
                    <div className="mt-4 text-2xl font-semibold text-white">
                      <AnimatedNumber value={metric.value} suffix={metric.suffix} decimals={metric.decimals ?? 0} />
                    </div>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-400">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4 text-sm leading-7 text-emerald-100">
                The interface favors readable states, immediate action, and calm hierarchy. It is designed to feel like a control room, not a sales page.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="impact" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-cyan-400/15 via-sky-400/10 to-emerald-400/15 p-8 shadow-[0_0_140px_rgba(34,211,238,0.12)] sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-cyan-100/80">Ready to ship</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                A website that looks like the future of care.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">
                MedIoT now opens with motion, depth, and a clear product story. The result is sharper, more memorable, and much closer to the kind of interface people expect from a serious health platform.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-slate-950 hover:bg-cyan-200">
                <Link href="/auth">
                  <Users className="mr-2 h-5 w-5" />
                  Join now
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                <Link href="/demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch the flow
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-white/10 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="MedIoT logo" className="h-10 w-10 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-white">MedIoT</p>
              <p className="text-sm text-slate-400">AI + IoT healthcare experience</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-slate-300">
            <Link href="/demo" className="transition-colors hover:text-white">Demo</Link>
            <Link href="/auth" className="transition-colors hover:text-white">Auth</Link>
            <a href="https://www.linkedin.com/in/sheikhwasimuddin/" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">Contact</a>
            <a href="https://sheikhwasimuddin.netlify.app/" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">About</a>
          </div>
        </div>
      </footer>
    </main>
  );
}