// charts.tsx
"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

interface Props {
  batchResults: any[]
  getBatchSummary: () => any
}

const riskColors = {
  Low: "#22c55e",
  Medium: "#eab308",
  High: "#f97316",
  Critical: "#ef4444"
}

export default function BatchCharts({ batchResults, getBatchSummary }: Props) {
  const getRiskCounts = () => {
    const counts = {
      Low: 0,
      Medium: 0,
      High: 0,
      Critical: 0
    }

    batchResults.forEach((r) => {
      if (r.riskLevel in counts) counts[r.riskLevel]++
    })

    return counts
  }

  const getRiskChartData = () => {
    const counts = getRiskCounts()
    return [
      { name: "Low", value: counts.Low },
      { name: "Medium", value: counts.Medium },
      { name: "High", value: counts.High },
      { name: "Critical", value: counts.Critical }
    ]
  }
const riskColors = {
  Low: "#22c55e",      // green-500
  Medium: "#facc15",   // yellow-400
  High: "#f97316",     // orange-500
  Critical: "#ef4444"  // red-500
}

  const getTopDiseasesChartData = () => {
    const summary = getBatchSummary()
    const sorted = Object.entries(summary.topDiseases)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return sorted.map(([disease, count]) => ({ name: disease, value: count }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {/* 📊 Bar Chart */}
      <div className="bg-white p-4 rounded-2xl border shadow-md">
  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
    📊 Risk Level Distribution
  </h4>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={getRiskChartData()} barSize={45}>
      <XAxis
        dataKey="name"
        axisLine={false}
        tickLine={false}
        style={{ fontSize: "14px" }}
      />
      <YAxis hide />
      <Tooltip
        contentStyle={{ borderRadius: "12px", fontSize: "14px" }}
        cursor={{ fill: "rgba(0,0,0,0.05)" }}
      />
      <Bar radius={[8, 8, 0, 0]} dataKey="value">
        {getRiskChartData().map((entry, index) => (
          <Cell key={index} fill={riskColors[entry.name]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


      <div className="bg-white p-4 rounded-2xl border shadow-md">
  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
    🧁 Top 5 Predicted Diseases
  </h4>
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={getTopDiseasesChartData()}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label={({ name, percent }) =>
          `${name} (${(percent * 100).toFixed(0)}%)`
        }
      >
        {getTopDiseasesChartData().map((_, index) => (
          <Cell key={index} fill={`hsl(${index * 50}, 70%, 60%)`} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{ borderRadius: "12px", fontSize: "14px" }}
        cursor={{ fill: "rgba(0,0,0,0.05)" }}
      />
      <Legend verticalAlign="bottom" iconType="circle" />
    </PieChart>
  </ResponsiveContainer>
</div>
</div>
  )
}
