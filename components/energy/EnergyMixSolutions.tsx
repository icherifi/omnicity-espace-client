import React, { useEffect, useState } from "react";
import { useDesignPageContext } from "@/contexts/designPage.context";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import { EnergyMix } from "@/types/project.types";
import EnergyLabelTypeCard from "./components/EnergyLabelTypeCard";
import { updateProject } from "@/utils/handleProjectDetails";

export type EnergyMixSolutionsType = "Simplicity" | "Balanced" | "Efficient";

export const STRATEGY_OPTIONS = [
  {
    type: "Simplicity" as EnergyMixSolutionsType,
    label: "Simplicité",
    description: "Solution simple et accessible",
  },
  {
    type: "Balanced" as EnergyMixSolutionsType,
    label: "Équilibré",
    description: "Compromis optimal",
  },
  {
    type: "Efficient" as EnergyMixSolutionsType,
    label: "Optimal",
    description: "Performance maximale",
  },
];

const selectEnergyMixForStrategy = (
  bouquets: EnergyMix[],
  strategy: EnergyMixSolutionsType,
): EnergyMix | null => {
  if (!bouquets?.length) return null;

  // Filtrer les bouquets non-null et les trier par prix (resteACharge)
  const validBouquets = bouquets
    .filter(Boolean)
    .sort((a, b) => a.resteACharge - b.resteACharge);

  if (validBouquets.length === 0) return null;

  // Si on a 3 bouquets : le moins cher = Simplicity, le plus cher = Efficient, le milieu = Balanced
  // Si on a 2 bouquets : le moins cher = Simplicity, le plus cher = Balanced
  // Si on a 1 bouquet : il devient Balanced par défaut

  switch (strategy) {
    case "Simplicity":
      return validBouquets[0] || null;
    case "Balanced":
      if (validBouquets.length === 1) {
        return validBouquets[0] || null;
      } else if (validBouquets.length === 2) {
        return validBouquets[1] || null; // Le plus cher des 2
      } else {
        return validBouquets[1] || null; // Le milieu des 3
      }
    case "Efficient":
      if (validBouquets.length >= 3) {
        return validBouquets[2] || null; // Le plus cher des 3
      }
      return null; // Pas d'Efficient si moins de 3 bouquets
    default:
      return null;
  }
};

