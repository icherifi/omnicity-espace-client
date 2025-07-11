"use client"
import { cn } from "@/lib/utils"

export type EnergyRating = "A" | "B" | "C" | "D" | "E" | "F" | "G"

interface EnergyLabelProps {
  currentRating?: EnergyRating
  targetRating?: EnergyRating
  className?: string
  onCard?: boolean
}

export const getRatingColor = (rating: EnergyRating): string => {
  switch (rating) {
    case "A":
      return "bg-green-600 dark:bg-green-500"
    case "B":
      return "bg-green-500 dark:bg-green-400"
    case "C":
      return "bg-lime-500 dark:bg-lime-400"
    case "D":
      return "bg-yellow-300 dark:bg-yellow-200"
    case "E":
      return "bg-amber-300 dark:bg-amber-200"
    case "F":
      return "bg-red-500 dark:bg-red-400"
    case "G":
      return "bg-red-700 dark:bg-red-600"
    default:
      return "bg-red-500 dark:bg-red-400"
  }
}

export default function EnergyLabel({ currentRating, targetRating, className, onCard }: EnergyLabelProps) {
  const ratings: EnergyRating[] = ["G", "F", "E", "D", "C", "B", "A"]

  const getTextColor = (rating: EnergyRating): string => {
    switch (rating) {
      case "A":
        return "text-white"
      case "B":
        return "text-white"
      case "C":
        return "text-black dark:text-gray-900"
      case "D":
        return "text-black dark:text-gray-900"
      case "E":
        return "text-black dark:text-gray-900"
      case "F":
        return "text-white"
      case "G":
        return "text-white"
      default:
        return "text-white"
    }
  }

  const getRatingPosition = (rating: EnergyRating): number => {
    const index = ratings.indexOf(rating)
    return index !== -1 ? index : 0
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className={cn("relative w-full bg-lavender-50", !onCard && "h-16")}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] flex">
          {currentRating && targetRating && (
            <div
              className="absolute text-xs font-medium text-black"
              style={{
                left: `${(getRatingPosition(currentRating) + 0.5) * (100 / ratings.length)}%`,
                transform: "translateX(-50%)",
              }}
            >
              Actuel
            </div>
          )}

          {targetRating && (
            <div
              className="absolute text-xs font-medium text-black"
              style={{
                left: `${(getRatingPosition(targetRating) + 0.5) * (100 / ratings.length)}%`,
                transform: "translateX(-50%)",
              }}
            >
              Projeté
            </div>
          )}
        </div>

        <div className="absolute top-6 left-1/2 -translate-x-1/2 h-8 w-[60%] flex">
          <div className="flex h-8 w-full overflow-hidden rounded-md border border-white dark:border-gray-300">
          {ratings.map((r, index) => (
            <div
              key={r}
              className={cn(
                "flex-1 h-full relative",
                getRatingColor(r),
                index === 0 ? "rounded-l-md" : "",
                index === ratings.length - 1 ? "rounded-r-md" : "",
                  index < ratings.length - 1 ? "border-r border-white dark:border-gray-300" : "",
              )}
            >
              {currentRating && index === getRatingPosition(currentRating) && (
                <div className="absolute inset-x-0 bottom-0 flex justify-center items-end">
                  <div
                    className="w-0 h-0 absolute -bottom-3"
                    style={{
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: `12px solid var(--${getRatingColor(currentRating).replace("bg-", "")})`,
                      zIndex: 10,
                    }}
                  />

                  <div
                    className={cn(
                        "absolute -bottom-[28px] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-300",
                      getRatingColor(currentRating),
                      getTextColor(currentRating),
                    )}
                  >
                    {currentRating}
                  </div>
                </div>
              )}

              {targetRating && index === getRatingPosition(targetRating) && (
                <div className="absolute inset-x-0 bottom-0 flex justify-center items-end">
                  <div
                    className="w-0 h-0 absolute -bottom-3"
                    style={{
                      borderLeft: "8px solid transparent",
                      borderRight: "8px solid transparent",
                      borderTop: `12px solid var(--${getRatingColor(targetRating).replace("bg-", "")})`,
                      zIndex: 10,
                    }}
                  />

                  <div
                    className={cn(
                        "absolute -bottom-[28px] w-8 h-8 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-300",
                      getRatingColor(targetRating),
                      getTextColor(targetRating),
                    )}
                  >
                    {targetRating}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}
