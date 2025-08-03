// app/predict/EnhancedDiseasePredictionApp.tsx
"use client";
import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import TheorySections from "@/components/theory-sections"
import MedicalAIChatbot from "@/components/medical-ai-chatbot"
import OfflineRiskCalculators from "@/components/offline-risk-calculators"
import BatchCharts from "@/components/ui/charts"
import ClearButton from "@/app/ClearButton"
import Game from "@/components/games/game"
import AuthTabs from "@/components/AuthCard"
import { Sun, Moon } from "lucide-react";
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { auth } from "@/lib/firebase"
import NavbarWithAuth from "@/components/NavbarWithAuth"
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  Brain,
  Mic,
  MicOff,
  Upload,
  Download,
  Users,
  TrendingUp,
  Pill,
  BookOpen,
  Calendar,
  Phone,
  FileText,
  Siren,
  Clock,
  Stethoscope,
  Sparkles,
  MessageSquare,
  Lightbulb,
  Target,
  CircuitBoard,
  BookDownIcon,
  BotIcon,
} from "lucide-react"

interface PatientData {
  heartRate: number
  spo2: number
  systolicBP: number
  diastolicBP: number
  temperature: number
  fallDetection: string
  symptoms: string[]
  medicalHistory: string[]
  currentMedications: string[]
  age: number
  gender: string
  weight: number
  height: number
}

interface PredictionResult {
  disease: string
  confidence: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  alerts: string[]
  emergencyAlert?: boolean
  riskScore: number
  recommendations: string[]
  followUpRequired: boolean
}

interface AISymptomData {
  primarySymptoms: string[]
  secondarySymptoms: string[]
  explanation: string
  severity: string
  recommendations: string[]
}

interface AISymptomAnalysis {
  analysis: string
  possibleConditions: string[]
  urgencyLevel: string
  redFlags: string[]
  recommendations: string[]
  followUpQuestions: string[]
}

interface MedicalExplanation {
  diseaseExplanation: string
  symptomConnection: string
  pathophysiology: string
  prognosis: string
  lifestyle: string
  whenToSeekHelp: string
}

interface PersonalizedHealthInsight {
  insight: string
  tailoredAdvice: string[]
  lifestyleSuggestions: string[]
}

interface SymptomEvolution {
  changes: string
  trend: "Improving" | "Worsening" | "Stable"
  updatedRisk: string
}

interface HistoricalData {
  timestamp: string
  prediction: PredictionResult
  vitals: PatientData
  aiSymptoms?: AISymptomData
}

const commonSymptoms = [
  "Chest Pain",
  "Shortness of Breath",
  "Dizziness",
  "Fatigue",
  "Nausea",
  "Headache",
  "Palpitations",
  "Sweating",
  "Confusion",
  "Weakness",
  "Cough",
  "Fever",
  "Joint Pain",
  "Muscle Aches",
  "Vision Changes",
]

const commonMedicalHistory = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "COPD",
  "Stroke",
  "Cancer",
  "Kidney Disease",
  "Liver Disease",
  "Depression",
  "Anxiety",
  "Arthritis",
  "Osteoporosis",
  "Thyroid Disease",
]

const commonMedications = [
  "Aspirin",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Amlodipine",
  "Metoprolol",
  "Omeprazole",
  "Albuterol",
  "Insulin",
  "Warfarin",
  "Levothyroxine",
  "Gabapentin",
  "Hydrochlorothiazide",
  "Prednisone",
]

const diseaseInfo = {
  Normal: {
    description: "All vital signs are within normal ranges",
    color: "bg-green-500",
    recommendations: ["Continue regular health checkups", "Maintain healthy lifestyle", "Stay hydrated"],
    education: "Maintaining normal vital signs indicates good cardiovascular and respiratory health.",
  },
  Asthma: {
    description: "Respiratory condition affecting breathing",
    color: "bg-yellow-500",
    recommendations: [
      "Monitor SpO2 levels regularly",
      "Keep rescue inhaler available",
      "Avoid triggers",
      "Consider pulmonary function test",
    ],
    education:
      "Asthma is a chronic respiratory condition that can be well-managed with proper medication and trigger avoidance.",
  },
  Hypertension: {
    description: "High blood pressure condition",
    color: "bg-orange-500",
    recommendations: [
      "Monitor blood pressure daily",
      "Reduce sodium intake",
      "Regular exercise",
      "Consider ACE inhibitor",
    ],
    education:
      "Hypertension is often called the 'silent killer' because it usually has no symptoms but can lead to serious complications.",
  },
  Arrhythmia: {
    description: "Irregular heart rhythm",
    color: "bg-red-500",
    recommendations: [
      "Monitor heart rate regularly",
      "Avoid caffeine",
      "Consult cardiologist",
      "Consider ECG monitoring",
    ],
    education:
      "Arrhythmias can range from harmless to life-threatening. Regular monitoring and medical supervision are essential.",
  },
  "Diabetes Mellitus": {
    description: "Blood sugar regulation disorder",
    color: "bg-purple-500",
    recommendations: ["Monitor blood glucose", "Follow diabetic diet", "Regular medication", "Check HbA1c quarterly"],
    education:
      "Diabetes management involves lifestyle changes, medication adherence, and regular monitoring to prevent complications.",
  },
  Fever: {
    description: "Elevated core body temperature",
    color: "bg-red-600",
    recommendations: [
      "Rest and hydrate",
      "Use antipyretics if needed",
      "Monitor temperature every 2-3 hours",
      "Seek medical help if > 39 °C",
    ],
    education:
      "Fever is the body’s response to infection or inflammation; persistent high fever needs evaluation.",
  },
  Hypothermia: {
    description: "Core body temperature below 35 °C",
    color: "bg-cyan-600",
    recommendations: [
      "Gradual rewarming",
      "Remove wet clothing",
      "Use blankets or warm fluids",
      "Seek emergency care if < 34 °C",
    ],
    education:
      "Hypothermia can impair heart rhythm and consciousness; rapid rewarming can be dangerous.",
  },
  Tachycardia: {
    description: "Resting heart rate above 100 bpm",
    color: "bg-orange-500",
    recommendations: [
      "Reduce caffeine & alcohol",
      "Check thyroid function",
      "Practice relaxation techniques",
      "See cardiologist if persistent",
    ],
    education:
      "Sustained tachycardia increases cardiac workload and may signal underlying disease.",
  },
  Bradycardia: {
    description: "Resting heart rate below 60 bpm",
    color: "bg-blue-500",
    recommendations: [
      "Review medications",
      "Check electrolytes & thyroid",
      "Monitor for dizziness or syncope",
      "Consider pacemaker evaluation if < 40 bpm",
    ],
    education:
      "Bradycardia may be normal in athletes or pathological in others.",
  },
  Hypoxemia: {
    description: "Low blood-oxygen saturation",
    color: "bg-purple-600",
    recommendations: [
      "Administer supplemental O₂",
      "Identify and treat underlying cause",
      "Monitor SpO₂ continuously",
      "Consider ABG analysis",
    ],
    education:
      "SpO₂ < 90 % indicates significant hypoxemia that can damage organs.",
  },
  Stage1Hypertension: {
    description: "Mild high blood pressure (130-139/80-89)",
    color: "bg-yellow-400",
    recommendations: [
      "Adopt DASH diet",
      "Limit sodium to < 2 g/day",
      "Exercise 30 min daily",
      "Recheck BP in 1-3 months",
    ],
    education:
      "Early intervention can prevent progression to more severe hypertension.",
  },
  Stage2Hypertension: {
    description: "Moderate-severe high blood pressure (≥140/≥90)",
    color: "bg-red-500",
    recommendations: [
      "Start antihypertensive medication",
      "Home BP monitoring twice daily",
      "Lifestyle modification",
      "Cardiology referral",
    ],
    education:
      "Stage 2 hypertension markedly increases stroke and MI risk.",
  },
  ObesityClass1: {
    description: "BMI 30–34.9 kg/m²",
    color: "bg-amber-500",
    recommendations: [
      "5–10 % weight-loss goal",
      "Calorie-restricted diet",
      "150 min moderate exercise/week",
      "Bariatric evaluation if comorbid",
    ],
    education:
      "Even modest weight loss improves BP, lipids, and glycemic control.",
  },
  ObesityClass2: {
    description: "BMI 35–39.9 kg/m²",
    color: "bg-orange-600",
    recommendations: [
      "Structured weight-loss program",
      "Consider pharmacotherapy",
      "Screen for diabetes & sleep apnea",
      "Bariatric surgery consult",
    ],
    education:
      "Class 2 obesity significantly raises cardiovascular and metabolic risk.",
  },
  Underweight: {
    description: "BMI < 18.5 kg/m²",
    color: "bg-teal-400",
    recommendations: [
      "Nutritionist consultation",
      "Rule out malabsorption or hyperthyroidism",
      "Strength training & protein increase",
      "Monitor for anemia or osteoporosis",
    ],
    education:
      "Underweight can impair immunity and increase fracture risk.",
  }, 
}

