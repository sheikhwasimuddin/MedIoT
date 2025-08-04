"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Heart,
  Brain,
  Shield,
  ArrowRight,
  Microscope,
  Activity,
  UserPlus,
  BarChart2,
  Lock,
  Zap,
  TrendingUp,
  Users,
  Star,
  CheckCircle,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import NavbarWithEme from "@/components/NavbarWithEme";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
/* ------------------------------------------------------------------ */
/* Constants                                                          */
/* ------------------------------------------------------------------ */
const META = {
  title: "MedIoT – Smarter Healthcare with AI & IoT",
  description:
    "Predict diseases with 95%+ accuracy, monitor in real-time, and receive personalized insights using MedIoT's AI-powered platform.",
  keywords: "AI healthcare, IoT sensors, predictive diagnostics, remote monitoring",
};

const HERO = {
  heading: "Smarter Healthcare with",
  gradientWord: "MedIoT",
  sub: "AI + IoT for predictive care, real-time monitoring, and personalized insights.",
  cta1: "Get Started",
  cta2: "Try Demo",
};

const STATS = [
  { value: 94, label: "Accuracy Rate", suffix: "%", color: "text-success" },
  { value: 50000, label: "Patients Monitored", suffix: "+", color: "text-health-primary" },
  { value: 24, label: "Hours Monitoring", suffix: "/7", color: "text-health-info" },
  { value: 99.9, label: "Uptime", suffix: "%", color: "text-health-wellness" },
];

const FEATURES = [
  { 
    icon: Brain, 
    title: "AI-Powered Diagnostics", 
    desc: "Predict diseases with 95%+ accuracy using real clinical data.",
    color: "from-health-primary to-health-secondary",
    hoverColor: "group-hover:text-health-primary"
  },
  { 
    icon: Heart, 
    title: "IoT Sensor Integration", 
    desc: "Connect sensors like MAX30100 & ECG for real-time health tracking.",
    color: "from-health-vitality to-health-accent",
    hoverColor: "group-hover:text-health-vitality"
  },
  { 
    icon: Shield, 
    title: "Offline Access", 
    desc: "Use core features and reference materials without internet.",
    color: "from-health-info to-health-calm",
    hoverColor: "group-hover:text-health-info"
  },
  { 
    icon: Microscope, 
    title: "Analytics Dashboards", 
    desc: "Visualize health trends & receive actionable alerts.",
    color: "from-health-wellness to-health-success",
    hoverColor: "group-hover:text-health-wellness"
  },
  { 
    icon: Activity, 
    title: "24/7 Monitoring", 
    desc: "Enable round-the-clock health data logging & alerts.",
    color: "from-health-warning to-health-vitality",
    hoverColor: "group-hover:text-health-warning"
  },
  { 
    icon: UserPlus, 
    title: "Personalized Insights", 
    desc: "Get tailored health tips based on age, risk & goals.",
    color: "from-health-accent to-health-calm",
    hoverColor: "group-hover:text-health-accent"
  },
  { 
    icon: Lock, 
    title: "Data Privacy First", 
    desc: "HIPAA/GDPR compliant, encrypted storage & secure access.",
    color: "from-health-primary to-health-info",
    hoverColor: "group-hover:text-health-primary"
  },
  { 
    icon: BarChart2, 
    title: "Clinician Panel", 
    desc: "Doctors can remotely monitor and assist in care decisions.",
    color: "from-health-success to-health-wellness",
    hoverColor: "group-hover:text-health-success"
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Sarah Chen",
    role: "Cardiologist",
    content: "MedIoT has revolutionized how we monitor patients. The predictive analytics are incredibly accurate.",
    avatar: "SC",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Patient",
    content: "The 24/7 monitoring gives me peace of mind. I caught a potential issue early thanks to MedIoT.",
    avatar: "MR",
    rating: 5
  },
  {
    name: "Dr. Amanda Kim",
    role: "Family Medicine",
    content: "The IoT integration is seamless. My patients love the personalized insights they receive.",
    avatar: "AK",
    rating: 5
  }
];

/* ------------------------------------------------------------------ */
/* Interactive Components                                             */
/* ------------------------------------------------------------------ */
const AnimatedCounter = ({
  value,
  suffix = "",
  duration = 2,
  className = ""
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart;

      setCount(Math.floor(current));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    updateCount();
  }, [isVisible, value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsVisible(true)}
      className="text-center"
    >
      <div className={`text-3xl md:text-4xl font-bold ${className}`}>
        {count.toLocaleString()}{suffix}
      </div>
    </motion.div>
  );
};


const InteractiveFeatureCard = React.memo(
  ({ icon: Icon, title, desc, color, hoverColor, index }: (typeof FEATURES)[0] & { index: number }) => {
    const shouldReduceMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: index * 0.1 }}
        className="group interactive-card relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <motion.div
          className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className={`h-6 w-6 text-primary ${hoverColor} transition-all duration-300`} aria-hidden />
        </motion.div>
        
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {desc}
        </p>
        
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-health-primary to-health-secondary"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? "100%" : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  }
);
InteractiveFeatureCard.displayName = "InteractiveFeatureCard";

