"use client"
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

type PropertyType = "House" | "Apartment" | "Co-ownership";
type WorkPeriodSlices = "None" | "Under10" | "Between10And20" | "Between20And30" | "Between30And40";
type GlazingType = "Bois / Bois métal" | "PVC" | "Aluminium";
type EnergyType = "Electricity" | "Wood" | "Gas or propane" | "Fuel oil" | "Coal"
type HeatingType = "Electric Transmitters" | "Heat pumps"

interface EnergyFormType {
    isEnergyFormDisplayed: boolean,
    setIsEnergyFormDisplayed: Dispatch<SetStateAction<boolean>>,
    currentEnergyFormPage: number,
    setCurrentEnergyFormPage: Dispatch<SetStateAction<number>>,
    energyFormGotOpened: boolean,
    setEnergyFormGotOpened: Dispatch<SetStateAction<boolean>>,
    selectedProperty: PropertyType,
    setSelectedProperty: Dispatch<SetStateAction<PropertyType>>,
    constructionDate: string,
    setConstructionDate: Dispatch<SetStateAction<string>>,
    projectAddress: string,
    setProjectAddress: Dispatch<SetStateAction<string>>,
    livingArea: string,
    setLivingArea: Dispatch<SetStateAction<string>>,
    averageAnnualIncome: number,
    setAverageAnnualIncome: Dispatch<SetStateAction<number>>,
    residentsNumber: number,
    setResidentsNumber: Dispatch<SetStateAction<number>>,
    workPeriodForWalls: WorkPeriodSlices,
    setWorkPeriodForWalls: Dispatch<SetStateAction<WorkPeriodSlices>>,
    workPeriodForFloors: WorkPeriodSlices,
    setWorkPeriodForFloors: Dispatch<SetStateAction<WorkPeriodSlices>>,
    windowMaterial: string,
    setWindowMaterial: Dispatch<SetStateAction<string>>,
    glazingType: string,
    setGlazingType: Dispatch<SetStateAction<string>>,
    selectedEnergyType: EnergyType,
    setSelectedEnergyType: Dispatch<SetStateAction<EnergyType>>,
    selectedHeatingType: HeatingType,
    setSelectedHeatingType: Dispatch<SetStateAction<HeatingType>>,
    hotWaterProductType: string,
    setHotWaterProductType: Dispatch<SetStateAction<string>>,
    ventilationType: string,
    setVentilationType: Dispatch<SetStateAction<string>>,
    resetEnergyForm: () => void  // Fonction de reset
}

// Définir l'état initial
const initialState = {
    isEnergyFormDisplayed: false,
    currentEnergyFormPage: 1,
    energyFormGotOpened: false,
    selectedProperty: "House" as PropertyType,
    constructionDate: "",
    projectAddress: "",
    livingArea: "",
    averageAnnualIncome: 5000000,
    residentsNumber: 1,
    workPeriodForWalls: "None" as WorkPeriodSlices,
    workPeriodForFloors: "None" as WorkPeriodSlices,
    windowMaterial: "",
    glazingType: "Bois / Bois métal",
    selectedEnergyType: "Electricity" as EnergyType,
    selectedHeatingType: "Heat pumps" as HeatingType,
    hotWaterProductType: "Mon systeme de chauffage",
    ventilationType: "Ventilation naturelle",
};

export const EnergyFormContext = createContext<EnergyFormType | null>(null);

export default function EnergyFormContextProvider({ children }: useCustomHook) {
    const [isEnergyFormDisplayed, setIsEnergyFormDisplayed] = useState(initialState.isEnergyFormDisplayed);
    const [currentEnergyFormPage, setCurrentEnergyFormPage] = useState(initialState.currentEnergyFormPage);
    const [selectedProperty, setSelectedProperty] = useState<PropertyType>(initialState.selectedProperty);
    const [energyFormGotOpened, setEnergyFormGotOpened] = useState(initialState.energyFormGotOpened);
    const [constructionDate, setConstructionDate] = useState(initialState.constructionDate);
    const [projectAddress, setProjectAddress] = useState(initialState.projectAddress);
    const [livingArea, setLivingArea] = useState(initialState.livingArea);
    const [averageAnnualIncome, setAverageAnnualIncome] = useState(initialState.averageAnnualIncome);
    const [residentsNumber, setResidentsNumber] = useState(initialState.residentsNumber);
    const [workPeriodForWalls, setWorkPeriodForWalls] = useState<WorkPeriodSlices>(initialState.workPeriodForWalls);
    const [workPeriodForFloors, setWorkPeriodForFloors] = useState<WorkPeriodSlices>(initialState.workPeriodForFloors);
    const [windowMaterial, setWindowMaterial] = useState(initialState.windowMaterial);
    const [glazingType, setGlazingType] = useState(initialState.glazingType);
    const [selectedEnergyType, setSelectedEnergyType] = useState(initialState.selectedEnergyType);
    const [selectedHeatingType, setSelectedHeatingType] = useState(initialState.selectedHeatingType);
    const [hotWaterProductType, setHotWaterProductType] = useState(initialState.hotWaterProductType);
    const [ventilationType, setVentilationType] = useState(initialState.ventilationType);

    // Fonction pour réinitialiser tous les états
    const resetEnergyForm = () => {
        setIsEnergyFormDisplayed(initialState.isEnergyFormDisplayed);
        setCurrentEnergyFormPage(initialState.currentEnergyFormPage);
        setSelectedProperty(initialState.selectedProperty);
        setEnergyFormGotOpened(initialState.energyFormGotOpened);
        setConstructionDate(initialState.constructionDate);
        setProjectAddress(initialState.projectAddress);
        setLivingArea(initialState.livingArea);
        setAverageAnnualIncome(initialState.averageAnnualIncome);
        setResidentsNumber(initialState.residentsNumber);
        setWorkPeriodForWalls(initialState.workPeriodForWalls);
        setWorkPeriodForFloors(initialState.workPeriodForFloors);
        setWindowMaterial(initialState.windowMaterial);
        setGlazingType(initialState.glazingType);
        setSelectedEnergyType(initialState.selectedEnergyType);
        setSelectedHeatingType(initialState.selectedHeatingType);
        setHotWaterProductType(initialState.hotWaterProductType);
        setVentilationType(initialState.ventilationType)
    };

    return (
        <EnergyFormContext.Provider value={{
            isEnergyFormDisplayed,
            setIsEnergyFormDisplayed,
            currentEnergyFormPage,
            setCurrentEnergyFormPage,
            selectedProperty,
            setSelectedProperty,
            energyFormGotOpened,
            setEnergyFormGotOpened,
            constructionDate,
            setConstructionDate,
            projectAddress,
            setProjectAddress,
            livingArea,
            setLivingArea,
            averageAnnualIncome,
            setAverageAnnualIncome,
            residentsNumber,
            setResidentsNumber,
            workPeriodForWalls,
            setWorkPeriodForWalls,
            workPeriodForFloors,
            setWorkPeriodForFloors,
            windowMaterial,
            setWindowMaterial,
            glazingType,
            setGlazingType,
            selectedEnergyType,
            setSelectedEnergyType,
            selectedHeatingType,
            setSelectedHeatingType,
            hotWaterProductType,
            setHotWaterProductType,
            ventilationType,
            setVentilationType,
            resetEnergyForm // Expose la fonction reset
        }}>
            {children}
        </EnergyFormContext.Provider>
    );
}

export function useEnergyFormContext() {
    const context = useContext(EnergyFormContext);
    if (!context) {
        throw new Error("useEnergyFormContext must be used within EnergyFormContextProvider");
    }
    return context;
}
