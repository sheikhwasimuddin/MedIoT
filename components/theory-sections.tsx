"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock } from "lucide-react"

import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Brain,
  Cpu,
  Zap,
  BookOpen,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
  Stethoscope,
  CircuitBoard,
  Wifi,
  Database,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Info,
  Microscope
} from "lucide-react"
import { link } from "fs"

interface AudienceMode {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
}

const audienceModes: AudienceMode[] = [
  {
    id: "medical",
    name: "Medical Students",
    icon: <Stethoscope className="h-4 w-4" />,
    color: "bg-blue-500",
    description: "Deep medical theory, pathophysiology, and diagnostic reasoning"
  },
  {
    id: "public",
    name: "General Public",
    icon: <Heart className="h-4 w-4" />,
    color: "bg-green-500",
    description: "Simple explanations, health tips, and monitoring guidance"
  },
  {
    id: "developer",
    name: "IoT Developers",
    icon: <CircuitBoard className="h-4 w-4" />,
    color: "bg-purple-500",
    description: "Technical specs, sensor integration, and code examples"
  },
  {
    id: "researcher",
    name: "Researchers",
    icon: <Microscope className="h-4 w-4" />,
    color: "bg-orange-500",
    description: "Analytics, research methodologies, and data insights"
  }
]

export default function TheorySections() {
  const [selectedAudience, setSelectedAudience] = useState<string>("medical")

  const getAudienceContent = (audience: string, contentType: string) => {
    const content = {
      medical: {
        pathophysiology: {
          title: "Advanced Pathophysiology",
          content: `
            ★Hypertension Pathophysiology:
            
            ★Primary Mechanisms:
            - Increased peripheral vascular resistance due to arteriolar vasoconstriction
            - Enhanced sodium retention leading to increased plasma volume
            - Activation of renin-angiotensin-aldosterone system (RAAS)
            - Sympathetic nervous system hyperactivation
            
            ★Cellular Level Changes:
            - Vascular smooth muscle hypertrophy and hyperplasia
            - Endothelial dysfunction with reduced nitric oxide bioavailability
            - Increased calcium influx in vascular smooth muscle cells
            - Altered pressure natriuresis relationship
            
            ★Cardiovascular Consequences:
            - Left ventricular hypertrophy and diastolic dysfunction
            - Accelerated atherosclerosis and coronary artery disease
            - Increased risk of heart failure, stroke, and kidney disease
            
            ★Asthma Pathophysiology:
            
            ★Inflammatory Cascade:
            - Type 2 T-helper cell mediated response
            - IgE-mediated mast cell degranulation
            - Eosinophil infiltration and activation
            - Release of inflammatory mediators (histamine, leukotrienes, prostaglandins)
            
            ★Airway Changes:
            - Bronchial smooth muscle contraction and hypertrophy
            - Mucus hypersecretion and impaired clearance
            - Epithelial damage and basement membrane thickening
            - Airway remodeling with fibrosis and collagen deposition
          `,
          level: "Advanced",
          duration: "15-20 min"
        },
        diagnostics: {
          title: "Evidence-Based Diagnostic Algorithms",
          content: `
            ★National Early Warning Score (NEWS2):
            
            | Parameter | Score 3 | Score 2 | Score 1 | Score 0 | Score 1 | Score 2 | Score 3 |
            |-----------|---------|---------|---------|---------|---------|---------|---------|
            | Resp Rate | ≤8 | 9-11 | 12-20 | 21-24 | ≥25 | | |
            | SpO2 Scale 1 | ≤83 | 84-85 | 86-87 | ≥88 | | | |
            | Air/Oxygen | | Oxygen | | Air | | | |
            | Systolic BP | ≤70 | 71-80 | 81-100 | 101-110 | 111-219 | ≥220 | |
            | Pulse | ≤40 | | 41-50 | 51-90 | 91-110 | 111-130 | ≥131 |
            | AVPU | | | | Alert | Voice | Pain | Unresponsive |
            | Temperature | ≤35.0 | | 35.1-36.0 | 36.1-38.0 | 38.1-39.0 | ≥39.1 | |
            
            ★Clinical Decision Rules:
            
            ★Wells Score for Pulmonary Embolism:
            - Clinical symptoms of DVT: 3 points
            - PE more likely than alternative diagnosis: 3 points
            - Heart rate >100 bpm: 1.5 points
            - Immobilization/surgery in past 4 weeks: 1.5 points
            - Previous PE/DVT: 1.5 points
            - Hemoptysis: 1 point
            - Malignancy: 1 point
            
            ★CHADS2-VASc Score for Stroke Risk:
            - Congestive heart failure: 1 point
            - Hypertension: 1 point
            - Age ≥75: 2 points
            - Diabetes: 1 point
            - Stroke/TIA history: 2 points
            - Vascular disease: 1 point
            - Age 65-74: 1 point
            - Sex category (female): 1 point
          `,
          level: "Advanced",
          duration: "25-30 min"
        }
      },
      public: {
        pathophysiology: {
          title: "Understanding Your Health Conditions",
          content: `
            ★What is High Blood Pressure?
            
            Think of your blood vessels like garden hoses carrying water throughout your body. When you have high blood pressure, it's like turning up the water pressure too high. This extra pressure can damage the "hoses" (blood vessels) over time.
            
            ★Why does it happen?
            - Your heart has to work harder to pump blood
            - Blood vessels become narrower or stiffer
            - Too much salt in your diet makes your body hold onto water
            - Stress makes your heart beat faster and harder
            
            ★What are the warning signs?
            - Headaches (especially in the morning)
            - Feeling dizzy or lightheaded
            - Tiredness that doesn't go away with rest
            - Sometimes chest discomfort
            
            ★What is Asthma?
            
            Imagine your breathing tubes as flexible straws. In asthma, these "straws" become swollen and filled with thick mucus, making it hard for air to flow through.
            
            ★Common triggers:
            - Allergens (pollen, dust mites, pet dander)
            - Cold air or weather changes
            - Exercise (but you can still exercise with proper management!)
            - Strong smells or smoke
            - Stress or strong emotions
            
            ★Warning signs to watch for:
            - Wheezing or whistling sounds when breathing
            - Coughing, especially at night
            - Feeling short of breath during normal activities
            - Chest tightness
          `,
          level: "Beginner",
          duration: "10-15 min"
        },
        diagnostics: {
          title: "When to Seek Medical Help",
          content: `
            ★Emergency Warning Signs - Call 911 Immediately:
            
            ★Heart Problems:
            🚨 Severe chest pain that feels like crushing or pressure
            🚨 Chest pain with sweating, nausea, or shortness of breath
            🚨 Pain spreading to arm, jaw, or back
            🚨 Heart rate over 150 or under 40 beats per minute
            
            ★Breathing Problems:
            🚨 Can't speak in full sentences due to breathlessness
            🚨 Blue lips or fingernails
            🚨 Gasping for air
            🚨 Wheezing that doesn't improve with rescue inhaler
            
            ★Blood Pressure Crisis:
            🚨 Blood pressure over 180/110 with symptoms
            🚨 Severe headache with vision changes
            🚨 Confusion or difficulty speaking
            
            ★When to See Your Doctor Soon (within 24-48 hours):
            
            ⚠️ Blood pressure consistently over 140/90
            ⚠️ New or worsening shortness of breath
            ⚠️ Chest discomfort that comes and goes
            ⚠️ Dizziness with standing up
            ⚠️ Persistent cough lasting more than 2 weeks
            ⚠️ Swelling in legs, ankles, or feet
            ⚠️ Unusual fatigue or weakness
            
            ★Track Your Symptoms:
            - Keep a daily log of blood pressure readings
            - Note when symptoms occur and what triggers them
            - Record medications taken and their effects
            - Monitor how symptoms affect your daily activities
          `,
          level: "Beginner",
          duration: "10-15 min"
        }
      },
      developer: {
        pathophysiology: {
          title: "IoT Sensor Technology and Integration",
          content: `
            ★MAX30100/MAX30102 Pulse Oximetry Sensor:
            
            ★Technical Specifications:
            - Supply Voltage: 1.8V to 3.3V
            - Communication: I2C interface
            - Sampling Rate: 50Hz to 3.2kHz
            - Resolution: 16-bit ADC
            - LED Wavelengths: 660nm (Red), 880nm/940nm (IR)
            
            ★Working Principle:
            \`\`\`
            Photoplethysmography (PPG) Technology:
            1. LED emits light through finger tissue
            2. Photodiode measures transmitted light
            3. Blood volume changes modulate light absorption
            4. Algorithm extracts heart rate and SpO2
            \`\`\`
            
            ★Arduino Integration Code:
            \`\`\`cpp
            #include <MAX30100.h>
            #include <WiFi.h>
            #include <HTTPClient.h>
            
            MAX30100 sensor;
            
            void setup() {
              Serial.begin(115200);
              sensor.begin();
              sensor.setMode(MAX30100_MODE_SPO2_HR);
              sensor.setLedsCurrent(IR_LED_CURRENT, RED_LED_CURRENT);
              
              WiFi.begin("SSID", "PASSWORD");
              while (WiFi.status() != WL_CONNECTED) {
                delay(1000);
                Serial.println("Connecting to WiFi...");
              }
            }
            
            void loop() {
              sensor.update();
              
              if (sensor.isFingerDetected()) {
                float heartRate = sensor.getHeartRate();
                float spO2 = sensor.getSpO2();
                
                sendToCloud(heartRate, spO2);
                delay(1000);
              }
            }
            
            void sendToCloud(float hr, float spo2) {
              HTTPClient http;
              http.begin("https://your-api-endpoint.com/vitals");
              http.addHeader("Content-Type", "application/json");
              
              String payload = "{\"heartRate\":" + String(hr) + 
                              ",\"spO2\":" + String(spo2) +
                              ",\"timestamp\":\"" + getTimestamp() + "\"}";
              
              int httpResponseCode = http.POST(payload);
              http.end();
            }
            \`\`\`
            
            ★DS18B20 Temperature Sensor:
            
            ★OneWire Protocol Implementation:
            \`\`\`cpp
            #include <OneWire.h>
            #include <DallasTemperature.h>
            
            #define ONE_WIRE_BUS 2
            OneWire oneWire(ONE_WIRE_BUS);
            DallasTemperature tempSensor(&oneWire);
            
            float readTemperature() {
              tempSensor.requestTemperatures();
              return tempSensor.getTempCByIndex(0);
            }
            \`\`\`
            
            ★ECG Signal Processing:
            
            ★AD8232 ECG Module Integration:
            \`\`\`cpp
            #define ECG_PIN A0
            #define LO_PLUS 10
            #define LO_MINUS 11
            
            void readECG() {
              if (digitalRead(LO_PLUS) == 1 || digitalRead(LO_MINUS) == 1) {
                Serial.println("Leads off!");
              } else {
                int ecgValue = analogRead(ECG_PIN);
                Serial.println(ecgValue);
                
                // Simple R-peak detection algorithm
                if (ecgValue > threshold && (millis() - lastBeat) > 300) {
                  calculateHeartRate();
                  lastBeat = millis();
                }
              }
            }
            \`\`\`
          `,
          level: "Advanced",
          duration: "30-45 min"
        },
        diagnostics: {
          title: "Signal Processing and Data Analytics",
          content: `
            ★Digital Signal Processing for Biomedical Signals:
            
            ★Heart Rate Variability (HRV) Analysis:
            \`\`\`python
            import numpy as np
            from scipy import signal
            import pandas as pd
            
            def calculate_hrv_metrics(rr_intervals):
                """Calculate HRV time and frequency domain metrics"""
                
                # Time domain metrics
                rmssd = np.sqrt(np.mean(np.diff(rr_intervals)**2))
                sdnn = np.std(rr_intervals)
                pnn50 = np.sum(np.abs(np.diff(rr_intervals)) > 50) / len(rr_intervals) * 100
                
                # Frequency domain analysis
                fs = 4  # Resampling frequency
                rr_interpolated = signal.resample(rr_intervals, len(rr_intervals) * fs)
                
                # Power spectral density
                freqs, psd = signal.welch(rr_interpolated, fs=fs, nperseg=256)
                
                # Frequency bands
                vlf_band = (0.003, 0.04)  # Very low frequency
                lf_band = (0.04, 0.15)    # Low frequency
                hf_band = (0.15, 0.4)     # High frequency
                
                vlf_power = np.trapz(psd[(freqs >= vlf_band[0]) & (freqs < vlf_band[1])])
                lf_power = np.trapz(psd[(freqs >= lf_band[0]) & (freqs < lf_band[1])])
                hf_power = np.trapz(psd[(freqs >= hf_band[0]) & (freqs < hf_band[1])])
                
                lf_hf_ratio = lf_power / hf_power if hf_power > 0 else 0
                
                return {
                    'RMSSD': rmssd,
                    'SDNN': sdnn,
                    'pNN50': pnn50,
                    'LF_Power': lf_power,
                    'HF_Power': hf_power,
                    'LF_HF_Ratio': lf_hf_ratio
                }
            \`\`\`
            
            ★Anomaly Detection Algorithm:
            \`\`\`python
            from sklearn.ensemble import IsolationForest
            import numpy as np
            
            class VitalSignsAnomalyDetector:
                def __init__(self, contamination=0.1):
                    self.model = IsolationForest(contamination=contamination, random_state=42)
                    self.fitted = False
                    
                def train(self, vital_data):
                    """Train anomaly detection model on historical data"""
                    features = self.extract_features(vital_data)
                    self.model.fit(features)
                    self.fitted = True
                    
                def detect_anomalies(self, current_vitals):
                    """Detect anomalies in current vital signs"""
                    if not self.fitted:
                        raise ValueError("Model must be trained first")
                        
                    features = self.extract_features([current_vitals])
                    anomaly_score = self.model.decision_function(features)[0]
                    is_anomaly = self.model.predict(features)[0] == -1
                    
                    return {
                        'is_anomaly': is_anomaly,
                        'anomaly_score': anomaly_score,
                        'risk_level': self.classify_risk(anomaly_score)
                    }
                    
                def extract_features(self, vital_data):
                    """Extract features from vital signs data"""
                    features = []
                    for vitals in vital_data:
                        feature_vector = [
                            vitals['heart_rate'],
                            vitals['spo2'],
                            vitals['systolic_bp'],
                            vitals['diastolic_bp'],
                            vitals['temperature'],
                            vitals['heart_rate'] / vitals['systolic_bp'],  # HR/SBP ratio
                            vitals['systolic_bp'] - vitals['diastolic_bp']  # Pulse pressure
                        ]
                        features.append(feature_vector)
                    return np.array(features)
                    
                def classify_risk(self, score):
                    """Classify risk level based on anomaly score"""
                    if score < -0.5:
                        return "Critical"
                    elif score < -0.2:
                        return "High"
                    elif score < 0:
                        return "Medium"
                    else:
                        return "Low"
            \`\`\`
            
            ★Real-time Data Pipeline:
            \`\`\`python
            import asyncio
            import websockets
            import json
            from datetime import datetime
            
            class RealTimeVitalProcessor:
                def __init__(self):
                    self.buffer = []
                    self.buffer_size = 100
                    self.anomaly_detector = VitalSignsAnomalyDetector()
                    
                async def process_vital_stream(self, websocket, path):
                    """Process real-time vital signs data"""
                    async for message in websocket:
                        try:
                            vital_data = json.loads(message)
                            vital_data['timestamp'] = datetime.now().isoformat()
                            
                            # Add to buffer
                            self.buffer.append(vital_data)
                            if len(self.buffer) > self.buffer_size:
                                self.buffer.pop(0)
                            
                            # Process data
                            processed_data = self.analyze_vitals(vital_data)
                            
                            # Send response
                            await websocket.send(json.dumps(processed_data))
                            
                        except Exception as e:
                            error_response = {
                                'error': str(e),
                                'timestamp': datetime.now().isoformat()
                            }
                            await websocket.send(json.dumps(error_response))
                            
                def analyze_vitals(self, vital_data):
                    """Analyze individual vital signs reading"""
                    analysis = {
                        'original_data': vital_data,
                        'quality_metrics': self.assess_signal_quality(vital_data),
                        'clinical_interpretation': self.interpret_clinically(vital_data),
                        'trends': self.analyze_trends(),
                        'alerts': self.generate_alerts(vital_data)
                    }
                    
                    # Run anomaly detection if model is trained
                    if self.anomaly_detector.fitted and len(self.buffer) >= 10:
                        anomaly_result = self.anomaly_detector.detect_anomalies(vital_data)
                        analysis['anomaly_detection'] = anomaly_result
                    
                    return analysis
            \`\`\`
          `,
          level: "Expert",
          duration: "45-60 min"
        }
      },
      researcher: {
        pathophysiology: {
          title: "Research Methodologies and Data Analytics",
          content: `
            ★Clinical Research Design for IoT Health Studies:
            
            ★Study Design Considerations:
            
            ★1. Observational Studies:
            - ★Cohort Studies: Track patient outcomes over time using continuous IoT monitoring
            - ★Case-Control Studies: Compare IoT data between patients with/without specific conditions
            - ★Cross-sectional Studies: Analyze population health metrics at specific time points
            
            ★2. Interventional Studies:
            - ★Randomized Controlled Trials (RCTs): Compare IoT-guided care vs. standard care
            - ★Crossover Studies: Patients serve as their own controls with different monitoring protocols
            - ★Cluster Randomized Trials: Randomize healthcare facilities to different IoT interventions
            
            ★Statistical Power Analysis:
            \`\`\`r
            # Sample size calculation for comparing mean heart rates
            library(pwr)
            
            # Detect 5 bpm difference with 80% power and α=0.05
            effect_size <- 5 / 12  # Assuming SD of 12 bpm
            sample_size <- pwr.t.test(d = effect_size, 
                                     sig.level = 0.05, 
                                     power = 0.80, 
                                     type = "two.sample")
            print(paste("Required sample size per group:", ceiling(sample_size$n)))
            \`\`\`
            
            ★Data Quality Assessment:
            
            ★Signal Quality Metrics:
            - ★Signal-to-Noise Ratio (SNR): Measure of signal clarity
            - ★Motion Artifact Detection: Accelerometer-based filtering
            - ★Contact Quality: Impedance measurements for ECG/PPG
            - ★Sampling Rate Adequacy: Nyquist frequency considerations
            
            ★Missing Data Patterns:
            \`\`\`python
            import pandas as pd
            import numpy as np
            from scipy import stats
            
            def assess_missing_data(df):
                """Comprehensive missing data analysis"""
                missing_summary = {
                    'total_missing': df.isnull().sum(),
                    'missing_percentage': (df.isnull().sum() / len(df)) * 100,
                    'missing_patterns': df.isnull().value_counts(),
                    'consecutive_missing': {}
                }
                
                # Analyze consecutive missing values
                for column in df.columns:
                    consecutive = []
                    current_streak = 0
                    for value in df[column].isnull():
                        if value:
                            current_streak += 1
                        else:
                            if current_streak > 0:
                                consecutive.append(current_streak)
                            current_streak = 0
                    
                    missing_summary['consecutive_missing'][column] = {
                        'max_consecutive': max(consecutive) if consecutive else 0,
                        'mean_consecutive': np.mean(consecutive) if consecutive else 0,
                        'missing_episodes': len(consecutive)
                    }
                
                return missing_summary
            \`\`\`
            
            ★Longitudinal Data Analysis:
            
            ★Mixed Effects Models for Repeated Measures:
            \`\`\`r
            library(lme4)
            library(nlme)
            
            # Mixed effects model for blood pressure over time
            model <- lmer(systolic_bp ~ time + age + gender + (1|patient_id), 
                         data = longitudinal_data)
            
            # Extract random effects (patient-specific intercepts)
            random_effects <- ranef(model)
            
            # Population-level predictions
            fixed_effects <- fixef(model)
            \`\`\`
            
            ★Time Series Analysis:
            \`\`\`python
            from statsmodels.tsa.seasonal import seasonal_decompose
            from statsmodels.tsa.arima.model import ARIMA
            import matplotlib.pyplot as plt
            
            def analyze_vital_trends(time_series_data):
                """Comprehensive time series analysis"""
                
                # Seasonal decomposition
                decomposition = seasonal_decompose(time_series_data, 
                                                 model='additive', 
                                                 period=1440)  # Daily cycle
                
                # Trend analysis
                trend_slope = np.polyfit(range(len(decomposition.trend.dropna())), 
                                       decomposition.trend.dropna(), 1)[0]
                
                # ARIMA modeling for forecasting
                model = ARIMA(time_series_data, order=(1,1,1))
                fitted_model = model.fit()
                forecast = fitted_model.forecast(steps=24)  # 24-hour forecast
                
                return {
                    'trend_slope': trend_slope,
                    'seasonal_component': decomposition.seasonal,
                    'forecast': forecast,
                    'model_aic': fitted_model.aic
                }
            \`\`\`
          `,
          level: "Expert",
          duration: "60+ min"
        },
        diagnostics: {
          title: "Advanced Analytics and Machine Learning",
          content: `
            ★Machine Learning Models for Health Prediction:
            
            ★1. Ensemble Methods for Disease Classification:
            \`\`\`python
            from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
            from sklearn.model_selection import cross_val_score, GridSearchCV
            from sklearn.metrics import classification_report, roc_auc_score
            import numpy as np
            
            class HealthPredictionEnsemble:
                def __init__(self):
                    self.models = {
                        'random_forest': RandomForestClassifier(n_estimators=100, random_state=42),
                        'gradient_boosting': GradientBoostingClassifier(n_estimators=100, random_state=42)
                    }
                    self.fitted_models = {}
                    
                def feature_engineering(self, vital_data):
                    """Create engineered features from raw vital signs"""
                    features = vital_data.copy()
                    
                    # Derived features
                    features['pulse_pressure'] = features['systolic_bp'] - features['diastolic_bp']
                    features['mean_arterial_pressure'] = (features['systolic_bp'] + 2*features['diastolic_bp']) / 3
                    features['hr_bp_ratio'] = features['heart_rate'] / features['systolic_bp']
                    features['shock_index'] = features['heart_rate'] / features['systolic_bp']
                    
                    # Time-based features (if timestamps available)
                    if 'timestamp' in features.columns:
                        features['hour'] = pd.to_datetime(features['timestamp']).dt.hour
                        features['day_of_week'] = pd.to_datetime(features['timestamp']).dt.dayofweek
                        
                        # Rolling statistics (requires temporal ordering)
                        features['hr_rolling_mean'] = features['heart_rate'].rolling(window=5).mean()
                        features['hr_rolling_std'] = features['heart_rate'].rolling(window=5).std()
                        features['bp_rolling_trend'] = features['systolic_bp'].rolling(window=5).apply(
                            lambda x: np.polyfit(range(len(x)), x, 1)[0] if len(x) == 5 else 0
                        )
                    
                    return features
                    
                def train_ensemble(self, X, y):
                    """Train ensemble of models"""
                    X_engineered = self.feature_engineering(X)
                    
                    for name, model in self.models.items():
                        # Hyperparameter tuning
                        if name == 'random_forest':
                            param_grid = {
                                'n_estimators': [50, 100, 200],
                                'max_depth': [10, 20, None],
                                'min_samples_split': [2, 5, 10]
                            }
                        else:  # gradient_boosting
                            param_grid = {
                                'n_estimators': [50, 100, 200],
                                'learning_rate': [0.01, 0.1, 0.2],
                                'max_depth': [3, 5, 7]
                            }
                        
                        grid_search = GridSearchCV(model, param_grid, cv=5, scoring='roc_auc')
                        grid_search.fit(X_engineered, y)
                        
                        self.fitted_models[name] = grid_search.best_estimator_
                        
                        # Feature importance analysis
                        feature_importance = pd.DataFrame({
                            'feature': X_engineered.columns,
                            'importance': grid_search.best_estimator_.feature_importances_
                        }).sort_values('importance', ascending=False)
                        
                        print(f"{name} - Top 5 Important Features:")
                        print(feature_importance.head())
                        
                def predict_ensemble(self, X):
                    """Make ensemble predictions"""
                    X_engineered = self.feature_engineering(X)
                    predictions = {}
                    
                    for name, model in self.fitted_models.items():
                        predictions[name] = model.predict_proba(X_engineered)[:, 1]
                    
                    # Ensemble average
                    ensemble_pred = np.mean(list(predictions.values()), axis=0)
                    
                    return {
                        'individual_predictions': predictions,
                        'ensemble_prediction': ensemble_pred,
                        'binary_prediction': (ensemble_pred > 0.5).astype(int)
                    }
            \`\`\`
            
            ★2. Deep Learning for Physiological Signal Analysis:
            \`\`\`python
            import tensorflow as tf
            from tensorflow.keras.models import Sequential, Model
            from tensorflow.keras.layers import LSTM, Dense, Dropout, Conv1D, MaxPooling1D, Flatten
            from tensorflow.keras.optimizers import Adam
            
            class PhysiologicalSignalCNN:
                def __init__(self, signal_length=1000, n_features=3):
                    self.signal_length = signal_length
                    self.n_features = n_features
                    self.model = self._build_model()
                    
                def _build_model(self):
                    """Build CNN model for physiological signal classification"""
                    model = Sequential([
                        # First convolutional block
                        Conv1D(filters=32, kernel_size=5, activation='relu', 
                               input_shape=(self.signal_length, self.n_features)),
                        MaxPooling1D(pool_size=2),
                        Dropout(0.2),
                        
                        # Second convolutional block
                        Conv1D(filters=64, kernel_size=3, activation='relu'),
                        MaxPooling1D(pool_size=2),
                        Dropout(0.2),
                        
                        # Third convolutional block
                        Conv1D(filters=128, kernel_size=3, activation='relu'),
                        MaxPooling1D(pool_size=2),
                        Dropout(0.3),
                        
                        # Flatten and dense layers
                        Flatten(),
                        Dense(512, activation='relu'),
                        Dropout(0.5),
                        Dense(256, activation='relu'),
                        Dropout(0.3),
                        Dense(1, activation='sigmoid')  # Binary classification
                    ])
                    
                    model.compile(optimizer=Adam(learning_rate=0.001),
                                loss='binary_crossentropy',
                                metrics=['accuracy', 'precision', 'recall'])
                    
                    return model
                    
                def preprocess_signals(self, signals):
                    """Preprocess physiological signals"""
                    # Normalize signals
                    normalized_signals = (signals - np.mean(signals, axis=1, keepdims=True)) / \
                                       np.std(signals, axis=1, keepdims=True)
                    
                    # Apply butterworth filter to remove noise
                    from scipy.signal import butter, filtfilt
                    nyquist = 0.5 * 250  # Assuming 250 Hz sampling rate
                    low_cutoff = 0.5 / nyquist
                    high_cutoff = 40 / nyquist
                    b, a = butter(4, [low_cutoff, high_cutoff], btype='band')
                    
                    filtered_signals = np.array([
                        filtfilt(b, a, signal) for signal in normalized_signals
                    ])
                    
                    return filtered_signals
                    
                def train_model(self, X_train, y_train, X_val, y_val, epochs=100):
                    """Train the CNN model"""
                    X_train_processed = self.preprocess_signals(X_train)
                    X_val_processed = self.preprocess_signals(X_val)
                    
                    # Callbacks
                    early_stopping = tf.keras.callbacks.EarlyStopping(
                        monitor='val_loss', patience=10, restore_best_weights=True
                    )
                    
                    reduce_lr = tf.keras.callbacks.ReduceLROnPlateau(
                        monitor='val_loss', factor=0.2, patience=5
                    )
                    
                    history = self.model.fit(
                        X_train_processed, y_train,
                        validation_data=(X_val_processed, y_val),
                        epochs=epochs,
                        batch_size=32,
                        callbacks=[early_stopping, reduce_lr],
                        verbose=1
                    )
                    
                    return history
            \`\`\`
            
            ★3. Survival Analysis for Risk Prediction:
            \`\`\`python
            from lifelines import CoxPHFitter, KaplanMeierFitter
            from lifelines.statistics import logrank_test
            import pandas as pd
            
            def survival_analysis(patient_data, duration_col, event_col):
                """Perform survival analysis on patient data"""
                
                # Kaplan-Meier survival estimation
                kmf = KaplanMeierFitter()
                kmf.fit(patient_data[duration_col], patient_data[event_col])
                
                # Cox Proportional Hazards model
                cph = CoxPHFitter()
                cph.fit(patient_data, duration_col=duration_col, event_col=event_col)
                
                # Risk scoring
                risk_scores = cph.predict_partial_hazard(patient_data)
                
                results = {
                    'survival_function': kmf.survival_function_,
                    'median_survival': kmf.median_survival_time_,
                    'cox_summary': cph.summary,
                    'risk_scores': risk_scores,
                    'concordance_index': cph.concordance_index_
                }
                
                return results
            \`\`\`
          `,
          level: "Expert",
          duration: "90+ min"
        }
      }
    }
    
    return content[audience as keyof typeof content]?.[contentType as keyof any] || { title: "Content Not Available", content: "Content not available for this audience.", level: "N/A", duration: "N/A" }
  }

  return (
    <div className="space-y-6">
      {/* Audience Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Mode Selection
          </CardTitle>
          <CardDescription>
            Choose your background to see content tailored for your expertise level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {audienceModes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedAudience === mode.id ? "default" : "outline"}
                className={`h-auto p-4 flex flex-col items-center text-center space-y-2 ${
                  selectedAudience === mode.id ? mode.color + " text-white" : ""
                }`}
                onClick={() => setSelectedAudience(mode.id)}
              >
                {mode.icon}
                <div>
                  <div className="font-semibold">{mode.name}</div>
                  <div className="text-xs opacity-80">{mode.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Theory Content Tabs */}
      <Tabs defaultValue="pathophysiology" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pathophysiology" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Pathophysiology</span>
            <span className="sm:hidden">Patho</span>
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Diagnostics</span>
            <span className="sm:hidden">Diag</span>
          </TabsTrigger>
          <TabsTrigger value="sensors" className="flex items-center gap-2">
            <CircuitBoard className="h-4 w-4" />
            <span className="hidden sm:inline">Sensors</span>
            <span className="sm:hidden">Tech</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pathophysiology" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="h-5 w-5" />
                  {getAudienceContent(selectedAudience, "pathophysiology").title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getAudienceContent(selectedAudience, "pathophysiology").level}
                  </Badge>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {getAudienceContent(selectedAudience, "pathophysiology").duration}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Comprehensive understanding of disease mechanisms and physiological processes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {getAudienceContent(selectedAudience, "pathophysiology").content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {getAudienceContent(selectedAudience, "diagnostics").title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {getAudienceContent(selectedAudience, "diagnostics").level}
                  </Badge>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {getAudienceContent(selectedAudience, "diagnostics").duration}
                  </Badge>
                </div>
              </div>
              <CardDescription>
                Evidence-based diagnostic approaches and clinical decision-making tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {getAudienceContent(selectedAudience, "diagnostics").content}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors" className="space-y-6">
          <SensorTechnologySection audienceMode={selectedAudience} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <DataAnalyticsSection audienceMode={selectedAudience} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Sensor Technology Component
function SensorTechnologySection({ audienceMode }: { audienceMode: string }) {
  const sensorSpecs = {
    MAX30100: {
      name: "MAX30100 Pulse Oximetry Sensor",
      applications: ["Heart Rate Monitoring", "SpO2 Measurement", "Pulse Oximetry"],
      specifications: {
        voltage: "1.8V - 3.3V",
        interface: "I2C",
        sampling: "50Hz - 3.2kHz",
        resolution: "16-bit ADC",
        wavelengths: "660nm (Red), 880nm (IR)"
      },
      pros: ["Integrated solution", "Low power consumption", "Small form factor"],
      cons: ["Sensitive to motion", "Requires calibration", "Limited by ambient light"],
      costRange: "$5-15",
      link:"https://www.amazon.in/MAX30100-Pulse-Oximeter-Sensor-Module/dp/B09RFV7PL5"
    },
    DS18B20: {
      name: "DS18B20 Temperature Sensor",
      applications: ["Body Temperature", "Environmental Monitoring", "Fever Detection"],
      specifications: {
        voltage: "3.0V - 5.5V",
        interface: "1-Wire",
        accuracy: "±0.5°C",
        resolution: "9-12 bit",
        range: "-55°C to +125°C"
        },
      pros: ["High accuracy", "Digital output", "Multiple sensors on one wire"],
      cons: ["Slower response time", "Requires pullup resistor", "Waterproofing needed"],
      costRange: "$2-8",
link:"https://www.amazon.in/KitsGuru-DS18B20-Temperature-Sensor-KG018/dp/B00XU2L1SK/ref=sr_1_6?dib=eyJ2IjoiMSJ9.U-Ife1MIH4wgu_ifF5O1l6dZlniHrYs2vIVg27LAY0DPLcxP3qGGDJZUOgQZTNlQTJ4HaTn69IvZ7HGaroIO4-yxj5lGNY9IyV8Lj4rIxiy9LZxaqDGn07lc-Ki_N9F1p9-mQZQ9_HZBUKg6jqaYzsvnRErLXADEiOl9RuncfpOFBZuOW0XCnxkBnT_e3F9QCSzNHvixrUSFJl8p0jqv-qpwr_rVCj8Ihww-Ssixxt7F1YufNiYc8s6KHEClEErl202z6lSzPzApj2K52IBnkgJczhGaoyWVZW6q08MAVOY.MVoeJiputHHYOUPYi6SYP5A48kk7SMhd8GB32mpfzlk&dib_tag=se&keywords=ds18b20&qid=1752516215&sr=8-6"
      
    },
    AD8232: {
      name: "AD8232 ECG Sensor",
      applications: ["Heart Rhythm Monitoring", "Arrhythmia Detection", "ECG Signal Processing"],
      specifications: {
        voltage: "2.0V - 3.5V",
        gainRange: "100 V/V",
        bandwidth: "0.5Hz - 40Hz",
        cmrr: "80dB typical",
        inputImpedance: "10^12 Ω"
        },
      pros: ["Low noise", "Integrated filtering", "Easy to use"],
      cons: ["Requires proper electrode placement", "Sensitive to interference", "Single-lead only"],
      costRange: "$15-30",
      link:"https://robu.in/product/ecg-module-ad8232-ecg-measurement-pulse-heart-ecg-monitoring-sensor-module-kit/?gad_source=1&gad_campaignid=20363337560&gbraid=0AAAAADvLFWemfP4M9NUOkY_wPsnqvzcTF&gclid=CjwKCAjw1dLDBhBoEiwAQNRiQQfU9fBLOyCjO3CaqSthaUfse75QHW5hxTxvFiA2Rtp38dtEGmYumxoC4u8QAvD_BwE"
      
          }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(sensorSpecs).map(([key, sensor]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <CircuitBoard className="h-4 w-4" />
                {sensor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Applications</h4>
                <div className="flex flex-wrap gap-1">
                  {sensor.applications.map((app, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-2">Key Specifications</h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(sensor.specifications).map(([spec, value]) => (
                    <div key={spec} className="flex justify-between">
                      <span className="text-gray-600">{spec}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <div>
                  <h5 className="font-medium text-xs text-green-600 mb-1">Advantages</h5>
                  <ul className="text-xs space-y-1">
                    {sensor.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-xs text-orange-600 mb-1">Limitations</h5>
                  <ul className="text-xs space-y-1">
                    {sensor.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Cost Range:</span>
                  <a href={sensor.link} target="_blank" rel="noopener noreferrer">
  Buy Now
</a>

                  <Badge variant="outline">{sensor.costRange}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sensor Integration Diagrams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Sensor Integration Architecture
          </CardTitle>
          <CardDescription>
            Complete IoT system architecture for medical monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-6 rounded-lg">
              <svg width="600" height="500" style={{ fontFamily: 'Arial', fontSize: '14px' }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="6" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#333" />
        </marker>
      </defs>

      <text x="200" y="40">📱 Patient Wearable Device</text>
      <line x1="220" y1="50" x2="220" y2="100" stroke="#333" markerEnd="url(#arrow)" />
      <text x="230" y="80" fill="gray">Bluetooth / WiFi</text>

      <text x="200" y="120">🔧 ESP32 Microcontroller</text>
      <line x1="220" y1="130" x2="220" y2="180" stroke="#333" markerEnd="url(#arrow)" />
      <text x="230" y="160" fill="gray">HTTPS / MQTT</text>

      <text x="200" y="200">☁️ Cloud IoT Platform</text>
      <line x1="220" y1="210" x2="220" y2="260" stroke="#333" markerEnd="url(#arrow)" />
      <text x="230" y="240" fill="gray">REST API</text>

      <text x="200" y="280">🖥️ Medical Dashboard</text>
      <line x1="220" y1="290" x2="220" y2="340" stroke="#333" markerEnd="url(#arrow)" />
      <text x="230" y="320" fill="gray">Real-time Updates</text>

      <text x="200" y="360">👨‍⚕️ Healthcare Provider Interface</text>
    </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Data Analytics Component  
function DataAnalyticsSection({ audienceMode }: { audienceMode: string }) {
  const analyticsTopics = [
    {
      title: "Signal Processing Fundamentals",
      icon: <Activity className="h-4 w-4" />,
      content: "Digital filtering, noise reduction, and feature extraction from physiological signals",
      level: "Intermediate"
    },
    {
      title: "Machine Learning Applications",
      icon: <Brain className="h-4 w-4" />,
      content: "Classification algorithms, anomaly detection, and predictive modeling for health outcomes",
      level: "Advanced"
    },
    {
      title: "Statistical Analysis Methods",
      icon: <TrendingUp className="h-4 w-4" />,
      content: "Time series analysis, survival analysis, and longitudinal data modeling",
      level: "Advanced"
    },
    {
      title: "Data Visualization Techniques",
      icon: <BarChart3 className="h-4 w-4" />,
      content: "Interactive dashboards, trend visualization, and clinical decision support interfaces",
      level: "Intermediate"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analyticsTopics.map((topic, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                {topic.icon}
                {topic.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {topic.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{topic.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Analytics Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Interactive Data Analytics Demo
          </CardTitle>
          <CardDescription>
            Explore real-time data processing and analysis capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This section demonstrates advanced analytics capabilities available in the MedIoT platform. 
              Choose your audience mode above to see content tailored to your expertise level.
              <iframe 
                title="ANALYSIS" 
                width="100%" 
                height="300"
                className="sm:h-[541.25px]"
                src="https://app.powerbi.com/reportEmbed?reportId=67850939-2401-4344-bdb0-e24e0c8015b6&autoAuth=true&embeddedDemo=true" 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}