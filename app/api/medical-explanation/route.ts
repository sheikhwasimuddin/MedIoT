import { type NextRequest, NextResponse } from "next/server"

// Comprehensive medical education database
const medicalEducationDatabase = {
  "Hypertension": {
    diseaseExplanation: "Hypertension, or high blood pressure, occurs when blood flows through arteries with excessive force. Think of it like water pressure in garden hose - too much pressure can damage the hose over time. Similarly, high blood pressure damages blood vessels, heart, kidneys, and other organs.",
    symptomConnection: "When blood pressure is high, your heart works harder to pump blood. This extra strain causes headaches (from increased pressure in head blood vessels), dizziness (from irregular blood flow to brain), and fatigue (from overworked heart muscle).",
    pathophysiology: "Your heart pumps blood through a network of blood vessels. In hypertension, these vessels become narrower or stiffer, like squeezing a garden hose. Your heart must pump harder to push blood through, creating higher pressure that can damage vessel walls over time.",
    prognosis: "With proper management, most people with hypertension live normal, healthy lives. Medications, diet changes, and exercise can effectively control blood pressure. The key is consistent treatment - think of it as maintaining your body's plumbing system.",
    lifestyle: "Reduce salt intake (aim for less than 1 teaspoon daily), exercise regularly (30 minutes walking), maintain healthy weight, limit alcohol, quit smoking, manage stress through relaxation techniques, and get adequate sleep (7-8 hours).",
    whenToSeekHelp: "Seek immediate help if blood pressure exceeds 180/110, you experience severe headache, vision changes, chest pain, difficulty breathing, or confusion. These may indicate a hypertensive crisis requiring emergency treatment.",
    iotMonitoring: "Use automated blood pressure monitors twice daily. IoT devices can track trends and alert you to dangerous readings. Wearable devices monitoring heart rate variability can also provide early warnings of cardiovascular stress.",
    sensorTechnology: "Blood pressure monitors use oscillometric sensors that detect arterial pulsations. Modern IoT cuffs wirelessly transmit data to apps, enabling continuous monitoring and early intervention."
  },
  "Asthma": {
    diseaseExplanation: "Asthma is a chronic condition where airways become inflamed and narrow, making breathing difficult. Imagine your airways as flexible straws - in asthma, these 'straws' become swollen and filled with thick mucus, making it hard for air to flow through.",
    symptomConnection: "When airways narrow, you experience shortness of breath and wheezing (the whistling sound of air squeezing through tight spaces). Coughing occurs as your body tries to clear mucus from airways. Chest tightness feels like someone is squeezing your chest.",
    pathophysiology: "In asthma, your immune system overreacts to triggers like allergens or irritants. This causes three main problems: airway inflammation (swelling), bronchospasm (muscle tightening around airways), and increased mucus production - all making breathing difficult.",
    prognosis: "Asthma is manageable with proper treatment. Most people with asthma can participate in normal activities, including sports. With controller medications and trigger avoidance, asthma symptoms can be well-controlled, preventing attacks and maintaining good quality of life.",
    lifestyle: "Identify and avoid triggers (allergens, smoke, cold air), use air purifiers at home, exercise regularly but warm up gradually, maintain healthy weight, get vaccinated against flu and pneumonia, practice breathing exercises, and always carry rescue inhaler.",
    whenToSeekHelp: "Emergency signs include: difficulty speaking due to breathlessness, peak flow meter reading below 50% of personal best, rescue inhaler not helping symptoms, blue lips or fingernails, severe anxiety due to breathing difficulty.",
    iotMonitoring: "Smart peak flow meters track lung function daily. Wearable devices monitor breathing patterns and detect early warning signs. Environmental sensors can identify trigger exposure (pollen, pollution, humidity changes).",
    sensorTechnology: "Peak flow sensors measure forced expiratory volume using differential pressure sensors. Smart inhalers track medication usage and technique. Air quality sensors monitor environmental triggers in real-time."
  },
  "Arrhythmia": {
    diseaseExplanation: "Arrhythmia is an irregular heartbeat - your heart may beat too fast, too slow, or with an irregular pattern. Think of your heart as having its own electrical system like a car - when this system malfunctions, the engine (heart) doesn't run smoothly.",
    symptomConnection: "When your heart beats irregularly, it can't pump blood efficiently. This causes palpitations (feeling your heartbeat), dizziness (poor blood flow to brain), fatigue (inadequate oxygen delivery), and chest discomfort (from irregular heart muscle contractions).",
    pathophysiology: "Your heart has a natural pacemaker (SA node) that sends electrical signals to coordinate heartbeats. In arrhythmia, these signals are disrupted - they may originate from wrong locations, travel abnormal pathways, or occur at irregular intervals, disturbing normal heart rhythm.",
    prognosis: "Many arrhythmias are manageable with medication, lifestyle changes, or procedures. Some are harmless, while others require ongoing treatment. With proper management, most people with arrhythmias live normal lives. Regular monitoring helps prevent complications.",
    lifestyle: "Avoid caffeine and alcohol (can trigger irregular beats), manage stress through relaxation techniques, maintain regular sleep schedule, exercise as recommended by doctor, avoid illegal stimulants, stay hydrated, and take medications consistently.",
    whenToSeekHelp: "Seek emergency care for: chest pain with irregular heartbeat, fainting or near-fainting, heart rate consistently above 150 or below 40 beats per minute, severe shortness of breath, or sudden onset of rapid irregular heartbeat.",
    iotMonitoring: "ECG wearables continuously monitor heart rhythm. Smart watches detect atrial fibrillation. Implantable loop recorders capture intermittent arrhythmias. Mobile ECG devices enable on-demand rhythm checks during symptoms.",
    sensorTechnology: "ECG sensors detect electrical heart activity using electrodes. Photoplethysmography (PPG) sensors in wearables use light to detect blood volume changes, identifying irregular pulse patterns. AI algorithms analyze patterns for arrhythmia detection."
  },
  "Diabetes Mellitus": {
    diseaseExplanation: "Diabetes occurs when your body can't properly use or produce insulin, leading to high blood sugar. Think of insulin as a key that unlocks cells to let sugar inside for energy. In diabetes, either you don't have enough keys (Type 1) or the locks are broken (Type 2).",
    symptomConnection: "High blood sugar causes your kidneys to work overtime, leading to frequent urination and thirst. Your cells can't access sugar for energy, causing fatigue. Excess sugar in blood affects vision (blurred sight) and slows healing processes.",
    pathophysiology: "Normally, insulin helps cells absorb glucose from blood for energy. In Type 1 diabetes, the pancreas produces little insulin. In Type 2, cells become resistant to insulin. Both result in glucose accumulating in blood instead of entering cells, causing various symptoms.",
    prognosis: "With proper management, people with diabetes can live long, healthy lives. Key is maintaining blood sugar levels close to normal through medication, diet, exercise, and monitoring. Early detection and treatment prevent serious complications affecting eyes, kidneys, and heart.",
    lifestyle: "Follow consistent meal schedule with balanced carbohydrates, exercise regularly (helps cells use glucose), monitor blood sugar as prescribed, take medications on schedule, maintain healthy weight, check feet daily for injuries, and attend regular medical checkups.",
    whenToSeekHelp: "Emergency signs: blood sugar above 400 mg/dL, ketones in urine, persistent vomiting, rapid breathing, confusion, extreme fatigue, or blood sugar below 70 mg/dL with symptoms like shakiness, sweating, or confusion.",
    iotMonitoring: "Continuous glucose monitors (CGMs) track blood sugar 24/7. Smart insulin pens log injection times and doses. Connected glucose meters sync readings to apps. Activity trackers monitor exercise impact on blood sugar levels.",
    sensorTechnology: "CGM sensors use electrochemical principles to measure glucose in interstitial fluid. Smart meters use glucose oxidase enzyme reactions. Integration with insulin pumps creates closed-loop systems for automated diabetes management."
  },
  "Normal": {
    diseaseExplanation: "Your vital signs are within healthy ranges, indicating good cardiovascular and metabolic function. This means your heart, lungs, and circulation are working efficiently to deliver oxygen and nutrients throughout your body.",
    symptomConnection: "With normal vital signs, you should feel energetic, breathe comfortably, and have good exercise tolerance. Any symptoms you experience are likely unrelated to serious cardiovascular or respiratory conditions.",
    pathophysiology: "Your cardiovascular system is functioning optimally - heart rate, blood pressure, and oxygen levels indicate efficient circulation. Your respiratory system is adequately oxygenating blood, and your body temperature regulation is working properly.",
    prognosis: "Excellent! Maintaining normal vital signs reduces risk of heart disease, stroke, and other chronic conditions. Continue current healthy practices to maintain this optimal health status throughout life.",
    lifestyle: "Maintain current healthy habits: regular exercise (150 minutes moderate activity weekly), balanced nutrition, adequate sleep (7-9 hours), stress management, avoiding tobacco, limiting alcohol, and staying hydrated.",
    whenToSeekHelp: "Seek medical attention for persistent unusual symptoms, sudden changes in energy levels, unexplained pain, or significant changes in vital signs during routine monitoring.",
    iotMonitoring: "Use fitness trackers to maintain activity levels. Periodic vital sign monitoring helps establish personal baselines. Smart scales track weight trends. Sleep monitors ensure adequate rest quality.",
    sensorTechnology: "Fitness wearables use accelerometers for activity tracking, PPG sensors for heart rate monitoring, and some include SpO2 sensors. Smart home devices can monitor ambient conditions affecting health and comfort."
  }
}

