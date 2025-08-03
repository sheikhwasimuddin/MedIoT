import { type NextRequest, NextResponse } from "next/server"

// Comprehensive symptom analysis database
const symptomAnalysisDatabase = {
  // Cardiovascular symptoms
  "Chest Pain": {
    urgency: "high",
    possibleConditions: ["Myocardial Infarction", "Angina", "Pulmonary Embolism", "Aortic Dissection", "Pericarditis"],
    redFlags: ["Crushing chest pain", "Pain radiating to arm/jaw", "Associated shortness of breath", "Diaphoresis"],
    followUpQuestions: ["Does pain radiate?", "What triggers the pain?", "Associated nausea or sweating?"]
  },
  "Palpitations": {
    urgency: "medium",
    possibleConditions: ["Atrial Fibrillation", "Supraventricular Tachycardia", "Anxiety", "Hyperthyroidism"],
    redFlags: ["Heart rate >150 bpm", "Associated chest pain", "Syncope", "Severe dyspnea"],
    followUpQuestions: ["How long do episodes last?", "Any triggers identified?", "Associated dizziness?"]
  },

  // Respiratory symptoms
  "Shortness of Breath": {
    urgency: "high",
    possibleConditions: ["Asthma", "COPD", "Heart Failure", "Pulmonary Embolism", "Pneumonia"],
    redFlags: ["At rest dyspnea", "Unable to speak in sentences", "Cyanosis", "Orthopnea"],
    followUpQuestions: ["Onset sudden or gradual?", "Worse lying flat?", "Associated cough or wheezing?"]
  },
  "Cough": {
    urgency: "low",
    possibleConditions: ["Upper Respiratory Infection", "Asthma", "COPD", "Heart Failure", "GERD"],
    redFlags: ["Hemoptysis", "Persistent >3 weeks", "Associated weight loss", "Night sweats"],
    followUpQuestions: ["Productive or dry cough?", "Any blood in sputum?", "Worse at certain times?"]
  },

  // Neurological symptoms
  "Headache": {
    urgency: "medium",
    possibleConditions: ["Tension Headache", "Migraine", "Hypertension", "Intracranial Pressure", "Meningitis"],
    redFlags: ["Sudden severe onset", "Fever with neck stiffness", "Vision changes", "Confusion"],
    followUpQuestions: ["Sudden or gradual onset?", "Location of pain?", "Associated visual changes?"]
  },
  "Dizziness": {
    urgency: "medium",
    possibleConditions: ["Orthostatic Hypotension", "Vertigo", "Medication Effect", "Dehydration", "Arrhythmia"],
    redFlags: ["Associated chest pain", "Syncope", "Severe headache", "Neurologic deficits"],
    followUpQuestions: ["Spinning sensation or lightheadedness?", "Worse with position changes?", "Any hearing changes?"]
  },

  // Systemic symptoms
  "Fatigue": {
    urgency: "low",
    possibleConditions: ["Anemia", "Thyroid Disorders", "Depression", "Heart Failure", "Diabetes"],
    redFlags: ["Sudden onset", "Associated weight loss", "Severe functional impairment", "Chest pain"],
    followUpQuestions: ["Duration of fatigue?", "Any weight changes?", "Sleep quality affected?"]
  },
  "Fever": {
    urgency: "medium",
    possibleConditions: ["Viral Infection", "Bacterial Infection", "UTI", "Pneumonia", "Sepsis"],
    redFlags: ["Temperature >39°C", "Rigors", "Confusion", "Hypotension", "Petechial rash"],
    followUpQuestions: ["How high is the fever?", "Associated chills?", "Any localizing symptoms?"]
  },

  // GI symptoms
  "Nausea": {
    urgency: "low",
    possibleConditions: ["Gastroenteritis", "Food Poisoning", "Medication Effect", "Pregnancy", "Migraine"],
    redFlags: ["Severe dehydration", "Bloody vomit", "Severe abdominal pain", "Signs of obstruction"],
    followUpQuestions: ["Associated vomiting?", "Any abdominal pain?", "Recent medication changes?"]
  }
}

