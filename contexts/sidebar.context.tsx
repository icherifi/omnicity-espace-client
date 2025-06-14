"use client";
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

export type SidebarSection = "projects" | "dashboard" | "documents" | "renovation" | "relation" | "assistance" | "settings";

interface SidebarContextType {
  section: SidebarSection;
  setSection: Dispatch<SetStateAction<SidebarSection>>;
  resetSidebar: () => void;
}

export const SidebarContext = createContext<SidebarContextType | null>(null);

const initialSection: SidebarSection = "dashboard";

export default function SidebarContextProvider({ children }: useCustomHook) {
  const [section, setSection] = useState<SidebarSection>(initialSection);

  const resetSidebar = () => setSection(initialSection);

  return (
    <SidebarContext.Provider value={{ section, setSection, resetSidebar }}>
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
