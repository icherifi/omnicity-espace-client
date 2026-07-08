import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProjectForm } from "@/hooks/useProjectForm";
import { ProjectService } from "@/services/project.service";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";
import EnergyMixSolutions, {
  EnergyMixSolutionsType,
} from "@/components/energy/EnergyMixSolutions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EnergyMix } from "@/types/project.types";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";
import { X } from "lucide-react";
import Image from "next/image";
import {
  fetchDpeData,
  KelvinDpeData,
  runCompleteSimulation,
} from "@/utils/kelvinApi";
import DpeResults from "@/components/forms/DpeResults";
import KelvinMapComponent from "@/components/forms/KelvinMapComponent";
import { useKelvinSimulation } from "@/hooks/useKelvinSimulation";

interface Props {
  onError?: (error: string) => void;
  onSuccess?: () => void;
  onQuit?: () => void;
}

const cleanDpeNumber = (value: string): string => {
  return value.replace(/[^A-Za-z0-9]/g, "").trim();
};

const isValidDpeNumber = (value: string): boolean => {
  const cleaned = cleanDpeNumber(value);
  return cleaned.length >= 10;
};

export default function NewProjectDpeNumberForm({
  onError,
  onSuccess,
  onQuit,
}: Props) {
  const { errors, isFormValid, onFieldChange, getDpeFormData } =
    useProjectForm("dpe");

  const [isLoading, setIsLoading] = useState(false);
  const [dpeData, setDpeData] = useState<any>(null);
  const [kelvinDpeData, setKelvinDpeData] = useState<KelvinDpeData | null>(
    null,
  );
  const [showEnergySolutions, setShowEnergySolutions] = useState(false);
  const [showDpeResults, setShowDpeResults] = useState(false);
  const [showMapSelection, setShowMapSelection] = useState(false);
  const [dpeNumber, setDpeNumber] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");
  const [isPasting, setIsPasting] = useState(false);
  const [selectedMapData, setSelectedMapData] = useState<{
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  }>({});

  const { setIsEnergyLabelSolutionsDisplayed } = useSimulationResultsContext();
  const { refreshProjects, projects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const {
    loading: simulationLoading,
    runSimulation,
    formatResultsForEnergyMix,
  } = useKelvinSimulation();

  const handleDpeSubmit = async (overrideDpeNumber?: string) => {
    try {
      setIsLoading(true);
      const formData = getDpeFormData();
      const dpeNumber = overrideDpeNumber || formData.dpeInformation.dpeNumber;

      // Récupérer les vraies données DPE via l'API Kelvin
      const dpeApiData = await fetchDpeData(dpeNumber);

      if (dpeApiData) {
        setKelvinDpeData(dpeApiData);
        setShowDpeResults(true);
      } else {
        onError?.("DPE non trouvé. Vérifiez le numéro saisi.");
      }
    } catch (e: any) {
      console.error("Erreur dans handleDpeSubmit", e);
      onError?.(
        e.message || "Une erreur est survenue lors de l'analyse du DPE",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitWithDpeNumber = async () => {
    const cleanedDpeNumber = cleanDpeNumber(dpeNumber);

    if (!cleanedDpeNumber) {
      setValidationError("Veuillez entrer un numéro de DPE valide");
      return;
    }

    if (!isValidDpeNumber(cleanedDpeNumber)) {
      setValidationError("Le numéro de DPE doit contenir au moins 10 chiffres");
      return;
    }

    setValidationError("");
    onFieldChange("dpeInformation.dpeNumber", cleanedDpeNumber);
    await handleDpeSubmit(cleanedDpeNumber);
  };

  const handleConfirmDpeResults = async (dpeData: KelvinDpeData) => {
    console.log("🎯 Confirmation DPE, passage à la sélection de parcelle");

    // Passer à l'étape carte pour sélectionner la parcelle
    setShowDpeResults(false);
    setShowMapSelection(true);
  };

  const handleBackToDpeForm = () => {
    setShowDpeResults(false);
    setKelvinDpeData(null);
  };

  const handleMapSelection = (data: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  }) => {
    setSelectedMapData(data);
  };

  const handleConfirmMapSelection = async () => {
    if (
      !selectedMapData.latitude ||
      !selectedMapData.longitude ||
      !selectedMapData.banId ||
      !kelvinDpeData
    ) {
      onError?.("Veuillez sélectionner un bâtiment sur la carte");
      return;
    }

    try {
      setIsLoading(true);

      console.log("🎯 Lancement simulation avec données DPE et coordonnées");

      // Exécuter la simulation avec les coordonnées
      const rawResults = await runSimulation({
        latitude: selectedMapData.latitude,
        longitude: selectedMapData.longitude,
        banId: selectedMapData.banId,
        address: selectedMapData.address,
        inputAddress: kelvinDpeData.address,
      });

      // Formater les résultats pour EnergyMixSolutions
      const formattedResults = formatResultsForEnergyMix(
        rawResults,
        kelvinDpeData.address,
        selectedMapData,
      );

      setDpeData(formattedResults);
      setShowMapSelection(false);
      setShowEnergySolutions(true);
      setIsEnergyLabelSolutionsDisplayed(true);

      console.log(
        "✅ Simulation terminée, affichage des solutions énergétiques",
      );
    } catch (e: any) {
      console.error("Erreur lors de la simulation:", e);
      onError?.(
        e.message ||
          "Une erreur est survenue lors de la simulation énergétique",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMap = () => {
    setShowEnergySolutions(false);
    setShowMapSelection(true);
    setIsEnergyLabelSolutionsDisplayed(false);
  };

  const handleBackToDpeResults = () => {
    setShowMapSelection(false);
    setShowDpeResults(true);
    setSelectedMapData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPasting) return;

    const value = e.target.value;
    setDpeNumber(value);
    setValidationError("");
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setIsPasting(true);

    const pastedValue = e.clipboardData.getData("text");
    const cleanedValue = cleanDpeNumber(pastedValue);
    setDpeNumber(cleanedValue);
    setValidationError("");

    setTimeout(() => setIsPasting(false), 100);
  };

  if (showEnergySolutions && dpeData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 border-b">
          <button
            onClick={handleBackToMap}
            className="text-primary hover:text-primary/80 font-medium"
            disabled={isLoading}
          >
            ← Retour à la sélection de parcelle
          </button>
        </div>
        <EnergyMixSolutions
          initialData={{
            bouquets: dpeData.energyResults?.bouquets || [],
            dpeData: dpeData.dpeData,
          }}
        />
      </div>
    );
  }

  if (showDpeResults && kelvinDpeData) {
    return (
      <DpeResults
        dpeData={kelvinDpeData}
        onConfirm={handleConfirmDpeResults}
        onBack={handleBackToDpeForm}
        loading={isLoading}
      />
    );
  }

  if (showMapSelection && kelvinDpeData) {
    return (
      <KelvinMapComponent
        address={kelvinDpeData.address}
        selectedData={selectedMapData}
        loading={simulationLoading || isLoading}
        onSelectionChange={handleMapSelection}
        onConfirmSelection={handleConfirmMapSelection}
        onBackToAddress={handleBackToDpeResults}
      />
    );
  }

  const cleanedDpeNumber = cleanDpeNumber(dpeNumber);
  const isFormValidForSubmit =
    cleanedDpeNumber && isValidDpeNumber(cleanedDpeNumber);

  return (
    <div className="min-h-0 bg-background text-foreground flex flex-col">
      <header className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="omnicity logo" width={32} height={32} />
        </div>
        <h1 className="text-primary font-bold text-lg hidden md:block">
          Améliorer la performance énergétique de mon logement
        </h1>
        <button
          className="text-primary font-medium hover:text-primary/80 flex items-center"
          onClick={() => onQuit?.()}
        >
          <X className="h-5 w-5 mr-1" /> Quitter
        </button>
      </header>

      <div className="flex flex-1">
        <main className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-primary text-center">
              Entrez votre numéro de DPE
            </h2>

            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <input
                type="text"
                value={dpeNumber}
                onChange={handleInputChange}
                onPaste={handleInputPaste}
                placeholder="Numéro de DPE"
                className={`border w-1/2 rounded-[12px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  validationError ? "border-red-500" : ""
                }`}
              />
              {validationError && (
                <p className="text-red-500 text-sm mt-1">{validationError}</p>
              )}
              <button
                onClick={handleSubmitWithDpeNumber}
                disabled={!isFormValidForSubmit || isLoading}
                className={`bg-primary w-1/2 text-primary-foreground px-6 py-3 rounded-md font-medium mt-4
                  ${!isFormValidForSubmit || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"}`}
              >
                {isLoading ? <LoadingSpinner /> : "Continuer"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
