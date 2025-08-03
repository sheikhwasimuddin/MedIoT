"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import { ArrowLeft, Droplets, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1️⃣ NEW – Emoji reactions bar
import { Heart} from "lucide-react";
// 2️⃣ NEW – Share profile via WebShare
import { Share2 } from "lucide-react";
// 3️⃣ NEW – Dark-mode toggle
import { Sun, Moon } from "lucide-react";


export default function ProfileViewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const router = useRouter();

  // ============================================
  // 0️⃣ Existing auth & data fetch (unchanged)
  // ============================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());

          const trendsRef = collection(db, "users", user.uid, "trends");
          const q = query(trendsRef, orderBy("timestamp", "desc"));
          onSnapshot(q, (snapshot) => {
            const trendsList = snapshot.docs.map((doc) => doc.data());
            setTrends(trendsList);
          });
        } else {
          router.push("/profile");
        }
      } else {
        router.push("/auth");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // ============================================
  // 2️⃣ WebShare API
  // ============================================
  const shareProfile = async () => {
    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${profile.name}'s Health Profile`,
          text: `Check out ${profile.name}'s health summary on MedAI.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    }
  };

  // ============================================
  // 3️⃣ Dark-mode toggle
  // ============================================
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // ============================================
  // 4️⃣ Typing indicator (mock)
  // ============================================
  useEffect(() => {
    const interval = setInterval(() => {
      setTyping((prev) => !prev);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // 5️⃣ Quick vitals FAB
  // ============================================
  const quickVitals = () => {
    router.push("/predict");
  };

  // ============================================
  // 🔁 Reset profile (unchanged)
  // ============================================
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

  // ============================================
  // 🏗️ UI
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">Loading...</div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Profile not found.
      </div>
    );
  }

  return (

    <div
      className={`min-h-screen bg-gradient-to-br ${
        darkMode
          ? "from-slate-900 to-slate-800 text-white"
          : "from-slate-50 to-blue-100"
      }`}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
  {/* Left: Quick Vitals Button */}
  <Button
    onClick={quickVitals}
    className="flex items-center gap-2 rounded-full shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:brightness-110 transition"
    size="lg"
  >
    <ArrowLeft className="w-5 h-5" />
    Quick Vitals
  </Button>
        <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MedIoT Logo" className="w-10 h-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              MedIoT
            </h1>
          </div>
        

        {/* Dark-mode toggle */}
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      <div className="flex justify-center items-start flex-col items-center px-4">
        {/* Profile Card */}
        <div
          className={`${
            darkMode ? "bg-slate-800" : "bg-white"
          } shadow-xl p-10 rounded-2xl max-w-md w-full space-y-6 border border-gray-300 text-center`}
        >
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-blue-200">
              <Image
                src={profile.photoURL || "/assets/avatar.png"}
                alt="Profile photo"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">{profile.name}</h2>
            <p className="text-sm opacity-70">{profile.email}</p>

            

            {/* 2️⃣ Share button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={shareProfile}
              className="mt-2 text-xs gap-1"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
          </div>

          {/* Personal Info */}
          <div className="text-left space-y-2">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Personal Information
            </h3>
            <div className="flex justify-between">
              <span className="font-medium">Phone:</span>
              <span>{profile.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Age:</span>
              <span>{profile.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Height:</span>
              <span>{profile.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Weight:</span>
              <span>{profile.weight}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-center space-x-4">
            <Button variant="secondary" onClick={() => router.push("/profile")}>
              Update Info
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Reset Profile
            </Button>
          </div>
        </div>

        {/* Trends Section */}
        <div className="mt-8 w-full max-w-md">
          <h3 className="text-lg font-semibold text-blue-700 mb-3 text-center">
            Health Trends
          </h3>
          {trends.length === 0 ? (
            <p className="text-sm opacity-60 text-center">No trend data yet.</p>
          ) : (
            <ul className="space-y-3">
              {trends.map((trend, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg shadow-md border ${
                    darkMode ? "bg-slate-800 border-slate-600" : "bg-white border-blue-100"
                  }`}
                >
                  <p>
                    <strong>Heart Rate:</strong> {trend.heartRate} bpm
                  </p>
                  <p>
                    <strong>SpO2:</strong> {trend.spo2}%
                  </p>
                  <p>
                    <strong>Temperature:</strong> {trend.temperature}°C
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
  {trend.timestamp?.toDate
    ? trend.timestamp.toDate().toLocaleString()
    : trend.timestamp
    ? new Date(trend.timestamp).toLocaleString()
    : "No timestamp"}
</p>
                </li>
              ))}
            </ul>
            
          )}
        </div>
{trends.length > 0 && (
  <div className="mt-6 space-y-6">
    {/* 1. Risk-Level Bar Chart */}
    <div>
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-blue-600" /> Risk Distribution
      </h4>
      {(() => {
        // compute counts
        const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
        trends.forEach((t) => {
          let score = 0;
          if (t.heartRate < 60 || t.heartRate > 100) score += 2;
          if (t.spo2 < 94) score += 3;
          if (t.temperature < 36 || t.temperature > 37.5) score += 1;
          if (t.systolicBP > 130 || t.diastolicBP > 80) score += 2;
          if (score >= 6) counts.Critical++;
          else if (score >= 4) counts.High++;
          else if (score >= 2) counts.Medium++;
          else counts.Low++;
        });
        const max = Math.max(...Object.values(counts), 1);
        const bars = [
          { label: "Low", val: counts.Low, color: "bg-green-500" },
          { label: "Medium", val: counts.Medium, color: "bg-yellow-500" },
          { label: "High", val: counts.High, color: "bg-orange-500" },
          { label: "Critical", val: counts.Critical, color: "bg-red-600" },
        ];
        return (
          <div className="flex items-end justify-around h-32 gap-2">
            {bars.map(({ label, val, color }) => (
              <div key={label} className="flex flex-col items-center w-1/4">
                <span className="text-xs mb-1">{val}</span>
                <div
                  className={`w-full ${color} rounded-t transition-all`}
                  style={{ height: `${(val / max) * 100}%` }}
                />
                <span className="text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        );
      })()}
    </div>

    {/* 2. Heart-Rate Line Chart (last 10 records) */}
    <div>
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
        <Heart className="w-4 h-4 text-red-500" /> Heart-Rate Trend
      </h4>
      {(() => {
        const points = trends.slice(0, 10).reverse();
        const max = Math.max(...points.map((p) => p.heartRate), 1);
        const min = Math.min(...points.map((p) => p.heartRate), 0);
        const range = max - min || 1;
        return (
          <svg viewBox="0 0 100 40" className="w-full h-20">
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              points={points
                .map(
                  (p, i) =>
                    `${(i / (points.length - 1)) * 100},${
                      40 - ((p.heartRate - min) / range) * 40
                    }`
                )
                .join(" ")}
            />
          </svg>
        );
      })()}
    </div>

    {/* 3. SpO₂ vs Temperature Scatter */}
    <div>
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
        <Droplets className="w-4 h-4 text-blue-500" /> SpO₂ vs Temperature
      </h4>
      {(() => {
        const points = trends.slice(0, 20);
        const minT = Math.min(...points.map((p) => p.temperature), 35);
        const maxT = Math.max(...points.map((p) => p.temperature), 39);
        const minS = Math.min(...points.map((p) => p.spo2), 90);
        const maxS = Math.max(...points.map((p) => p.spo2), 100);
        return (
          <svg viewBox="0 0 100 60" className="w-full h-28">
            {points.map((p, i) => (
              <circle
                key={i}
                cx={((p.temperature - minT) / (maxT - minT)) * 100}
                cy={60 - ((p.spo2 - minS) / (maxS - minS)) * 60}
                r="2"
                className="fill-blue-600"
              />
            ))}
          </svg>
        );
      })()}
    </div>
  </div>
)}
        

        {/* 5️⃣ Floating Action Button */}
        
      </div>
    </div>
  );
}