"use client";

import React, { useState } from "react";
import AddressForm from "./AddressForm";
import KelvinMapComponent from "./KelvinMapComponent";
import InitialState from "./InitialState";
import SimulationResults from "./SimulationResults";
import { useKelvinSimulation } from "../../hooks/useKelvinSimulation";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";
import {
  KelvinInitialStateResponse,
  KelvinProjectedStateResponse,
} from "@/types/simulation.types";
import { saveEnergyChoiceWithKelvinData } from "@/utils/handleEnergyChoiceData";
import {
  validateBeforeSave,
  formatValidationErrors,
  logValidationWarnings,
} from "@/utils/validationUtils";

interface AddressOnlyFormProps {
  projectId?: string;
  onSuccess: (results?: any) => void;
  onError: (error: string) => void;
  onQuit: () => void;
}

type FormStep = "address" | "map" | "initial" | "results";

interface SelectedData {
  latitude?: number;
  longitude?: number;
  banId?: string;
  address?: any;
}

export default function AddressOnlyForm({
  projectId,
  onSuccess,
  onError,
  onQuit,
}: AddressOnlyFormProps) {
  // Context
  const {
    initialState,
    setInitialState,
    projectedState,
    setProjectedState,
    setSimulationResults,
    setSelectedAddress,
    setSelectedData,
    setSimulationCompleted,
    sessionId,
    setSessionId,
  } = useSimulationResultsContext();

  // États de l'interface
  const [currentStep, setCurrentStep] = useState<FormStep>("address");
  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedData, setLocalSelectedData] = useState<SelectedData>({});
  const [initialStateLoading, setInitialStateLoading] = useState(false);
  const [simulationResults, setLocalSimulationResults] = useState<any>(null);

  // Hook de simulation Kelvin
  const {
    loading: simulationLoading,
    runSimulation,
    formatResultsForEnergyMix,
  } = useKelvinSimulation();

  // État local pour le projectId effectif
  const [effectiveProjectId, setEffectiveProjectId] = useState<string>("");

  // Initialiser le sessionId avec l'id du projet
  React.useEffect(() => {
    if (projectId) {
      // Utiliser directement le projectId fourni
      setSessionId(projectId);
      setEffectiveProjectId(projectId);
      console.log("📝 Utilisation du projectId:", projectId);
    } else {
      // Erreur si aucun projectId n'est fourni
      onError("Aucun projectId fourni pour la simulation");
      return;
    }
  }, [projectId, setSessionId, onError]);

  // Gestionnaires d'événements
  const handleAddressSubmit = async (submittedAddress: string) => {
    setAddressLoading(true);

    try {
      // Simuler un délai de validation d'adresse
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Adresse validée:", submittedAddress);

      // Passer à l'étape carte
      setCurrentStep("map");
    } catch (error) {
      console.error("Erreur lors de la validation de l'adresse:", error);
      onError("Une erreur est survenue lors de la validation de l'adresse");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleMapSelection = (data: SelectedData) => {
    setLocalSelectedData(data);
    setSelectedData(data); // Update context
  };

  const handleConfirmSelection = async () => {
    if (
      !selectedData.latitude ||
      !selectedData.longitude ||
      !selectedData.banId
    ) {
      onError("Veuillez sélectionner un bâtiment sur la carte");
      return;
    }

    try {
      setInitialStateLoading(true);

      // Exécuter la simulation
      const rawResults = await runSimulation({
        latitude: selectedData.latitude,
        longitude: selectedData.longitude,
        banId: selectedData.banId,
        address: selectedData.address,
        inputAddress: address,
      });

      // Récupérer l'état initial et l'état projeté si on a un simulationId
      const simulationId = rawResults?.simulation?.simulation_id;
      let initialStateData: KelvinInitialStateResponse | null = null;
      let projectedStateData: KelvinProjectedStateResponse | null = null;

      if (simulationId) {
        try {
          // Récupérer l'état initial
          const initialStateResponse = await fetch(
            `/api/kelvin/simulation/${simulationId}/initial-state`,
          );
          if (initialStateResponse.ok) {
            initialStateData = await initialStateResponse.json();
            setInitialState(initialStateData);
          }

          // Récupérer l'état projeté
          const projectedStateResponse = await fetch(
            `/api/kelvin/simulation/${simulationId}/projected-state`,
          );
          if (projectedStateResponse.ok) {
            projectedStateData = await projectedStateResponse.json();
            setProjectedState(projectedStateData);
          }
        } catch (apiError) {
          console.warn(
            "Erreur lors de la récupération des états Kelvin:",
            apiError,
          );
        }
      }

      // Formater les résultats pour EnergyMixSolutions
      const formattedResults = formatResultsForEnergyMix(
        rawResults,
        address,
        selectedData,
      );

      setLocalSimulationResults(formattedResults);
      setSimulationResults(formattedResults); // Update context

      // Aller vers l'état initial si disponible, sinon directement aux résultats
      if (initialStateData) {
        setCurrentStep("initial");
      } else {
        setCurrentStep("results");
      }

      console.log("✅ Interface des résultats activée");
    } catch (error: any) {
      console.error("💥 Erreur lors du processus de simulation:", error);
      onError(error.message);
    } finally {
      setInitialStateLoading(false);
    }
  };

  // Navigation entre les étapes
  const handleBackToAddress = () => {
    setCurrentStep("address");
    setLocalSelectedData({});
    setInitialState(null);
    setProjectedState(null);
    setLocalSimulationResults(null);
    setSelectedData({});
    setSimulationResults(null);
  };

  const handleBackToMap = () => {
    setCurrentStep("map");
    setInitialState(null);
    setProjectedState(null);
    setLocalSimulationResults(null);
    setSimulationResults(null);
  };

  const handleContinueToResults = () => {
    setCurrentStep("results");
  };

  const handleBackToInitial = () => {
    if (initialState) {
      setCurrentStep("initial");
    } else {
      handleBackToMap();
    }
  };

  // Rendu conditionnel selon l'étape
  return (
    <div className="w-full max-w-4xl mx-auto">
      {currentStep === "address" && (
        <AddressForm
          address={address}
          loading={addressLoading}
          onAddressChange={setAddress}
          onSubmit={handleAddressSubmit}
          onQuit={onQuit}
        />
      )}

      {currentStep === "map" && (
        <KelvinMapComponent
          address={address}
          selectedData={selectedData}
          loading={simulationLoading || initialStateLoading}
          onSelectionChange={handleMapSelection}
          onConfirmSelection={handleConfirmSelection}
          onBackToAddress={handleBackToAddress}
        />
      )}

      {currentStep === "initial" && initialState && (
        <InitialState
          initialState={initialState}
          address={address}
          onContinue={handleContinueToResults}
          onBack={handleBackToMap}
        />
      )}

      {currentStep === "results" && (
        <SimulationResults
          address={address}
          selectedData={selectedData}
          simulationResults={simulationResults}
          onBackToMap={initialState ? handleBackToInitial : handleBackToMap}
          onSuccess={onSuccess}
          onError={onError}
        />
      )}
    </div>
  );
}
