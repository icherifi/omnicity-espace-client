"use client";
import { useCustomHook } from "@/app/layout";
import { fetchProjects } from "@/utils/handleProjectDetails";
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

export interface ProjectType {
  id: number;
  name: string;
  address: string;
  created_at?: string;
  actualEnergyRating: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  targetedEnergyRating: "A" | "B" | "C" | "D" | "E" | "F" | "G";
  features: {
    size: string;
    roomsNumber: string;
    floorsNumber: string;
  };
  stateOfPlay: string;
  costEstimation: {
    withAid: number;
    withoutAid: number;
  };
  state: "inprogress" | "completed";
  id_bouquet: string;
  id_design: string | null;
  created_by: string;
  description: string;
  authorName: string;
  imageFullPath?: string;
  iziResponse?: {
    CEP: number;
    EGES: number;
    confort: number;
    inputQr: any;
    bouquets: any[];
    sessionId: string;
    etiquetteInitial: string;
    etiquetteEGESInitial: string;
    performanceEnergetique: {
      murs: any;
      toiture: any;
      vitrages: any;
      chauffage: any;
      plancherBas: any;
      ventilation: any;
      plancherHaut: any;
    };
    etiquetteEnergetiqueInitial: string;
  };
  choice?: {
    confort: number;
    coutTotal: number;
    etiquette: string;
    detailsPrix: any[];
    valeurVerte: number;
    montantAides: number;
    resteACharge: number;
    etiquetteEGES: string;
    renoMenuiserie: boolean;
    renovationMurs: boolean;
    categoriesAides: string;
    renoComblesPerdus: boolean;
    renoPorteFenetres: boolean;
    appareilChauffage1: string;
    appareilChauffage2: string;
    pourcentageGainCEP: number;
    renoComblesAmenages: boolean;
    etiquetteEnergetique: string;
    renoPlancherBasSousSol: boolean;
    typeVentilationExterieur: string;
    renoPlancherBasTerrePlein: boolean;
    renoIsolationToitureTerrasse: boolean;
    renoPlancherBasVideSanitaire: boolean;
    remplacementEauChaudeSanitaire: null;
  };
}

interface ProjectsContextType {
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
  refreshProjects: () => void;
}

export const ProjectsContext = createContext<ProjectsContextType | null>(null);

export default function ProjectsContextProvider({ children }: useCustomHook) {
  const [projects, setProjects] = useState<ProjectType[]>([]);

  const refreshProjects = () => {
    fetchProjects(setProjects);
  };

  useEffect(() => {
    fetchProjects(setProjects);
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
