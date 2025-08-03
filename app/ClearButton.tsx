// components/ClearButton.tsx
"use client"

import React from "react"

interface ClearButtonProps {
  onClick: () => void
  label?: string
  show?: boolean
  className?: string
}

const ClearButton: React.FC<ClearButtonProps> = ({
  onClick,
  label = "Clear",
  show = true,
  className = ""
}) => {
  if (!show) return null

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`inline-flex items-center gap-2 text-xs text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 px-3 py-1.5 rounded-md font-medium shadow-sm transition-all ${className}`}
    >
      <span className="text-sm">🧹</span>
      {label}
    </button>
  )
}

export default ClearButton
