"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Phone, User, LogOut, Heart, Shield } from "lucide-react";

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
    <nav className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="MedIoT Logo" className="w-32 h-32 mix-blend-multiply" />
          </div>

          {/* Center - Emergency Button */}
          <div className="flex-1 flex justify-end">
            <Button
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency 112
            </Button>
          </div>

         
            
           
        </div>
      </div>
    </nav>
  );
}