const FloatingElement = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    animate={{
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof TESTIMONIALS[0]; index: number }) => {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-health-warning text-health-warning" />
        ))}
      </div>
      <p className="text-foreground mb-4 italic">"{testimonial.content}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-health-primary to-health-secondary flex items-center justify-center text-white font-semibold">
          {testimonial.avatar}
        </div>
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Page Component                                                */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let unsubscribeSnapshot: () => void = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);

        // Real-time sync with Firestore
        unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data());
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
        setProfile(null);
      }
    });

 return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  return (
    <><NavbarWithEme></NavbarWithEme>
      <Head>
        <title>{META.title}</title>
        <meta name="description" content={META.description} />
        <meta name="keywords" content={META.keywords} />
        <meta property="og:title" content={META.title} />
        <meta property="og:description" content={META.description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="isolate min-h-screen bg-background font-sans text-foreground overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <FloatingElement delay={0}>
              <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-health-primary/20 blur-3xl animate-pulse-soft" />
            </FloatingElement>
            <FloatingElement delay={2}>
              <div className="absolute right-1/4 top-1/3 h-80 w-80 rounded-full bg-health-secondary/20 blur-3xl animate-pulse-soft" />
            </FloatingElement>
            <FloatingElement delay={4}>
              <div className="absolute left-1/3 bottom-1/4 h-64 w-64 rounded-full bg-health-wellness/20 blur-3xl animate-pulse-soft" />
            </FloatingElement>
          </div>

          <div className="container relative mx-auto flex flex-col items-center px-6 py-28 text-center z-10">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, type: "spring", bounce: 0.4 }}
              className="mb-8 inline-block rounded-full bg-white/90 p-6 shadow-2xl wellness-glow"
            >
              
            <img src="/logo.png" alt="MedIoT Logo" className="w-64 h-64 mix-blend-multiply rounded-full object-cover" />
            
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.2 }}
              className="max-w-4xl text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              {HERO.heading}{" "}
              <span className="bg-gradient-to-r from-health-primary via-health-secondary to-health-wellness bg-clip-text text-transparent animate-pulse-soft">
                {HERO.gradientWord}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.4 }}
              className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground"
            >
              {HERO.sub}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: 0.6 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Button 
                size="lg" 
                className="bg-health-primary hover:bg-health-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                asChild
              >
                <Link href="/auth">
                  <HeartHandshake className="mr-2 h-5 w-5" />
                  {HERO.cta1}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white transition-all duration-300 transform hover:scale-105" 
                asChild
              >
                <Link href="/demo">
                  <Sparkles className="mr-2 h-4 w-4" />
                  {HERO.cta2}
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
<section className="py-20 text-white bg-gradient-to-r from-health-primary to-health-secondary">
  <div className="container mx-auto px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <AnimatedCounter value={stat.value} suffix={stat.suffix} className="text-white" />
          <div className="text-sm md:text-base opacity-90 mt-2">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>


        {/* Features Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-health-primary to-health-secondary bg-clip-text text-transparent">
                Why Choose MedIoT?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how our cutting-edge technology transforms healthcare delivery
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {FEATURES.map((feature, index) => (
                <InteractiveFeatureCard
                  key={feature.title}
                  {...feature}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-foreground">
                Trusted by Healthcare Professionals
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                See what doctors and patients say about MedIoT
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-health-primary via-health-secondary to-health-wellness relative overflow-hidden">
          <div className="absolute inset-0">
            <FloatingElement delay={0}>
              <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            </FloatingElement>
            <FloatingElement delay={2}>
              <div className="absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-white/10 blur-xl" />
            </FloatingElement>
          </div>
          
          <div className="container mx-auto max-w-4xl px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8">
                Join thousands of healthcare professionals using MedIoT to deliver better patient outcomes
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-health-primary hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link href="/auth">
                    <Users className="mr-2 h-5 w-5" />
                    Join MedIoT Today
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-health-primary transition-all duration-300 transform hover:scale-105"
                  asChild
                >
                  <Link href="/demo">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 text-health-primary">
                  
            <img src="/logo.png" alt="MedIoT Logo" className="w-64 h-64 mix-blend-multiply" />
                </div>
              </div>
              
              <p className="text-m text-muted-foreground mb-4">
                &copy; {new Date().getFullYear()} MedIoT. All rights reserved.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6 text-m">
                <Link href="/docs/Privacy Policy.docx" target="_blank" download className="text-health-primary hover:text-health-secondary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/docs/Terms and Conditions.docx" className="text-health-primary hover:text-health-secondary transition-colors">
                  Terms of Service
                </Link>
                <Link href="https://www.linkedin.com/in/sheikhwasimuddin/" className="text-health-primary hover:text-health-secondary transition-colors">
                  Contact Us
                </Link>
                <Link href="https://sheikhwasimuddin.netlify.app/" className="text-health-primary hover:text-health-secondary transition-colors">
                  About
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
