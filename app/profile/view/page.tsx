"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, onSnapshot, query, orderBy, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, Droplets, Moon, RefreshCcw, Share2, Sun, TrendingUp, UserRound, Activity, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfileViewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
          const trendsRef = collection(db, "users", user.uid, "trends");
          const q = query(trendsRef, orderBy("timestamp", "desc"));
          const unsubscribeTrends = onSnapshot(q, (snapshot) => {
            setTrends(snapshot.docs.map((item) => item.data()));
          });

          setLoading(false);
          return () => unsubscribeTrends();
        }

        router.push("/profile");
      } else {
        router.push("/auth");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const shareProfile = async () => {
    if (navigator.share && profile) {
      await navigator.share({
        title: `${profile.name}'s Health Profile`,
        text: `Check out ${profile.name}'s health summary on MedIoT.`,
        url: window.location.href,
      });
    }
  };

  const handleReset = async () => {
    const user = auth.currentUser;
    if (!user) return;

    await setDoc(doc(db, "users", user.uid), {
      name: "",
      age: "",
      phoneNumber: "",
      height: "",
      weight: "",
      email: user.email || "",
      photoURL: user.photoURL || "",
    });

    router.push("/profile");
  };

  const summary = useMemo(() => {
    const count = trends.length;
    const average = count
      ? Math.round(trends.reduce((acc, trend) => acc + Number(trend.heartRate || 0), 0) / count)
      : 0;
    return { count, average };
  }, [trends]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 backdrop-blur-xl">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#050816] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/6 px-6 py-4 text-sm text-slate-200 backdrop-blur-xl">
          Profile not found.
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.14),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_24%)]" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <Button
            onClick={() => router.push("/predict")}
            className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white hover:text-slate-950"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to prediction
          </Button>

          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10">
              <ShieldCheck className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">MedIoT Profile</p>
              <p className="text-xs text-slate-400">Personal health overview and trends</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="rounded-full text-slate-200 hover:bg-white/10 hover:text-white">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-white/10 bg-white/6 text-white shadow-[0_0_100px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/10">
                <img src={profile.photoURL || "/assets/avatar.png"} alt="Profile photo" className="h-20 w-20 rounded-full object-cover" />
              </div>
              <CardTitle className="text-2xl">{profile.name}</CardTitle>
              <CardDescription className="text-slate-300">{profile.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Phone", profile.phoneNumber],
                  ["Age", profile.age],
                  ["Height", profile.height],
                  ["Weight", profile.weight],
                ].map(([label, value]) => (
                  <div key={label as string} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
                    <p className="mt-2 text-sm text-white">{value as string}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <UserRound className="h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm text-slate-200">Profile complete</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <Activity className="h-5 w-5 text-emerald-200" />
                  <p className="mt-3 text-sm text-slate-200">Trend capture active</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <Share2 className="h-5 w-5 text-sky-200" />
                  <p className="mt-3 text-sm text-slate-200">Sharing ready</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={shareProfile} className="bg-cyan-300 text-slate-950 hover:bg-white">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share profile
                </Button>
                <Button variant="outline" onClick={() => router.push("/profile")} className="border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-950">
                  Update info
                </Button>
                <Button variant="destructive" onClick={handleReset} className="bg-red-500 text-white hover:bg-red-400">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/6 text-white backdrop-blur-2xl">
              <CardHeader>
                <CardTitle className="text-xl">Health trends</CardTitle>
                <CardDescription className="text-slate-300">Recent vitals and trend signals from your prediction history.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Trend records", summary.count],
                    ["Avg. heart rate", `${summary.average} bpm`],
                    ["Status", summary.count > 0 ? "Active" : "Idle"],
                  ].map(([label, value]) => (
                    <div key={label as string} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{label}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{value as string}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  {trends.length === 0 ? (
                    <p className="text-sm text-slate-400">No trend data yet.</p>
                  ) : (
                    trends.map((trend, index) => (
                      <div key={index} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-white">Recorded session {index + 1}</p>
                          <p className="text-xs text-slate-400">
                            {trend.timestamp?.toDate ? trend.timestamp.toDate().toLocaleString() : trend.timestamp ? new Date(trend.timestamp).toLocaleString() : "No timestamp"}
                          </p>
                        </div>
                        <div className="mt-4 grid gap-2 sm:grid-cols-3">
                          {[
                            ["Heart rate", `${trend.heartRate} bpm`],
                            ["SpO2", `${trend.spo2}%`],
                            ["Temperature", `${trend.temperature}°C`],
                          ].map(([label, value]) => (
                            <div key={label as string} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{label}</p>
                              <p className="mt-1 text-sm text-white">{value as string}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-gradient-to-br from-cyan-400/15 via-sky-400/10 to-emerald-400/15 text-white backdrop-blur-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm text-cyan-100">
                  <TrendingUp className="h-4 w-4" />
                  Profile summary
                </div>
                <h3 className="mt-3 text-2xl font-semibold">Your MedIoT profile is ready for prediction and trend tracking.</h3>
                <p className="mt-3 text-sm leading-7 text-slate-200">
                  Once your profile is complete, MedIoT can route you back to the prediction workspace with better context and a cleaner clinical record.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
