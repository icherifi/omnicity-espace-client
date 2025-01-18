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
import { ProjectType, useProjectsContext } from "./projects.context";

// interface ProjectFeaturesType {
//   servicesAndAccessibility: string[];
//   outsite: string[];
//   additionalAres: string[];
//   hygiene: string[];
//   size: string;
//   roomsNumber: number;
//   floorsNumber: number;
// }

// export interface MarksMostUsedObjectType {
//   mark: string;
//   percentage: number;
// }

// interface CostEstimationType {
//   withAid: number;
//   withoutAid: number;
// }

// export interface ProjectType {
//   id: string;
//   name: string;
//   address: string;
//   date: string;
//   actualEnergyRating: "a" | "b" | "c" | "d" | "e" | "f" | "g";
//   targetedEnergyRating: "a" | "b" | "c" | "d" | "e" | "f" | "g";
//   features: ProjectFeaturesType;
//   stateOfPlay: string;
//   marksMostUsed: MarksMostUsedObjectType[];
//   costEstimation: CostEstimationType;
//   state: "inprogress" | "completed";
//   lastUpdate?: string;
//   id_bouquet: string;
//   id_design: string;
//   authorName: string;
//   image?: string;
// }

interface DashboardContextType {
  currentProjectDisplayed: ProjectType;
  setCurrentProjectDisplayed: Dispatch<SetStateAction<ProjectType>>;
  resetDashboard: () => void; // Fonction de reset
}

export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

export default function DashboardContextProvider({ children }: useCustomHook) {
  const { projects } = useProjectsContext();
  const [currentProjectDisplayed, setCurrentProjectDisplayed] =
    useState<ProjectType>({
      id: "#Oe31b70H",
      name: "T211 VITRY",
      created_at: "23 Juin 2024",
      address: "337 Centre Cial V Deux, 94400 Vitry-sur-Seine",
      actualEnergyRating: "e",
      targetedEnergyRating: "b",
      features: {
        servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
        outsite: ["Balcon"],
        additionalAres: ["Parking", "Cave"],
        hygiene: ["Salle de bain", "Toilettes"],
        size: "65m²",
        roomsNumber: 5,
        floorsNumber: 2,
      },
      stateOfPlay:
        "QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400). Studio dans une copropriété sécurisée avec gardien et espaces verts, à proximité des commodités.",
      marksMostUsed: [
        { mark: "Ikea", percentage: 26 },
        { mark: "H&M home", percentage: 14 },
        { mark: "Diptyque", percentage: 19 },
        { mark: "Zara home", percentage: 32 },
        { mark: "Benatura", percentage: 9 },
      ],
      costEstimation: {
        withAid: 178000,
        withoutAid: 213000,
      },
      state: "inprogress",
      lastUpdate: "17 September 2024",
      id_bouquet: "#Oe31b70k",
      id_design: "#Zk41b70H",
      authorName: "Saikou",
      image: "/placeholder.svg",
    });
  // Fonction pour réinitialiser tous les états
  const resetDashboard = () => {
    setCurrentProjectDisplayed(projects[0]);
  };

  return (
    <DashboardContext.Provider
      value={{
        currentProjectDisplayed,
        setCurrentProjectDisplayed,
        resetDashboard, // Expose la fonction reset
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
