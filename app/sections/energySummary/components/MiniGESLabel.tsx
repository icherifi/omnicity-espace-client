"use client"

import { cn } from "@/lib/utils";
import { EnergyRating } from "./EnergyLabel";

interface MiniGESLabelProps {
  rating: EnergyRating;
  className?: string;
}

const COLOR_GES: Record<EnergyRating, string> = {
  A: "bg-sky-200 dark:bg-sky-300",
  B: "bg-sky-300 dark:bg-sky-400",
  C: "bg-sky-400 dark:bg-sky-500",
  D: "bg-slate-500 dark:bg-slate-400",
  E: "bg-slate-600 dark:bg-slate-500",
  F: "bg-slate-700 dark:bg-slate-600",
  G: "bg-slate-800 dark:bg-slate-700",
};

const TEXT_GES: Record<EnergyRating, string> = {
  A: "text-black dark:text-gray-900",
  B: "text-black dark:text-gray-900",
  C: "text-white",
  D: "text-white",
  E: "text-white",
  F: "text-white",
  G: "text-white",
};

export default function MiniGESLabel({ rating, className }: MiniGESLabelProps) {
  const ratings: EnergyRating[] = ["G", "F", "E", "D", "C", "B", "A"];

  return (
    <div className={cn("w-40", className)}>
      <div className="flex h-6 w-full overflow-hidden rounded-md border border-white dark:border-gray-300">
        {ratings.map((r, i) => (
          <div
            key={r}
            className={cn(
              "flex-1 border-r last:border-none border-white dark:border-gray-300",
              COLOR_GES[r]
            )}
          />
        ))}
      </div>

      <div className="flex justify-between">
        {ratings.map((r) => (
          <div
            key={r}
            className={cn(
              "flex-1 flex justify-center",
              r === rating ? "mt-[-0.5rem]" : ""
            )}
          >
            {r === rating && (
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 border-white dark:border-gray-300 flex items-center justify-center text-xs font-bold",
                  COLOR_GES[r],
                  TEXT_GES[r]
                )}
              >
                {r}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 