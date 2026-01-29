"use client";

import React, { useState } from "react";
import AddressForm from "./AddressForm";
import KelvinMapComponent from "./KelvinMapComponent";
import SimulationResults from "./SimulationResults";
import { useKelvinSimulation } from "../../hooks/useKelvinSimulation";

interface AddressOnlyFormProps {
  projectId?: string;
  onSuccess: (results?: any) => void;
  onError: (error: string) => void;
  onQuit: () => void;
}

type FormStep = "address" | "map" | "results";

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
  // États de l'interface
  const [currentStep, setCurrentStep] = useState<FormStep>("address");
  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedData, setSelectedData] = useState<SelectedData>({});
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Hook de simulation Kelvin
  const {
    loading: simulationLoading,
    runSimulation,
    formatResultsForEnergyMix,
  } = useKelvinSimulation();

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
    setSelectedData(data);
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
      // Exécuter la simulation
      const rawResults = await runSimulation({
        latitude: selectedData.latitude,
        longitude: selectedData.longitude,
        banId: selectedData.banId,
        address: selectedData.address,
        inputAddress: address,
      });

      // Formater les résultats pour EnergyMixSolutions
      const formattedResults = formatResultsForEnergyMix(
        rawResults,
        address,
        selectedData,
      );

      // Afficher les résultats
      setSimulationResults(formattedResults);
      setCurrentStep("results");

      console.log("✅ Interface des résultats activée");
    } catch (error: any) {
      console.error("💥 Erreur lors du processus de simulation:", error);
      onError(error.message);
    }
  };

  const handleResultsFinish = (selectedBouquet: any, selectedStrategy: any) => {
    console.log("🎯 Bouquet énergétique sélectionné:", selectedBouquet);
    console.log("🎯 Stratégie sélectionnée:", selectedStrategy);

    // Finaliser avec tous les résultats incluant la sélection énergétique
    const completeResults = {
      ...simulationResults,
      selectedEnergyMix: selectedBouquet,
      selectedStrategy: selectedStrategy,
      // Ajouter les données originales de la simulation pour référence
      originalSimulationData: {
        selection: {
          latitude: selectedData.latitude,
          longitude: selectedData.longitude,
          banId: selectedData.banId,
          address: selectedData.address,
          inputAddress: address,
        },
      },
    };

    console.log("✅ PROCESSUS TERMINÉ - Résultats complets:", completeResults);
    onSuccess(completeResults);
  };

  // Navigation entre les étapes
  const handleBackToAddress = () => {
    setCurrentStep("address");
    setSelectedData({});
  };

  const handleBackToMap = () => {
    setCurrentStep("map");
    setSimulationResults(null);
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
          loading={simulationLoading}
          onSelectionChange={handleMapSelection}
          onConfirmSelection={handleConfirmSelection}
          onBackToAddress={handleBackToAddress}
        />
      )}

      {currentStep === "results" && (
        <SimulationResults
          address={address}
          selectedData={selectedData}
          simulationResults={simulationResults}
          onBackToMap={handleBackToMap}
          onFinish={handleResultsFinish}
        />
      )}
    </div>
  );
}
