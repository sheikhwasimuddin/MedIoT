"use client";

import Link from "next/link";
import { Paperclip, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const quickPrompts = [
  "Launch a patient triage flow",
  "Design a monitoring dashboard",
  "Generate a care routing screen",
  "Build a clean medical hero",
];

export function Hero1() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0414] px-6 py-6 text-white shadow-[0_0_80px_rgba(34,211,238,0.08)] sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_25%)]" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10">
              <img src="/logo.png" alt="MedIoT logo" className="h-8 w-8 rounded-xl object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">MedIoT</p>
              <p className="text-xs text-slate-400">AI + IoT healthcare interface</p>
            </div>
          </div>

          <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-cyan-200">
            <Link href="/auth">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            21st.dev inspired hero component
          </div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Build a calmer, smarter health experience.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            A compact hero section you can drop into MedIoT routes to keep the app feeling premium while pointing users toward the next action.
          </p>
        </div>

        <div className="relative max-w-2xl">
          <div className="flex items-center rounded-full border border-white/10 bg-white/6 p-2 backdrop-blur-xl">
            <button className="rounded-full p-2 transition-colors hover:bg-white/10">
              <Paperclip className="h-5 w-5 text-slate-400" />
            </button>
            <button className="rounded-full p-2 transition-colors hover:bg-white/10">
              <Sparkles className="h-5 w-5 text-cyan-300" />
            </button>
            <input
              type="text"
              readOnly
              value="How can MedIoT help you today?"
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <span key={prompt} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-slate-200">
              {prompt}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
