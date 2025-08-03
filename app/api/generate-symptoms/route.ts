import { type NextRequest, NextResponse } from "next/server"

// Comprehensive offline symptom database
const symptomDatabase = {
  "Hypertension": {
    primarySymptoms: ["Headache", "Dizziness", "Chest Pain", "Shortness of Breath"],
    secondarySymptoms: ["Fatigue", "Vision Changes", "Nausea", "Palpitations"],
    explanation: "High blood pressure damages blood vessels over time, reducing oxygen delivery to organs and causing compensatory symptoms like headaches and dizziness.",
    severity: "moderate",
    recommendations: [
      "Monitor blood pressure daily",
      "Reduce sodium intake to <2g/day",
      "Exercise 30 minutes daily",
      "Consider DASH diet",
      "Limit alcohol consumption"
    ]
  },
  "Asthma": {
    primarySymptoms: ["Shortness of Breath", "Cough", "Chest Pain", "Wheezing"],
    secondarySymptoms: ["Fatigue", "Anxiety", "Sleep disturbances"],
    explanation: "Airway inflammation and bronchospasm reduce oxygen delivery, triggering compensatory breathing patterns and associated symptoms.",
    severity: "moderate",
    recommendations: [
      "Use rescue inhaler as prescribed",
      "Avoid known triggers",
      "Monitor peak flow daily",
      "Keep medication accessible",
      "Consider allergy testing"
    ]
  },
  "Arrhythmia": {
    primarySymptoms: ["Palpitations", "Dizziness", "Chest Pain", "Shortness of Breath"],
    secondarySymptoms: ["Fatigue", "Weakness", "Sweating", "Confusion"],
    explanation: "Irregular heart rhythms disrupt normal blood circulation, causing symptoms related to inadequate cardiac output and oxygen delivery.",
    severity: "severe",
    recommendations: [
      "Monitor heart rate regularly",
      "Avoid caffeine and stimulants",
      "Take medications as prescribed",
      "Wear medical alert bracelet",
      "Schedule cardiology follow-up"
    ]
  },
  "Diabetes Mellitus": {
    primarySymptoms: ["Fatigue", "Frequent urination", "Excessive thirst", "Blurred vision"],
    secondarySymptoms: ["Headache", "Dizziness", "Slow healing", "Nausea"],
    explanation: "High blood glucose affects cellular metabolism and vascular function, leading to dehydration, fatigue, and circulatory symptoms.",
    severity: "moderate",
    recommendations: [
      "Monitor blood glucose 4x daily",
      "Follow diabetic meal plan",
      "Take medications as scheduled",
      "Exercise after meals",
      "Check feet daily for wounds"
    ]
  },
  "Normal": {
    primarySymptoms: [],
    secondarySymptoms: [],
    explanation: "All vital signs are within normal ranges, indicating good cardiovascular and metabolic health.",
    severity: "mild",
    recommendations: [
      "Continue healthy lifestyle",
      "Regular preventive checkups",
      "Maintain current activity level",
      "Stay hydrated",
      "Monitor vitals periodically"
    ]
  }
}

// Enhanced risk-based symptom modifier
function adjustSymptomsForRisk(baseSymptoms: any, vitals: any, demographics: any) {
  const adjusted = { ...baseSymptoms }
  
  // Age-based modifications
  if (demographics.age > 65) {
    adjusted.secondarySymptoms = [...adjusted.secondarySymptoms, "Confusion", "Weakness"]
    adjusted.severity = adjusted.severity === "mild" ? "moderate" : "severe"
  }
  
  // Vital sign severity modifiers
  if (vitals.heartRate > 120 || vitals.heartRate < 50) {
    if (!adjusted.primarySymptoms.includes("Palpitations")) {
      adjusted.primarySymptoms = [...adjusted.primarySymptoms, "Palpitations"]
    }
  }
  
  if (vitals.spo2 < 90) {
    adjusted.primarySymptoms = [...adjusted.primarySymptoms, "Shortness of Breath"]
    adjusted.severity = "severe"
  }
  
  if (vitals.systolicBP > 160) {
    adjusted.primarySymptoms = [...adjusted.primarySymptoms, "Headache"]
  }
  
  if (vitals.temperature > 38.0) {
    adjusted.secondarySymptoms = [...adjusted.secondarySymptoms, "Fever", "Sweating"]
  }
  
  return adjusted
}

