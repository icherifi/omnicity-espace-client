"use client"
import { useCustomHook } from "@/app/layout";
import { projects } from "@/components/ProjectsTable";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface ProjectFeaturesType {
    servicesAndAccessibility: string[],
    outsite: string[],
    additionalAres: string[],
    hygiene: string[],
    size: string,
    roomsNumber: number,
    floorsNumber: number
}

export interface MarksMostUsedObjectType {
    mark: string,
    percentage: number
}

interface CostEstimationType {
    withAid: number,
    withoutAid: number
}

export interface ProjectType {
    id: string,
    name: string,
    address: string,
    date: string,
    actualEnergyRating: "a"|"b"|"c"|"d"|"e"|"f"|"g",
    targetedEnergyRating: "a"|"b"|"c"|"d"|"e"|"f"|"g",
    features: ProjectFeaturesType,
    stateOfPlay: string,
    marksMostUsed: MarksMostUsedObjectType[],
    costEstimation: CostEstimationType,
    status: "inprogress" | "completed",
    lastUpdate?: string,
    id_bouquet: string,
    id_design: string,

}

interface DashboardType {
    currentProjectDisplayed: ProjectType,
    setCurrentProjectDisplayed: Dispatch<SetStateAction<ProjectType>>,
    resetDashboard: () => void  // Fonction de reset
}

// Définir l'état initial
const initialState = {
    //Fetch de la db
    currentProjectDisplayed: projects[0]
};

export const DashboardContext = createContext<DashboardType | null>(null);

export default function DashboardContextProvider({ children }: useCustomHook) {
    const [currentProjectDisplayed, setCurrentProjectDisplayed] = useState<ProjectType>(initialState.currentProjectDisplayed);
    // Fonction pour réinitialiser tous les états
    const resetDashboard = () => {
        setCurrentProjectDisplayed(initialState.currentProjectDisplayed)
    };

    return (
        <DashboardContext.Provider value={{
            currentProjectDisplayed,
            setCurrentProjectDisplayed,
            resetDashboard // Expose la fonction reset
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardContext() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboardContext must be used within DashboardContextProvider");
    }
    return context;
}
