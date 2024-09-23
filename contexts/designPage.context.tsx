"use client"
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type DesignPageAssetsType = "chambre" | "cuisine" | "salle de bain" | "salon" | "entrée" | "buandrie" | "luminaires" | "plantes" | "collections" | ""

interface SelectedAssetsType {
    title: string,
    roomType: string,
    price: number
}

interface CostEstimationType {
    withAid: number,
    withoutAid: number
}

type ModelType = "2D" | "3D" | "Virtuelle"

interface DesignPageType {
    isDesignPageAssetsDisplayed: boolean,
    setIsDesignPageAssetsDisplayed: Dispatch<SetStateAction<boolean>>,
    currentDesignPageAssetsDisplayed: DesignPageAssetsType,
    setCurrentDesignPageAssetsDisplayed: Dispatch<SetStateAction<DesignPageAssetsType>>,
    selectedAssets: SelectedAssetsType[],
    setSelectedAssets: Dispatch<SetStateAction<SelectedAssetsType[]>>,
    costEstimation: CostEstimationType,
    setCostEstimation: Dispatch<SetStateAction<CostEstimationType>>,
    selectedModelType: ModelType,
    setSelectedModelType: Dispatch<SetStateAction<ModelType>>,
    resetDesignPage: () => void  // Fonction de reset
}

// Définir l'état initial
const initialState = {
    isDesignPageAssetsDisplayed: false,
    currentDesignPageAssetsDisplayed: "" as DesignPageAssetsType,
    selectedAssets: [] as SelectedAssetsType[],
    costEstimation: {
        withAid: 0,
        withoutAid: 0
    } as CostEstimationType,
    selectedModelType: "3D" as ModelType
};

export const DesignPageContext = createContext<DesignPageType | null>(null);

export default function DesignPageContextProvider({ children }: useCustomHook) {
    const [isDesignPageAssetsDisplayed, setIsDesignPageAssetsDisplayed] = useState(initialState.isDesignPageAssetsDisplayed)
    const [currentDesignPageAssetsDisplayed, setCurrentDesignPageAssetsDisplayed] = useState(initialState.currentDesignPageAssetsDisplayed)
    const [selectedAssets, setSelectedAssets] = useState(initialState.selectedAssets)
    const [costEstimation, setCostEstimation] = useState(initialState.costEstimation)
    const [selectedModelType, setSelectedModelType] = useState(initialState.selectedModelType)
    // Fonction pour réinitialiser tous les états
    const resetDesignPage = () => {
        setIsDesignPageAssetsDisplayed(initialState.isDesignPageAssetsDisplayed)
    };

    return (
        <DesignPageContext.Provider value={{
            isDesignPageAssetsDisplayed,
            setIsDesignPageAssetsDisplayed,
            currentDesignPageAssetsDisplayed,
            setCurrentDesignPageAssetsDisplayed,
            selectedAssets,
            setSelectedAssets,
            costEstimation,
            setCostEstimation,
            selectedModelType,
            setSelectedModelType,
            resetDesignPage // Expose la fonction reset
        }}>
            {children}
        </DesignPageContext.Provider>
    );
}

export function useDesignPageContext() {
    const context = useContext(DesignPageContext);
    if (!context) {
        throw new Error("useDesignPageContext must be used within DesignPageContextProvider");
    }
    return context;
}