export async function POST(request: NextRequest) {
  try {
    const { disease, vitals, demographics } = await request.json()
    
    // Get base symptoms from database
    const baseSymptoms = symptomDatabase[disease as keyof typeof symptomDatabase] || symptomDatabase["Normal"]
    
    // Adjust symptoms based on patient-specific factors
    const adjustedSymptoms = adjustSymptomsForRisk(baseSymptoms, vitals, demographics)
    
    // Add educational context
    const educationalContext = {
      pathophysiology: getPathophysiology(disease),
      monitoring: getMonitoringGuidelines(disease),
      redFlags: getRedFlags(disease)
    }
    
    const response = {
      ...adjustedSymptoms,
      educational: educationalContext,
      generatedBy: "Offline Rule-Based AI",
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error generating symptoms:", error)
    return NextResponse.json({ error: "Failed to generate symptoms" }, { status: 500 })
  }
}

function getPathophysiology(disease: string): string {
  const pathophysiology = {
    "Hypertension": "Increased vascular resistance leads to elevated blood pressure, straining the cardiovascular system and reducing organ perfusion.",
    "Asthma": "Airway inflammation and smooth muscle constriction reduce airflow, triggering compensatory respiratory mechanisms.",
    "Arrhythmia": "Disrupted electrical conduction affects cardiac output and systemic circulation, leading to hemodynamic instability.",
    "Diabetes Mellitus": "Insulin resistance or deficiency impairs glucose utilization, affecting cellular metabolism and vascular integrity.",
    "Normal": "All physiological systems are functioning within optimal parameters."
  }
  
  return pathophysiology[disease as keyof typeof pathophysiology] || "No specific pathophysiology identified."
}

function getMonitoringGuidelines(disease: string): string[] {
  const guidelines = {
    "Hypertension": ["Check BP twice daily", "Monitor for headaches", "Track sodium intake", "Weigh daily"],
    "Asthma": ["Monitor peak flow", "Track trigger exposure", "Count rescue inhaler uses", "Assess breathing quality"],
    "Arrhythmia": ["Monitor heart rate", "Track palpitation episodes", "Assess exercise tolerance", "Monitor for dizziness"],
    "Diabetes Mellitus": ["Check blood glucose 4x daily", "Monitor ketones if sick", "Track carbohydrate intake", "Inspect feet daily"],
    "Normal": ["Monthly vital sign checks", "Annual health screenings", "Maintain activity log"]
  }
  
  return guidelines[disease as keyof typeof guidelines] || ["Regular health monitoring"]
}

function getRedFlags(disease: string): string[] {
  const redFlags = {
    "Hypertension": ["BP >180/110", "Severe headache", "Vision changes", "Chest pain", "Shortness of breath"],
    "Asthma": ["Peak flow <50%", "Can't speak in sentences", "Blue lips/fingernails", "Rescue inhaler ineffective"],
    "Arrhythmia": ["Heart rate >150 or <40", "Chest pain", "Fainting", "Severe dizziness", "Difficulty breathing"],
    "Diabetes Mellitus": ["Blood glucose >400 mg/dL", "Ketones present", "Vomiting", "Confusion", "Rapid breathing"],
    "Normal": ["Any sudden symptom changes", "Persistent fatigue", "Unexplained pain"]
  }
  
  return redFlags[disease as keyof typeof redFlags] || ["Consult healthcare provider for concerns"]
}