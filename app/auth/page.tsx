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
      <div className="min-h-screen grid place-items-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 backdrop-blur-xl">
          Loading secure session...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_24%)]" />
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-12">
        <section className="relative flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure access for clinicians and patients
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              One entry point for
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                prediction, monitoring, and care routing.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Sign in to continue into the MedIoT workspace. The platform keeps authentication, patient profiles, and downstream prediction flows connected in a single calm interface.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [Brain, "AI-guided triage"],
                [HeartPulse, "Connected vitals"],
                [Activity, "Live risk signals"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm text-slate-200">{label as string}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Encrypted sign-in</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Profile-aware routing</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Fast launch</span>
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="border-white/10 bg-white/6 text-white shadow-[0_0_100px_rgba(34,211,238,0.12)] backdrop-blur-2xl">
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <img src="/logo.png" alt="MedIoT logo" className="h-10 w-10 rounded-xl object-cover" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Welcome back</CardTitle>
                  <p className="mt-2 text-sm text-slate-300">Sign in or create an account to open the MedIoT control room.</p>
                </div>
              </CardHeader>
              <CardContent>
                <AuthTabs />
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
                  <span>Protected healthcare workspace</span>
                  <Link href="/" className="inline-flex items-center gap-1 text-cyan-200 transition-colors hover:text-white">
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
