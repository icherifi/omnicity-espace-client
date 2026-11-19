"use client";
import { useCustomHook } from "@/app/layout";
import { ProjectType } from "@/types/project.types";
import { fetchProjects } from "@/utils/handleProjectDetails";
import { useAccount } from "@/contexts/account.context";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export interface MarksMostUsedObjectType {
  mark: string;
  percentage: number;
}
interface ProjectsContextType {
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  refreshProjects: () => void;
}

export const ProjectsContext = createContext<ProjectsContextType | null>(null);

export default function ProjectsContextProvider({ children }: useCustomHook) {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const { status, me } = useAccount();

  const refreshProjects = () => {
    fetchProjects(setProjects);
  };

  // Only once we know the user is signed in AND activated (and again if they switch account):
  // fetching at mount used to race the login and leave the list empty.
  useEffect(() => {
    if (status === "active") {
      fetchProjects(setProjects);
    } else {
      setProjects([]);
    }
  }, [status, me?.id]);

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
