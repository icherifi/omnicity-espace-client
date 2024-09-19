"use client"
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type DesignPageAssetsType = "chambre" | "cuisine" | "salle de bain" | "salon" | "entrée" | "buandrie" | "luminaires" | "plantes" | "collections" | ""

interface SelectedAssetsType {
    title: string,
    roomType: string,
    price: number
}

interface DesignPageType {
    isDesignPageAssetsDisplayed: boolean,
    setIsDesignPageAssetsDisplayed: Dispatch<SetStateAction<boolean>>,
    currentDesignPageAssetsDisplayed: DesignPageAssetsType,
    setCurrentDesignPageAssetsDisplayed: Dispatch<SetStateAction<DesignPageAssetsType>>,
    selectedAssets: SelectedAssetsType[],
    setSelectedAssets: Dispatch<SetStateAction<SelectedAssetsType[]>>
    resetDesignPage: () => void  // Fonction de reset
}

// Définir l'état initial
const initialState = {
    isDesignPageAssetsDisplayed: false,
    currentDesignPageAssetsDisplayed: "" as DesignPageAssetsType,
    selectedAssets: [] as SelectedAssetsType[]
};

export const DesignPageContext = createContext<DesignPageType | null>(null);

export default function DesignPageContextProvider({ children }: useCustomHook) {
    const [isDesignPageAssetsDisplayed, setIsDesignPageAssetsDisplayed] = useState(initialState.isDesignPageAssetsDisplayed)
    const [currentDesignPageAssetsDisplayed, setCurrentDesignPageAssetsDisplayed] = useState(initialState.currentDesignPageAssetsDisplayed)
    const [selectedAssets, setSelectedAssets] = useState(initialState.selectedAssets)
    
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
