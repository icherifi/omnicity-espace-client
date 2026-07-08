"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import EnergyMixSolutions from "@/components/energy/EnergyMixSolutions";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";

interface SimulationResultsProps {
  address: string;
  selectedData: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  };
  simulationResults: any;
  onBackToMap: () => void;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function SimulationResults({
  address,
  selectedData,
  simulationResults,
  onBackToMap,
  onSuccess,
  onError,
}: SimulationResultsProps) {
  const {
    setSimulationResults,
    setSelectedAddress,
    setSelectedData,
    setSimulationCompleted,
  } = useSimulationResultsContext();

  // Update context when component receives new data
  useEffect(() => {
    if (simulationResults) {
      setSimulationResults(simulationResults);
      setSimulationCompleted(true);
    }
    if (address) {
      setSelectedAddress(address);
    }
    if (selectedData) {
      setSelectedData(selectedData);
    }
    console.log("SimulationResults component updated context with new data:", {
      simulationResults,
      address,
      selectedData,
    });
  }, [
    simulationResults,
    address,
    selectedData,
    setSimulationResults,
    setSelectedAddress,
    setSelectedData,
    setSimulationCompleted,
  ]);
  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
          🎉 Simulation terminée avec succès !
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adresse: <span className="font-medium">{address}</span>
        </p>
        <p className="text-sm text-gray-500">
          Coordonnées: {selectedData.latitude?.toFixed(6)},{" "}
          {selectedData.longitude?.toFixed(6)} | BAN ID: {selectedData.banId}
        </p>
      </div>

      {simulationResults?.bouquets && simulationResults.bouquets.length > 0 ? (
        <EnergyMixSolutions
          bouquets={simulationResults.bouquets}
          onSuccess={onSuccess}
          onError={onError}
        />
      ) : (
        <div className="text-center p-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 font-medium text-lg mb-2">
            ⚠️ Aucun bouquet énergétique disponible
          </p>
          <p className="text-yellow-600 dark:text-yellow-300 text-sm mb-4">
            Les résultats de simulation ne contiennent pas de solutions
            énergétiques.
          </p>
          <Button
            onClick={onBackToMap}
            variant="outline"
            className="bg-white dark:bg-gray-800"
          >
            Retour à la carte
          </Button>
        </div>
      )}

      {simulationResults?.bouquets && simulationResults.bouquets.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button onClick={onBackToMap} variant="outline" className="mr-4">
            Retour à la carte
          </Button>
        </div>
      )}
    </div>
  );
}
