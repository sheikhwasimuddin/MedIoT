"use client"

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
  ArrowLeft,
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

interface HistoricalData {
  timestamp: Date
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
  const [isGeneratingSymptoms, setIsGeneratingSymptoms] = useState(false)
  const [isAnalyzingSymptoms, setIsAnalyzingSymptoms] = useState(false)
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Voice recognition setup
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
    const heightMatch=text.match(/height(\d+)/)
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

        // Auto-add AI-generated symptoms to patient data
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

  // AI-powered symptom analysis
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

  // AI-powered medical explanation
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

  // Enhanced prediction with emergency detection
  const predictDisease = (data: PatientData): PredictionResult => {
    const alerts: string[] = []
    let emergencyAlert = false
    let riskScore = 0

    // Critical value detection
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

    // Symptom-based risk assessment
    const criticalSymptoms = ["Chest Pain", "Shortness of Breath", "Confusion"]
    const hasCriticalSymptoms = data.symptoms.some((symptom) => criticalSymptoms.includes(symptom))
    if (hasCriticalSymptoms) {
      riskScore += 20
      alerts.push("Critical symptoms detected")
    }

    // Age and comorbidity factors
    if (data.age > 65) riskScore += 10
    if (data.medicalHistory.includes("Heart Disease")) riskScore += 15
    if (data.medicalHistory.includes("Diabetes")) riskScore += 10

    // Disease prediction logic
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

    // Determine risk level
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

    // Generate AI symptoms for the predicted disease
    if (result.disease !== "Normal") {
      await generateAISymptoms(result.disease)
      await generateMedicalExplanation(result.disease)
    }

    // Add to historical data
    const newEntry: HistoricalData = {
      timestamp: new Date(),
      prediction: result,
      vitals: { ...patientData },
    }
    setHistoricalData((prev) => [newEntry, ...prev.slice(0, 9)]) // Keep last 10 entries

    // Emergency alert
    if (result.emergencyAlert) {
      setEmergencyAlert("EMERGENCY: Critical vital signs detected. Immediate medical attention required!")
    }

    setIsLoading(false)
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

  const processBatchFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target?.result as string
        const lines = csv.split("\n")
        const headers = lines[0].split(",")
        const results = []

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(",")
            const patientData: any = {}
            headers.forEach((header, index) => {
              patientData[header.trim()] = values[index]?.trim()
            })

            // Convert to our format and predict
            const convertedData: PatientData = {
              heartRate: Number(patientData["Heart Rate"]) || 75,
              spo2: Number(patientData["SpO2"]) || 98,
              systolicBP: Number(patientData["Systolic BP"]) || 120,
              diastolicBP: Number(patientData["Diastolic BP"]) || 80,
              temperature: Number(patientData["Temperature"]) || 36.8,
              fallDetection: patientData["Fall Detection"] || "No",
              symptoms: [],
              medicalHistory: [],
              currentMedications: [],
              age: Number(patientData["Age"]) || 45,
              gender: patientData["Gender"] || "male",
              weight: Number(patientData["Weight"]) || 70,
              height: Number(patientData["Height"]) || 170,
            }

            const prediction = predictDisease(convertedData)
            results.push({
              patientId: patientData["Patient ID"] || `Patient ${i}`,
              ...prediction,
            })
          }
        }
        setBatchResults(results)
      }
      reader.readAsText(file)
    }
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

    // Simple interaction checking (in real app, use proper drug database)
    if (meds.includes("Warfarin") && meds.includes("Aspirin")) {
      interactions.push("Warfarin + Aspirin: Increased bleeding risk")
    }
    if (meds.includes("Metformin") && meds.includes("Prednisone")) {
      interactions.push("Metformin + Prednisone: May affect blood sugar control")
    }
    if (meds.includes("Lisinopril") && meds.includes("Hydrochlorothiazide")) {
      interactions.push("ACE inhibitor + Diuretic: Monitor kidney function")
    }

    return interactions
  }

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case "heartRate":
        if (value >= 60 && value <= 100) return { status: "Normal", color: "text-green-600" }
        if (value < 40 || value > 150) return { status: "Critical", color: "text-red-800" }
        return { status: value > 100 ? "High" : "Low", color: "text-red-600" }
      case "spo2":
        if (value >= 95) return { status: "Normal", color: "text-green-600" }
        if (value < 85) return { status: "Critical", color: "text-red-800" }
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
        if (value >= 36.5 && value <= 37.2) return { status: "Normal", color: "text-green-600" }
        if (value > 39.0 || value < 35.0) return { status: "Critical", color: "text-red-800" }
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
const [ageInput, setAgeInput] = useState(patientData.age.toString())
const [weightInput, setWeightInput] = useState(patientData.weight.toString())
const [heightInput, setHeightInput] = useState(patientData.height.toString())
const [heartRateInput, setHeartRateInput] = useState(patientData.heartRate.toString())
const [spo2Input, setSpo2Input] = useState(patientData.spo2.toString())
const [diastolicInput, setDiastolicBPInput] = useState(patientData.diastolicBP.toString())
const [systolicBPInput, setSystolicBPInput] = useState(patientData.systolicBP.toString())
const [temperatureInput, setTemperatureInput] = useState(patientData.temperature.toString())
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Emergency Alert Modal */}
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

      <div className="max-w-7xl mx-auto">
  {/* Header with Back Button */}
  <div className="flex items-center justify-between mb-8 px-4">
    {/* Back Button */}
   <button
  onClick={() => window.location.href = "/"}
  className="text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 px-4 py-2 rounded-full shadow-md transition-all flex items-center gap-2"
