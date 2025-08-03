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
  Stethoscope
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

export default function OfflineQAChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your offline medical education assistant. I can help you understand diseases, symptoms, vital signs, and IoT sensor technology. What would you like to learn about today?",
      timestamp: new Date(),
      category: "greeting"
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Comprehensive medical knowledge base
  const knowledgeBase = {
    // Disease Information
    hypertension: {
      keywords: ["high blood pressure", "hypertension", "bp", "systolic", "diastolic"],
      responses: [
        {
          answer: "Hypertension (high blood pressure) occurs when blood flows through arteries with excessive force. Normal blood pressure is less than 120/80 mmHg. Stage 1 hypertension is 130-139/80-89 mmHg, and Stage 2 is ≥140/90 mmHg. It's called the 'silent killer' because it often has no symptoms but increases risk of heart disease, stroke, and kidney problems.",
          category: "Disease Information",
          confidence: 0.95,
          relatedQuestions: ["What causes high blood pressure?", "How to lower blood pressure naturally?", "What are blood pressure medications?"],
          sources: ["American Heart Association Guidelines", "WHO Hypertension Fact Sheet"],
          tips: ["Monitor BP daily", "Reduce sodium intake", "Exercise regularly", "Maintain healthy weight"]
        }
      ]
    },
    stroke: {
  keywords: ["stroke", "brain attack", "F.A.S.T.", "paralysis", "clot", "ischemic"],
  responses: [{
    answer: "A stroke occurs when blood flow to a part of the brain is interrupted, causing brain cells to die. Symptoms include sudden numbness, confusion, trouble speaking, or loss of balance. Use the F.A.S.T. acronym: Face drooping, Arm weakness, Speech difficulty, Time to call emergency.",
    category: "Disease Information",
    confidence: 0.96,
    relatedQuestions: ["What causes strokes?", "What is F.A.S.T.?", "How to prevent stroke?"],
    sources: ["Stroke Foundation", "WHO Guidelines"],
    tips: ["Control blood pressure", "Avoid smoking", "Manage diabetes", "Exercise regularly"]
  }]
},
thyroid: {
  keywords: ["thyroid", "hypothyroidism", "hyperthyroidism", "TSH", "metabolism"],
  responses: [{
    answer: "Thyroid disorders affect metabolism. Hypothyroidism slows the metabolism, causing fatigue and weight gain. Hyperthyroidism speeds it up, causing anxiety and weight loss. Tests include TSH, T3, and T4 levels. Treatment involves medications or surgery depending on severity.",
    category: "Disease Information",
    confidence: 0.91,
    relatedQuestions: ["How to treat hypothyroidism?", "What are thyroid symptoms?", "When to get TSH tested?"],
    sources: ["Endocrine Society", "Thyroid Foundation"],
    tips: ["Take medication consistently", "Get regular thyroid tests", "Watch for weight or mood changes"]
  }]
},
covid19: {
  keywords: ["covid", "coronavirus", "SARS-CoV-2", "pandemic", "infection", "vaccine"],
  responses: [{
    answer: "COVID-19 is a respiratory illness caused by SARS-CoV-2. Symptoms include fever, cough, loss of smell, and fatigue. It spreads through droplets and aerosols. Vaccines reduce severity. Testing includes RT-PCR and antigen tests. Isolation and hygiene are key to prevention.",
    category: "Infectious Diseases",
    confidence: 0.95,
    relatedQuestions: ["What are COVID-19 symptoms?", "Which vaccines are available?", "When to isolate?"],
    sources: ["WHO", "CDC"],
    tips: ["Wear a mask in crowded places", "Wash hands frequently", "Get vaccinated", "Stay home if symptomatic"]
  }]
},
elderly_fitness: {
  keywords: ["elderly", "senior health", "aging", "exercise for seniors", "old age fitness"],
  responses: [{
    answer: "Elderly fitness helps maintain mobility, strength, and mental well-being. Activities include walking, chair exercises, yoga, and light strength training. Always consult a doctor before starting. Staying active reduces risk of falls and improves quality of life.",
    category: "Health & Wellness",
    confidence: 0.88,
    relatedQuestions: ["Best exercise for seniors?", "How to stay fit at old age?", "How to avoid falls?"],
    sources: ["National Institute on Aging", "WHO Ageing Health"],
    tips: ["Start slow", "Use support while exercising", "Hydrate well", "Exercise regularly"]
  }]
},
ai_diagnosis: {
  keywords: ["AI diagnosis", "artificial intelligence", "machine learning", "health AI", "diagnostic tools"],
  responses: [{
    answer: "AI in healthcare assists in diagnosis by analyzing medical images, predicting diseases, and monitoring patient data. It uses machine learning algorithms trained on large datasets. Examples include AI detecting pneumonia on X-rays or predicting heart attacks using wearable data.",
    category: "Technology in Medicine",
    confidence: 0.9,
    relatedQuestions: ["How is AI used in hospitals?", "Can AI replace doctors?", "Examples of medical AI?"],
    sources: ["The Lancet Digital Health", "Nature Medicine"],
    tips: ["AI supports doctors, not replaces", "Data quality is crucial", "Always confirm with clinical judgement"]
  }]
},
    asthma: {
      keywords: ["asthma", "breathing", "wheeze", "inhaler", "airways", "bronchospasm"],
      responses: [
        {
          answer: "Asthma is a chronic respiratory condition where airways become inflamed and narrow, making breathing difficult. Common symptoms include wheezing, coughing, chest tightness, and shortness of breath. Triggers include allergens, cold air, exercise, and stress. Treatment involves controller medications (preventive) and rescue inhalers (quick relief).",
          category: "Disease Information",
          confidence: 0.93,
          relatedQuestions: ["What triggers asthma attacks?", "How do inhalers work?", "Can asthma be cured?"],
          sources: ["Global Initiative for Asthma (GINA)", "CDC Asthma Guidelines"],
          tips: ["Identify and avoid triggers", "Use controller medication daily", "Always carry rescue inhaler", "Monitor peak flow"]
        }
      ]
    },
    diabetes: {
      keywords: ["diabetes", "blood sugar", "glucose", "insulin", "type 1", "type 2"],
      responses: [
        {
          answer: "Diabetes is a condition where blood glucose levels are too high. Type 1 diabetes occurs when the pancreas produces little to no insulin. Type 2 diabetes occurs when the body becomes resistant to insulin or doesn't produce enough. Normal fasting glucose is <100 mg/dL, prediabetes is 100-125 mg/dL, and diabetes is ≥126 mg/dL.",
          category: "Disease Information",
          confidence: 0.94,
          relatedQuestions: ["What are diabetes complications?", "How to manage blood sugar?", "What is HbA1c?"],
          sources: ["American Diabetes Association", "WHO Diabetes Guidelines"],
          tips: ["Monitor blood glucose regularly", "Follow meal plan", "Exercise after meals", "Take medications as prescribed"]
        }
      ]
    },

    // Vital Signs Information
    heart_rate: {
      keywords: ["heart rate", "pulse", "bpm", "beats per minute", "tachycardia", "bradycardia"],
      responses: [
        {
          answer: "Normal resting heart rate for adults is 60-100 beats per minute (bpm). Athletes may have rates as low as 40-60 bpm. Tachycardia is >100 bpm at rest, bradycardia is <60 bpm. Heart rate increases with exercise, stress, fever, and certain medications. It's measured using pulse oximeters, ECG, or manual palpation.",
          category: "Vital Signs",
          confidence: 0.96,
          relatedQuestions: ["What affects heart rate?", "How to measure heart rate?", "When is heart rate dangerous?"],
          sources: ["American Heart Association", "Medical Physiology Textbooks"],
          tips: ["Check pulse at wrist or neck", "Count for 15 seconds and multiply by 4", "Best measured when resting"]
        }
      ]
    },
    spo2: {
      keywords: ["spo2", "oxygen saturation", "pulse oximetry", "oxygen levels", "hypoxemia"],
      responses: [
        {
          answer: "SpO2 (oxygen saturation) measures the percentage of hemoglobin carrying oxygen. Normal values are 95-100%. Values below 95% indicate hypoxemia and may require medical attention. Below 90% is considered severe hypoxemia. Pulse oximeters use light absorption to measure SpO2 non-invasively.",
          category: "Vital Signs",
          confidence: 0.97,
          relatedQuestions: ["How does pulse oximetry work?", "What causes low oxygen?", "When to seek help for low SpO2?"],
          sources: ["Respiratory Medicine Guidelines", "Pulse Oximetry Standards"],
          tips: ["Warm hands before measurement", "Remove nail polish", "Avoid movement during reading", "Consider altitude effects"]
        }
      ]
    },
    blood_pressure: {
      keywords: ["blood pressure", "systolic", "diastolic", "mmhg", "hypertension", "hypotension"],
      responses: [
        {
          answer: "Blood pressure has two components: systolic (pressure during heartbeats) and diastolic (pressure between beats). Normal is <120/80 mmHg. Elevated is 120-129/<80. Stage 1 hypertension is 130-139/80-89. Stage 2 is ≥140/90. Hypotension is generally <90/60 mmHg and may cause dizziness.",
          category: "Vital Signs",
          confidence: 0.98,
          relatedQuestions: ["How to measure blood pressure correctly?", "What causes blood pressure changes?", "When is blood pressure an emergency?"],
          sources: ["American Heart Association", "Hypertension Guidelines"],
          tips: ["Sit quietly for 5 minutes before measurement", "Use proper cuff size", "Support arm at heart level", "Take multiple readings"]
        }
      ]
    },

    // IoT Sensor Technology
    max30100: {
      keywords: ["max30100", "max30102", "pulse oximeter sensor", "ppg", "photoplethysmography"],
      responses: [
        {
          answer: "MAX30100/MAX30102 are integrated pulse oximetry sensors that measure heart rate and SpO2. They use photoplethysmography (PPG) technology with red (660nm) and infrared (880nm/940nm) LEDs. The sensor detects blood volume changes to calculate heart rate and uses the difference in light absorption between oxygenated and deoxygenated blood for SpO2.",
          category: "IoT Technology",
          confidence: 0.92,
          relatedQuestions: ["How to calibrate MAX30100?", "Arduino code for MAX30100?", "MAX30100 vs MAX30102 differences?"],
          sources: ["Maxim Integrated Datasheets", "Biomedical Engineering Handbooks"],
          tips: ["Ensure good finger contact", "Filter motion artifacts", "Calibrate with known references", "Consider ambient light interference"]
        }
      ]
    },
    ds18b20: {
      keywords: ["ds18b20", "temperature sensor", "1-wire", "thermometer", "body temperature"],
      responses: [
        {
          answer: "DS18B20 is a digital temperature sensor using 1-Wire protocol. It provides 9-12 bit temperature readings with ±0.5°C accuracy. For medical applications, it can monitor body temperature (normal: 36.5-37.2°C) and environmental conditions. The 1-Wire protocol allows multiple sensors on a single data line.",
          category: "IoT Technology",
          confidence: 0.89,
          relatedQuestions: ["How to waterproof DS18B20?", "1-Wire protocol explained?", "Temperature sensor calibration?"],
          sources: ["Dallas Semiconductor Datasheets", "Temperature Measurement Standards"],
          tips: ["Use proper waterproofing for body contact", "Allow thermal equilibration time", "Consider sensor placement", "Account for self-heating effects"]
        }
      ]
    },
    ecg: {
      keywords: ["ecg", "ekg", "electrocardiogram", "ad8232", "heart rhythm", "arrhythmia detection"],
      responses: [
        {
          answer: "ECG (electrocardiogram) measures electrical activity of the heart. The AD8232 is a popular single-lead ECG sensor for IoT applications. It detects P waves (atrial depolarization), QRS complex (ventricular depolarization), and T waves (ventricular repolarization). Normal heart rhythm shows regular intervals between QRS complexes.",
          category: "IoT Technology",
          confidence: 0.87,
          relatedQuestions: ["How to read ECG signals?", "ECG electrode placement?", "Detecting arrhythmias with ECG?"],
          sources: ["Cardiology Textbooks", "AD8232 Application Notes"],
          tips: ["Proper electrode placement crucial", "Filter 50/60Hz noise", "Use right leg drive for common mode rejection", "Detect lead-off conditions"]
        }
      ]
    },

    // Emergency and Symptoms
    emergency: {
      keywords: ["emergency", "112", "urgent", "help", "critical", "severe", "chest pain", "stroke"],
      responses: [
        {
          answer: "Call emergency services (112) immediately for: severe chest pain, difficulty breathing, sudden weakness or numbness, severe allergic reactions, loss of consciousness, severe bleeding, or signs of stroke (F.A.S.T. - Face drooping, Arm weakness, Speech difficulty, Time to call). For urgent but non-emergency concerns, contact your healthcare provider or urgent care.",
          category: "Emergency Information",
          confidence: 0.99,
          relatedQuestions: ["What are stroke warning signs?", "Heart attack symptoms?", "When to use EpiPen?"],
          sources: ["Emergency Medicine Guidelines", "American Heart Association", "Stroke Association"],
          tips: ["Know emergency numbers", "Keep emergency contacts accessible", "Don't drive yourself during emergency", "Stay calm and provide clear information to dispatcher"]
        }
      ]
    },

    // Medication and Treatment
    medications: {
      keywords: ["medication", "drugs", "pills", "dosage", "side effects", "interactions"],
      responses: [
        {
          answer: "Medications should be taken exactly as prescribed. Common categories include: antihypertensives (ACE inhibitors, beta-blockers), diabetes medications (metformin, insulin), respiratory medications (bronchodilators, corticosteroids). Always inform healthcare providers about all medications to avoid dangerous interactions. Use pill organizers for complex regimens.",
          category: "Treatment Information",
          confidence: 0.91,
          relatedQuestions: ["Common drug interactions?", "How to manage multiple medications?", "When to take medications?"],
          sources: ["Pharmacology References", "FDA Drug Information"],
          tips: ["Set medication reminders", "Keep updated medication list", "Report side effects to doctor", "Don't stop medications abruptly"]
        }
      ]
    }
  }

  // Quick topic suggestions
  const quickTopics = [
    { icon: <Heart className="h-4 w-4" />, label: "Blood Pressure", query: "blood pressure normal ranges" },
    { icon: <Activity className="h-4 w-4" />, label: "Heart Rate", query: "heart rate monitoring" },
    { icon: <Droplets className="h-4 w-4" />, label: "SpO2 Levels", query: "oxygen saturation normal values" },
    { icon: <Thermometer className="h-4 w-4" />, label: "Temperature", query: "body temperature measurement" },
    { icon: <Stethoscope className="h-4 w-4" />, label: "Asthma", query: "asthma symptoms treatment" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Emergency Signs", query: "emergency warning signs" },
    { icon: <BookOpen className="h-4 w-4" />, label: "Diabetes", query: "diabetes symptoms and treatment" },
    { icon: <Lightbulb className="h-4 w-4" />, label: "Hypertension", query: "what is hypertension" },
    { icon: <CheckCircle className="h-4 w-4" />, label: "Medications", query: "common medications in chronic diseases" },
    { icon: <Clock className="h-4 w-4" />, label: "IoT Sensors", query: "MAX30100 and DS18B20 usage" },
    { icon: <Activity className="h-4 w-4" />, label: "ECG", query: "how ECG sensors work" },
    { icon: <Heart className="h-4 w-4" />, label: "Heart Attack Signs", query: "how to identify heart attack" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Stroke", query: "signs of stroke and F.A.S.T." },
    { icon: <Stethoscope className="h-4 w-4" />, label: "Thyroid", query: "thyroid disorders and symptoms" },
    { icon: <Droplets className="h-4 w-4" />, label: "Fever", query: "what to do in case of high fever" },
    { icon: <Thermometer className="h-4 w-4" />, label: "Body Temp", query: "how to measure body temperature accurately" },

  ]

  // Process user query and find best response
  const processQuery = (query: string): QAResponse => {
    const lowercaseQuery = query.toLowerCase()
    let bestMatch: QAResponse | null = null
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
          bestMatch = data.responses[0]
        }
      }
    })

    // Fallback responses for common patterns
    if (!bestMatch) {
      if (lowercaseQuery.includes("how") || lowercaseQuery.includes("what") || lowercaseQuery.includes("why")) {
        bestMatch = {
          answer: "I'd be happy to help you learn about medical topics! I have information about diseases (hypertension, asthma, diabetes), vital signs (heart rate, blood pressure, SpO2, temperature), IoT sensors (MAX30100, DS18B20, ECG), and emergency care. Could you please be more specific about what you'd like to know?",
          category: "General Help",
          confidence: 0.7,
          relatedQuestions: ["What diseases can you explain?", "How do medical sensors work?", "What are normal vital signs?"],
          sources: ["Medical Education Database"]
        }
      } else {
        bestMatch = {
          answer: "I'm sorry, I don't have specific information about that topic in my knowledge base. I can help with medical conditions, vital signs, IoT sensors, and emergency information. Try asking about blood pressure, heart rate, asthma, diabetes, or medical sensors like MAX30100.",
          category: "Unknown",
          confidence: 0.3,
          relatedQuestions: ["What topics can you help with?", "Tell me about vital signs", "Explain medical sensors"],
          sources: ["Available Knowledge Base"]
        }
      }
    }

    return bestMatch!
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
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const response = processQuery(inputValue)
      
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
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleQuickTopic = (query: string) => {
    setInputValue(query)
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Medical Education Assistant
          <Badge variant="secondary" className="ml-auto">Offline AI</Badge>
        </CardTitle>
        <CardDescription>
          Get instant answers about medical conditions, vital signs, and IoT sensor technology
        </CardDescription>
      </CardHeader>

      {/* Quick Topics */}
      <div className="px-6 pb-3">
        <div className="flex flex-wrap gap-2">
          {quickTopics.map((topic, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => handleQuickTopic(topic.query)}
              className="h-8 text-xs"
            >
              {topic.icon}
              <span className="ml-1">{topic.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Chat Messages */}
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
                    <Bot className="h-6 w-6 text-blue-600 bg-blue-100 rounded-full p-1" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 text-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="space-y-2">
                    <p>{message.content}</p>
                    
                    {message.category && message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
                        <Badge variant="outline" className="text-xs">
                          {message.category}
                        </Badge>
                      </div>
                    )}
                    
                    {message.relatedTopics && message.relatedTopics.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Related questions:</p>
                        <div className="space-y-1">
                          {message.relatedTopics.slice(0, 2).map((topic, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuickTopic(topic)}
                              className="block text-xs text-blue-600 hover:text-blue-800 underline text-left"
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
                    <User className="h-6 w-6 text-blue-600 bg-blue-100 rounded-full p-1" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-3">
                <Bot className="h-6 w-6 text-blue-600 bg-blue-100 rounded-full p-1 flex-shrink-0" />
                <div className="bg-gray-100 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                    <span className="text-gray-600 ml-2">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <Separator />

      {/* Input Area */}
      <div className="p-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about diseases, vital signs, or IoT sensors..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Powered by offline medical knowledge base • No internet required
        </p>
      </div>
    </Card>
  )
}