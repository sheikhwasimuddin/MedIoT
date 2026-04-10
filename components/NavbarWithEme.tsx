"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Phone, Shield, HeartPulse, ArrowRight } from "lucide-react";

export default function NavbarWithAuth() {
  const router = useRouter();
  const [showAuthBox, setShowAuthBox] = useState(false);
  const authBoxRef = useRef<HTMLDivElement>(null);

  const onLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleEmergencyCall = () => {
    // In a real app, this would integrate with the device's phone functionality
    // For web, we can use tel: protocol
    window.location.href = "tel:112";
  };

  // Handle clicks outside authBox to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authBoxRef.current && !authBoxRef.current.contains(event.target as Node)) {
        setShowAuthBox(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10">
            <HeartPulse className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">MedIoT</p>
            <p className="text-xs text-slate-400">Care console</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-200 sm:flex">
            <Shield className="h-3.5 w-3.5" />
            Protected session
          </div>
          <Button
            onClick={handleEmergencyCall}
            className="rounded-full bg-red-500 px-5 py-2 font-semibold text-white shadow-lg shadow-red-950/20 transition-transform duration-200 hover:scale-[1.02] hover:bg-red-400"
          >
            <Phone className="mr-2 h-4 w-4" />
            Emergency 112
          </Button>
        </div>
      </div>
    </nav>
  );
}