// Enhanced educational content with IoT integration
function getEnhancedEducation(disease: string, vitals: any) {
  const base = medicalEducationDatabase[disease as keyof typeof medicalEducationDatabase] || medicalEducationDatabase["Normal"]
  
  // Add personalized insights based on current vitals
  const personalizedInsights = generatePersonalizedInsights(disease, vitals)
  
  return {
    ...base,
    personalizedInsights,
    diagnosticCriteria: getDiagnosticCriteria(disease),
    preventionStrategies: getPreventionStrategies(disease),
    technologyIntegration: getTechnologyIntegration(disease),
    educationalResources: getEducationalResources(disease)
  }
}

function generatePersonalizedInsights(disease: string, vitals: any): string[] {
  const insights = []
  
  if (disease === "Hypertension") {
    if (vitals.systolicBP > 140) insights.push(`Your systolic pressure of ${vitals.systolicBP} is elevated - focus on salt reduction and stress management`)
    if (vitals.heartRate > 80) insights.push(`Heart rate of ${vitals.heartRate} suggests increased cardiovascular workload`)
  }
  
  if (disease === "Asthma") {
    if (vitals.spo2 < 95) insights.push(`Oxygen saturation of ${vitals.spo2}% indicates airway compromise - monitor closely`)
    if (vitals.heartRate > 100) insights.push(`Elevated heart rate may indicate respiratory distress - consider rescue medication`)
  }
  
  if (disease === "Arrhythmia") {
    if (vitals.heartRate > 120) insights.push(`Heart rate of ${vitals.heartRate} is significantly elevated - monitor for symptoms`)
    if (vitals.heartRate < 60) insights.push(`Heart rate of ${vitals.heartRate} is low - watch for dizziness or fatigue`)
  }
  
  return insights
}

