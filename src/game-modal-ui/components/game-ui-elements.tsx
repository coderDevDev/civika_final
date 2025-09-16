"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface GameButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "red" | "orange" | "yellow" | "green" | "blue"
  className?: string
}

export function GameButton({ children, onClick, variant = "red", className }: GameButtonProps) {
  const variants = {
    red: "bg-red-500 hover:bg-red-600 shadow-red-500/30 border-red-700 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30 border-orange-700 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30 border-yellow-700 text-gray-900",
    green: "bg-green-500 hover:bg-green-600 shadow-green-500/30 border-green-700 text-white",
    blue: "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30 border-blue-700 text-white",
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-lg font-semibold transition-all duration-200",
        "shadow-lg hover:scale-105 active:scale-95",
        "game-button-frame border-4",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

interface GameCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
}

export function GameCheckbox({ checked, onChange, label }: GameCheckboxProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <div className="w-8 h-8 wooden-frame rounded-sm border-2 border-amber-900">
          <div className="w-full h-full parchment-bg rounded-sm flex items-center justify-center border border-amber-700">
            {checked && <div className="w-4 h-4 bg-green-500 rounded-sm shadow-sm border border-green-700" />}
          </div>
        </div>
      </div>
      <span className="text-card-foreground font-medium group-hover:text-primary transition-colors">{label}</span>
    </label>
  )
}

interface GameSliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
}

export function GameSlider({ value, onChange, min = 0, max = 100, label }: GameSliderProps) {
  return (
    <div className="space-y-3">
      <label className="text-card-foreground font-medium game-element-border rounded px-2 py-1 inline-block">
        {label}
      </label>
      <div className="relative">
        <div className="h-4 wooden-frame rounded-full border-2 border-amber-900">
          <div className="h-full parchment-bg rounded-full relative overflow-hidden border border-amber-700">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-200 border-r border-green-700"
              style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            />
            <div
              className="absolute top-1/2 w-6 h-6 bg-green-600 rounded-full border-3 border-white shadow-lg transform -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
              style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 12px)` }}
            />
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  )
}

interface GameToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label: string
}

export function GameToggle({ enabled, onChange, label }: GameToggleProps) {
  return (
    <label className="flex items-center justify-between cursor-pointer group p-2 game-element-border rounded-md">
      <span className="text-card-foreground font-medium group-hover:text-primary transition-colors">{label}</span>
      <div className="relative w-14 h-7 wooden-frame rounded-full border-2 border-amber-900">
        <div
          className={cn(
            "w-full h-full rounded-full relative transition-all duration-200 border border-amber-700",
            enabled ? "bg-green-400" : "bg-gray-400",
          )}
        >
          <div
            className={cn(
              "absolute top-1/2 w-6 h-6 rounded-full border-2 border-white shadow-lg transform -translate-y-1/2 transition-all duration-200",
              enabled ? "translate-x-7 bg-green-600" : "translate-x-0 bg-gray-600",
            )}
          />
        </div>
      </div>
    </label>
  )
}

interface GameMapProps {
  className?: string
}

export function GameMap({ className }: GameMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)

  const mapPoints = [
    { id: 1, x: 20, y: 30 },
    { id: 2, x: 60, y: 20 },
    { id: 3, x: 40, y: 60 },
    { id: 4, x: 80, y: 70 },
  ]

  return (
    <div className={cn("relative w-full h-40 wooden-frame rounded-lg border-4 border-amber-900", className)}>
      <div className="w-full h-full parchment-bg rounded-lg relative overflow-hidden border-2 border-amber-700">
        {/* Map grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6b4c3a" strokeWidth="1.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Map points */}
        {mapPoints.map((point) => (
          <button
            key={point.id}
            onClick={() => setSelectedPoint(point.id)}
            className={cn(
              "absolute w-4 h-4 rounded-full border-3 border-white shadow-lg transition-all duration-200 hover:scale-125",
              selectedPoint === point.id ? "bg-yellow-500 border-yellow-200" : "bg-green-500 border-green-200",
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  )
}
