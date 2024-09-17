"use client"
import { useCustomHook } from "@/app/layout";
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
    //Fetch et prendre le 1st project
    currentProjectDisplayed: {
        id: "#Oe31b70H",
        name: "T2 VITRY",
        date: "23 Juin 2024",
        address: "337 Centre Cial V Deux, 94400",
        actualEnergyRating: "e",
        targetedEnergyRating: "b",
        features: {
            servicesAndAccessibility: ["Ascenseur", "Gardien", "Digicode"],
            outsite: ["Balcon"],
            additionalAres: ["Parking", "Cave"],
            hygiene: ["Salle de bain", "Toilettes"],
            size: "65m²",
            roomsNumber: 5,
            floorsNumber: 2
        },
        stateOfPlay: "QUARTIER GARE-JEAN-JAURÈS - VITRY SUR SEINE (94400) Dans une copropriété sécurisé avec gardien et espace vert, studio comprenant : entrée, séjour donnant sur balcon, cuisine, et une salle de bains avec wc, et une cave. 10 min du métro Mairie d'Ivry et du RERC et proche de toutes commodites. Référence agence : 563",
        marksMostUsed: [{mark: "Ikea", percentage: 26}, {mark: "H&M home", percentage: 14}, {mark: "Diptyque", percentage: 19}, {mark: "Zara home", percentage: 32}, {mark: "Benatura", percentage: 9}],
        costEstimation: {
            withAid: 178000,
            withoutAid: 213000
        },
        status: "inprogress",
        lastUpdate: "17 September 2024",
        id_bouquet: "#Oe31b70k",
        id_design: "#Zk41b70H"
    } as ProjectType
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
