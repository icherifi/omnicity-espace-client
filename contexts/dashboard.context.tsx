"use client";
import { useCustomHook } from "@/app/layout";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useProjectsContext } from "./projects.context";
import { ProjectType } from "@/types/project.types";
interface DashboardContextType {
  currentProjectDisplayed: ProjectType | null;
  setCurrentProjectDisplayed: Dispatch<SetStateAction<ProjectType | null>>;
  resetDashboard: () => void;
}

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export default function DashboardContextProvider({ children }: useCustomHook) {
  const { projects } = useProjectsContext();
  const [currentProjectDisplayed, setCurrentProjectDisplayed] = useState<ProjectType | null>(null);

  const resetDashboard = () => {
    setCurrentProjectDisplayed(projects[0]);
  };

  useEffect(() => {
    if (projects.length > 0 && !currentProjectDisplayed) {
      setCurrentProjectDisplayed(projects[0]);
    }
  }, [projects, currentProjectDisplayed]);

  return (
    <DashboardContext.Provider
      value={{
        currentProjectDisplayed: currentProjectDisplayed!,
        setCurrentProjectDisplayed: setCurrentProjectDisplayed!,
        resetDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within DashboardContextProvider"
    );
  }
  return context;
}