// Symptom combination analysis patterns
const symptomPatterns = {
  "chest_pain_shortness_of_breath": {
    urgency: "critical",
    analysis: "Combination of chest pain and shortness of breath is concerning for acute cardiac or pulmonary pathology",
    possibleConditions: ["Myocardial Infarction", "Pulmonary Embolism", "Acute Heart Failure"],
    recommendations: ["Seek immediate emergency care", "Call emergency services", "Do not drive yourself"]
  },
  "fever_cough_shortness_of_breath": {
    urgency: "high",
    analysis: "Respiratory symptoms with fever suggest infectious respiratory pathology requiring prompt evaluation",
    possibleConditions: ["Pneumonia", "COVID-19", "Bronchitis", "Influenza"],
    recommendations: ["Seek medical evaluation within 24 hours", "Isolate if infectious", "Monitor oxygen saturation"]
  },
  "headache_fever_confusion": {
    urgency: "critical",
    analysis: "Neurological symptoms with fever are concerning for central nervous system infection",
    possibleConditions: ["Meningitis", "Encephalitis", "Sepsis"],
    recommendations: ["Seek immediate emergency care", "Do not delay treatment", "Monitor neurological status"]
  },
  "palpitations_dizziness_chest_pain": {
    urgency: "high",
    analysis: "Cardiac symptoms constellation suggests arrhythmia or other cardiac pathology",
    possibleConditions: ["Arrhythmia", "Acute Coronary Syndrome", "Heart Failure"],
    recommendations: ["Urgent cardiology evaluation", "Monitor vital signs", "Avoid stimulants"]
  }
}

// Enhanced analysis with medical reasoning
function analyzeSymptomCombination(symptoms: string[], vitals: any, demographics: any) {
  const analysis = {
    primaryConcerns: [] as string[],
    urgencyLevel: "low",
    analysis: "",
    possibleConditions: [] as string[],
    redFlags: [] as string[],
    recommendations: [] as string[],
    followUpQuestions: [] as string[],
    medicalReasoning: "",
    vitalSignCorrelation: "",
    riskFactors: [] as string[]
  }

  // Check for concerning symptom patterns
  const symptomKey = symptoms.sort().join("_").toLowerCase().replace(/\s+/g, "_")
  const patternMatch = findMatchingPattern(symptoms)
  
  if (patternMatch) {
    analysis.urgencyLevel = patternMatch.urgency
    analysis.analysis = patternMatch.analysis
    analysis.possibleConditions = patternMatch.possibleConditions
    analysis.recommendations = patternMatch.recommendations
  }

  // Analyze individual symptoms
  symptoms.forEach(symptom => {
    const symptomData = symptomAnalysisDatabase[symptom as keyof typeof symptomAnalysisDatabase]
    if (symptomData) {
      analysis.possibleConditions = [...new Set([...analysis.possibleConditions, ...symptomData.possibleConditions])]
      analysis.redFlags = [...new Set([...analysis.redFlags, ...symptomData.redFlags])]
      analysis.followUpQuestions = [...new Set([...analysis.followUpQuestions, ...symptomData.followUpQuestions])]
      
      // Update urgency to highest level
      if (symptomData.urgency === "critical" || (symptomData.urgency === "high" && analysis.urgencyLevel !== "critical")) {
        analysis.urgencyLevel = symptomData.urgency
      }
    }
  })

  // Add vital sign correlation
  analysis.vitalSignCorrelation = correlateSymptomsWithVitals(symptoms, vitals)
  
  // Add medical reasoning
  analysis.medicalReasoning = generateMedicalReasoning(symptoms, vitals, demographics)
  
  // Add risk factors
  analysis.riskFactors = identifyRiskFactors(demographics, vitals)
  
  // Generate personalized recommendations
  analysis.recommendations = [...new Set([
    ...analysis.recommendations,
    ...generatePersonalizedRecommendations(symptoms, vitals, demographics, analysis.urgencyLevel)
  ])]

  return analysis
}

function findMatchingPattern(symptoms: string[]) {
  const lowerSymptoms = symptoms.map(s => s.toLowerCase().replace(/\s+/g, "_"))
  
  for (const [pattern, data] of Object.entries(symptomPatterns)) {
    const patternSymptoms = pattern.split("_")
    const matches = patternSymptoms.filter(ps => 
      lowerSymptoms.some(ls => ls.includes(ps) || ps.includes(ls))
    )
    
    if (matches.length >= Math.min(patternSymptoms.length, 2)) {
      return data
    }
  }
  
  return null
}

function correlateSymptomsWithVitals(symptoms: string[], vitals: any): string {
  const correlations = []
  
  if (symptoms.includes("Chest Pain") && vitals.heartRate > 100) {
    correlations.push("Tachycardia with chest pain increases cardiac event suspicion")
  }
  
  if (symptoms.includes("Shortness of Breath") && vitals.spo2 < 95) {
    correlations.push("Low oxygen saturation confirms respiratory compromise")
  }
  
  if (symptoms.includes("Dizziness") && (vitals.systolicBP < 90 || vitals.systolicBP > 160)) {
    correlations.push("Blood pressure abnormalities correlate with reported dizziness")
  }
  
  if (symptoms.includes("Palpitations") && (vitals.heartRate > 120 || vitals.heartRate < 50)) {
    correlations.push("Heart rate abnormalities confirm palpitation symptoms")
  }
  
  if (symptoms.includes("Fever") && vitals.temperature > 37.5) {
    correlations.push("Elevated temperature confirms febrile presentation")
  }
  
  return correlations.length > 0 ? correlations.join(". ") : "Vital signs do not show immediate correlation with reported symptoms"
}

