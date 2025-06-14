import React from "react";

export type EnergyRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

interface DpeBarProps {
  currentRating: EnergyRating;
  targetRating?: EnergyRating;
  className?: string;
}

const ratingColors: Record<EnergyRating, string> = {
  G: "#C62828",
  F: "#E53935",
  E: "#FB8C00",
  D: "#FDD835",
  C: "#C0CA33",
  B: "#7CB342",
  A: "#388E3C",
};

const ratings: EnergyRating[] = ["G", "F", "E", "D", "C", "B", "A"];

const labelStyle = {
  color: "#575757",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontStyle: "normal" as const,
  fontWeight: 700,
  lineHeight: "24px",
  letterSpacing: "-0.6px",
};

export default function DpeBar({ currentRating, targetRating, className }: DpeBarProps) {
  const getRatingPosition = (rating: EnergyRating) => ratings.indexOf(rating);

  return (
    <div className={`flex flex-col items-center w-full ${className || ""}`.trim()}>
      <div className="flex w-full max-w-lg h-8 rounded-full overflow-hidden">
        {ratings.map((r, idx) => (
          <div
            key={r}
            className="flex-1 w-[12px] h-full flex items-center justify-center relative"
            style={{
              background: ratingColors[r],
              borderTopLeftRadius: idx === 0 ? 20 : 0,
              borderBottomLeftRadius: idx === 0 ? 20 : 0,
              borderTopRightRadius: idx === ratings.length - 1 ? 20 : 0,
              borderBottomRightRadius: idx === ratings.length - 1 ? 20 : 0,
            }}
          >
            <span className="text-white font-bold text-lg z-10">
              {r === currentRating ? r : r === targetRating ? r : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="relative w-full max-w-md h-8 mt-1" style={{ height: 32 }}>
        {currentRating && (
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${(getRatingPosition(currentRating) + 0.5) * (100 / ratings.length)}%`, transform: "translateX(-50%)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9" fill="none">
              <path d="M1 8L7.50001 2L14 8" stroke="#575757" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={labelStyle}>Actuel</span>
          </div>
        )}
        {targetRating && (
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${(getRatingPosition(targetRating) + 0.5) * (100 / ratings.length)}%`, transform: "translateX(-50%)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="9" viewBox="0 0 15 9" fill="none">
              <path d="M1 8L7.50001 2L14 8" stroke="#575757" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={labelStyle}>Visé</span>
          </div>
        )}
      </div>
    </div>
  );
} 