>
  <ArrowLeft className="w-5 h-5" />
  Back To Home
</button>

    {/* Logo Centered */}
    <div className="flex flex-col items-center mx-auto">
      <div className="flex items-center justify-center gap-3 mb-4">
        <img src="/logo.png" alt="MedIoT Logo" className="w-64 h-64 mix-blend-multiply" />
      </div>
      <p className="text-xl text-gray-600 text-center">
        AI&ML-Powered Disease Prediction & Symptom Analysis System
      </p>
    </div>

    {/* Invisible div to balance layout */}
    <div className="w-[100px]" />
  </div>

        <Tabs defaultValue="predict" className="w-full space-y-4 sm:space-y-6">
  <TabsList className="flex w-full">
    <TabsTrigger 
      value="predict" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Prediction</span>
      <span className="sm:hidden">Predict</span>
    </TabsTrigger>
    <TabsTrigger 
      value="analysis" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Power Bi</span>
      <span className="sm:hidden">Analysis</span>
    </TabsTrigger>
    <TabsTrigger 
      value="batch" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Batch Process</span>
      <span className="sm:hidden">Batch</span>
    </TabsTrigger>
    <TabsTrigger 
      value="trends" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Trends</span>
      <span className="sm:hidden">Trends</span>
    </TabsTrigger>
    <TabsTrigger 
      value="education" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Education</span>
      <span className="sm:hidden">Edu</span>
    </TabsTrigger>
    <TabsTrigger 
      value="tools" 
      className="flex-1 text-xs sm:text-sm py-2 px-1 truncate text-center"
    >
      <span className="hidden sm:inline">Tools</span>
      <span className="sm:hidden">Tools</span>
    </TabsTrigger>
  </TabsList>


          <TabsContent value="predict" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Input Form */}
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
                  {/* Demographics */}
                  
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

                  {/* Vital Signs */}
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

                  <Button onClick={handlePredict} className="w-full" disabled={isLoading} size="lg">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        AI Predict & Generate Symptoms
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Results with AI */}
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
                  <CardDescription>Comprehensive AI health assessment with symptom generation</CardDescription>
                </CardHeader>
                <CardContent>
                  {prediction ? (
                    <div className="space-y-6">
                      {/* Emergency Banner */}
                      {prediction.emergencyAlert && (
                        <Alert variant="destructive" className="border-red-600 bg-red-50">
                          <Siren className="h-4 w-4" />
                          <AlertDescription className="font-semibold">
                            EMERGENCY: Immediate medical attention required!
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Main Prediction */}
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

                      {/* AI Generated Symptoms */}
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

                      {/* Medical Explanation */}
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

                      {/* Risk Score Progress */}
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

                      {/* Alerts */}
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

                      {/* Enhanced Recommendations */}
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

                      {/* Follow-up Required */}
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
                        Enter patient data and click "AI Predict & Generate Symptoms" to see comprehensive AI analysis
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Enhanced Symptom Checker with AI */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    AI Symptom Assessment
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={analyzeSymptoms}
                      disabled={isAnalyzingSymptoms || patientData.symptoms.length === 0}
                      className="ml-auto"
                    >
                      {isAnalyzingSymptoms ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      AI Analyze
                    </Button>
                  </CardTitle>
                  <CardDescription>Select symptoms for AI-powered analysis and insights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {commonSymptoms.map((symptom) => (
                      <div key={symptom} className="flex items-center space-x-2">
                        <Checkbox
                          id={symptom}
                          checked={patientData.symptoms.includes(symptom)}
                          onCheckedChange={(checked) => handleSymptomChange(symptom, checked as boolean)}
                        />
                        <Label htmlFor={symptom} className="text-sm">
                          {symptom}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Selected Symptoms Display */}
                  {patientData.symptoms.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Selected Symptoms ({patientData.symptoms.length}):
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {patientData.symptoms.map((symptom, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <Label htmlFor="additionalSymptoms">Additional Symptoms</Label>
                    <Textarea id="additionalSymptoms" placeholder="Describe any other symptoms..." className="mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* AI Symptom Analysis Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    AI Symptom Analysis
                  </CardTitle>
                  <CardDescription>Intelligent analysis of symptom patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  {symptomAnalysis ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                        <h4 className="font-semibold text-indigo-800 mb-2">AI Analysis</h4>
                        <p className="text-sm text-indigo-700">{symptomAnalysis.analysis}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2 text-orange-600">Possible Conditions</h4>
                        <div className="flex flex-wrap gap-2">
                          {symptomAnalysis.possibleConditions.map((condition, index) => (
                            <Badge key={index} variant="outline" className="border-orange-300 text-orange-700">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Urgency Level</h4>
                        <Badge
                          variant={
                            symptomAnalysis.urgencyLevel === "critical"
                              ? "destructive"
                              : symptomAnalysis.urgencyLevel === "high"
                                ? "destructive"
                                : symptomAnalysis.urgencyLevel === "medium"
                                  ? "default"
                                  : "secondary"
                          }
                        >
                          {symptomAnalysis.urgencyLevel.toUpperCase()}
                        </Badge>
                      </div>

                      {symptomAnalysis.redFlags.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-red-600">Red Flag Symptoms</h4>
                          <ul className="space-y-1">
                            {symptomAnalysis.redFlags.map((flag, index) => (
                              <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                                <AlertTriangle className="h-3 w-3 mt-1 flex-shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">AI Recommendations</h4>
                        <ul className="space-y-1">
                          {symptomAnalysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                              <span className="text-green-500 mt-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {symptomAnalysis.followUpQuestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2 text-blue-600">Follow-up Questions</h4>
                          <ul className="space-y-1">
                            {symptomAnalysis.followUpQuestions.map((question, index) => (
                              <li key={index} className="text-sm text-blue-600 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">?</span>
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select symptoms and click "AI Analyze" to get intelligent symptom analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                  <CardDescription>Select relevant medical conditions for enhanced AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {commonMedicalHistory.map((condition) => (
                      <div key={condition} className="flex items-center space-x-2">
                        <Checkbox
                          id={condition}
                          checked={patientData.medicalHistory.includes(condition)}
                          onCheckedChange={(checked) => handleMedicalHistoryChange(condition, checked as boolean)}
                        />
                        <Label htmlFor={condition} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Current Medications
                  </CardTitle>
                  <CardDescription>Select current medications for AI-powered drug interaction analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {commonMedications.map((medication) => (
                      <div key={medication} className="flex items-center space-x-2">
                        <Checkbox
                          id={medication}
                          checked={patientData.currentMedications.includes(medication)}
                          onCheckedChange={(checked) => handleMedicationChange(medication, checked as boolean)}
                        />
                        <Label htmlFor={medication} className="text-sm">
                          {medication}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Drug Interactions */}
                  {patientData.currentMedications.length > 1 && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2 text-orange-600">AI Drug Interaction Check</h4>
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Comprehensive Power Bi Health Analysis
                </CardTitle>
                <CardDescription>Detailed powered Bi medical insights and explanations</CardDescription>
              </CardHeader>
              <CardContent>
                
                  <div className="text-center py-12 text-gray-500">
                    
        <iframe 
  title="ANALYSIS" 
  width="100%" 
  height="300"
  className="sm:h-[541.25px]"
  src="https://app.powerbi.com/reportEmbed?reportId=67850939-2401-4344-bdb0-e24e0c8015b6&autoAuth=true&embeddedDemo=true" 
  frameBorder="0" 
  allowFullScreen
></iframe>
                  </div>
                
              </CardContent>
            </Card>
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

                {/* Batch Results */}
                {batchResults.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      AI Batch Processing Results
                    </h3>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  AI Health Trends & History
                </CardTitle>
                <CardDescription>Track patient health metrics and AI predictions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {historicalData.length > 0 ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {historicalData.filter((h) => h.prediction.riskLevel === "Low").length}
                        </div>
                        <div className="text-sm text-gray-600">Low Risk Assessments</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {
                            historicalData.filter(
                              (h) => h.prediction.riskLevel === "Medium" || h.prediction.riskLevel === "High",
                            ).length
                          }
                        </div>
                        <div className="text-sm text-gray-600">Medium/High Risk</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {historicalData.filter((h) => h.prediction.riskLevel === "Critical").length}
                        </div>
                        <div className="text-sm text-gray-600">Critical Alerts</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Recent AI Assessments
                      </h4>
                      {historicalData.slice(0, 5).map((entry, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{entry.prediction.disease}</p>
                            <p className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</p>
                            {entry.aiSymptoms && (
                              <p className="text-xs text-purple-600">
                                AI Symptoms: {entry.aiSymptoms.primarySymptoms.slice(0, 2).join(", ")}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
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
                            <p className="text-sm text-gray-500">Risk: {entry.prediction.riskScore}/100</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No historical data available. Make some AI predictions to see trends.</p>
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

            {/* Health Tips */}
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
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BMI Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>AI BMI Calculator</CardTitle>
                  <CardDescription>Calculate Body Mass Index with AI insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {(patientData.weight / Math.pow(patientData.height / 100, 2)).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">BMI</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {patientData.weight / Math.pow(patientData.height / 100, 2) < 18.5
                          ? "Underweight"
                          : patientData.weight / Math.pow(patientData.height / 100, 2) < 25
                            ? "Normal"
                            : patientData.weight / Math.pow(patientData.height / 100, 2) < 30
                              ? "Overweight"
                              : "Obese"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>AI 10-Year CVD Risk</CardTitle>
                  <CardDescription>AI-enhanced cardiovascular risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.min(
                          Math.max(
                            (patientData.age - 40) * 0.5 +
                              (patientData.systolicBP > 140 ? 5 : 0) +
                              (patientData.medicalHistory.includes("Diabetes") ? 3 : 0) +
                              (patientData.currentMedications.includes("Aspirin") ? -2 : 0),
                            0,
                          ),
                          30,
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-gray-600">10-Year Risk</div>
                      <div className="text-xs text-gray-500 mt-1">AI-calculated based on multiple factors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => window.open("tel:112")} className="w-full bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Services (112)
                  </Button>
                  <Button onClick={() => window.open("tel:1800-425-1213")} variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Poison Control (1800-425-1213)
                  </Button>
                  <Button onClick={() => window.open("tel:988")} variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Crisis Lifeline (988)
                  </Button>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    AI Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={exportReport} variant="outline" className="w-full" disabled={!prediction}>
                    <Download className="h-4 w-4 mr-2" />
                    Export AI Report
                  </Button>
                  <Button
                    onClick={() => {
                      const data = JSON.stringify(historicalData, null, 2)
                      const blob = new Blob([data], { type: "application/json" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `ai-health-history-${Date.now()}.json`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={historicalData.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export AI Health History
                  </Button>
                  <Button
                    onClick={() => {
                      setHistoricalData([])
                      setPrediction(null)
                      setAiSymptoms(null)
                      setSymptomAnalysis(null)
                      setMedicalExplanation(null)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Data
                  </Button>
                </CardContent>
                
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
