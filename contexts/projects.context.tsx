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

interface ProjectFeaturesType {
  servicesAndAccessibility: string[];
  outsite: string[];
  additionalAres: string[];
  hygiene: string[];
  size: string;
  roomsNumber: number;
  floorsNumber: number;
}

export interface MarksMostUsedObjectType {
  mark: string;
  percentage: number;
}

interface CostEstimationType {
  withAid: number;
  withoutAid: number;
}

export interface ProjectType {
  id: string;
  name: string;
  address: string;
  date: string;
  actualEnergyRating: "a" | "b" | "c" | "d" | "e" | "f" | "g";
  targetedEnergyRating: "a" | "b" | "c" | "d" | "e" | "f" | "g";
  features: ProjectFeaturesType;
  stateOfPlay: string;
  marksMostUsed: MarksMostUsedObjectType[];
  costEstimation: CostEstimationType;
  state: "inprogress" | "completed";
  lastUpdate?: string;
  id_bouquet: string;
  id_design: string;
  authorName: string;
  image?: string;
}

interface ProjectsContextType {
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  refreshProjects: () => void;
}

export const ProjectsContext = createContext<ProjectsContextType | null>(null);

export default function ProjectsContextProvider({ children }: useCustomHook) {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const fetchProjects = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`;
      console.log("Fetching projects from:", apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const refreshProjects = () => {
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        setProjects,
        refreshProjects,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjectsContext() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error(
      "useProjectsContext must be used within ProjectsContextProvider"
    );
  }
  return context;
}
