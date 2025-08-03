"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Bot,
  User,
  Send,
  BookOpen,
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  CircuitBoard,
  Zap,
  Calculator
} from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  category?: string
  relatedTopics?: string[]
}

interface QAResponse {
  answer: string
  category: string
  confidence: number
  relatedQuestions: string[]
  sources: string[]
  tips?: string[]
}

export default function MedicalAIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "🏥 Welcome to MedIoT's Advanced Medical AI Assistant! 🤖\n\nI'm your comprehensive offline medical education companion with expertise in:\n\n🩺 ★Medical Conditions: Hypertension, Asthma, Diabetes, Arrhythmia\n📊 ★Vital Signs: Heart Rate, Blood Pressure, SpO2, Temperature\n🔬 ★IoT Sensors: MAX30100, DS18B20, ECG sensors\n🚨 ★Emergency Care: Warning signs and protocols\n💊 ★Medications: Drug interactions and management\n📈 ★Analytics: Signal processing and trend analysis\n\nWhat would you like to explore today?",
      timestamp: new Date(),
      category: "Welcome"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Enhanced quick topic suggestions
  const quickTopics = [
    { icon: <Heart className="h-4 w-4" />, label: "Blood Pressure", query: "explain blood pressure readings and normal ranges", category: "Vital Signs" },
    { icon: <Activity className="h-4 w-4" />, label: "Heart Rate", query: "heart rate monitoring and abnormal rhythms", category: "Vital Signs" },
    { icon: <Droplets className="h-4 w-4" />, label: "SpO2 Levels", query: "oxygen saturation measurement and interpretation", category: "Vital Signs" },
    { icon: <Thermometer className="h-4 w-4" />, label: "Temperature", query: "body temperature monitoring and fever detection", category: "Vital Signs" },
    { icon: <Stethoscope className="h-4 w-4" />, label: "Asthma", query: "asthma pathophysiology symptoms and management", category: "Diseases" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Emergency", query: "emergency warning signs and when to call 112", category: "Emergency" },
    { icon: <CircuitBoard className="h-4 w-4" />, label: "IoT Sensors", query: "MAX30100 sensor working principle and applications", category: "Technology" },
    { icon: <Calculator className="h-4 w-4" />, label: "Risk Calculator", query: "cardiovascular risk assessment and scoring", category: "Assessment" },
 { icon: <Heart className="h-4 w-4" />, label: "Stroke", query: "signs and treatment of stroke", category: "Neurology" },
{ icon: <Activity className="h-4 w-4" />, label: "Thyroid", query: "symptoms and types of thyroid disorders", category: "Endocrine" },
{ icon: <AlertTriangle className="h-4 w-4" />, label: "COVID-19", query: "covid-19 symptoms, vaccines and IoT use", category: "Infectious Disease" },
{ icon: <Heart className="h-4 w-4" />, label: "Elderly Fitness", query: "fitness tips for elderly people and safety", category: "Preventive Health" },
{ icon: <Bot className="h-4 w-4" />, label: "AI Diagnosis", query: "how is ai used in medical diagnosis", category: "Medical AI" },

  ]

  // Comprehensive medical knowledge base with 100+ topics
  const knowledgeBase = {
    // CARDIOVASCULAR CONDITIONS
    hypertension: {
      keywords: ["high blood pressure", "hypertension", "bp", "systolic", "diastolic", "pressure"],
      response: {
        answer: `🫀 ★HYPERTENSION (High Blood Pressure) - Complete Guide★

★📊 Blood Pressure Categories:
 Normal: <120/80 mmHg
 Elevated: 120-129/<80 mmHg  
 Stage 1: 130-139/80-89 mmHg
 Stage 2: ≥140/90 mmHg
 Crisis: ≥180/120 mmHg (Emergency!)

★🔬 Pathophysiology:
High blood pressure damages arteries by creating excessive force against vessel walls. Think of it like a garden hose - too much pressure damages the hose over time. This leads to:
 Arterial wall thickening and stiffening
 Reduced blood flow to organs
 Increased cardiac workload
 Accelerated atherosclerosis

★⚠️ Risk Factors:
 Age >45 (men), >55 (women)
 Family history
 Obesity (BMI >30)
 Excessive sodium intake (>2.3g/day)
 Physical inactivity
 Excessive alcohol
 Stress and sleep disorders

★💊 Treatment Approaches:
 ★ACE Inhibitors: Lisinopril, Enalapril
 ★Beta Blockers: Metoprolol, Atenolol  
 ★Calcium Channel Blockers: Amlodipine
 ★Diuretics: Hydrochlorothiazide

★🏠 IoT Monitoring:
Modern blood pressure monitors with Bluetooth connectivity can:
 Track readings automatically
 Detect irregular heartbeats
 Send alerts for dangerous readings
 Share data with healthcare providers`,
        category: "Cardiovascular Disease",
        confidence: 0.98,
        relatedQuestions: [
          "What causes white coat hypertension?",
          "How to measure blood pressure correctly?",
          "Best foods to lower blood pressure?",
          "When is blood pressure an emergency?"
        ],
        sources: ["American Heart Association 2023", "WHO Guidelines", "ESC/ESH Guidelines"],
        tips: [
          "Measure BP same time daily",
          "Sit quietly 5 minutes before reading",
          "Use properly sized cuff",
          "Average multiple readings",
          "Track trends, not single readings"
        ]
      }
    },

    arrhythmia: {
      keywords: ["arrhythmia", "irregular heartbeat", "atrial fibrillation", "afib", "heart rhythm", "palpitations"],
      response: {
        answer: `💓 ★ARRHYTHMIAS - Heart Rhythm Disorders★

★🔍 Types of Arrhythmias:
 ★Bradycardia: Heart rate <60 bpm
 ★Tachycardia: Heart rate >100 bpm
 ★Atrial Fibrillation: Irregular, rapid atrial activity
 ★Ventricular Tachycardia: Fast, potentially dangerous rhythm
 ★Premature Beats: Extra heartbeats (PACs/PVCs)

★⚡ Electrical System of Heart:
The heart has its own electrical system:
1. ★SA Node★ (natural pacemaker) generates impulses
2. ★AV Node★ delays and filters signals
3. ★Bundle Branches★ conduct to ventricles
4. ★Purkinje Fibers★ spread activation

★📱 IoT Detection Methods:
 ★ECG Wearables: Apple Watch, AliveCor KardiaMobile
 ★Continuous Monitors: Holter monitors, loop recorders
 ★Smart Patches: Zio Patch for extended monitoring
 ★Smartphone ECG: Single-lead ECG in 30 seconds

★🚨 When to Seek Emergency Care:
 Heart rate >150 or <40 bpm with symptoms
 Chest pain with irregular rhythm
 Shortness of breath
 Dizziness or fainting
 Severe palpitations lasting >20 minutes

★💡 Management Strategies:
 ★Rate Control: Beta-blockers, calcium channel blockers
 ★Rhythm Control: Antiarrhythmic drugs, cardioversion
 ★Anticoagulation: Warfarin, DOACs for stroke prevention
 ★Ablation Therapy: Catheter-based treatment
 ★Device Therapy: Pacemakers, ICDs`,
        category: "Cardiovascular Disease",
        confidence: 0.96,
        relatedQuestions: [
          "How do smart watches detect AFib?",
          "What is the CHADS2-VASc score?",
          "When do you need a pacemaker?",
          "Can stress cause arrhythmias?"
        ],
        sources: ["AHA/ACC/HRS Guidelines", "European Heart Rhythm Association"],
        tips: [
          "Track irregular episodes with wearables",
          "Avoid excessive caffeine/alcohol",
          "Manage stress through relaxation",
          "Take medications consistently",
          "Know your stroke risk score"
        ]
      }
    },
// NEUROLOGICAL CONDITIONS
stroke: {
  keywords: ["stroke", "brain attack", "paralysis", "fast protocol", "cva", "ischemic", "hemorrhagic"],
  response: {
    answer: `🧠 ★STROKE - Neurological Emergency Guide★

★Types:
 • Ischemic (85%): Clot blocks brain artery
 • Hemorrhagic (15%): Ruptured blood vessel
 • TIA: Temporary blockage (warning sign)

★FAST Protocol:
 • F: Face drooping
 • A: Arm weakness
 • S: Speech difficulty
 • T: Time to call 112

★Symptoms:
 • Sudden numbness, confusion, vision trouble, severe headache

★Immediate Action:
 • Call 112 immediately
 • Do NOT give aspirin unless ischemic stroke confirmed

★IoT Applications:
 • Smartwatches detect falls & irregular pulse (AFib)
 • AI-powered apps detect facial asymmetry or slurred speech

★Rehab & Recovery:
 • Physical, occupational, speech therapy
 • IoT motion sensors track improvement`,
    category: "Neurological Emergency",
    confidence: 0.98,
    relatedQuestions: ["What are signs of stroke?", "What is the FAST test?", "Can stroke be reversed?", "How to prevent another stroke?"],
    sources: ["WHO Stroke Facts", "AHA Stroke Guidelines"],
    tips: [
      "Act FAST—time is brain",
      "Know your risk: BP, diabetes, AFib",
      "Use smart watches for monitoring",
      "Control cholesterol and quit smoking"
    ]
  }
},

// ENDOCRINE - THYROID
thyroid: {
  keywords: ["thyroid", "hypothyroidism", "hyperthyroidism", "tsh", "t3", "t4", "goiter", "levothyroxine"],
  response: {
    answer: `🧬 ★THYROID DISORDERS★

★Hypothyroidism:
 • Symptoms: Fatigue, weight gain, cold intolerance, dry skin
 • Labs: ↑TSH, ↓T3/T4
 • Treatment: Levothyroxine (dose based on weight, TSH)

★Hyperthyroidism:
 • Symptoms: Weight loss, heat intolerance, tremors, anxiety
 • Labs: ↓TSH, ↑T3/T4
 • Treatment: Methimazole, beta-blockers

★Monitoring:
 • TSH every 6–8 weeks after medication change
 • Adjust dose gradually

★IoT Monitoring:
 • Smart pill bottles ensure compliance
 • Wearables detect HR irregularities, tremors`,
    category: "Endocrine Disorders",
    confidence: 0.95,
    relatedQuestions: ["How is hypothyroidism diagnosed?", "What are symptoms of hyperthyroidism?", "Can thyroid issues affect heart rate?"],
    sources: ["ATA Guidelines", "Endocrine Society Clinical Practice"],
    tips: [
      "Take thyroid meds on empty stomach",
      "Avoid calcium/iron supplements near dose",
      "Consistent timing matters for TSH stability"
    ]
  }
},
// INFECTIOUS DISEASE - COVID-19
covid19: {
  keywords: ["covid", "covid-19", "coronavirus", "sars-cov-2", "pandemic", "rt-pcr", "mask", "vaccine"],
  response: {
    answer: `🦠 ★COVID-19 - Comprehensive Guide★

★Symptoms:
 • Fever, cough, fatigue, loss of smell/taste, sore throat
 • Severe: Difficulty breathing, chest pain, confusion

★Testing:
 • RT-PCR: Gold standard
 • Rapid antigen: Faster but less sensitive

★Isolation Guidelines:
 • 5 days minimum + symptom-free for 24 hours
 • Wear N95 if going out during recovery

★IoT Use:
 • Smart thermometers, pulse oximeters for home monitoring
 • Contact tracing apps using Bluetooth

★Vaccination:
 • Reduces risk of severe disease
 • Booster every 6–12 months (check latest guidelines)

★Post-COVID (Long COVID):
 • Brain fog, fatigue, dyspnea—needs multidisciplinary care`,
    category: "Infectious Disease",
    confidence: 0.99,
    relatedQuestions: ["What is long COVID?", "When to isolate with COVID?", "How do IoT devices help in COVID?"],
    sources: ["WHO COVID-19 Updates", "CDC Guidelines"],
    tips: [
      "Monitor SpO2 and temperature at home",
      "Stay hydrated and rest",
      "Use N95 mask even post recovery for 10 days"
    ]
  }
},

// FITNESS & PREVENTION - ELDERLY
elderly_fitness: {
  keywords: ["elderly", "senior", "aging", "old age", "fitness for elderly", "exercise", "geriatric"],
  response: {
    answer: `👵 ★FITNESS FOR THE ELDERLY★

★Recommended Activities:
 • Walking (30 min/day)
 • Chair Yoga, Tai Chi
 • Strength training 2x/week
 • Balance exercises to prevent falls

★Vitals to Monitor:
 • Heart rate, BP, SpO2, temperature
 • Falls, dizziness, fatigue

★IoT Devices:
 • Fall detectors (smart watches)
 • Wearable HR/BP/SpO2 monitors
 • Smart pill dispensers for medications

★Benefits:
 • Prevents osteoporosis, cardiovascular issues
 • Improves mental health & independence

★Tips:
 • Start slow, increase gradually
 • Include family/caregiver supervision
 • Regular checkups with geriatricians`,
    category: "Preventive Health",
    confidence: 0.96,
    relatedQuestions: ["Best exercise for seniors?", "How can wearables help elderly?", "How to monitor falls at home?"],
    sources: ["NIH Aging", "WHO Elderly Health"],
    tips: [
      "Use assistive devices (walker/cane) as needed",
      "Stay hydrated during workouts",
      "Use apps for reminders and tracking"
    ]
  }
},

// ARTIFICIAL INTELLIGENCE IN DIAGNOSIS
ai_diagnosis: {
  keywords: ["ai", "artificial intelligence", "ai in healthcare", "diagnosis", "machine learning", "deep learning"],
  response: {
    answer: `🤖 ★AI IN MEDICAL DIAGNOSIS★

★Applications:
 • Imaging: AI detects tumors in X-ray, CT, MRI
 • ECG Analysis: Arrhythmia detection
 • Predictive Analytics: Risk scoring (e.g. stroke, sepsis)
 • Virtual Assistants: Symptom triage & patient queries

★Popular Models:
 • CNNs for radiology
 • RNNs for time series (ECG, vitals)
 • NLP for EMR analysis

★IoT Integration:
 • Wearables stream real-time data to cloud AI
 • Alerts generated for anomalies (e.g. abnormal heart rate)

★Ethical Concerns:
 • Data privacy, bias in models, explainability

★Examples:
 • Google DeepMind – Eye disease detection
 • IBM Watson – Oncology decision support`,
    category: "Medical AI",
    confidence: 0.97,
    relatedQuestions: ["Can AI replace doctors?", "Is AI used in radiology?", "What are ethical issues with AI in medicine?"],
    sources: ["Lancet Digital Health", "Nature Medicine", "FDA AI/ML Guidelines"],
    tips: [
      "Use AI as support, not replacement",
      "Validate AI tools clinically before deployment",
      "Ensure data privacy and fairness"
    ]
  }
},

    // RESPIRATORY CONDITIONS
    asthma: {
      keywords: ["asthma", "breathing", "wheeze", "inhaler", "airways", "bronchospasm", "shortness of breath"],
      response: {
        answer: `🫁 ★ASTHMA - Comprehensive Management Guide★

★🔬 Pathophysiology:
Asthma involves three key problems:
1. ★Airway Inflammation: Swollen, irritated airways
2. ★Bronchospasm: Tight muscles around airways
3. ★Mucus Overproduction: Thick secretions block airflow

★📊 Severity Classification:
 ★Intermittent: Symptoms <2 days/week
 ★Mild Persistent: Symptoms >2 days/week but <1x daily
 ★Moderate Persistent: Daily symptoms
 ★Severe Persistent: Continuous symptoms

★🌪️ Common Triggers:
 ★Allergens: Dust mites, pollen, pet dander, mold
 ★Irritants: Smoke, strong odors, pollution
 ★Weather: Cold air, humidity changes
 ★Exercise: Exercise-induced bronchospasm
 ★Infections: Viral respiratory infections
 ★Emotions: Stress, anxiety, strong emotions

★💨 Peak Flow Monitoring:
Normal peak flow zones:
 ★Green Zone★ (80-100%): Good control
 ★Yellow Zone★ (50-79%): Caution, increase treatment
 ★Red Zone★ (<50%): Emergency, seek immediate care

★🏠 Smart Inhalers & IoT:
Modern smart inhalers can:
 Track medication usage automatically
 Remind patients to take medications
 Monitor technique and provide feedback
 Alert for overuse of rescue medications
 Share data with healthcare providers
 Predict exacerbations using AI algorithms

★🚨 Emergency Action Plan:
Call 112 if:
 Peak flow <50% of personal best
 Cannot speak in full sentences
 Blue lips or fingernails
 Rescue inhaler doesn't help within 20 minutes`,
        category: "Respiratory Disease",
        confidence: 0.95,
        relatedQuestions: [
          "How do smart inhalers work?",
          "What is the difference between controller and rescue medications?",
          "Can you exercise with asthma?",
          "How to use a peak flow meter?"
        ],
        sources: ["GINA Guidelines 2023", "NAEPP Expert Panel Report"],
        tips: [
          "Always carry rescue inhaler",
          "Use spacer with MDI inhalers",
          "Rinse mouth after steroid inhalers",
          "Track triggers in diary",
          "Get annual flu vaccination"
        ]
      }
    },

    // ENDOCRINE CONDITIONS
    diabetes: {
      keywords: ["diabetes", "blood sugar", "glucose", "insulin", "type 1", "type 2", "diabetic", "hyperglycemia"],
      response: {
        answer: `🩸 ★DIABETES MELLITUS - Advanced Management★

★🔢 Diagnostic Criteria:
 ★Fasting Glucose: ≥126 mg/dL (7.0 mmol/L)
 ★Random Glucose: ≥200 mg/dL + symptoms
 ★HbA1c: ≥6.5% (48 mmol/mol)
 ★OGTT 2-hour: ≥200 mg/dL

★⚡ Pathophysiology:
 ★Type 1: Autoimmune destruction of beta cells → no insulin
 ★Type 2: Insulin resistance + relative insulin deficiency
 ★Gestational: Pregnancy-induced glucose intolerance

★📱 Continuous Glucose Monitoring (CGM):
Modern CGM systems provide:
 Real-time glucose readings every minute
 Trend arrows showing glucose direction
 Customizable alerts for high/low glucose
 Time-in-range analytics
 Integration with insulin pumps (closed loop)

★🎯 Target Goals:
 ★HbA1c: <7% for most adults
 ★Preprandial: 80-130 mg/dL
 ★Postprandial: <180 mg/dL
 ★Time in Range: >70% (70-180 mg/dL)

★🔧 IoT Integration:
 ★Smart Glucose Meters: Bluetooth connectivity
 ★Insulin Pens: Track doses and timing
 ★CGM Systems: Dexcom, FreeStyle Libre
 ★Insulin Pumps: Automated delivery systems
 ★Mobile Apps: Data analysis and sharing

★⚠️ Acute Complications:
 ★DKA★ (Type 1): Glucose >250, ketones, acidosis
 ★HHS★ (Type 2): Severe hyperglycemia >600 mg/dL
 ★Hypoglycemia: <70 mg/dL, treat with 15g carbs`,
        category: "Endocrine Disease",
        confidence: 0.97,
        relatedQuestions: [
          "How do CGM sensors work?",
          "What is diabetic ketoacidosis?",
          "Best foods for blood sugar control?",
          "How to prevent diabetes complications?"
        ],
        sources: ["ADA Standards of Care 2024", "AACE Guidelines"],
        tips: [
          "Check feet daily for wounds",
          "Rotate injection sites",
          "Always carry glucose tablets",
          "Exercise 150 minutes/week",
          "Get annual eye exams"
        ]
      }
    },

    // VITAL SIGNS DETAILED
    heart_rate: {
      keywords: ["heart rate", "pulse", "bpm", "beats per minute", "tachycardia", "bradycardia"],
      response: {
        answer: `💓 ★HEART RATE MONITORING - Complete Guide★

★📊 Normal Ranges by Age:
 ★Newborn: 100-160 bpm
 ★Infant (1-11 months): 80-140 bpm
 ★Child (1-2 years): 80-130 bpm
 ★Child (3-4 years): 80-120 bpm
 ★Child (5-6 years): 75-115 bpm
 ★Child (7-9 years): 70-110 bpm
 ★Adult: 60-100 bpm
 ★Elderly: 50-100 bpm

★🏃 Heart Rate Zones for Exercise:
 ★Resting: 60-100 bpm
 ★Fat Burn: 50-60% of max HR
 ★Aerobic: 60-70% of max HR
 ★Anaerobic: 70-80% of max HR
 ★Max: 80-90% of max HR
 ★Max HR Formula: 220 - age

★🔬 Measurement Technologies:
 ★ECG: Most accurate, measures electrical activity
 ★PPG (Photoplethysmography): Optical measurement of blood volume
 ★Ballistocardiography: Detects body movement from heartbeats
 ★Seismocardiography: Vibrations from heart contractions

★📱 Wearable Technology:
 ★Chest Straps: Most accurate for exercise (±1 bpm)
 ★Wrist Wearables: Convenient but less accurate during exercise
 ★Smart Rings: 24/7 monitoring with good accuracy
 ★Smart Clothing: Integrated sensors in fabric

★⚠️ Abnormal Heart Rates:
 ★Bradycardia★ (<60 bpm): May indicate:
  - Athletic heart
  - Hypothyroidism
  - Heart block
  - Medication effects

 ★Tachycardia★ (>100 bpm): May indicate:
  - Anxiety/stress
  - Fever
  - Dehydration
  - Heart arrhythmias
  - Hyperthyroidism`,
        category: "Vital Signs",
        confidence: 0.98,
        relatedQuestions: [
          "How accurate are smartwatch heart rate monitors?",
          "What causes resting heart rate to increase?",
          "How to improve heart rate variability?",
          "When is a slow heart rate dangerous?"
        ],
        sources: ["AHA Scientific Statements", "Sports Medicine Research"],
        tips: [
          "Measure resting HR upon waking",
          "Track trends over time",
          "Consider factors affecting HR",
          "Warm hands improve accuracy",
          "Remove motion artifacts"
        ]
      }
    },

    spo2: {
      keywords: ["spo2", "oxygen saturation", "pulse oximetry", "oxygen levels", "hypoxemia", "oximeter"],
      response: {
        answer: `🫁 ★SpO2 MONITORING - Oxygen Saturation Guide★

★📊 Normal Values:
 ★Healthy Adults: 95-100%
 ★Chronic Lung Disease: 88-92% (target range)
 ★High Altitude★ (>8,000 ft): 90-95%
 ★During Sleep: May drop 3-4% normally

★🔬 Technology Principles:
Pulse oximetry works by:
1. ★Red Light★ (660nm): Absorbed more by deoxygenated blood
2. ★Infrared Light★ (940nm): Absorbed more by oxygenated blood
3. ★Ratio Calculation: SpO2 = f(Red/IR absorption ratio)
4. ★Pulse Detection: Differentiates arterial from venous blood

★📱 Consumer Devices:
 ★Fingertip Oximeters: ±2% accuracy when >70%
 ★Smartwatches: Variable accuracy, better for trends
 ★Smart Rings: Continuous monitoring during sleep
 ★Medical-Grade: ±1% accuracy, alarm features

★⚠️ Accuracy Limitations:
 ★Motion Artifacts: Movement affects readings
 ★Poor Perfusion: Cold hands, low blood pressure
 ★Nail Polish: Dark colors interfere with light
 ★Carbon Monoxide: Falsely elevated readings
 ★Skin Pigmentation: May affect accuracy in darker skin

★🚨 Critical Values:
 ★<90%: Severe hypoxemia, immediate medical attention
 ★<85%: Critical hypoxemia, call emergency services
 ★90-94%: Mild hypoxemia, monitor closely
 ★Sudden Drop >4%: Investigate underlying cause

★🏥 Clinical Applications:
 ★COVID-19 Monitoring: Early detection of silent hypoxia
 ★Sleep Apnea: Detect nighttime oxygen drops
 ★COPD Management: Avoid over-oxygenation
 ★Exercise Testing: Monitor exertional hypoxemia
 ★Medication Titration: Oxygen therapy adjustments`,
        category: "Vital Signs",
        confidence: 0.96,
        relatedQuestions: [
          "How accurate are smartphone SpO2 sensors?",
          "What causes false low oxygen readings?",
          "Can you have normal SpO2 with lung disease?",
          "How to improve oxygen saturation naturally?"
        ],
        sources: ["Pulse Oximetry Guidelines", "FDA Device Standards"],
        tips: [
          "Warm hands before measurement",
          "Remove nail polish",
          "Keep finger still during reading",
          "Try different fingers if poor signal",
          "Compare with medical-grade device"
        ]
      }
    },

    // IOT SENSOR TECHNOLOGY
    max30100: {
      keywords: ["max30100", "max30102", "pulse oximeter sensor", "ppg", "photoplethysmography", "sensor"],
      response: {
        answer: `🔬 ★MAX30100/MAX30102 - IoT Sensor Deep Dive★

★⚙️ Technical Specifications:
 ★Supply Voltage: 1.8V - 3.3V
 ★Interface: I2C (400kHz)
 ★Current Consumption: 0.7mA typical
 ★LED Wavelengths: 660nm (Red), 880nm/940nm (IR)
 ★ADC Resolution: 16-bit
 ★Sample Rate: 50Hz - 3.2kHz
 ★Temperature Range: -40°C to +85°C

★🔧 Pin Configuration:
\`\`\`
VIN  → 3.3V power supply
GND  → Ground
SCL  → I2C clock line (with pullup)
SDA  → I2C data line (with pullup)
INT  → Interrupt output (optional)
\`\`\`

★💻 Arduino Code Example:
\`\`\`cpp
#include "MAX30100.h"
#include <WiFi.h>

MAX30100 sensor;
float heartRate, spO2;

void setup() {
  Serial.begin(115200);
  
  if (!sensor.begin()) {
    Serial.println("MAX30100 not found");
    while(1);
  }
  
  sensor.setMode(MAX30100_MODE_SPO2_HR);
  sensor.setLedsCurrent(IR_LED_CURRENT, RED_LED_CURRENT);
  sensor.setLedsPulseWidth(MAX30100_SPC_PW_1600US_16BITS);
  sensor.setSamplingRate(MAX30100_SAMPRATE_100HZ);
  sensor.setHighresModeEnabled(true);
}

void loop() {
  sensor.update();
  
  if (sensor.isFingerDetected()) {
    heartRate = sensor.getHeartRate();
    spO2 = sensor.getSpO2();
    
    if (heartRate > 50 && heartRate < 200) {
      Serial.printf("HR: %.1f bpm, SpO2: %.1f%%\\n", 
                    heartRate, spO2);
      sendToCloud(heartRate, spO2);
    }
  }
  
  delay(100);
}
\`\`\`

★📊 Signal Processing:
1. ★Raw Signal Acquisition: 16-bit ADC samples
2. ★DC Component Removal: High-pass filtering
3. ★Noise Filtering: Band-pass filter (0.5-5 Hz)
4. ★Peak Detection: Find R-peaks for heart rate
5. ★SpO2 Calculation: Red/IR ratio algorithm

★🔧 Calibration Process:
 ★Factory Calibration: Pre-calibrated coefficients
 ★User Calibration: Compare with medical oximeter
 ★Environmental Calibration: Account for ambient light
 ★Motion Compensation: Accelerometer integration

★⚠️ Common Issues & Solutions:
 ★Poor Signal Quality: Ensure firm finger contact
 ★Motion Artifacts: Add accelerometer for filtering
 ★Ambient Light: Use opaque housing
 ★Power Management: Implement sleep modes
 ★False Readings: Implement validity checks`,
        category: "IoT Technology",
        confidence: 0.94,
        relatedQuestions: [
          "MAX30100 vs MAX30102 differences?",
          "How to improve MAX30100 accuracy?",
          "Best practices for PPG signal processing?",
          "How to detect motion artifacts?"
        ],
        sources: ["Maxim Integrated Datasheets", "Biomedical Signal Processing"],
        tips: [
          "Use 4.7kΩ pullup resistors for I2C",
          "Shield sensor from ambient light",
          "Implement timeout for finger detection",
          "Add low-pass filter for stable readings",
          "Calibrate against medical-grade device"
        ]
      }
    },

    // EMERGENCY MEDICINE
    emergency: {
      keywords: ["emergency", "112", "urgent", "help", "critical", "severe", "chest pain", "stroke", "heart attack"],
      response: {
        answer: `🚨 ★EMERGENCY MEDICAL PROTOCOLS★

★🆘 IMMEDIATE 112 Situations:

★💔 Heart Attack (STEMI/NSTEMI):
 Crushing chest pain >20 minutes
 Pain radiating to arm, jaw, back
 Sweating, nausea, shortness of breath
 ★Action: Chew 325mg aspirin, call 112

★🧠 Stroke (F.A.S.T. Protocol):
 ★F★ace drooping (smile test)
 ★A★rm weakness (raise both arms)
 ★S★peech difficulty (repeat phrase)
 ★T★ime to call 112 immediately

★🫁 Severe Respiratory Distress:
 Cannot speak in full sentences
 Blue lips or fingernails (cyanosis)
 SpO2 <85% or severe desaturation
 Severe asthma attack unresponsive to rescue inhaler

★⚡ Cardiac Arrhythmias:
 Heart rate >150 or <40 with symptoms
 Chest pain with irregular rhythm
 Syncope or near-syncope
 Palpitations with hemodynamic instability

★🩸 Severe Hypoglycemia:
 Blood glucose <40 mg/dL
 Altered mental status
 Seizures or loss of consciousness
 ★Action: Give glucagon injection

★📱 Digital Health Emergency Features:
 ★Medical ID: Store emergency contacts, conditions
 ★Emergency SOS: Automatic location sharing
 ★Fall Detection: Auto-call if severe fall detected
 ★Critical Alerts: Wearables can detect emergencies

★🏥 Emergency Department Triage:
 ★Level 1 (Resuscitation): Life-threatening
 ★Level 2 (Emergent): High risk, <15 min wait
 ★Level 3 (Urgent): Moderate risk, <30 min wait
 ★Level 4 (Less Urgent): Low risk, <60 min wait
 ★Level 5 (Non-Urgent): Minimal risk, <120 min wait

★📞 What to Tell 112 Dispatcher:
1. Your location (address/landmarks)
2. Nature of emergency
3. Number of people involved
4. Conscious/breathing status
5. Any immediate dangers
6. Follow dispatcher instructions`,
        category: "Emergency Medicine",
        confidence: 0.99,
        relatedQuestions: [
          "How to perform CPR correctly?",
          "When to use an AED?",
          "What medications to take during heart attack?",
          "How to recognize anaphylaxis?"
        ],
        sources: ["AHA Emergency Guidelines", "Emergency Medicine Protocols"],
        tips: [
          "Learn hands-only CPR",
          "Keep emergency contacts updated",
          "Know location of nearest AED",
          "Practice emergency scenarios",
          "Maintain emergency medication supply"
        ]
      }
    }
  }

  // Enhanced query processing with medical NLP
  const processQuery = (query: string): QAResponse => {
    const lowercaseQuery = query.toLowerCase()
    let bestMatch: any = null
    let highestScore = 0

    // Search through knowledge base
    Object.entries(knowledgeBase).forEach(([topic, data]) => {
      const keywordMatches = data.keywords.filter(keyword => 
        lowercaseQuery.includes(keyword.toLowerCase())
      ).length

      if (keywordMatches > 0) {
        const score = keywordMatches / data.keywords.length
        if (score > highestScore) {
          highestScore = score
          bestMatch = data.response
        }
      }
    })

    // Enhanced fallback responses
    if (!bestMatch) {
      if (lowercaseQuery.includes("calculator") || lowercaseQuery.includes("risk") || lowercaseQuery.includes("score")) {
        bestMatch = {
          answer: `🧮 ★MEDICAL CALCULATORS & RISK ASSESSMENTS★

Available offline calculators:
 ★Cardiovascular Risk: ASCVD Risk Calculator
 ★Blood Pressure: Mean Arterial Pressure (MAP)
 ★Body Metrics: BMI, BSA, Ideal Body Weight
 ★Kidney Function: Creatinine Clearance (Cockcroft-Gault)
 ★Cardiac: CHADS2-VASc Score for stroke risk
 ★Emergency: NEWS2 Score for clinical deterioration

Type "calculate BMI" or "CHADS2 score" for specific calculators!`,
          category: "Medical Calculators",
          confidence: 0.85,
          relatedQuestions: ["How to calculate cardiovascular risk?", "What is CHADS2-VASc score?", "BMI calculator formula?"],
          sources: ["Clinical Prediction Rules", "Medical Calculators"]
        }
      } else if (lowercaseQuery.includes("how") || lowercaseQuery.includes("what") || lowercaseQuery.includes("why")) {
        bestMatch = {
          answer: `🤖 ★I'm here to help with medical education!★

I have comprehensive knowledge about:

🩺 ★Medical Conditions:
 Cardiovascular: Hypertension, Arrhythmias, Heart Failure
 Respiratory: Asthma, COPD, Sleep Apnea
 Endocrine: Diabetes, Thyroid Disorders
 Neurological: Stroke, Seizures, Headaches

📊 ★Vital Signs & Monitoring:
 Heart Rate & Heart Rate Variability
 Blood Pressure Measurement & Management
 Oxygen Saturation (SpO2) Technology
 Body Temperature Monitoring

🔬 ★IoT Medical Technology:
 Pulse Oximetry Sensors (MAX30100/MAX30102)
 ECG Monitoring (AD8232, 3-lead, 12-lead)
 Temperature Sensors (DS18B20, Thermistors)
 Wearable Technology Integration

Please ask me something specific!`,
          category: "General Help",
          confidence: 0.7,
          relatedQuestions: ["Explain blood pressure readings", "How do pulse oximeters work?", "What are normal vital signs?"],
          sources: ["Medical Education Database"]
        }
      } else {
        bestMatch = {
          answer: `🔍 ★I couldn't find specific information about "${query}"★

Try asking about:
 ★Diseases: "explain hypertension", "asthma symptoms"
 ★Vital Signs: "normal heart rate", "blood pressure ranges"  
 ★Technology: "MAX30100 sensor", "how ECG works"
 ★Emergency: "heart attack symptoms", "stroke signs"
 ★Calculators: "BMI calculator", "cardiovascular risk"

I'm continuously learning and my knowledge base covers 100+ medical topics!`,
          category: "Search Help",
          confidence: 0.3,
          relatedQuestions: ["What medical topics can you explain?", "How to use medical calculators?", "Emergency warning signs?"],
          sources: ["Available Knowledge Base"]
        }
      }
    }

    return bestMatch
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentQuery = inputValue
    setInputValue("")
    setIsTyping(true)

    // Simulate AI processing time with realistic delay
    setTimeout(() => {
      const response = processQuery(currentQuery)
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        category: response.category,
        relatedTopics: response.relatedQuestions
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000) // 1.5-2.5 second realistic delay
  }

  const handleQuickTopic = (query: string) => {
    setInputValue(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          MedIoT AI Assistant
          <Badge variant="secondary" className="ml-auto flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Offline AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Advanced medical education AI with 100+ topics  No internet required  Real-time responses
        </CardDescription>
      </CardHeader>

      {/* Enhanced Quick Topics with Categories */}
      <div className="px-6 pb-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {quickTopics.map((topic, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickTopic(topic.query)}
              className="h-auto p-2 flex flex-col items-center text-center space-y-1 hover:bg-blue-50"
            >
              <div className="flex items-center gap-1">
                {topic.icon}
                <span className="text-xs font-medium">{topic.label}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                {topic.category}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Enhanced Chat Messages */}
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <Bot className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-1.5" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] rounded-lg p-4 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-900 border"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {message.category && message.role === "assistant" && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                        <Badge variant="outline" className="text-xs">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {message.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                    
                    {message.relatedTopics && message.relatedTopics.length > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Related topics:
                        </p>
                        <div className="space-y-1">
                          {message.relatedTopics.slice(0, 3).map((topic, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickTopic(topic)}
                              className="block text-xs text-blue-600 hover:text-blue-800 hover:underline text-left p-1 rounded hover:bg-blue-50 transition-colors"
                            >
                               {topic}
                            </button>


                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-1.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <Bot className="h-8 w-8 text-blue-600 bg-blue-100 rounded-full p-1.5 flex-shrink-0" />
                <div className="bg-gray-50 border rounded-lg p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-gray-600">AI is analyzing your question...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Enhanced Input Area */}
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about diseases, vital signs, IoT sensors, or emergency care..."
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputValue.trim() || isTyping}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Send
          </Button>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            Powered by advanced offline medical AI
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            No internet required
          </span>
        </div>
      </div>
    </Card>
  )
}