const populationAverages = {
  heartRate: { male: 72, female: 76, range: "60-100" },
  spo2: { male: 97, female: 97, range: "95-100" },
  systolicBP: { male: 120, female: 118, range: "100-120" },
  diastolicBP: { male: 80, female: 78, range: "60-80" },
  temperature: { male: 36.8, female: 36.9, range: "36.5-37.2" },
}

export default function EnhancedDiseasePredictionApp() {
  const [patientData, setPatientData] = useState<PatientData>({
    heartRate: 75,
    spo2: 98,
    systolicBP: 120,
    diastolicBP: 80,
    temperature: 36.8,
    fallDetection: "No",
    symptoms: [],
    medicalHistory: [],
    currentMedications: [],
    age: 45,
    gender: "male",
    weight: 70,
    height: 170,
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [isListening, setIsListening] = useState(false)
  const [batchResults, setBatchResults] = useState<any[]>([])
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null)
  const [aiSymptoms, setAiSymptoms] = useState<AISymptomData | null>(null)
  const [symptomAnalysis, setSymptomAnalysis] = useState<AISymptomAnalysis | null>(null)
  const [medicalExplanation, setMedicalExplanation] = useState<MedicalExplanation | null>(null)
  const [personalizedInsight, setPersonalizedInsight] = useState<PersonalizedHealthInsight | null>(null)
  const [symptomEvolution, setSymptomEvolution] = useState<SymptomEvolution | null>(null)
  const [isGeneratingSymptoms, setIsGeneratingSymptoms] = useState(false)
  const [isAnalyzingSymptoms, setIsAnalyzingSymptoms] = useState(false)
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false)
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
const [darkMode, setDarkMode] = useState(false);
  const [ageInput, setAgeInput] = useState(patientData.age.toString())
  const [weightInput, setWeightInput] = useState(patientData.weight.toString())
  const [heightInput, setHeightInput] = useState(patientData.height.toString())
  const [heartRateInput, setHeartRateInput] = useState(patientData.heartRate.toString())
  const [spo2Input, setSpo2Input] = useState(patientData.spo2.toString())
  const [diastolicInput, setDiastolicBPInput] = useState(patientData.diastolicBP.toString())
  const [systolicBPInput, setSystolicBPInput] = useState(patientData.systolicBP.toString())
  const [temperatureInput, setTemperatureInput] = useState(patientData.temperature.toString())

  const [recognition, setRecognition] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = "en-US"
      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        processVoiceInput(transcript)
      }
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      setRecognition(recognitionInstance)
    }
  }, [])

  const processVoiceInput = (transcript: string) => {
    const text = transcript.toLowerCase()
    const heartRateMatch = text.match(/heart rate (\d+)/)
    const heightMatch = text.match(/height (\d+)/)
    const spo2Match = text.match(/spo2 (\d+)/)
    const bpMatch = text.match(/blood pressure (\d+) over (\d+)/)
    const tempMatch = text.match(/temperature (\d+\.?\d*)/)
    const weightMatch = text.match(/weight (\d+)/)
    if (heartRateMatch) {
      updatePatientData("heartRate", Number.parseInt(heartRateMatch[1]))
    }
    if (heightMatch) {
      updatePatientData("height", Number.parseInt(heightMatch[1]))
    }
    if (weightMatch) {
      updatePatientData("weight", Number.parseInt(weightMatch[1]))
    }
    if (spo2Match) {
      updatePatientData("spo2", Number.parseInt(spo2Match[1]))
    }
    if (bpMatch) {
      updatePatientData("systolicBP", Number.parseInt(bpMatch[1]))
      updatePatientData("diastolicBP", Number.parseInt(bpMatch[2]))
    }
    if (tempMatch) {
      updatePatientData("temperature", Number.parseFloat(tempMatch[1]))
    }
  }
