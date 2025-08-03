"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ProfileFormPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) return;

  let photoURL = "";

  try {
    // Check if photo is selected
    if (photo && photo instanceof File) {
      console.log("Uploading photo...");

      const photoRef = ref(storage, `profilePhotos/${user.uid}.jpg`);
      await uploadBytes(photoRef, photo);
      console.log("Upload complete.");

      photoURL = await getDownloadURL(photoRef);
      console.log("Download URL:", photoURL);
    }

    // Save profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      ...formData,
      email: user.email,
      photoURL,
    });

    console.log("Profile saved, redirecting...");
    router.push("/predict");

  } catch (error: any) {
    console.error("Error submitting profile:", error);
    alert("Profile submission failed: " + error.message);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-100">
      

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-lg max-w-md w-full space-y-4 border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>

        {photoPreview && (
  <img
    src={photoPreview}
    alt="Profile preview"
    className="w-24 h-24 rounded-full mx-auto object-cover"
  />
)}


        <div className="flex justify-center">
          <img src="/logo.png" alt="MedIoT Logo" className="w-32 h-32 mix-blend-multiply" />
        </div>
        <Input type="file" accept="image/*" onChange={handlePhotoChange} />

        <Input name="name" placeholder="Full Name" required onChange={handleChange} />
        <Input name="age" placeholder="Age" type="number" required onChange={handleChange} />
        <Input name="phoneNumber" placeholder="Phone Number" required onChange={handleChange} />
        <Input name="height" placeholder="Height (cm)" required onChange={handleChange} />
        <Input name="weight" placeholder="Weight (kg)" required onChange={handleChange} />

        <Button type="submit" className="w-full">Save Profile</Button>
      </form>
    </div>
  );
}
