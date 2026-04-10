// app/predict/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck, Brain, Activity, Sparkles } from "lucide-react";

import EnhancedDiseasePredictionApp from "./EnhancedDiseasePredictionApp";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PredictPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      try {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.push("/");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 backdrop-blur-xl">
          Loading prediction workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 backdrop-blur-xl">
          Redirecting to home page...
        </div>
      </div>
    );
  }
  const saveTrendToFirestore = async (trendData: any) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const trendRef = collection(db, "users", user.uid, "trends");
    await addDoc(trendRef, {
      ...trendData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving trend:", error);
  }
};


  return (
    <main className="min-h-screen bg-[#050816] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_24%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6 rounded-[2rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5" />
                Private prediction workspace
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Clinical signals, risk scoring, and next-step guidance in one place.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                Use the prediction console to move from inputs to a clear recommendation without losing the context that matters.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[28rem]">
              {[
                [Brain, "AI analysis"],
                [Activity, "Live vitals"],
                [Sparkles, "Actionable output"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm text-slate-200">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-colors hover:bg-white hover:text-slate-950">
              Back home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Authenticated session</span>
          </div>
        </motion.section>

        <EnhancedDiseasePredictionApp />
      </div>
    </main>
  );
}