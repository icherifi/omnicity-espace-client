"use client";

import { useTheme } from "@/contexts/theme.context";
import Image from "next/image";

export function LoginBackground() {
  const { theme } = useTheme();
  const bgSrc = theme === "dark" ? "/bg-login-dark.png" : "/bg-login-light.png";

  return (
    <>
      {/* Couche de fond principale */}
      <div
        className={`absolute inset-0 w-full h-full z-0 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#221C36] via-[#2B2342] to-[#1A1A2E]"
            : "bg-white"
        }`}
        aria-hidden="true"
      />
      {/* Overlay pour harmoniser le fond en dark mode */}
      {theme === "dark" && (
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{background:"linear-gradient(120deg,rgba(44,30,80,0.55) 0%,rgba(30,22,50,0.65) 100%)"}} />
      )}
      {/* Texture PNG par-dessus */}
      <Image
        src={bgSrc}
        alt="Background Login"
        fill
        priority
        className={`object-cover object-center absolute inset-0 w-full h-full select-none pointer-events-none z-0 ${theme === "dark" ? "opacity-25 brightness-75" : "opacity-10 brightness-150"}`}
        draggable={false}
      />
    </>
  );
} 