const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "en-US"
    utterance.pitch = 1
    utterance.rate = 1
    utterance.volume = 1
    window.speechSynthesis.speak(utterance)
  }
}

  const startVoiceInput = () => {
    if (recognition) {
      setIsListening(true)
      recognition.start()
    }
  }

  const stopVoiceInput = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }

  const generateAISymptoms = async (disease: string) => {
    setIsGeneratingSymptoms(true)
    try {
      const response = await fetch("/api/generate-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease,
          vitals: {
            heartRate: patientData.heartRate,
            spo2: patientData.spo2,
            systolicBP: patientData.systolicBP,
            diastolicBP: patientData.diastolicBP,
            temperature: patientData.temperature,
          },
          demographics: {
            age: patientData.age,
            gender: patientData.gender,
          },
        }),
      })

      if (response.ok) {
        const symptomsData = await response.json()
        setAiSymptoms(symptomsData)

        const allAISymptoms = [...symptomsData.primarySymptoms, ...symptomsData.secondarySymptoms]
        updatePatientData("symptoms", [
          ...patientData.symptoms,
          ...allAISymptoms.filter((s) => !patientData.symptoms.includes(s)),
        ])
      }
    } catch (error) {
      console.error("Error generating symptoms:", error)
    }
    setIsGeneratingSymptoms(false)
  }

  const analyzeSymptoms = async () => {
    if (patientData.symptoms.length === 0) return

    setIsAnalyzingSymptoms(true)
    try {
      const response = await fetch("/api/analyze-symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: patientData.symptoms,
          vitals: {
            heartRate: patientData.heartRate,
            spo2: patientData.spo2,
            systolicBP: patientData.systolicBP,
            diastolicBP: patientData.diastolicBP,
            temperature: patientData.temperature,
          },
          demographics: {
            age: patientData.age,
            gender: patientData.gender,
          },
        }),
      })

      if (response.ok) {
        const analysisData = await response.json()
        setSymptomAnalysis(analysisData)
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error)
    }
    setIsAnalyzingSymptoms(false)
  }

  const generateMedicalExplanation = async (disease: string) => {
    setIsGeneratingExplanation(true)
    try {
      const response = await fetch("/api/medical-explanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          disease,
          symptoms: patientData.symptoms,
          vitals: {
            heartRate: patientData.heartRate,
            spo2: patientData.spo2,
            systolicBP: patientData.systolicBP,
            diastolicBP: patientData.diastolicBP,
            temperature: patientData.temperature,
          },
        }),
      })

      if (response.ok) {
        const explanationData = await response.json()
        setMedicalExplanation(explanationData)
      }
    } catch (error) {
      console.error("Error generating explanation:", error)
    }
    setIsGeneratingExplanation(false)
  }

  const generatePersonalizedInsight = async () => {
    setIsGeneratingInsight(true)
    try {
      const response = await fetch("/api/personalized-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vitals: {
            heartRate: patientData.heartRate,
            spo2: patientData.spo2,
            systolicBP: patientData.systolicBP,
            diastolicBP: patientData.diastolicBP,
            temperature: patientData.temperature,
          },
          demographics: {
            age: patientData.age,
            gender: patientData.gender,
            weight: patientData.weight,
            height: patientData.height,
          },
          medicalHistory: patientData.medicalHistory,
          symptoms: patientData.symptoms,
        }),
      })

      if (response.ok) {
        const insightData = await response.json()
        setPersonalizedInsight(insightData)
      }
    } catch (error) {
      console.error("Error generating personalized insight:", error)
    }
    setIsGeneratingInsight(false)
  }

  const trackSymptomEvolution = async () => {
    if (historicalData.length < 2 || !symptomAnalysis) return

    setIsAnalyzingSymptoms(true)
    try {
      const response = await fetch("/api/symptom-evolution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSymptoms: patientData.symptoms,
          pastSymptoms: historicalData.map((h) => h.vitals.symptoms).flat(),
          currentVitals: {
            heartRate: patientData.heartRate,
            spo2: patientData.spo2,
            systolicBP: patientData.systolicBP,
            diastolicBP: patientData.diastolicBP,
            temperature: patientData.temperature,
          },
          pastVitals: historicalData.map((h) => h.vitals),
        }),
      })

      if (response.ok) {
        const evolutionData = await response.json()
        setSymptomEvolution(evolutionData)
      }
    } catch (error) {
      console.error("Error tracking symptom evolution:", error)
    }
    setIsAnalyzingSymptoms(false)
  }

  const predictDisease = (data: PatientData): PredictionResult => {
    const alerts: string[] = []
    let emergencyAlert = false
    let riskScore = 0

    if (data.heartRate < 40 || data.heartRate > 150) {
      alerts.push(data.heartRate > 150 ? "Critical: Severe Tachycardia" : "Critical: Severe Bradycardia")
      emergencyAlert = true
      riskScore += 30
    } else if (data.heartRate < 60 || data.heartRate > 100) {
      alerts.push(data.heartRate > 100 ? "High Heart Rate" : "Low Heart Rate")
      riskScore += 10
    }

    if (data.spo2 < 85) {
      alerts.push("Critical: Severe Hypoxemia")
      emergencyAlert = true
      riskScore += 35
    } else if (data.spo2 < 95) {
      alerts.push("Low SpO2 Level")
      riskScore += 15
    }else if(data.spo2>100){
      alerts.push("Invalid Data")

      riskScore += 0
    }

    if (data.fallDetection === "Yes") {
  alerts.push("Fall Detected: Possible trauma risk")
  riskScore += 10
}


    if (data.systolicBP > 180 || data.diastolicBP > 110) {
      alerts.push("Critical: Hypertensive Crisis")
      emergencyAlert = true
      riskScore += 40
    } else if (data.systolicBP > 140 || data.diastolicBP > 90) {
      alerts.push("High Blood Pressure")
      riskScore += 20
    }

    if (data.temperature > 39.0 || data.temperature < 35.0) {
      alerts.push("Critical: Severe Temperature Abnormality")
      emergencyAlert = true
      riskScore += 25
    } else if (data.temperature < 36.5 || data.temperature > 37.5) {
      alerts.push("Abnormal Temperature")
      riskScore += 10
    }

    const criticalSymptoms = ["Chest Pain", "Shortness of Breath", "Confusion"]
    const hasCriticalSymptoms = data.symptoms.some((symptom) => criticalSymptoms.includes(symptom))
    if (hasCriticalSymptoms) {
      riskScore += 20
      alerts.push("Critical symptoms detected")
    }

    if (data.age > 65) riskScore += 10
    if (data.medicalHistory.includes("Heart Disease")) riskScore += 15
    if (data.medicalHistory.includes("Diabetes")) riskScore += 10

    let disease = "Normal"
    let confidence = 0.85

    if (data.spo2 < 95 && data.heartRate > 80) {
      disease = "Asthma"
      confidence = 0.92
    } else if (data.systolicBP >= 140 || data.diastolicBP >= 90) {
      disease = "Hypertension"
      confidence = 0.89
    } else if (data.heartRate < 50 || data.heartRate > 120) {
      disease = "Arrhythmia"
      confidence = 0.87
    } else if (data.temperature > 37.5 && data.systolicBP > 130) {
      disease = "Diabetes Mellitus"
      confidence = 0.84
    }

    let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low"
    if (emergencyAlert || riskScore > 60) riskLevel = "Critical"
    else if (riskScore > 40) riskLevel = "High"
    else if (riskScore > 20) riskLevel = "Medium"

    const recommendations = [
      ...diseaseInfo[disease as keyof typeof diseaseInfo].recommendations,
      ...(emergencyAlert ? ["Seek immediate medical attention", "Call emergency services"] : []),
      ...(riskLevel === "High" ? ["Schedule urgent medical consultation"] : []),
    ]

    return {
      disease,
      confidence,
      riskLevel,
      alerts,
      emergencyAlert,
      riskScore,
      recommendations,
      followUpRequired: riskLevel !== "Low" || alerts.length > 0,
    }
  }

  const handlePredict = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const result = predictDisease(patientData)
    setPrediction(result)

    speakText(`Diagnosis: ${result.disease}. Risk Level: ${result.riskLevel}. Recommendations: ${result.recommendations.slice(0, 6).join(". ")}`)
    if (result.disease !== "Normal") {
      await generateAISymptoms(result.disease)
      await generateMedicalExplanation(result.disease)
      await generatePersonalizedInsight()
    }

const newEntry = {
  heartRate: patientData.heartRate,
  spo2: patientData.spo2,
  temperature: patientData.temperature,
   timestamp: new Date().toISOString(),
  
}

