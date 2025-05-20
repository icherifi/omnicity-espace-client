"use client"

import { EnergyRating } from "@/types/project.types"
import { useState, useMemo } from "react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const RATES = [
  { key: "0", label: "Prix énergie stable", value: 0 },
  { key: "3", label: "Prix énergie 3 % / an", value: 0.03 },
  { key: "4", label: "Prix énergie 4 % / an", value: 0.04 },
] as const

interface Props {
  beforeAnnual: number 
  afterAnnual: number 
  years?: number
  actualEnergyRating: EnergyRating
  targetEnergyRating: EnergyRating
}

export function EnergySavingsChart({ beforeAnnual, afterAnnual, years = 20, actualEnergyRating, targetEnergyRating }: Props) {
  const [rateKey, setRateKey] = useState<(typeof RATES)[number]["key"]>("3")
  const rate = RATES.find((r) => r.key === rateKey)!.value

  const data = useMemo(
    () =>
      Array.from({ length: years + 1 }, (_, y) => {
        const factor = (1 + rate) ** y / 12
        return {
          year: y,
          Avant: +(beforeAnnual * factor).toFixed(0),
          Après: +(afterAnnual * factor).toFixed(0),
        }
      }),
    [beforeAnnual, afterAnnual, rate, years],
  )

  const highlightPoints = [0, Math.floor(years / 2), years]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-md p-3 border border-gray-100">
          <p className="text-sm font-medium text-gray-700">{`${label} ans`}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={`item-${index}`}
              className={`text-sm font-bold ${entry.name === "Avant" ? "text-red-500" : "text-green-500"}`}
            >
              {`${entry.name}: ${entry.value.toLocaleString()} €`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PRICE_SHIFT = (index: number) => (index === 0 ? -15 : -30)

  const LABEL_SHIFT = (isAvant: boolean, index: number) => {
    if (index !== years) return { dx: 0, dy: -2 }   
  
    return isAvant
      ? { dx: 0, dy: 25 }   
      : { dx: 0, dy: -47 } 
  }
      
  const CustomizedDot = (props: any) => {
    const { cx, cy, value, dataKey, index } = props
    const isAvant = dataKey === 'Avant'
    const color   = isAvant ? '#ef4444' : '#22c55e'
    const highlight = highlightPoints.includes(index)
  
    if (!highlight)
      return <circle cx={cx} cy={cy} r={4} stroke={color} strokeWidth={2} fill="white" />
  
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={color} />
        <circle cx={cx} cy={cy} r={4} fill="white" />
  
        <g transform={`translate(${cx + PRICE_SHIFT(index)}, ${cy - 30})`}>
          <rect width="60" height="24" rx="12"
                fill={isAvant ? 'rgba(239,68,68,.15)' : 'rgba(34,197,94,.15)'} />
          <text x="30" y="16" textAnchor="middle"
                fill={color} fontSize="12" fontWeight="bold">
            {`${value.toLocaleString()} €`}
          </text>
        </g>
  
        {index === years && (() => {
          const { dx, dy } = LABEL_SHIFT(isAvant, index)
          const rating     = isAvant ? actualEnergyRating : targetEnergyRating
          return (
            <g transform={`translate(${cx + dx}, ${cy + dy})`}>
              <circle r="16" fill={color} />
              <text y="5" textAnchor="middle"
                    fill="white" fontSize="14" fontWeight="bold">
                {rating}
              </text>
            </g>
          )
        })()}
      </g>
    )
  };

  return (
    <div className="space-y-4 p-6 bg-white rounded-xl shadow-sm">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 40, right: 40, left: 10, bottom: 45 }}
        >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => (v % 10 === 0 ? `${v}` : "")}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              label={{ value: "Années", position: "insideBottomRight", offset: -5, fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v} €`}
              width={60}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              label={{ value: "Prix / mois", angle: -90, position: "insideLeft", offset: 10, fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="Avant"
              stroke="#ef4444"
              strokeWidth={3}
              dot={<CustomizedDot actualEnergyRating={actualEnergyRating} targetEnergyRating={targetEnergyRating} />}
              activeDot={{ r: 6, fill: "#ef4444" }}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey="Après"
              stroke="#22c55e"
              strokeWidth={3}
              dot={<CustomizedDot actualEnergyRating={actualEnergyRating} targetEnergyRating={targetEnergyRating} />}
              activeDot={{ r: 6, fill: "#22c55e" }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {RATES.map((r) => (
          <button
            key={r.key}
            onClick={() => setRateKey(r.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition
              ${rateKey === r.key ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {r.label.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
