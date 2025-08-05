# 🩺 MedIoT – Smart Healthcare Monitoring System

![MedIoT Banner](https://medicaliot.netlify.app/logo.png)

**MedIoT** is an intelligent Internet of Things (IoT)-based medical application designed to monitor patient health, assess emergencies, and assist both users and healthcare providers. It leverages real-time data, Firebase backend, and modern web technologies to deliver a seamless and secure medical monitoring experience.

🌐 Live Demo: [https://medicaliot.netlify.app](https://medicaliot.netlify.app)

---

## 🚀 Features

- 👤 **User Authentication** (Register/Login/Logout via Firebase)
- 📝 **Profile Management** – Stores name, age, contact, height, weight, etc.
- 📊 **Vital Tracking** – Collect and visualize real-time vitals like SpO2, pulse, etc.
- 🧠 **AI Medical Assistant** – Offline chatbot powered by medical knowledge
- 🧪 **Patient Assessment Tool** – Quick insights and analysis
- 🚨 **Emergency Alerts** – Emergency button to notify critical health situations
- 🎮 **Educational Game** – Fun, quiz-based game to test medical awareness
- 🌙 **Dark Mode** – User toggle between light and dark themes

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Hosting | Other |
|----------|---------|----------|---------|-------|
| React + Next.js | Firebase Functions | Firebase Firestore | Netlify | TailwindCSS, TypeScript, Lucide Icons |

---

## 📁 Project Structure

```
medicaliot/
├── components/           # Reusable components (Navbar, Forms, Cards)
├── pages/                # App routes (Home, Login, Profile, Game, View)
├── lib/                  # Firebase config
├── public/               # Static assets
├── styles/               # Global styles
├── .env                  # Firebase API keys
└── README.md             # This file
```
🧠 AI Chatbot Knowledge Base
The chatbot includes:

Vital signs and sensor info (SpO2, BPM, etc.)

Diseases like stroke, thyroid, COVID-19

Emergency procedures and elder care tips

IoT-based health solutions

🔍 Future Improvements
Admin dashboard to manage users

Integration with real hardware devices (e.g., ESP32 + MAX30100)

Real-time alerts via SMS/email

Cloud data analytics

📦 Deployment
Hosted on Netlify:
```
bash
Copy
Edit
# Build for production
npm run build

# Start local server
npm run dev
```
🧑‍💻 Author
Sheikh Wasimuddin
