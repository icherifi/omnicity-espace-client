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
  fontSize: 10,
  fontStyle: "normal" as const,
  fontWeight: 600,
  lineHeight: "16px",
  letterSpacing: "-0.4px",
};

export default function DpeBar({ currentRating, targetRating, className }: DpeBarProps) {
  const getRatingPosition = (rating: EnergyRating) => ratings.indexOf(rating);
  const isSameRating = currentRating === targetRating;

  return (
    <div className={`flex flex-col items-center w-full ${className || ""}`.trim()}>
      {/* Label "Visé" en haut si même étiquette */}
      {isSameRating && targetRating && (
        <div className="relative w-full max-w-sm h-6 mb-0.5" style={{ height: 24 }}>
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${(getRatingPosition(targetRating) + 0.5) * (100 / ratings.length)}%`, transform: "translateX(-50%)" }}
          >
            <span style={labelStyle}>Visé</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 15 9" fill="none">
              <path d="M1 1L7.50001 7L14 1" stroke="#575757" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}

      <div className="flex w-full max-w-md h-6 rounded-full overflow-hidden">
        {ratings.map((r, idx) => (
          <div
            key={r}
            className="flex-1 w-[10px] h-full flex items-center justify-center relative"
            style={{
              background: ratingColors[r],
              borderTopLeftRadius: idx === 0 ? 12 : 0,
              borderBottomLeftRadius: idx === 0 ? 12 : 0,
              borderTopRightRadius: idx === ratings.length - 1 ? 12 : 0,
              borderBottomRightRadius: idx === ratings.length - 1 ? 12 : 0,
            }}
          >
            <span className="text-white font-bold text-sm z-10">
              {r === currentRating ? r : r === targetRating ? r : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-sm h-6 mt-0.5" style={{ height: 24 }}>
        {currentRating && (
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${(getRatingPosition(currentRating) + 0.5) * (100 / ratings.length)}%`, transform: "translateX(-50%)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 15 9" fill="none">
              <path d="M1 8L7.50001 2L14 8" stroke="#575757" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={labelStyle}>Actuel</span>
          </div>
        )}
        {/* Label "Visé" en bas seulement si étiquettes différentes */}
        {targetRating && !isSameRating && (
          <div
            className="absolute flex flex-col items-center"
            style={{ left: `${(getRatingPosition(targetRating) + 0.5) * (100 / ratings.length)}%`, transform: "translateX(-50%)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 15 9" fill="none">
              <path d="M1 8L7.50001 2L14 8" stroke="#575757" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span style={labelStyle}>Visé</span>
          </div>
        )}
      </div>
    </div>
  );
} 