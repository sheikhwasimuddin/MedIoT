"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Camera, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Hero1 } from "../../components/ui/hero-1";
import { BackgroundPaths } from "../../components/ui/background-paths";

export default function ProfileFormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phoneNumber: "",
    height: "",
    weight: "",
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    let photoURL = "";

    try {
      if (photo) {
        const photoRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        email: user.email,
        photoURL,
      });

      router.push("/predict");
    } catch (error: any) {
      console.error("Error submitting profile:", error);
      alert("Profile submission failed: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_24%)]" />
      <div className="mx-auto grid min-h-screen max-w-7xl gap-10 px-4 py-8 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-12">
        <section className="flex items-center">
          <div className="max-w-2xl">
            <Hero1 />
            <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-3 backdrop-blur-xl">
              <BackgroundPaths
                title="Secure profile setup"
                subtitle="Complete your profile so MedIoT can route the right predictions and trend insights to your workspace."
                ctaLabel="Continue"
                ctaHref="#profile-form"
              />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure onboarding for your MedIoT workspace
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Complete your profile so the prediction flow knows who it is helping.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Add the details MedIoT needs for personalized guidance, risk context, and cleaner follow-up recommendations.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                [UserRound, "Personalized care"],
                [Camera, "Profile image"],
                [Sparkles, "Fast handoff"],
              ].map(([Icon, label]) => (
                <div key={label as string} className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-xl">
                  <Icon className="h-5 w-5 text-cyan-200" />
                  <p className="mt-3 text-sm text-slate-200">{label as string}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Encrypted profile data</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Health-first defaults</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">One-step launch</span>
            </div>

            <div className="mt-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-cyan-200 transition-colors hover:text-white">
                Back home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <Card id="profile-form" className="w-full max-w-xl border-white/10 bg-white/6 text-white shadow-[0_0_100px_rgba(34,211,238,0.08)] backdrop-blur-2xl">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <img src="/logo.png" alt="MedIoT Logo" className="h-10 w-10 rounded-xl object-cover" />
              </div>
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
              <CardDescription className="text-slate-300">Add a few details to unlock the prediction console.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/50 p-4 text-center">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile preview" className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-cyan-300/20" />
                  ) : (
                    <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400">
                      <Camera className="h-8 w-8" />
                    </div>
                  )}
                  <Input
                    className="mt-4 border-white/10 bg-slate-950/70 text-slate-100 file:border-0 file:bg-transparent file:text-slate-100"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>

                <Input
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                />
                <Input
                  name="age"
                  placeholder="Age"
                  type="number"
                  required
                  onChange={handleChange}
                  className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                />
                <Input
                  name="phoneNumber"
                  placeholder="Phone Number"
                  required
                  onChange={handleChange}
                  className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    name="height"
                    placeholder="Height (cm)"
                    required
                    onChange={handleChange}
                    className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                  />
                  <Input
                    name="weight"
                    placeholder="Weight (kg)"
                    required
                    onChange={handleChange}
                    className="border-white/10 bg-slate-950/70 text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <Button type="submit" disabled={isSaving} className="w-full bg-cyan-300 text-slate-950 hover:bg-white">
                  {isSaving ? "Saving profile..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
