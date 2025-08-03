# MedIoT - Medical IoT System

MedIoT is an integrated Medical IoT system designed to monitor and analyze real-time health data using wearable sensors and smart devices. The system enables continuous tracking of vital parameters such as heart rate, SpO₂, and body temperature to assist in early disease detection and patient monitoring.

## 🚀 Features

- 🩺 Real-time health monitoring
- 📡 Wireless data transmission via ESP32
- 📊 Integration with Power BI dashboards for visualization
- 🤖 Optional AI/ML analysis support (can be extended)
- 📁 Clean and modular code structure for easy expansion

## 🧰 Tech Stack

- **ESP32** for sensor data acquisition
- **Sensors**: Heart rate, SpO₂, Temperature
- **Power BI** for data visualization
- **React / Next.js** frontend (optional)
- **Firebase / MongoDB** (for data storage – optional)

## 📦 Installation

```bash
git clone https://github.com/sheikhwasimuddin/MedIoT.git
cd MedIoT
# For frontend (if included):
npm install
npm run dev
```
📡 Hardware Requirements
Component	Description
ESP32 Dev Board	Microcontroller with WiFi & Bluetooth support
SpO₂ Sensor	Measures oxygen saturation and heart rate
Temp Sensor	Measures body temperature
Power Supply	3.7V Li-ion battery

📊 Power BI Dashboard
The system integrates with Power BI for intuitive data visualization.

Health trends and anomalies can be tracked in real-time.

```📁 Folder Structure
bash
Copy
Edit
MedIoT/
├── firmware/         # ESP32 Arduino or MicroPython code
├── frontend/         # Web dashboard (React/Next.js)
├── powerbi/          # Power BI .pbix file
├── docs/             # Architecture and documentation
📄 License
```


🙌 Acknowledgements
MANIT Bhopal Internship Program

Inspiration from wearable healthcare systems

Open-source sensor libraries