function generateMedicalReasoning(symptoms: string[], vitals: any, demographics: any): string {
  let reasoning = `Analysis of ${symptoms.length} symptoms in ${demographics.age}-year-old ${demographics.gender}: `
  
  // Age-based considerations
  if (demographics.age > 65) {
    reasoning += "Advanced age increases risk for serious pathology. "
  }
  
  if (demographics.age < 30) {
    reasoning += "Younger age makes serious pathology less likely but not excluded. "
  }
  
  // Vital sign integration
  if (vitals.heartRate > 100) {
    reasoning += "Tachycardia suggests physiologic stress or pathology. "
  }
  
  if (vitals.spo2 < 95) {
    reasoning += "Hypoxemia indicates respiratory or circulatory compromise. "
  }
  
  if (vitals.systolicBP > 140) {
    reasoning += "Hypertension may be primary condition or secondary to pain/stress. "
  }
  
  // Symptom-specific reasoning
  if (symptoms.includes("Chest Pain")) {
    reasoning += "Chest pain requires cardiac and pulmonary evaluation. "
  }
  
  if (symptoms.includes("Shortness of Breath")) {
    reasoning += "Dyspnea warrants respiratory and cardiac assessment. "
  }
  
  return reasoning
}

function identifyRiskFactors(demographics: any, vitals: any): string[] {
  const riskFactors = []
  
  if (demographics.age > 65) riskFactors.push("Advanced age")
  if (demographics.age > 45 && demographics.gender === "male") riskFactors.push("Male gender >45")
  if (demographics.age > 55 && demographics.gender === "female") riskFactors.push("Female gender >55")
  if (vitals.systolicBP > 140) riskFactors.push("Hypertension")
  if (vitals.heartRate > 100) riskFactors.push("Tachycardia")
  if (vitals.spo2 < 95) riskFactors.push("Hypoxemia")
  if (vitals.temperature > 38.0) riskFactors.push("Fever")
  
  return riskFactors
}

function generatePersonalizedRecommendations(symptoms: string[], vitals: any, demographics: any, urgency: string): string[] {
  const recommendations = []
  
  // Urgency-based recommendations
  if (urgency === "critical") {
    recommendations.push("Seek immediate emergency medical care")
    recommendations.push("Call emergency services if symptoms worsen")
    recommendations.push("Do not drive yourself to hospital")
  } else if (urgency === "high") {
    recommendations.push("Seek medical evaluation within 24 hours")
    recommendations.push("Monitor symptoms closely")
    recommendations.push("Return immediately if symptoms worsen")
  } else {
    recommendations.push("Schedule routine medical follow-up")
    recommendations.push("Monitor symptoms and track patterns")
  }
  
  // Symptom-specific recommendations
  if (symptoms.includes("Chest Pain")) {
    recommendations.push("Avoid strenuous activity until evaluated")
    recommendations.push("Take aspirin if not contraindicated")
  }
  
  if (symptoms.includes("Shortness of Breath")) {
    recommendations.push("Rest in comfortable position")
    recommendations.push("Monitor oxygen saturation if available")
  }
  
  if (symptoms.includes("Fever")) {
    recommendations.push("Stay hydrated and rest")
    recommendations.push("Monitor temperature regularly")
  }
  
  // Demographics-based recommendations
  if (demographics.age > 65) {
    recommendations.push("Consider lower threshold for medical evaluation")
    recommendations.push("Ensure medication compliance")
  }
  
  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const { symptoms, vitals, demographics } = await request.json()
    
    if (!symptoms || symptoms.length === 0) {
      return NextResponse.json({ error: "No symptoms provided for analysis" }, { status: 400 })
    }
    
    const analysis = analyzeSymptomCombination(symptoms, vitals, demographics)
    
    const response = {
      ...analysis,
      inputSymptoms: symptoms,
      analysisTimestamp: new Date().toISOString(),
      generatedBy: "Offline Symptom Analysis AI",
      disclaimer: "This analysis is for educational purposes only and does not replace professional medical advice",
      emergencyContact: urgency === "critical" ? "Call emergency services immediately" : null
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return NextResponse.json({ error: "Failed to analyze symptoms" }, { status: 500 })
  }
}

const urgency = "medium" // This should be dynamically determined