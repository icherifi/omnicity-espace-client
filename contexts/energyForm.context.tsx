"use client";
import { useCustomHook } from "@/app/layout";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type PropertyType = "House" | "Apartment" | "Co-ownership";
type WorkPeriodSlices =
  | "Il y a moins de 10 ans"
  | "Entre 10 et 20 ans"
  | "Entre 20 et 30 ans"
  | "Pas de travaux"
  | "Je ne sais pas";
export type WindowMaterialType = "Bois / Bois metal" | "PVC" | "Aluminium";
type EnergyType =
  | "Electricité"
  | "Bois"
  | "Gaz ou propane"
  | "Fioul"
  | "Charbon";
  type HeatingType =
  | "Convecteurs électriques"
  | "Pompe à chaleur";
  export type GlazingType =
  | "Simple vitrage"
  | "Double vitrage ancien (plus de 25 ans)";
  type HotWaterProductType =
  | "Ballon électrique"
  | "Un chauffe-eau au gaz";
export type EnergyLabelSolutionsType = "Simplicity" | "Balanced" | "Efficient";
export type VentilationType =
  | "Ventilation naturelle"
  | "Ventilation mécanique simple flux"
  | "Ventilation mécanique double flux";
export type ConstructionDate =
  | "Avant 1948"
  | "Entre 1948 et 1974"
  | "Entre 1975 et 1977"
  | "Entre 1978 et 1982"
  | "Entre 1983 et 1988"
  | "Entre 1989 et 2000"
  | "Entre 2001 et 2005"
  | "Entre 2006 et 2012"
  | "Après 2012";

interface EnergyFormType {
  isEnergyFormDisplayed: boolean;
  setIsEnergyFormDisplayed: Dispatch<SetStateAction<boolean>>;
  currentEnergyFormPage: number;
  setCurrentEnergyFormPage: Dispatch<SetStateAction<number>>;
  energyFormGotOpened: boolean;
  setEnergyFormGotOpened: Dispatch<SetStateAction<boolean>>;
  selectedProperty: PropertyType;
  setSelectedProperty: Dispatch<SetStateAction<PropertyType>>;
  constructionDate: ConstructionDate;
  setConstructionDate: Dispatch<SetStateAction<ConstructionDate>>;
  projectAddress: string;
  setProjectAddress: Dispatch<SetStateAction<string>>;
  livingArea: string;
  setLivingArea: Dispatch<SetStateAction<string>>;
  averageAnnualIncome: number;
  setAverageAnnualIncome: Dispatch<SetStateAction<number>>;
  residentsNumber: number;
  setResidentsNumber: Dispatch<SetStateAction<number>>;
  workPeriodForWalls: WorkPeriodSlices;
  setWorkPeriodForWalls: Dispatch<SetStateAction<WorkPeriodSlices>>;
  workPeriodForFloors: WorkPeriodSlices;
  setWorkPeriodForFloors: Dispatch<SetStateAction<WorkPeriodSlices>>;
  windowMaterial: WindowMaterialType;
  setWindowMaterial: Dispatch<SetStateAction<WindowMaterialType>>;
  glazingType: GlazingType;
  setGlazingType: Dispatch<SetStateAction<GlazingType>>;
  selectedEnergyType: EnergyType;
  setSelectedEnergyType: Dispatch<SetStateAction<EnergyType>>;
  selectedHeatingType: HeatingType;
  setSelectedHeatingType: Dispatch<SetStateAction<HeatingType>>;
  hotWaterProductType: HotWaterProductType;
  setHotWaterProductType: Dispatch<SetStateAction<HotWaterProductType>>;
  ventilationType: VentilationType;
  setVentilationType: Dispatch<SetStateAction<VentilationType>>;
  energyLabelSolutionsType: EnergyLabelSolutionsType;
  setEnergyLabelSolutionsType: Dispatch<
    SetStateAction<EnergyLabelSolutionsType>
  >;
  resetEnergyForm: () => void; // Fonction de reset
  getEnergyFormState: () => object; // Fonction pour obtenir l'état actuel du formulaire
  getFormattedEnergyFormState: () => object; // Fonction pour obtenir l'état actuel du formulaire formaté
  iziResponse: any;
  setIziResponse: Dispatch<SetStateAction<any>>;
}

