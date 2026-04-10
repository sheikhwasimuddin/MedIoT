"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Phone, User, LogOut, Heart, Shield, BadgeInfo } from "lucide-react";

import { Sun, Moon } from "lucide-react";
export default function NavbarWithAuth() {
  const router = useRouter();
  const [showAuthBox, setShowAuthBox] = useState(false);
  const authBoxRef = useRef<HTMLDivElement>(null);

  const [darkMode, setDarkMode] = useState(false);
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
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);
  return (
    <nav className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MedIoT Logo" className="w-32 h-32 mix-blend-multiply" />
          </div>

          {/* Center - Emergency Button */}
          <div className="flex-1 flex justify-center">
            <Button
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency 112
            </Button>
          </div>

          {/* Right side - Account */}
          <div className="relative" ref={authBoxRef}>
            <Button
              variant="outline"
              onClick={() => setShowAuthBox(!showAuthBox)}
              className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 rounded-lg px-4 py-2 shadow-sm transition-all duration-200"
            >
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5" />}
      </Button>

            {showAuthBox && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-blue-100 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="p-2">
                  <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Account Settings</span>
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-left hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                    onClick={() => {
                      router.push("/profile/view");
                      setShowAuthBox(false);
                    }}
                  >
                    <BadgeInfo className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>

                  {/* Logout Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-3 py-2 text-left hover:bg-red-50 hover:text-red-700 transition-colors duration-200 mt-1"
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