// Save to Firestore trends collection
if (auth.currentUser) {
  await addDoc(collection(db, "users", auth.currentUser.uid, "trends"), newEntry)
}

// Keep local history array (optional)
setHistoricalData((prev) => [
  { ...newEntry, prediction: result, vitals: { ...patientData } },
  ...prev.slice(0, 9),
])
    
    if (result.emergencyAlert) {
      setEmergencyAlert("EMERGENCY: Critical vital signs detected. Immediate medical attention required!")
    }

    setIsLoading(false)
    await trackSymptomEvolution()
  }

  const updatePatientData = (field: keyof PatientData, value: string | number | string[]) => {
    setPatientData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      updatePatientData("symptoms", [...patientData.symptoms, symptom])
    } else {
      updatePatientData(
        "symptoms",
        patientData.symptoms.filter((s) => s !== symptom),
      )
    }
  }

  const handleMedicalHistoryChange = (condition: string, checked: boolean) => {
    if (checked) {
      updatePatientData("medicalHistory", [...patientData.medicalHistory, condition])
    } else {
      updatePatientData(
        "medicalHistory",
        patientData.medicalHistory.filter((c) => c !== condition),
      )
    }
  }

  const handleMedicationChange = (medication: string, checked: boolean) => {
    if (checked) {
      updatePatientData("currentMedications", [...patientData.currentMedications, medication])
    } else {
      updatePatientData(
        "currentMedications",
        patientData.currentMedications.filter((m) => m !== medication),
      )
    }
  }


  
const calculateRiskLevel = (entry: any) => {
  let score = 0

  if (entry.heartRate < 50 || entry.heartRate > 130) score += 4
  else if (entry.heartRate < 60 || entry.heartRate > 100) score += 2

  if (entry.spo2 < 90) score += 4
  else if (entry.spo2 < 94) score += 2

  if (entry.temperature > 39 || entry.temperature < 35) score += 3
  else if (entry.temperature > 37.5 || entry.temperature < 36) score += 1

  if (entry.systolicBP > 160 || entry.diastolicBP > 100) score += 3
  else if (entry.systolicBP > 140 || entry.diastolicBP > 90) score += 1

  if (entry.disease !== "Normal") score += 2

  // Adjusted thresholds
if (score >= 9) return "Critical"
if (score >= 7) return "High"
if (score > 4) return "Medium"
return "Low"

}
const getRiskCounts = () => {
  const counts = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  }

  batchResults.forEach((r) => {
    const level = r.riskLevel?.toString() || ""
    if (level === "Low") counts.Low++
    else if (level === "Medium") counts.Medium++
    else if (level === "High") counts.High++
    else if (level === "Critical") counts.Critical++
  })

  return counts
}




const processBatchFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  const text = await file.text()
  const rows = text.trim().split("\n")
  const headers = rows[0].split(",").map((h) => h.trim())

 const data = rows.slice(1).map((row) => {
  const values = row.split(",")
  const entry: any = {}

  headers.forEach((header, index) => {
    entry[header] = values[index]
  })

  const parsed = {
    patientId: entry["Patient Number"],
    heartRate: parseFloat(entry["Heart Rate (bpm)"]),
    spo2: parseFloat(entry["SpO2 Level (%)"]),
    systolicBP: parseFloat(entry["Systolic Blood Pressure (mmHg)"]),
    diastolicBP: parseFloat(entry["Diastolic Blood Pressure (mmHg)"]),
    temperature: parseFloat(entry["Body Temperature (°C)"]),
    disease: entry["Predicted Disease"],
    confidence: parseFloat(entry["Data Accuracy (%)"]) / 100,
  }

  // ✅ Clean return with riskLevel + emergencyAlert added
  return {
    ...parsed,
    riskLevel: calculateRiskLevel(parsed),
    emergencyAlert: false,
  }
})


  setBatchResults(data)
}


  const exportReport = () => {
    if (!prediction) return

    const reportData = {
      timestamp: new Date().toISOString(),
      patientData,
      prediction,
      aiSymptoms,
      symptomAnalysis,
      medicalExplanation,
      personalizedInsight,
      symptomEvolution,
      recommendations: prediction.recommendations,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ai-medical-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

 const checkDrugInteractions = () => {
  const interactions = []
  const meds = patientData.currentMedications

  // Warfarin interactions
  if (meds.includes("Warfarin") && meds.includes("Aspirin")) {
    interactions.push("Warfarin + Aspirin: Increased bleeding risk")
  }
  if (meds.includes("Warfarin") && meds.includes("Omeprazole")) {
    interactions.push("Warfarin + Omeprazole: May increase INR — monitor for bleeding")
  }
  if (meds.includes("Warfarin") && meds.includes("Levothyroxine")) {
    interactions.push("Warfarin + Levothyroxine: May enhance anticoagulant effect — monitor INR")
  }

  // Metformin interactions
  if (meds.includes("Metformin") && meds.includes("Prednisone")) {
    interactions.push("Metformin + Prednisone: May affect blood sugar control")
  }
  if (meds.includes("Metformin") && meds.includes("Insulin")) {
    interactions.push("Metformin + Insulin: Increased risk of hypoglycemia")
  }

  // ACE inhibitor + Diuretic
  if (meds.includes("Lisinopril") && meds.includes("Hydrochlorothiazide")) {
    interactions.push("Lisinopril + Hydrochlorothiazide: Monitor kidney function and electrolytes")
  }

  // BP medications
  if (meds.includes("Lisinopril") && meds.includes("Amlodipine")) {
    interactions.push("Lisinopril + Amlodipine: Risk of low blood pressure — monitor")
  }

  // Metoprolol interactions
  if (meds.includes("Metoprolol") && meds.includes("Insulin")) {
    interactions.push("Metoprolol + Insulin: May mask symptoms of hypoglycemia")
  }
  if (meds.includes("Metoprolol") && meds.includes("Albuterol")) {
    interactions.push("Metoprolol + Albuterol: Reduced bronchodilation — caution in asthma/COPD")
  }

  // Aspirin + Prednisone
  if (meds.includes("Aspirin") && meds.includes("Prednisone")) {
    interactions.push("Aspirin + Prednisone: Increased risk of GI bleeding")
  }

  // Levothyroxine + Omeprazole
  if (meds.includes("Levothyroxine") && meds.includes("Omeprazole")) {
    interactions.push("Levothyroxine + Omeprazole: Reduced thyroid absorption — space doses")
  }

  // Gabapentin + Omeprazole
  if (meds.includes("Gabapentin") && meds.includes("Omeprazole")) {
    interactions.push("Gabapentin + Omeprazole: May reduce Gabapentin absorption")
  }

  return interactions
}
const generateMedicationSchedule = () => {
  const schedule: string[] = []

  patientData.currentMedications.forEach((med) => {
    switch (med) {
      case "Aspirin":
        schedule.push(`${med}: ☀️ Take in the morning, 🍽️ with food`)
        break
      case "Metformin":
        schedule.push(`${med}: ☀️🌙 Take in the morning and evening, 🍽️ with meals`)
        break
      case "Lisinopril":
        schedule.push(`${med}: ☀️ Take once daily in the morning`)
        break
      case "Atorvastatin":
        schedule.push(`${med}: 🌙 Take in the evening or at bedtime`)
        break
      case "Amlodipine":
        schedule.push(`${med}: 🕒 Take at the same time daily`)
        break
      case "Metoprolol":
        schedule.push(`${med}: 🍽️ Take with or immediately after meals`)
        break
      case "Omeprazole":
        schedule.push(`${med}: ☀️ Take before breakfast, empty stomach`)
        break
      case "Albuterol":
        schedule.push(`${med}: 💊 Use as needed for breathing issues`)
        break
      case "Insulin":
        schedule.push(`${med}: 🕒 Use as prescribed, based on meals/blood sugar`)
        break
      case "Warfarin":
        schedule.push(`${med}: 🕒 Take at the same time each day, monitor INR`)
        break
      case "Levothyroxine":
        schedule.push(`${med}: ☀️ Take in the morning, empty stomach, 30 min before food`)
        break
      case "Gabapentin":
        schedule.push(`${med}: 🌙 Take at bedtime, may cause drowsiness`)
        break
      case "Hydrochlorothiazide":
        schedule.push(`${med}: ☀️ Take in the morning to avoid nighttime urination`)
        break
      case "Prednisone":
        schedule.push(`${med}: ☀️ Take in the morning, 🍽️ with food`)
        break
      default:
        schedule.push(`${med}: 💊 Take as prescribed`)
    }
  })

  return schedule
}




const getBatchSummary = () => {
  const summary = {
    totalPatients: batchResults.length,
    emergencyCount: 0,
    avgHeartRate: 0,
    avgSpO2: 0,
    avgTemp: 0,
    topDiseases: {} as Record<string, number>
  }

  if (batchResults.length === 0) return summary

  let totalHR = 0
  let totalSpO2 = 0
  let totalTemp = 0
  let validHR = 0
  let validSpO2 = 0
  let validTemp = 0

  batchResults.forEach((entry) => {
    // Safely accumulate only valid values
    if (!isNaN(entry.heartRate)) {
      totalHR += entry.heartRate
      validHR++
    }

    if (!isNaN(entry.spo2)) {
      totalSpO2 += entry.spo2
      validSpO2++
    }

    if (!isNaN(entry.temperature)) {
      totalTemp += entry.temperature
      validTemp++
    }

    if (entry.emergencyAlert) {
      summary.emergencyCount += 1
    }

    const disease = entry.disease
    if (!summary.topDiseases[disease]) summary.topDiseases[disease] = 0
    summary.topDiseases[disease] += 1
  })

  summary.avgHeartRate = validHR ? Math.round(totalHR / validHR) : 0
  summary.avgSpO2 = validSpO2 ? Math.round(totalSpO2 / validSpO2) : 0
  summary.avgTemp = validTemp ? Number((totalTemp / validTemp).toFixed(1)) : 0

  return summary
}

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case "heartRate":
        if (value >= 60 && value <= 100) return { status: "Normal", color: "text-green-600" }
        if (value < 40 || value > 150) return { status: "Critical", color: "text-red-800" }
        return { status: value > 100 ? "High" : "Low", color: "text-red-600" }
      case "spo2":
        if (value >= 95 && value <=100) return { status: "Normal", color: "text-green-600" }
        if (value < 85) return { status: "Critical", color: "text-red-800" }
        if(value > 100) return { status: "Invalid Data", color: "text-gray-600" }
        return { status: "Low", color: "text-red-600" }
      case "systolicBP":
        if (value >= 100 && value <= 120) return { status: "Normal", color: "text-green-600" }
        if (value > 180) return { status: "Critical", color: "text-red-800" }
        return { status: value > 120 ? "High" : "Low", color: "text-orange-600" }
      case "diastolicBP":
        if (value >= 60 && value <= 80) return { status: "Normal", color: "text-green-600" }
        if (value > 110) return { status: "Critical", color: "text-red-800" }
        return { status: value > 80 ? "High" : "Low", color: "text-orange-600" }
      case "temperature":
        if (value >= 36 && value <= 38) return { status: "Normal", color: "text-green-600" }
        if (value > 39.0 || value < 36.0) return { status: "Critical", color: "text-red-800" }
        return { status: "Abnormal", color: "text-red-600" }
      default:
        return { status: "Unknown", color: "text-gray-600" }
    }
  }

  const getPopulationComparison = (vital: string, value: number) => {
    const pop = populationAverages[vital as keyof typeof populationAverages]
    if (!pop) return null

    const average = patientData.gender === "male" ? pop.male : pop.female
    const diff = (((value - average) / average) * 100).toFixed(1)
    const isHigher = value > average

    return {
      average,
      difference: diff,
      isHigher,
      status: Math.abs(Number.parseFloat(diff)) < 10 ? "Similar" : isHigher ? "Above" : "Below",
    }
  }
const exportBatchToCSV = () => {
  if (!batchResults || batchResults.length === 0) return

  const headers = [
    "Patient ID",
    "Heart Rate",
    "SpO2",
    "Temperature",
    "Systolic BP",
    "Diastolic BP",
    "Age",
    "Gender",
    "Predicted Disease",
    "Risk Level",
    "Confidence (%)",
    "Emergency Alert"
  ]

  const rows = batchResults.map((entry) => [
    entry.patientId,
    entry.heartRate,
    entry.spo2,
    entry.temperature,
    entry.systolicBP,
    entry.diastolicBP,
    entry.age,
    entry.gender,
    entry.disease,
    entry.riskLevel,
    (entry.confidence * 100).toFixed(1),
    entry.emergencyAlert ? "Yes" : "No"
  ])

  const csvContent = [headers, ...rows]
    .map((row) => row.join(","))
    .join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", "batch_results.csv")
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
 useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);



  // Your original page.tsx content
  // Ensure it starts with "use client" at the top
  

