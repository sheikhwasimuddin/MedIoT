"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Phone, User, LogOut, Shield, BadgeInfo } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

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
    window.location.href = "tel:112";
  };

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
    <nav className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-green-50 shadow-sm dark:border-white/10 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MedIoT Logo" className="w-32 h-32 mix-blend-multiply dark:mix-blend-normal" />
          </div>

          <div className="flex-1 flex justify-center">
            <Button
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency 112
            </Button>
          </div>

          <div className="relative flex items-center gap-2" ref={authBoxRef}>
            <ThemeToggle className="rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white" />

            <Button
              variant="outline"
              onClick={() => setShowAuthBox(!showAuthBox)}
              className="rounded-lg border-blue-200 bg-white px-4 py-2 text-blue-700 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>

            {showAuthBox && (
              <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg z-50 dark:border-white/10 dark:bg-slate-900">
                <div className="p-2">
                  <div className="border-b border-slate-100 px-3 py-2 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Account Settings</span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-left transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-white/10 dark:hover:text-white"
                    onClick={() => {
                      router.push("/profile/view");
                      setShowAuthBox(false);
                    }}
                  >
                    <BadgeInfo className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>

                  <Button
                    variant="ghost"
                    className="mt-1 w-full justify-start px-3 py-2 text-left transition-colors duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
