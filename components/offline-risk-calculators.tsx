"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calculator,
  Heart,
  Activity,
  AlertTriangle,
  TrendingUp,
  Target,
  Info,
  CheckCircle,
  BarChart3,
  Stethoscope,
  Brain,
  Download,
} from "lucide-react"

interface RiskCalculatorProps {
  patientData?: any
}

export default function OfflineRiskCalculators({ patientData }: RiskCalculatorProps) {
  const [bmiData, setBmiData] = useState({ height: "", weight: "" })
  const [cvdData, setCvdData] = useState({
    age: "",
    gender: "male",
    totalCholesterol: "",
    hdlCholesterol: "",
    systolicBP: patientData?.systolicBP?.toString() || "",
    smoker: "no",
    diabetes: "no",
    hypertensionTreatment: "no"
  })
  const [chadsData, setChadsData] = useState({
    chf: false,
    hypertension: false,
    age75Plus: false,
    diabetes: false,
    strokeHistory: false,
    vascularDisease: false,
    age65to74: false,
    femaleGender: false
  })
  const [newsData, setNewsData] = useState({
    respiratoryRate: patientData?.respiratoryRate?.toString() || "16",
    oxygenSaturation: patientData?.spo2?.toString() || "98",
    supplementalOxygen: "air",
    temperature: patientData?.temperature?.toString() || "36.8",
    systolicBP: patientData?.systolicBP?.toString() || "120",
    heartRate: patientData?.heartRate?.toString() || "75",
    consciousness: "alert"
  })

  // BMI Calculator
  const calculateBMI = () => {
    const height = parseFloat(bmiData.height) / 100 // Convert cm to m
    const weight = parseFloat(bmiData.weight)
    
    if (!height || !weight) return null
    
    const bmi = weight / (height * height)
    let category = ""
    let risk = ""
    let color = ""
    
    if (bmi < 18.5) {
      category = "Underweight"
      risk = "Increased risk of malnutrition"
      color = "text-blue-600"
    } else if (bmi < 25) {
      category = "Normal weight"
      risk = "Low health risk"
      color = "text-green-600"
    } else if (bmi < 30) {
      category = "Overweight"
      risk = "Increased risk of cardiovascular disease"
      color = "text-yellow-600"
    } else if (bmi < 35) {
      category = "Obesity Class I"
      risk = "High risk of cardiovascular disease"
      color = "text-orange-600"
    } else if (bmi < 40) {
      category = "Obesity Class II"
      risk = "Very high risk of cardiovascular disease"
      color = "text-red-600"
    } else {
      category = "Obesity Class III"
      risk = "Extremely high risk of cardiovascular disease"
      color = "text-red-800"
    }
    
    return { bmi: bmi.toFixed(1), category, risk, color }
  }

  // Cardiovascular Risk Calculator (Framingham-based)
  const calculateCVDRisk = () => {
    const age = parseInt(cvdData.age)
    const totalChol = parseInt(cvdData.totalCholesterol)
    const hdlChol = parseInt(cvdData.hdlCholesterol)
    const systolicBP = parseInt(cvdData.systolicBP)
    
    if (!age || !totalChol || !hdlChol || !systolicBP) return null
    
    let points = 0
    
    // Age points (simplified)
    if (cvdData.gender === "male") {
      if (age >= 20 && age <= 34) points += -9
      else if (age >= 35 && age <= 39) points += -4
      else if (age >= 40 && age <= 44) points += 0
      else if (age >= 45 && age <= 49) points += 3
      else if (age >= 50 && age <= 54) points += 6
      else if (age >= 55 && age <= 59) points += 8
      else if (age >= 60 && age <= 64) points += 10
      else if (age >= 65 && age <= 69) points += 11
      else if (age >= 70 && age <= 74) points += 12
      else if (age >= 75) points += 13
    } else {
      if (age >= 20 && age <= 34) points += -7
      else if (age >= 35 && age <= 39) points += -3
      else if (age >= 40 && age <= 44) points += 0
      else if (age >= 45 && age <= 49) points += 3
      else if (age >= 50 && age <= 54) points += 6
      else if (age >= 55 && age <= 59) points += 8
      else if (age >= 60 && age <= 64) points += 10
      else if (age >= 65 && age <= 69) points += 12
      else if (age >= 70 && age <= 74) points += 14
      else if (age >= 75) points += 16
    }
    
    // Cholesterol points
    if (totalChol < 160) points += 0
    else if (totalChol < 200) points += 4
    else if (totalChol < 240) points += 7
    else if (totalChol < 280) points += 9
    else points += 11
    
    // HDL points
    if (hdlChol >= 60) points += -1
    else if (hdlChol >= 50) points += 0
    else if (hdlChol >= 40) points += 1
    else points += 2
    
    // Blood pressure points
    if (systolicBP < 120) points += 0
    else if (systolicBP < 130) points += 0
    else if (systolicBP < 140) points += 1
    else if (systolicBP < 160) points += 1
    else points += 2
    
    // Risk factors
    if (cvdData.smoker === "yes") points += 8
    if (cvdData.diabetes === "yes") points += 6
    
    // Convert points to risk percentage (simplified)
    let riskPercent = 0
    if (points < 0) riskPercent = 1
    else if (points < 5) riskPercent = 2
    else if (points < 10) riskPercent = 4
    else if (points < 15) riskPercent = 8
    else if (points < 20) riskPercent = 16
    else if (points < 25) riskPercent = 25
    else riskPercent = 30
    
    let riskLevel = "Low"
    let color = "text-green-600"
    
    if (riskPercent >= 20) {
      riskLevel = "High"
      color = "text-red-600"
    } else if (riskPercent >= 10) {
      riskLevel = "Moderate"
      color = "text-yellow-600"
    }
    
    return { riskPercent, riskLevel, color, points }
  }

  // CHADS2-VASc Score Calculator
  const calculateCHADS2VASc = () => {
    let score = 0
    
    if (chadsData.chf) score += 1
    if (chadsData.hypertension) score += 1
    if (chadsData.age75Plus) score += 2
    if (chadsData.diabetes) score += 1
    if (chadsData.strokeHistory) score += 2
    if (chadsData.vascularDisease) score += 1
    if (chadsData.age65to74) score += 1
    if (chadsData.femaleGender) score += 1
    
    let strokeRisk = ""
    let recommendation = ""
    let color = ""
    
    if (score === 0) {
      strokeRisk = "0.2% per year"
      recommendation = "No anticoagulation recommended"
      color = "text-green-600"
    } else if (score === 1) {
      strokeRisk = "0.6% per year"
      recommendation = "Consider anticoagulation"
      color = "text-yellow-600"
    } else if (score === 2) {
      strokeRisk = "2.2% per year"
      recommendation = "Anticoagulation recommended"
      color = "text-orange-600"
    } else {
      strokeRisk = `${Math.min(score * 2, 15)}% per year`
      recommendation = "Strong anticoagulation recommendation"
      color = "text-red-600"
    }
    
    return { score, strokeRisk, recommendation, color }
  }

  // NEWS2 (National Early Warning Score) Calculator
  const calculateNEWS2 = () => {
    let totalScore = 0
    
    // Respiratory Rate
    const rr = parseInt(newsData.respiratoryRate)
    if (rr <= 8) totalScore += 3
    else if (rr <= 11) totalScore += 1
    else if (rr <= 20) totalScore += 0
    else if (rr <= 24) totalScore += 2
    else totalScore += 3
    
    // Oxygen Saturation
    const spo2 = parseInt(newsData.oxygenSaturation)
    if (spo2 <= 83) totalScore += 3
    else if (spo2 <= 85) totalScore += 2
    else if (spo2 <= 87) totalScore += 1
    else totalScore += 0
    
    // Supplemental Oxygen
    if (newsData.supplementalOxygen === "oxygen") totalScore += 2
    
    // Temperature
    const temp = parseFloat(newsData.temperature)
    if (temp <= 35.0) totalScore += 3
    else if (temp <= 36.0) totalScore += 1
    else if (temp <= 38.0) totalScore += 0
    else if (temp <= 39.0) totalScore += 1
    else totalScore += 2
    
    // Systolic BP
    const sbp = parseInt(newsData.systolicBP)
    if (sbp <= 70) totalScore += 3
    else if (sbp <= 80) totalScore += 2
    else if (sbp <= 100) totalScore += 1
    else if (sbp <= 110) totalScore += 0
    else if (sbp <= 219) totalScore += 0
    else totalScore += 3
    
    // Heart Rate
    const hr = parseInt(newsData.heartRate)
    if (hr <= 40) totalScore += 3
    else if (hr <= 50) totalScore += 1
    else if (hr <= 90) totalScore += 0
    else if (hr <= 110) totalScore += 1
    else if (hr <= 130) totalScore += 2
    else totalScore += 3
    
    // Consciousness
    if (newsData.consciousness === "voice") totalScore += 3
    else if (newsData.consciousness === "pain") totalScore += 3
    else if (newsData.consciousness === "unresponsive") totalScore += 3
    
    let riskLevel = ""
    let frequency = ""
    let color = ""
    let action = ""
    
    if (totalScore === 0) {
      riskLevel = "Low"
      frequency = "Minimum 12 hourly"
      color = "text-green-600"
      action = "Continue routine monitoring"
    } else if (totalScore <= 4) {
      riskLevel = "Low-Medium"
      frequency = "Minimum 4-6 hourly"
      color = "text-yellow-600"
      action = "Increase monitoring frequency"
    } else if (totalScore <= 6) {
      riskLevel = "Medium"
      frequency = "Minimum 1 hourly"
      color = "text-orange-600"
      action = "Urgent response threshold"
    } else {
      riskLevel = "High"
      frequency = "Continuous monitoring"
      color = "text-red-600"
      action = "Emergency response threshold"
    }
    
    return { totalScore, riskLevel, frequency, color, action }
  }

  // Export functions for each calculator
  const exportBMIReport = () => {
    const result = calculateBMI()
    if (!result) return

    const reportData = {
      timestamp: new Date().toISOString(),
      calculator: "BMI",
      input: bmiData,
      result,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bmi-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCVDReport = () => {
    const result = calculateCVDRisk()
    if (!result) return

    const reportData = {
      timestamp: new Date().toISOString(),
      calculator: "Cardiovascular Risk",
      input: cvdData,
      result,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cvd-risk-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportCHADSReport = () => {
    const result = calculateCHADS2VASc()
    const reportData = {
      timestamp: new Date().toISOString(),
      calculator: "CHADS₂-VASc",
      input: chadsData,
      result,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chads2-vasc-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportNEWS2Report = () => {
    const result = calculateNEWS2()
    const reportData = {
      timestamp: new Date().toISOString(),
      calculator: "NEWS2",
      input: newsData,
      result,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `news2-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const bmiResult = calculateBMI()
  const cvdResult = calculateCVDRisk()
  const chadsResult = calculateCHADS2VASc()
  const newsResult = calculateNEWS2()

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            Offline Medical Risk Calculators
          </CardTitle>
          <CardDescription>
            Evidence-based clinical calculators for risk assessment and decision support
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="bmi" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bmi">BMI Calculator</TabsTrigger>
          <TabsTrigger value="cvd">CVD Risk</TabsTrigger>
          <TabsTrigger value="chads">CHADS₂-VASc</TabsTrigger>
          <TabsTrigger value="news">NEWS2 Score</TabsTrigger>
        </TabsList>

        {/* BMI Calculator */}
        <TabsContent value="bmi" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Body Mass Index Calculator
                </CardTitle>
                <CardDescription>Calculate BMI and assess weight-related health risks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={bmiData.height}
                      onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="70"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  BMI Result
                  {bmiResult && (
                    <Button size="sm" variant="outline" onClick={exportBMIReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export BMI Report
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bmiResult ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{bmiResult.bmi}</div>
                      <div className={`text-lg font-medium ${bmiResult.color}`}>
                        {bmiResult.category}
                      </div>
                    </div>
                    <Progress value={Math.min((parseFloat(bmiResult.bmi) / 40) * 100, 100)} className="h-2" />
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>{bmiResult.risk}</AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Enter height and weight to calculate BMI
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cardiovascular Risk */}
        <TabsContent value="cvd" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  10-Year Cardiovascular Risk
                </CardTitle>
                <CardDescription>Framingham-based cardiovascular risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cvd-age">Age</Label>
                    <Input
                      id="cvd-age"
                      type="number"
                      value={cvdData.age}
                      onChange={(e) => setCvdData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="45"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvd-gender">Gender</Label>
                    <Select value={cvdData.gender} onValueChange={(value) => setCvdData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="total-chol">Total Cholesterol (mg/dL)</Label>
                    <Input
                      id="total-chol"
                      type="number"
                      value={cvdData.totalCholesterol}
                      onChange={(e) => setCvdData(prev => ({ ...prev, totalCholesterol: e.target.value }))}
                      placeholder="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hdl-chol">HDL Cholesterol (mg/dL)</Label>
                    <Input
                      id="hdl-chol"
                      type="number"
                      value={cvdData.hdlCholesterol}
                      onChange={(e) => setCvdData(prev => ({ ...prev, hdlCholesterol: e.target.value }))}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cvd-sbp">Systolic Blood Pressure (mmHg)</Label>
                  <Input
                    id="cvd-sbp"
                    type="number"
                    value={cvdData.systolicBP}
                    onChange={(e) => setCvdData(prev => ({ ...prev, systolicBP: e.target.value }))}
                    placeholder="120"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smoker">Current Smoker</Label>
                    <Select value={cvdData.smoker} onValueChange={(value) => setCvdData(prev => ({ ...prev, smoker: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="diabetes">Diabetes</Label>
                    <Select value={cvdData.diabetes} onValueChange={(value) => setCvdData(prev => ({ ...prev, diabetes: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Cardiovascular Risk Result
                  {cvdResult && (
                    <Button size="sm" variant="outline" onClick={exportCVDReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CVD Report
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cvdResult ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{cvdResult.riskPercent}%</div>
                      <div className={`text-lg font-medium ${cvdResult.color}`}>
                        {cvdResult.riskLevel} Risk
                      </div>
                    </div>
                    <Progress value={Math.min(cvdResult.riskPercent * 3, 100)} className="h-2" />
                    <Alert>
                      <Heart className="h-4 w-4" />
                      <AlertDescription>
                        10-year risk of cardiovascular disease. Risk points: {cvdResult.points}
                      </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Complete all fields to calculate cardiovascular risk
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CHADS2-VASc Score */}
        <TabsContent value="chads" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  CHADS₂-VASc Score
                </CardTitle>
                <CardDescription>Stroke risk assessment for atrial fibrillation patients</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'chf', label: 'Congestive Heart Failure', points: 1 },
                  { key: 'hypertension', label: 'Hypertension', points: 1 },
                  { key: 'age75Plus', label: 'Age ≥75 years', points: 2 },
                  { key: 'diabetes', label: 'Diabetes Mellitus', points: 1 },
                  { key: 'strokeHistory', label: 'Stroke/TIA History', points: 2 },
                  { key: 'vascularDisease', label: 'Vascular Disease', points: 1 },
                  { key: 'age65to74', label: 'Age 65-74 years', points: 1 },
                  { key: 'femaleGender', label: 'Female Gender', points: 1 }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={item.key}
                        checked={chadsData[item.key as keyof typeof chadsData] as boolean}
                        onChange={(e) => setChadsData(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      <Label htmlFor={item.key} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                    <Badge variant="secondary">{item.points} point{item.points > 1 ? 's' : ''}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  CHADS₂-VASc Result
                  <Button size="sm" variant="outline" onClick={exportCHADSReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CHADS₂-VASc Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{chadsResult.score}</div>
                    <div className="text-lg font-medium">Total Score</div>
                  </div>
                  <div className={`text-center ${chadsResult.color}`}>
                    <div className="font-medium">Stroke Risk: {chadsResult.strokeRisk}</div>
                  </div>
                  <Alert>
                    <Stethoscope className="h-4 w-4" />
                    <AlertDescription>{chadsResult.recommendation}</AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NEWS2 Score */}
        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  NEWS2 Score Calculator
                </CardTitle>
                <CardDescription>National Early Warning Score for clinical deterioration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rr">Respiratory Rate (/min)</Label>
                    <Input
                      id="rr"
                      type="number"
                      value={newsData.respiratoryRate}
                      onChange={(e) => setNewsData(prev => ({ ...prev, respiratoryRate: e.target.value }))}
                      placeholder="16"
                    />
                  </div>
                  <div>
                    <Label htmlFor="news-spo2">SpO₂ (%)</Label>
                    <Input
                      id="news-spo2"
                      type="number"
                      value={newsData.oxygenSaturation}
                      onChange={(e) => setNewsData(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                      placeholder="98"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="oxygen">Supplemental Oxygen</Label>
                  <Select value={newsData.supplementalOxygen} onValueChange={(value) => setNewsData(prev => ({ ...prev, supplementalOxygen: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air">Room Air</SelectItem>
                      <SelectItem value="oxygen">Supplemental Oxygen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="news-temp">Temperature (°C)</Label>
                    <Input
                      id="news-temp"
                      type="number"
                      step="0.1"
                      value={newsData.temperature}
                      onChange={(e) => setNewsData(prev => ({ ...prev, temperature: e.target.value }))}
                      placeholder="36.8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="news-sbp">Systolic BP (mmHg)</Label>
                    <Input
                      id="news-sbp"
                      type="number"
                      value={newsData.systolicBP}
                      onChange={(e) => setNewsData(prev => ({ ...prev, systolicBP: e.target.value }))}
                      placeholder="120"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="news-hr">Heart Rate (bpm)</Label>
                    <Input
                      id="news-hr"
                      type="number"
                      value={newsData.heartRate}
                      onChange={(e) => setNewsData(prev => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="75"
                    />
                  </div>
                  <div>
                    <Label htmlFor="consciousness">Consciousness Level</Label>
                    <Select value={newsData.consciousness} onValueChange={(value) => setNewsData(prev => ({ ...prev, consciousness: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="voice">Voice</SelectItem>
                        <SelectItem value="pain">Pain</SelectItem>
                        <SelectItem value="unresponsive">Unresponsive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  NEWS2 Score Result
                  <Button size="sm" variant="outline" onClick={exportNEWS2Report}>
                    <Download className="h-4 w-4 mr-2" />
                    Export NEWS2 Report
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{newsResult.totalScore}</div>
                    <div className={`text-lg font-medium ${newsResult.color}`}>
                      {newsResult.riskLevel} Risk
                    </div>
                  </div>
                  <Progress value={Math.min((newsResult.totalScore / 20) * 100, 100)} className="h-2" />
                  <div className="space-y-2">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Monitoring:</strong> {newsResult.frequency}
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Action:</strong> {newsResult.action}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}