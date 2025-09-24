"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Restaurer le thème depuis localStorage au chargement
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
      setTheme(savedTheme)
    }
    setMounted(true)
  }, [])

  // Appliquer le thème au DOM et sauvegarder en localStorage
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    
    // Sauvegarder en localStorage
    localStorage.setItem("theme", theme)
  }, [theme, mounted])

  // Éviter le rendu pendant l'hydratation
  if (!mounted) {
    return <div className="light">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
} 