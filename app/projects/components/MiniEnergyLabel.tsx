"use client"

import { cn } from "@/lib/utils"
import { EnergyRating } from "./EnergyLabel"

interface MiniEnergyLabelProps {
  rating: EnergyRating         
  className?: string          
}

const COLOR: Record<EnergyRating, string> = {
  A: "bg-green-600",
  B: "bg-green-500",
  C: "bg-lime-500",
  D: "bg-yellow-300",
  E: "bg-amber-300",
  F: "bg-red-500",
  G: "bg-red-700",
}

const TEXT: Record<EnergyRating, string> = {
  A: "text-white",
  B: "text-white",
  C: "text-black",
  D: "text-black",
  E: "text-black",
  F: "text-white",
  G: "text-white",
}

export default function MiniEnergyLabel({
  rating,
  className,
}: MiniEnergyLabelProps) {
  const ratings: EnergyRating[] = ["G", "F", "E", "D", "C", "B", "A"]

  return (
    <div className={cn("w-40", className)}>
      <div className="flex h-6 w-full overflow-hidden rounded-md border border-white">
        {ratings.map((r, i) => (
          <div
            key={r}
            className={cn(
              "flex-1 border-r last:border-none border-white",
              COLOR[r]
            )}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {ratings.map(r => (
          <div
            key={r}
            className={cn(
              "flex-1 flex justify-center",
              r === rating ? "mt-[-0.5rem]" : ""
            )}
          >
            {r === rating && (
              <div className={cn(
                "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold",
                COLOR[r],
                TEXT[r]
              )}>
                {r}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
