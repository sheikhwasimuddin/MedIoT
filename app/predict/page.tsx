// app/predict/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import EnhancedDiseasePredictionApp from "./EnhancedDiseasePredictionApp";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function PredictPage() {
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to home page...</p>
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


  return <EnhancedDiseasePredictionApp />;
}