return ( <div
      className={`min-h-screen bg-gradient-to-br ${
        darkMode
          ? "from-slate-900 to-slate-800 text-white"
          : "from-slate-50 to-blue-100"
      }`}
    >
      <NavbarWithAuth />


      {emergencyAlert && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4 text-center">
            <Siren className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-red-600 mb-4">MEDICAL EMERGENCY</h2>
            <p className="text-gray-800 mb-6">{emergencyAlert}</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => window.open("tel:112")} className="bg-red-600 hover:bg-red-700">
                <Phone className="h-4 w-4 mr-2" />
                Call 112
              </Button>
              <Button variant="outline" onClick={() => setEmergencyAlert(null)}>
                Acknowledge
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600">AI & ML-Powered Disease Prediction & Comprehensive Medical Education Platform
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <BotIcon className="h-3 w-3" />
              Offline AI Assistant
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              100+ Medical Topics
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <CircuitBoard className="h-3 w-3" />
              IoT Sensor Integration
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="predict" className="w-full space-y-4 sm:space-y-6">
          {/* Enhanced TabsList with Gradient Background */}
          <div className="sticky top-16 z-30 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-xl shadow-lg backdrop-blur-lg bg-opacity-95 p-2">
            <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7 bg-transparent h-auto gap-1">
              <TabsTrigger 
                value="predict" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <Activity className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Prediction</span>
                <span className="sm:hidden">Predict</span>
              </TabsTrigger>
              <TabsTrigger 
                value="theory" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <BookOpen className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Theory</span>
                <span className="sm:hidden">Theory</span>
              </TabsTrigger>
              <TabsTrigger 
                value="ai-assistant" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <BotIcon className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">AI Chat</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
              <TabsTrigger 
                value="batch" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <Users className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Batch</span>
                <span className="sm:hidden">Batch</span>
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <TrendingUp className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Trends</span>
                <span className="sm:hidden">Trends</span>
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <BookOpen className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Education</span>
                <span className="sm:hidden">Edu</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tools" 
                className="text-xs sm:text-sm py-3 px-2 data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg font-medium"
              >
                <Stethoscope className="h-4 w-4 mr-1 hidden sm:inline" />
                <span className="hidden sm:inline">Tools</span>
                <span className="sm:hidden">Tools</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Patient Assessment
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={isListening ? stopVoiceInput : startVoiceInput}
                      className="ml-auto"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      {isListening ? "Stop" : "Voice"}
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Enter patient data for AI-powered health analysis
                    {isListening && <span className="text-red-500 ml-2">🎤 Listening...</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="text"
                        inputMode="numeric"
                        value={ageInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setAgeInput(cleaned)
                          updatePatientData("age", Number(cleaned || "0"))
                        }}
                        placeholder="Enter the Age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={patientData.gender} onValueChange={(value) => updatePatientData("gender", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="text"
                        inputMode="numeric"
                        value={weightInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setWeightInput(cleaned)
                          updatePatientData("weight", Number(cleaned || "0"))
                        }}
                        placeholder="Enter weight"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="text"
                        inputMode="numeric"
                        value={heightInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setHeightInput(cleaned)
                          updatePatientData("height", Number(cleaned || "0"))
                        }}
                        placeholder="Enter height"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="heartRate" className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Heart Rate (bpm)
                      </Label>
                      <Input
                        id="heartRate"
                        type="text"
                        inputMode="numeric"
                        value={heartRateInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setHeartRateInput(cleaned)
                          updatePatientData("heartRate", Number(cleaned || "0"))
                        }}
                        placeholder="Enter Heart Rate"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={getVitalStatus("heartRate", patientData.heartRate).color}>
                          Status: {getVitalStatus("heartRate", patientData.heartRate).status}
                        </span>
                        {getPopulationComparison("heartRate", patientData.heartRate) && (
                          <span className="text-gray-500">
                            Pop avg: {getPopulationComparison("heartRate", patientData.heartRate)?.average}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spo2" className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        SpO2 Level (%)
                      </Label>
                      <Input
                        id="spo2"
                        type="text"
                        inputMode="numeric"
                        value={spo2Input}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setSpo2Input(cleaned)
                          updatePatientData("spo2", Number(cleaned || "0"))
                        }}
                        placeholder="Enter Spo2"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={getVitalStatus("spo2", patientData.spo2).color}>
                          Status: {getVitalStatus("spo2", patientData.spo2).status}
                        </span>
                        {getPopulationComparison("spo2", patientData.spo2) && (
                          <span className="text-gray-500">
                            Pop avg: {getPopulationComparison("spo2", patientData.spo2)?.average}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                      <Input
                        id="systolicBP"
                        type="text"
                        inputMode="numeric"
                        value={systolicBPInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setSystolicBPInput(cleaned)
                          updatePatientData("systolicBP", Number(cleaned || "0"))
                        }}
                        placeholder="Enter Systolic BP"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={getVitalStatus("systolicBP", patientData.systolicBP).color}>
                          Status: {getVitalStatus("systolicBP", patientData.systolicBP).status}
                        </span>
                        {getPopulationComparison("systolicBP", patientData.systolicBP) && (
                          <span className="text-gray-500">
                            Pop avg: {getPopulationComparison("systolicBP", patientData.systolicBP)?.average}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                      <Input
                        id="diastolicBP"
                        type="text"
                        inputMode="numeric"
                        value={diastolicInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setDiastolicBPInput(cleaned)
                          updatePatientData("diastolicBP", Number(cleaned || "0"))
                        }}
                        placeholder="Enter DiastolicBP"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={getVitalStatus("diastolicBP", patientData.diastolicBP).color}>
                          Status: {getVitalStatus("diastolicBP", patientData.diastolicBP).status}
                        </span>
                        {getPopulationComparison("diastolicBP", patientData.diastolicBP) && (
                          <span className="text-gray-500">
                            Pop avg: {getPopulationComparison("diastolicBP", patientData.diastolicBP)?.average}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        Temperature (°C)
                      </Label>
                      <Input
                        id="temperature"
                        type="text"
                        inputMode="numeric"
                        value={temperatureInput}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/^0+/, "")
                          const cleaned = raw.replace(/\D/g, "")
                          setTemperatureInput(cleaned)
                          updatePatientData("temperature", Number(cleaned || "0"))
                        }}
                        placeholder="Enter temperature"
                      />
                      <div className="flex justify-between text-xs">
                        <span className={getVitalStatus("temperature", patientData.temperature).color}>
                          Status: {getVitalStatus("temperature", patientData.temperature).status}
                        </span>
                        {getPopulationComparison("temperature", patientData.temperature) && (
                          <span className="text-gray-500">
                            Pop avg: {getPopulationComparison("temperature", patientData.temperature)?.average}°C
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fallDetection">Fall Detection</Label>
                      <Select
                        value={patientData.fallDetection}
                        onValueChange={(value) => updatePatientData("fallDetection", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                     {/* Symptoms Section */}
                      <div className="space-y-4">
                        <Label>🩺 Common Symptoms</Label>
                        {patientData.symptoms.length > 0 && (
                          <div>
                            <button
                              onClick={() =>
                                setPatientData((prev) => ({
                                  ...prev,
                                  symptoms: []
                                }))
                              }
                              className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md inline-flex items-center gap-1 transition-colors"
                            >
                              🧹 Clear All
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          {commonSymptoms.slice(0, 8).map((symptom) => (
                            <div key={symptom} className="flex items-center space-x-2">
                              <Checkbox
                                id={symptom}
                                checked={patientData.symptoms.includes(symptom)}
                                onCheckedChange={(checked) =>
                                  handleSymptomChange(symptom, checked as boolean)
                                }
                              />
                              <Label htmlFor={symptom} className="text-sm">
                                {symptom}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>


                  {/* Medical History Section */}
                    <div className="space-y-4">
                      <Label>📋 Medical History</Label>

                      {patientData.medicalHistory.length > 0 && (
                        <div>
                          <button
                            onClick={() =>
                              setPatientData((prev) => ({
                                ...prev,
                                medicalHistory: [] 
                              }))
                            }
                            className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md inline-flex items-center gap-1 transition-colors"
                          >
                            🧹 Clear All
                          </button>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        {commonMedicalHistory.slice(0, 6).map((condition) => (
                          <div key={condition} className="flex items-center space-x-2">
                            <Checkbox
                              id={condition}
                              checked={patientData.medicalHistory.includes(condition)}
                              onCheckedChange={(checked) =>
                                handleMedicalHistoryChange(condition, checked as boolean)
                              }
                            />
                            <Label htmlFor={condition} className="text-sm">
                              {condition}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Current Medications Section */}
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2 text-base font-semibold text-gray-800">
                      <Pill className="h-4 w-4" />
                      Current Medications
                    </Label>
                    {patientData.currentMedications.length > 0 && (
                      <div>
                        <button
                          onClick={() =>
                            setPatientData((prev) => ({
                              ...prev,
                              currentMedications: []
                            }))
                          }
                          className="text-xs text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md inline-flex items-center gap-1 transition-colors"
                        >
                          🧹 Clear All
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {commonMedications.slice(0, 14).map((medication) => (
                        <div key={medication} className="flex items-center space-x-2">
                          <Checkbox
                            id={medication}
                            checked={patientData.currentMedications.includes(medication)}
                            onCheckedChange={(checked) =>
                              handleMedicationChange(medication, checked as boolean)
                            }
                          />
                          <Label htmlFor={medication} className="text-sm">
                            {medication}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Drug Interactions Check */}
                  {patientData.currentMedications.length > 1 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-orange-600 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        AI Drug Interaction Check
                      </h4>
                      {checkDrugInteractions().length > 0 ? (
                        <div className="space-y-2">
                          {checkDrugInteractions().map((interaction, index) => (
                            <Alert key={index} variant="default" className="border-orange-200">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{interaction}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      ) : (
                        <p className="text-green-600 text-sm">✓ No known interactions detected by AI analysis</p>
                      )}
                    </div>
                  )}
                  {patientData.currentMedications.length > 0 && (
  <div className="mt-6">
    <h4 className="font-semibold mb-2 text-blue-600 flex items-center gap-2">
      <Pill className="h-5 w-5 text-blue-500" />
      Medication Reminder Schedule
    </h4>
    <ul className="space-y-1 list-disc pl-5 text-sm text-gray-800">
      {generateMedicationSchedule().map((line, index) => (
        <li key={index} dangerouslySetInnerHTML={{ __html: line }} />
      ))}
    </ul>

    <Button
      variant="outline"
      className="mt-3"
      onClick={() => speakText(generateMedicationSchedule().join(". "))}
    >
      🔊 Speak Medication Schedule
    </Button>
  </div>
)}


                  <Button onClick={handlePredict} className="w-full" disabled={isLoading} size="lg">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        AI Predict & Generate Insights
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    AI-Powered Analysis
                    {prediction && (
                      <Button size="sm" variant="outline" onClick={exportReport} className="ml-auto">
                        <Download className="h-4 w-4 mr-2" />
                        Export AI Report
                      </Button>
                    )}
                  </CardTitle>
                  <CardDescription>Comprehensive AI health assessment with personalized insights</CardDescription>
                </CardHeader>
                <CardContent>
                  {prediction ? (
                    <div className="space-y-6">
                      {prediction.emergencyAlert && (
                        <Alert variant="destructive" className="border-red-600 bg-red-50">
                          <Siren className="h-4 w-4" />
                          <AlertDescription className="font-semibold">
                            EMERGENCY: Immediate medical attention required!
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div
                            className={`w-4 h-4 rounded-full ${diseaseInfo[prediction.disease as keyof typeof diseaseInfo].color}`}
                          ></div>
                          <h3 className="text-2xl font-bold text-gray-900">{prediction.disease}</h3>
                          <Sparkles className="h-5 w-5 text-yellow-500" />
                        </div>
                        <p className="text-gray-600 mb-4">
                          {diseaseInfo[prediction.disease as keyof typeof diseaseInfo].description}
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">AI Confidence</p>
                            <p className="text-xl font-semibold">{(prediction.confidence * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Risk Level</p>
                            <Badge
                              variant={
                                prediction.riskLevel === "Critical"
                                  ? "destructive"
                                  : prediction.riskLevel === "High"
                                    ? "destructive"
                                    : prediction.riskLevel === "Medium"
                                      ? "default"
                                      : "secondary"
                              }
                            >
                              {prediction.riskLevel}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Risk Score</p>
                            <p className="text-xl font-semibold">{prediction.riskScore}/100</p>
                          </div>
                        </div>
                      </div>

                      {aiSymptoms && (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="h-4 w-4 text-purple-600" />
                            <h4 className="font-semibold text-purple-800">AI-Generated Symptoms</h4>
                            <Badge variant="secondary" className="text-xs">
                              {aiSymptoms.severity}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-purple-700 mb-1">Primary Symptoms:</p>
                              <div className="flex flex-wrap gap-1">
                                {aiSymptoms.primarySymptoms.map((symptom, index) => (
                                  <Badge
                                    key={index}
                                    variant="default"
                                    className="text-xs bg-purple-100 text-purple-800"
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-700 mb-1">Secondary Symptoms:</p>
                              <div className="flex flex-wrap gap-1">
                                {aiSymptoms.secondarySymptoms.map((symptom, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs border-purple-300 text-purple-700"
                                  >
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-purple-700 mb-1">AI Explanation:</p>
                              <p className="text-sm text-purple-600">{aiSymptoms.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {medicalExplanation && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-green-600" />
                            <h4 className="font-semibold text-green-800">AI Medical Explanation</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-green-700">Condition Overview:</p>
                              <p className="text-green-600">{medicalExplanation.diseaseExplanation}</p>
                            </div>
                            <div>
                              <p className="font-medium text-green-700">Symptom Connection:</p>
                              <p className="text-green-600">{medicalExplanation.symptomConnection}</p>
                            </div>
                            <div>
                              <p className="font-medium text-green-700">What's Happening:</p>
                              <p className="text-green-600">{medicalExplanation.pathophysiology}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {personalizedInsight && (
                        <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="h-4 w-4 text-teal-600" />
                            <h4 className="font-semibold text-teal-800">AI Personalized Health Insights</h4>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-teal-700">Insight:</p>
                              <p className="text-teal-600">{personalizedInsight.insight}</p>
                            </div>
                            <div>
                              <p className="font-medium text-teal-700">Tailored Advice:</p>
                              <ul className="space-y-1">
                                {personalizedInsight.tailoredAdvice.map((advice, index) => (
                                  <li key={index} className="text-teal-600 flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    {advice}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-teal-700">Lifestyle Suggestions:</p>
                              <ul className="space-y-1">
                                {personalizedInsight.lifestyleSuggestions.map((suggestion, index) => (
                                  <li key={index} className="text-teal-600 flex items-start gap-2">
                                    <span className="text-teal-500 mt-1">•</span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Risk Assessment</span>
                          <span>{prediction.riskScore}/100</span>
                        </div>
                        <Progress
                          value={prediction.riskScore}
                          className={`h-3 ${prediction.riskScore > 60 ? "bg-red-100" : prediction.riskScore > 30 ? "bg-yellow-100" : "bg-green-100"}`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Low Risk</span>
                          <span>Medium Risk</span>
                          <span>High Risk</span>
                          <span>Critical</span>
                        </div>
                      </div>

                      {prediction.alerts.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Health Alerts</h4>
                          <div className="space-y-2">
                            {prediction.alerts.map((alert, index) => (
                              <Alert key={index} variant={alert.includes("Critical") ? "destructive" : "default"}>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{alert}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2 text-blue-600">AI Clinical Recommendations</h4>
                        <ul className="space-y-2">
                          {prediction.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {prediction.followUpRequired && (
                        <Alert>
                          <Calendar className="h-4 w-4" />
                          <AlertDescription>AI recommends follow-up appointment within 24-48 hours</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        Enter patient data and click "AI Predict & Generate Insights" to see comprehensive AI analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="space-y-6">
            <TheorySections />
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6">
            <MedicalAIChatbot />
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  AI Batch Patient Processing
                </CardTitle>
                <CardDescription>Upload CSV file to process multiple patients with AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Upload Patient Data CSV</p>
                  <p className="text-sm text-gray-500 mb-4">
                    CSV should include: Patient ID, Heart Rate, SpO2, Systolic BP, Diastolic BP, Temperature, Age,
                    Gender
                  </p>
                  <input ref={fileInputRef} type="file" accept=".csv" onChange={processBatchFile} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                </div>
                    {batchResults.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          AI Batch Processing Results
                        </h3>

                        {/* Existing Result Cards */}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {batchResults.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium">{result.patientId}</p>
                                <p className="text-sm text-gray-600">{result.disease}</p>
                              </div>
                              <div className="text-right">
                                <Badge
                                  variant={
                                    result.riskLevel === "Critical"
                                      ? "destructive"
                                      : result.riskLevel === "High"
                                      ? "destructive"
                                      : result.riskLevel === "Medium"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {result.riskLevel}
                                </Badge>
                                <p className="text-sm text-gray-500">{(result.confidence * 100).toFixed(1)}%</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ✅ New: Batch Summary */}
                        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
                          <h3 className="text-lg font-semibold mb-2 text-gray-800">📊 Batch Summary</h3>
                          {(() => {
                            const summary = getBatchSummary()
                            const topDisease = Object.entries(summary.topDiseases).sort((a, b) => b[1] - a[1])[0]

                            return (
                              <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                                <li>Total Patients: {summary.totalPatients}</li>
                                <li>Emergency Cases: {summary.emergencyCount}</li>
                                <li>Average Heart Rate: {summary.avgHeartRate} bpm</li>
                                <li>Average SpO2: {summary.avgSpO2} %</li>
                                <li>Average Temperature: {summary.avgTemp} °C</li>
                                {topDisease && <li>Most Common Disease: {topDisease[0]} ({topDisease[1]})</li>}
                              </ul>
                            )
                          })()}
                        </div>
                        <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 mb-1">📉 Risk Level Distribution:</h4>
                        {(() => {
                          const risk = getRiskCounts()
                          return (
                            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                              <li>🟢 Low Risk: {risk.Low}</li>
                              <li>🟡 Medium Risk: {risk.Medium}</li>
                              <li>🔴 High Risk: {risk.High}</li>
                              <li>🟥 Critical Risk: {risk.Critical}</li>
                            </ul>
                          )
                        })()}
                      </div>
                      <BatchCharts batchResults={batchResults} getBatchSummary={getBatchSummary} />

                        {/* ✅ New: Export Button */}
                        <Button className="mt-4" variant="secondary" onClick={exportBatchToCSV}>
                          ⬇️ Export Batch to CSV
                        </Button>
                      </div>
                    )}

        
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        AI Health Trends & History
      </CardTitle>
      <CardDescription>
        Track patient health metrics and AI predictions over time.
      </CardDescription>
    </CardHeader>

    <CardContent>
      {historicalData.length > 0 ? (
        <div className="space-y-6">
          {/* 🔢 Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-blue-600">
                {
                  historicalData.filter(
                    (h) => h.prediction.riskLevel === "Low"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-600">Low Risk Assessments</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-yellow-600">
                {
                  historicalData.filter(
                    (h) =>
                      h.prediction.riskLevel === "Medium" ||
                      h.prediction.riskLevel === "High"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-700">Medium / High Risk</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl shadow-sm">
              <p className="text-2xl font-bold text-red-600">
                {
                  historicalData.filter(
                    (h) => h.prediction.riskLevel === "Critical"
                  ).length
                }
              </p>
              <p className="text-sm text-gray-700">Critical Alerts</p>
            </div>
          </div>

          {/* 🧠 Recent Assessments */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-gray-800 text-sm">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Recent AI Assessments
            </h4>

            {historicalData.slice(0, 5).map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition rounded-xl shadow-sm"
              >
                <div className="space-y-1">
                  <p className="font-medium text-blue-800">
                    🦠 {entry.prediction.disease}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleString("en-IN", {
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                 {Array.isArray(entry.aiSymptoms?.primarySymptoms) &&
                    entry.aiSymptoms.primarySymptoms.length > 0 && (
                      <p className="text-xs text-purple-600">
                        AI Symptoms:{" "}
                        {entry.aiSymptoms.primarySymptoms.slice(0, 3).join(", ")}
                        {entry.aiSymptoms.primarySymptoms.length > 3 && " ..."}
                      </p>
                  )}

                </div>

                <div className="text-right space-y-1">
                  <Badge
                    variant={
                      entry.prediction.riskLevel === "Critical"
                        ? "destructive"
                        : entry.prediction.riskLevel === "High"
                        ? "destructive"
                        : entry.prediction.riskLevel === "Medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {entry.prediction.riskLevel}
                  </Badge>
                  <p className="text-xs text-gray-500">
                    Risk Score: {entry.prediction.riskScore}/100
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 space-y-2">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="font-medium">No historical data yet.</p>
          <p className="text-sm">Run an AI assessment to begin tracking trends.</p>
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>


          <TabsContent value="education" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(diseaseInfo).map(([disease, info]) => (
                <Card key={disease}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${info.color}`}></div>
                      {disease}
                    </CardTitle>
                    <CardDescription>{info.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Clinical Recommendations:</h4>
                      <ul className="space-y-1">
                        {info.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 ">Education:</h4>
                      <p className="text-sm text-gray-600">{info.education}</p>
                    </div>
                    
                  </CardContent>
                </Card>
                
              ))}
              
            </div>
            

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  AI-Enhanced Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Cardiovascular Health</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Regular aerobic exercise (150 min/week)</li>
                      <li>• Maintain healthy weight (BMI 18.5-24.9)</li>
                      <li>• Limit sodium intake (&lt;2300mg/day)</li>
                      <li>• Don't smoke or use tobacco</li>
                      <li>• Manage stress through relaxation techniques</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Respiratory Health</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Avoid air pollutants and allergens</li>
                      <li>• Practice deep breathing exercises</li>
                      <li>• Stay up to date with vaccinations</li>
                      <li>• Maintain good indoor air quality</li>
                      <li>• Seek prompt treatment for respiratory infections</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Game />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <OfflineRiskCalculators patientData={patientData} />
          </TabsContent>
        </Tabs>
      </div>
      </div>
      
  )
}
