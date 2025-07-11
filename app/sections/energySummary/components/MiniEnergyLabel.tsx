"use client"

import { cn } from "@/lib/utils"
import { EnergyRating } from "./EnergyLabel"

interface MiniEnergyLabelProps {
  rating: EnergyRating         
  className?: string          
}

const COLOR: Record<EnergyRating, string> = {
  A: "bg-green-600 dark:bg-green-500",
  B: "bg-green-500 dark:bg-green-400",
  C: "bg-lime-500 dark:bg-lime-400",
  D: "bg-yellow-300 dark:bg-yellow-200",
  E: "bg-amber-300 dark:bg-amber-200",
  F: "bg-red-500 dark:bg-red-400",
  G: "bg-red-700 dark:bg-red-600",
}

const TEXT: Record<EnergyRating, string> = {
  A: "text-white",
  B: "text-white",
  C: "text-black dark:text-gray-900",
  D: "text-black dark:text-gray-900",
  E: "text-black dark:text-gray-900",
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
      <div className="flex h-6 w-full overflow-hidden rounded-md border border-white dark:border-gray-300">
        {ratings.map((r, i) => (
          <div
            key={r}
            className={cn(
              "flex-1 border-r last:border-none border-white dark:border-gray-300",
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
                "w-6 h-6 rounded-full border-2 border-white dark:border-gray-300 flex items-center justify-center text-xs font-bold",
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
