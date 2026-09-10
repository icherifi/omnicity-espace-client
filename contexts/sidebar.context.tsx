"use client";
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export type SidebarSection = "projects" | "dashboard" | "documents" | "renovation" | "relation" | "assistance" | "settings";

interface SidebarContextType {
  section: SidebarSection;
  setSection: Dispatch<SetStateAction<SidebarSection>>;
  resetSidebar: () => void;
  showEnergySummary: boolean;
  setShowEnergySummary: Dispatch<SetStateAction<boolean>>;
  toggleEnergySummary: () => void;
  selectedRenovationDocument: string | null;
  setSelectedRenovationDocument: Dispatch<SetStateAction<string | null>>;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

const initialSection: SidebarSection = "projects";

export default function SidebarContextProvider({ children }: useCustomHook) {
  const pathname = usePathname();
  const [section, setSection] = useState<SidebarSection>(initialSection);
  const [showEnergySummary, setShowEnergySummary] = useState(false);
  const [selectedRenovationDocument, setSelectedRenovationDocument] = useState<string | null>(null);

  // Synchroniser l'état avec l'URL
  useEffect(() => {
    if (pathname === "/") {
      setSection("projects");
      setShowEnergySummary(false);
      setSelectedRenovationDocument(null);
      return;
    }

    if (pathname === "/assistance") {
      setSection("assistance");
      setShowEnergySummary(false);
      setSelectedRenovationDocument(null);
      return;
    }

    if (pathname === "/settings") {
      setSection("settings");
      setShowEnergySummary(false);
      setSelectedRenovationDocument(null);
      return;
    }

    const projMatch = pathname.match(/^\/project\/[0-9a-fA-F-]{36}(?:\/(\w+))?$/);
    if (projMatch) {
      const sub = projMatch[1];
      switch (sub) {
        case "energy":
          setSection("dashboard");
          setShowEnergySummary(true);
          setSelectedRenovationDocument(null);
          break;
        case "documents":
          setSection("documents");
          setShowEnergySummary(false);
          setSelectedRenovationDocument(null);
          break;
        case "renovation":
          setSection("renovation");
          setShowEnergySummary(false);
          break;
        case "relation":
          setSection("relation");
          setShowEnergySummary(false);
          setSelectedRenovationDocument(null);
          break;
        default:
          setSection("dashboard");
          setShowEnergySummary(false);
          setSelectedRenovationDocument(null);
      }
    }
  }, [pathname]);

  const resetSidebar = () => setSection(initialSection);
  const toggleEnergySummary = () => setShowEnergySummary((s) => !s);

  return (
    <SidebarContext.Provider value={{ 
      section, 
      setSection, 
      resetSidebar, 
      showEnergySummary, 
      setShowEnergySummary, 
      toggleEnergySummary,
      selectedRenovationDocument,
      setSelectedRenovationDocument
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarContextProvider");
  }
  return context;
}
