"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { KelvinInitialStateResponse } from "@/types/simulation.types";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";
import { updateProject } from "@/utils/handleProjectDetails";
import InitialStateDiagnosticsDisplay from "./InitialStateDiagnosticsDisplay";

interface InitialStateProps {
  initialState: KelvinInitialStateResponse;
  address: string;
  onContinue: () => void;
  onBack: () => void;
}

export default function InitialState({
  initialState,
  address,
  onContinue,
  onBack,
}: InitialStateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { sessionId } = useSimulationResultsContext();

  // Extraire les informations de l'état initial
  const data = initialState?.initial_state || {};

  const formatSurface = (surface: number) => {
    if (!surface) return "Non spécifiée";
    return `${surface} m²`;
  };

  const formatYear = (year: number) => {
    if (!year) return "Inconnue";
    return year.toString();
  };

  const formatEnergyClass = (energyClass: string) => {
    if (!energyClass) return "Non spécifiée";
    return energyClass.toUpperCase();
  };

  const formatCost = (costRange: any) => {
    if (!costRange || !costRange.min || !costRange.max) return "Non spécifié";
    return `${costRange.min}€ - ${costRange.max}€`;
  };

  const formatConsumption = (consumption: number) => {
    if (!consumption) return "Non spécifiée";
    return `${consumption} kWh/m²/an`;
  };

  const formatPercentage = (percentage: number) => {
    if (percentage === undefined || percentage === null) return "Non spécifié";
    return `${Math.round(percentage * 100)}%`;
  };

  const formatEnergyType = (type: string) => {
    const types = {
      gas: "Gaz",
      electricity: "Électricité",
      fuel: "Fioul",
      wood: "Bois",
      boiler: "Chaudière",
    };
    return types[type as keyof typeof types] || type || "Non spécifié";
  };

  const formatInsulation = (level: string) => {
    const levels = {
      very_good: "Très bonne",
      good: "Bonne",
      middle_class: "Moyenne",
      low: "Faible",
      very_low: "Très faible",
    };
    return levels[level as keyof typeof levels] || level || "Non spécifiée";
  };

  const handleContinue = async () => {
    try {
      setIsLoading(true);

      if (!sessionId) {
        console.error("Session ID manquante");
        throw new Error("Session ID manquante");
      }

      console.log("💾 Mise à jour du projet avec l'état initial...");
      const updateRes = await updateProject(sessionId, {
        initial_state: initialState,
      });

      if (!updateRes) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }

      console.log("✅ État initial sauvegardé avec succès");
      onContinue();
    } catch (error) {
      console.error(
        "❌ Erreur lors de la sauvegarde de l'état initial:",
        error,
      );
      alert(
        error instanceof Error
          ? error.message
          : "Erreur lors de la sauvegarde de l'état initial",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <InitialStateDiagnosticsDisplay initialState={data} address={address} />

      {/* Boutons d'action */}
      <div className="flex justify-between pt-6">
        <Button onClick={onBack} variant="outline" className="px-6">
          ← Retour à la carte
        </Button>
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          className={`px-6 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-2">⏳</div>
              Enregistrement...
            </>
          ) : (
            "Continuer vers les résultats →"
          )}
        </Button>
      </div>
    </div>
  );
}