interface EnergyMixSolutionsProps {
  bouquets: any;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function EnergyMixSolutions({
  bouquets,
  onSuccess,
  onError,
}: EnergyMixSolutionsProps) {
  const { setCostEstimation } = useDesignPageContext();
  const {
    setIsEnergyLabelSolutionsDisplayed,
    setSimulationCompleted,
    sessionId,
    simulationResults,
    setSelectedBouquet,
    selectedStrategy,
    setSelectedStrategy,
    initialState,
  } = useSimulationResultsContext();

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bouquetsByStrategy = {
    Simplicity: selectEnergyMixForStrategy(bouquets, "Simplicity"),
    Balanced: selectEnergyMixForStrategy(bouquets, "Balanced"),
    Efficient: selectEnergyMixForStrategy(bouquets, "Efficient"),
  };

  // Filtrer les stratégies qui ont un bouquet disponible
  const availableStrategies = STRATEGY_OPTIONS.filter(
    (option) => bouquetsByStrategy[option.type] !== null,
  );

  // Sélectionner automatiquement "Équilibré" par défaut, sinon la première stratégie disponible
  const getDefaultStrategy = (): EnergyMixSolutionsType => {
    if (availableStrategies.length === 0) return "Balanced";

    // Priorité : Équilibré > Simplicité > Optimal
    const priorityOrder: EnergyMixSolutionsType[] = [
      "Balanced",
      "Simplicity",
      "Efficient",
    ];

    for (const strategy of priorityOrder) {
      if (availableStrategies.some((s) => s.type === strategy)) {
        return strategy;
      }
    }

    // Fallback sur la première stratégie disponible
    return availableStrategies[0].type;
  };

  const selectedEnergyMix =
    bouquetsByStrategy[selectedStrategy as EnergyMixSolutionsType];

  // Initialiser la stratégie par défaut si nécessaire
  useEffect(() => {
    if (
      !selectedStrategy ||
      !bouquetsByStrategy[selectedStrategy as EnergyMixSolutionsType]
    ) {
      setSelectedStrategy(getDefaultStrategy());
    }
  }, [availableStrategies.length, selectedStrategy, setSelectedStrategy]);

  useEffect(() => {
    if (!selectedEnergyMix) return;
    const newEstimation = {
      withAid: Math.floor(selectedEnergyMix.resteACharge),
      withoutAid: Math.floor(selectedEnergyMix.coutTotal),
    };
    setCostEstimation((prev) => {
      if (
        prev.withAid === newEstimation.withAid &&
        prev.withoutAid === newEstimation.withoutAid
      ) {
        return prev;
      }
      return newEstimation;
    });
  }, [selectedEnergyMix, setCostEstimation]);

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      if (!selectedEnergyMix || !sessionId) {
        throw new Error("Bouquet énergétique ou session manquante");
      }

      console.log(`🎯 Sélection finale:`);
      console.log(`📋 Stratégie: ${selectedStrategy}`);
      console.log(`💰 Coût total: ${selectedEnergyMix.coutTotal}€`);
      console.log(`💸 Reste à charge: ${selectedEnergyMix.resteACharge}€`);

      // Sauvegarder dans le contexte
      setSelectedBouquet(selectedEnergyMix);
      setSelectedStrategy(selectedStrategy);

      // Sauvegarder directement
      console.log("💾 Sauvegarde du bouquet énergétique...");
      const energyChoiceRes = await saveEnergyChoice(
        selectedStrategy,
        selectedEnergyMix,
      );
      console.log("✅ Bouquet sauvegardé avec succès");

      const updateRes = await updateProject(sessionId, {
        id_energy_choices: energyChoiceRes.id,
      });
      if (!updateRes) {
        throw new Error("Erreur lors de la mise à jour du projet");
      }

      setSimulationCompleted(true);
      setIsEnergyLabelSolutionsDisplayed(false);
      setSuccessMessage("✅ Votre sélection a été enregistrée avec succès!");
      onSuccess?.();

      // Fermer automatiquement après 2 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      const errorMsg =
        err.message || "Erreur lors de l'enregistrement du bouquet énergétique";
      console.error("❌ Erreur:", err);
      setErrorMessage(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const cardBase =
    "flex-1 mx-2 bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-300 flex flex-col items-center border-2 cursor-pointer min-w-[260px] max-w-[340px]";
  const cardSelected =
    "border-purple-300 dark:border-purple-200 !bg-purple-50 dark:!bg-purple-900/10 scale-105 z-10 shadow-xl ring-2 ring-purple-300 dark:ring-purple-200";
  const cardUnselected =
    "border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-90 hover:scale-102";

  return (
    <div className="flex flex-col items-center w-full">
      {availableStrategies.length === 1 && (
        <div className="text-center mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg max-w-2xl">
          <p className="text-blue-800 dark:text-blue-200 font-medium">
            Une seule solution optimale disponible pour votre projet
          </p>
          <p className="text-blue-600 dark:text-blue-300 text-sm mt-1">
            Basé sur vos données, nous avons identifié la meilleure approche
            pour votre situation.
          </p>
        </div>
      )}
      {availableStrategies.length === 0 ? (
        <div className="text-center mb-8 p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg max-w-2xl">
          <p className="text-red-800 dark:text-red-200 font-medium text-lg mb-2">
            Aucune solution disponible
          </p>
          <p className="text-red-600 dark:text-red-300 text-sm">
            Nous n'avons pas pu générer de solutions avec les données fournies.
            Veuillez vérifier vos informations ou contacter le support.
          </p>
        </div>
      ) : (
        <div className="flex flex-row justify-center items-stretch w-full max-w-5xl mb-8">
          {availableStrategies.map((option, idx) => {
            const isSelected = selectedStrategy === option.type;
            const bouquet = bouquetsByStrategy[option.type];
            const isSingleStrategy = availableStrategies.length === 1;
            return (
              <div
                key={option.type}
                className={
                  cardBase +
                  " " +
                  (isSelected ? cardSelected : cardUnselected) +
                  (availableStrategies.length === 2 && idx === 0
                    ? " mr-4"
                    : "") +
                  (availableStrategies.length === 2 && idx === 1
                    ? " ml-4"
                    : "") +
                  (isSingleStrategy ? " mx-auto cursor-default" : "")
                }
                style={{
                  minHeight: isSelected ? 600 : 520,
                  boxShadow: isSelected
                    ? "0 4px 32px rgba(167, 139, 250, 0.15)"
                    : undefined,
                  maxWidth: isSingleStrategy ? "400px" : undefined,
                }}
                onClick={
                  isSingleStrategy
                    ? undefined
                    : () =>
                        setSelectedStrategy(
                          option.type as EnergyMixSolutionsType,
                        )
                }
              >
                <div className="w-full flex flex-col items-center p-6">
                  <EnergyLabelTypeCard
                    energyLabelSolutionsType={option.type}
                    bouquet={bouquet!}
                    initialState={initialState}
                    isSelected={isSelected}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {availableStrategies.length > 0 && (
        <div className="flex flex-col w-full max-w-5xl gap-4">
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {successMessage}
              </p>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-medium">
                ❌ {errorMessage}
              </p>
            </div>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleFinish}
              disabled={!selectedEnergyMix || isLoading}
              className={`px-8 py-3 rounded-lg font-semibold text-white text-lg transition-colors duration-200 flex items-center gap-2 ${
                selectedEnergyMix && !isLoading
                  ? "bg-purple-300 dark:bg-purple-400 hover:bg-purple-400 dark:hover:bg-purple-500"
                  : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Enregistrement...
                </>
              ) : (
                "Suivant"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnergyMixSolutions;
