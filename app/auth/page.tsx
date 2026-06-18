// app/auth/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import AuthTabs from "@/components/AuthCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, Sparkles, Activity, Brain, HeartPulse } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AuthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const profile = docSnap.data();
            const isComplete =
              profile.name &&
              profile.age &&
              profile.phoneNumber &&
              profile.height &&
              profile.weight;

            if (isComplete) {
              router.push("/predict");
            } else {
              router.push("/profile");
            }
          } else {
            router.push("/profile");
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Auth state check failed:", error);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="mediot-page grid place-items-center">
        <div className="mediot-glass rounded-3xl px-6 py-4 text-sm mediot-muted">
          Loading secure session...
        </div>
      </div>
    );
  }

  return (
    <div className="mediot-page">
      <div className="mediot-page-glow" />
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle className="rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white" />
      </div>
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-12">
        <section className="relative flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-100/60 px-4 py-2 text-xs font-medium text-cyan-800 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure access for clinicians and patients
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              One entry point for
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                prediction, monitoring, and care routing.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              Sign in to continue into the MedIoT workspace. The platform keeps authentication, patient profiles, and downstream prediction flows connected in a single calm interface.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [Brain, "AI-guided triage"],
                [HeartPulse, "Connected vitals"],
                [Activity, "Live risk signals"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl mediot-glass p-4">
                  <Icon className="h-5 w-5 text-cyan-600 dark:text-cyan-200" />
                  <p className="mt-3 text-sm mediot-muted">{label as string}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm mediot-muted">
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">Encrypted sign-in</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">Profile-aware routing</span>
              <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">Fast launch</span>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="mediot-glass shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10">
                  <img src="/logo.png" alt="MedIoT logo" className="h-10 w-10 rounded-xl object-cover" />
                </div>
                <div>
                  <CardTitle className="text-2xl mediot-heading">Welcome back</CardTitle>
                  <p className="mt-2 text-sm mediot-muted">Sign in or create an account to open the MedIoT control room.</p>
                </div>
              </CardHeader>
              <CardContent>
                <AuthTabs />
                <div className="mt-6 flex items-center justify-between text-xs mediot-subtle">
                  <span>Protected healthcare workspace</span>
                  <Link href="/" className="inline-flex items-center gap-1 text-cyan-700 transition-colors hover:text-slate-900 dark:text-cyan-200 dark:hover:text-white">
                    Back home
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