// Définir l'état initial
const initialState = {
  isEnergyFormDisplayed: false,
  currentEnergyFormPage: 1,
  energyFormGotOpened: false,
  selectedProperty: "House" as PropertyType,
  constructionDate: "Entre 1989 et 2000" as ConstructionDate,
  projectAddress: "77500",
  livingArea: "50",
  averageAnnualIncome: 5000000,
  residentsNumber: 1,
  workPeriodForWalls: "Je ne sais pas" as WorkPeriodSlices,
  workPeriodForFloors: "Je ne sais pas" as WorkPeriodSlices,
  windowMaterial: "Aluminium" as WindowMaterialType,
  glazingType: "Double vitrage ancien (plus de 25 ans)" as GlazingType,
  selectedEnergyType: "Electricité" as EnergyType,
  selectedHeatingType: "Convecteurs électriques" as HeatingType,
  hotWaterProductType: "Ballon électrique" as HotWaterProductType,
  ventilationType: "Ventilation naturelle" as VentilationType,
  energyLabelSolutionsType: "Balanced" as EnergyLabelSolutionsType,
  iziResponse: null,
};

export const EnergyFormContext = createContext<EnergyFormType | null>(null);

export default function EnergyFormContextProvider({ children }: useCustomHook) {
  const [isEnergyFormDisplayed, setIsEnergyFormDisplayed] = useState(
    initialState.isEnergyFormDisplayed
  );
  const [currentEnergyFormPage, setCurrentEnergyFormPage] = useState(
    initialState.currentEnergyFormPage
  );
  const [selectedProperty, setSelectedProperty] = useState<PropertyType>(
    initialState.selectedProperty
  );
  const [energyFormGotOpened, setEnergyFormGotOpened] = useState(
    initialState.energyFormGotOpened
  );
  const [constructionDate, setConstructionDate] = useState(
    initialState.constructionDate
  );
  const [projectAddress, setProjectAddress] = useState(
    initialState.projectAddress
  );
  const [livingArea, setLivingArea] = useState(initialState.livingArea);
  const [averageAnnualIncome, setAverageAnnualIncome] = useState(
    initialState.averageAnnualIncome
  );
  const [residentsNumber, setResidentsNumber] = useState(
    initialState.residentsNumber
  );
  const [workPeriodForWalls, setWorkPeriodForWalls] =
    useState<WorkPeriodSlices>(initialState.workPeriodForWalls);
  const [workPeriodForFloors, setWorkPeriodForFloors] =
    useState<WorkPeriodSlices>(initialState.workPeriodForFloors);
  const [windowMaterial, setWindowMaterial] = useState(
    initialState.windowMaterial
  );
  const [glazingType, setGlazingType] = useState(initialState.glazingType);
  const [selectedEnergyType, setSelectedEnergyType] = useState(
    initialState.selectedEnergyType
  );
  const [selectedHeatingType, setSelectedHeatingType] = useState(
    initialState.selectedHeatingType
  );
  const [hotWaterProductType, setHotWaterProductType] = useState(
    initialState.hotWaterProductType
  );
  const [ventilationType, setVentilationType] = useState(
    initialState.ventilationType
  );
  const [energyLabelSolutionsType, setEnergyLabelSolutionsType] =
    useState<EnergyLabelSolutionsType>(initialState.energyLabelSolutionsType);
  const [iziResponse, setIziResponse] = useState(initialState.iziResponse);
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
    setVentilationType(initialState.ventilationType);
    setEnergyLabelSolutionsType(initialState.energyLabelSolutionsType);
    setIziResponse(initialState.iziResponse);
  };

  const getEnergyFormState = () => {
    return {
      isEnergyFormDisplayed,
      currentEnergyFormPage,
      selectedProperty,
      energyFormGotOpened,
      constructionDate,
      projectAddress,
      livingArea,
      averageAnnualIncome,
      residentsNumber,
      workPeriodForWalls,
      workPeriodForFloors,
      windowMaterial,
      glazingType,
      selectedEnergyType,
      selectedHeatingType,
      hotWaterProductType,
      ventilationType,
      energyLabelSolutionsType,
      iziResponse,
    };
  };

  const getFormattedEnergyFormState = () => {
    return {
      "Sa surface habitable (m²) :": livingArea,
      "L'année de construction du logement :": [constructionDate],
      "Sa forme :": ["Rectangulaire allongée"], // This is a placeholder, replace with actual value if available
      "Le nombre de niveaux habités :": ["1"], // This is a placeholder, replace with actual value if available
      "La maison est-elle mitoyenne ?": ["Non"], // This is a placeholder, replace with actual value if available
      "Avez-vous déjà effectué des travaux d'isolation de vos murs ?": [
        workPeriodForWalls === "Pas de travaux"
          ? "Je ne sais pas"
          : workPeriodForWalls,
      ],
      "Le type de toiture :": ["Toit terrasse"], // This is a placeholder, replace with actual value if available
      "Avez-vous déjà effectué des travaux d'isolation de votre toiture ?": [
        "Pas de travaux", // This is a placeholder, replace with actual value if available
      ],
      "Quel est votre type de planchers bas ?": ["Terre plein"], // This is a placeholder, replace with actual value if available
      "Avez-vous déjà effectué des travaux d'isolation de vos planchers bas ?":
        [
          workPeriodForFloors === "Pas de travaux"
            ? "Je ne sais pas"
            : workPeriodForFloors,
        ],
      "Comment est le vitrage de vos fenêtres ?": [glazingType],
      "Quel est le matériau de vos fenêtres ?": [windowMaterial],
      "Quelle est la source d'énergie de chauffage principale ?": [
        selectedEnergyType,
      ],
      "Le type d'appareil de votre chauffage principal :": [
        selectedHeatingType,
      ],
      "Quel appareil produit votre eau chaude sanitaire ?": [
        hotWaterProductType,
      ],
      "Possédez-vous un second type de chauffage ?": ["Non"], // This is a placeholder, replace with actual value if available
      "Quel est le type de ventilation ?": [ventilationType],
      "Par rapport au logement, vous êtes ?": [
        "Propriétaire résidence principale", // This is a placeholder, replace with actual value if available
      ],
      "Vous habitez": ["En Ile de France"], // This is a placeholder, replace with actual value if available
      "Nombre d'habitants composant votre foyer fiscal": [
        residentsNumber.toString(),
      ],
      "Revenu annuel moyen de votre foyer fiscal": [
        averageAnnualIncome.toString(), // This is a placeholder, replace with actual value if available
      ],
      "Code Postal": projectAddress, // Assuming projectAddress contains postal code
    };
  };

  return (
    <EnergyFormContext.Provider
      value={{
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
        energyLabelSolutionsType,
        setEnergyLabelSolutionsType,
        resetEnergyForm, // Expose la fonction reset
        getEnergyFormState, // Expose la fonction pour obtenir l'état actuel du formulaire
        getFormattedEnergyFormState, // Expose la fonction pour obtenir l'état actuel du formulaire formaté
        iziResponse,
        setIziResponse,
      }}
    >
      {children}
    </EnergyFormContext.Provider>
  );
}

export function useEnergyFormContext() {
  const context = useContext(EnergyFormContext);
  if (!context) {
    throw new Error(
      "useEnergyFormContext must be used within EnergyFormContextProvider"
    );
  }
  return context;
}