function getDiagnosticCriteria(disease: string): any {
  const criteria = {
    "Hypertension": {
      stage1: "130-139/80-89 mmHg",
      stage2: "≥140/90 mmHg",
      crisis: "≥180/120 mmHg"
    },
    "Asthma": {
      fev1: "FEV1 <80% predicted",
      peakFlow: "Peak flow variability >20%",
      reversibility: "FEV1 improvement >12% with bronchodilator"
    },
    "Arrhythmia": {
      bradycardia: "Heart rate <60 bpm",
      tachycardia: "Heart rate >100 bpm",
      irregular: "Irregular R-R intervals on ECG"
    },
    "Diabetes Mellitus": {
      fasting: "Fasting glucose ≥126 mg/dL",
      random: "Random glucose ≥200 mg/dL + symptoms",
      hba1c: "HbA1c ≥6.5%"
    }
  }
  
  return criteria[disease as keyof typeof criteria] || {}
}

function getPreventionStrategies(disease: string): string[] {
  const strategies = {
    "Hypertension": ["Regular exercise", "DASH diet", "Weight management", "Stress reduction", "Limited alcohol"],
    "Asthma": ["Trigger identification", "Allergen avoidance", "Vaccination", "Air quality monitoring", "Regular medication"],
    "Arrhythmia": ["Heart-healthy diet", "Regular exercise", "Stress management", "Avoid stimulants", "Regular checkups"],
    "Diabetes Mellitus": ["Healthy weight", "Regular exercise", "Balanced diet", "Blood sugar monitoring", "Regular screening"],
    "Normal": ["Maintain healthy lifestyle", "Regular screenings", "Preventive care", "Health education", "Risk factor management"]
  }
  
  return strategies[disease as keyof typeof strategies] || []
}

function getTechnologyIntegration(disease: string): any {
  const tech = {
    "Hypertension": {
      devices: ["Smart BP monitors", "Wearable heart rate trackers", "Mobile health apps"],
      features: ["Automatic readings", "Trend analysis", "Medication reminders", "Doctor sharing"]
    },
    "Asthma": {
      devices: ["Smart inhalers", "Peak flow meters", "Air quality monitors", "Wearable sensors"],
      features: ["Usage tracking", "Technique coaching", "Environmental alerts", "Emergency notifications"]
    },
    "Arrhythmia": {
      devices: ["ECG wearables", "Holter monitors", "Implantable devices", "Mobile ECG"],
      features: ["Continuous monitoring", "Arrhythmia detection", "Emergency alerts", "Remote monitoring"]
    },
    "Diabetes Mellitus": {
      devices: ["Continuous glucose monitors", "Smart insulin pens", "Connected meters", "Activity trackers"],
      features: ["Real-time glucose", "Insulin tracking", "Trend predictions", "Exercise correlation"]
    }
  }
  
  return tech[disease as keyof typeof tech] || {}
}

function getEducationalResources(disease: string): any {
  return {
    videos: [`Understanding ${disease}`, `Managing ${disease} symptoms`, `Technology for ${disease}`],
    articles: [`${disease} pathophysiology`, `Latest treatments for ${disease}`, `Living with ${disease}`],
    tools: [`${disease} risk calculator`, `Symptom tracker`, `Medication adherence tool`],
    support: ["Patient support groups", "Educational webinars", "Healthcare provider network"]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { disease, symptoms, vitals } = await request.json()
    
    const enhancedExplanation = getEnhancedEducation(disease, vitals)
    
    const response = {
      ...enhancedExplanation,
      currentSymptoms: symptoms,
      vitalSignAnalysis: analyzeVitalSigns(vitals, disease),
      generatedBy: "Offline Medical Education AI",
      timestamp: new Date().toISOString(),
      educationLevel: "comprehensive"
    }
    
    return NextResponse.json(response)
  } catch (error) {
    console.error("Error generating explanation:", error)
    return NextResponse.json({ error: "Failed to generate explanation" }, { status: 500 })
  }
}

function analyzeVitalSigns(vitals: any, disease: string): any {
  return {
    heartRate: {
      value: vitals.heartRate,
      status: vitals.heartRate >= 60 && vitals.heartRate <= 100 ? "Normal" : 
              vitals.heartRate > 100 ? "Elevated" : "Low",
      implications: getHeartRateImplications(vitals.heartRate, disease)
    },
    bloodPressure: {
      systolic: vitals.systolicBP,
      diastolic: vitals.diastolicBP,
      status: vitals.systolicBP < 120 && vitals.diastolicBP < 80 ? "Normal" :
              vitals.systolicBP >= 140 || vitals.diastolicBP >= 90 ? "High" : "Elevated",
      implications: getBPImplications(vitals.systolicBP, vitals.diastolicBP, disease)
    },
    oxygenSaturation: {
      value: vitals.spo2,
      status: vitals.spo2 >= 95 ? "Normal" : vitals.spo2 >= 90 ? "Low" : "Critical",
      implications: getSpO2Implications(vitals.spo2, disease)
    },
    temperature: {
      value: vitals.temperature,
      status: vitals.temperature >= 36.5 && vitals.temperature <= 37.2 ? "Normal" : 
              vitals.temperature > 37.2 ? "Elevated" : "Low",
      implications: getTempImplications(vitals.temperature, disease)
    }
  }
}

function getHeartRateImplications(hr: number, disease: string): string {
  if (disease === "Arrhythmia") return `Heart rate of ${hr} may indicate rhythm disturbance requiring monitoring`
  if (disease === "Hypertension" && hr > 80) return `Elevated heart rate suggests increased cardiovascular workload`
  if (disease === "Asthma" && hr > 100) return `Tachycardia may indicate respiratory distress or medication effects`
  return `Heart rate of ${hr} bpm within expected range for your condition`
}

function getBPImplications(sys: number, dia: number, disease: string): string {
  if (disease === "Hypertension") return `Blood pressure ${sys}/${dia} requires ongoing monitoring and management`
  if (sys > 140 || dia > 90) return `Elevated blood pressure may increase cardiovascular risk`
  return `Blood pressure ${sys}/${dia} within healthy range`
}

function getSpO2Implications(spo2: number, disease: string): string {
  if (disease === "Asthma" && spo2 < 95) return `Low oxygen saturation indicates airway compromise - consider bronchodilator`
  if (spo2 < 90) return `Critically low oxygen saturation requires immediate medical attention`
  return `Oxygen saturation of ${spo2}% indicates adequate respiratory function`
}

function getTempImplications(temp: number, disease: string): string {
  if (temp > 38.0) return `Fever may indicate infection or inflammation requiring evaluation`
  if (temp < 36.0) return `Low temperature may indicate circulation issues or exposure`
  return `Body temperature of ${temp}°C within normal range`
}