import React, { useEffect, useState } from "react";
import { useDesignPageContext } from "@/contexts/designPage.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import { Bouquet } from "@/types/project.types";
import StrategyButton from "./components/StrategyButton";
import EnergyLabelTypeCard from "./components/EnergyLabelTypeCard";

export type EnergyLabelSolutionsType = "Simplicity" | "Balanced" | "Efficient";

export const STRATEGY_OPTIONS = [
  {
    type: "Simplicity" as EnergyLabelSolutionsType,
    label: "Simplicité",
    description: "Solution simple et accessible",
  },
  {
    type: "Balanced" as EnergyLabelSolutionsType,
    label: "Équilibrée",
    description: "Compromis optimal",
  },
  {
    type: "Efficient" as EnergyLabelSolutionsType,
    label: "Performante",
    description: "Performance maximale",
  },
];

const selectBouquetForStrategy = (
  bouquets: Bouquet[],
  strategy: EnergyLabelSolutionsType
): Bouquet | null => {
  if (!bouquets?.length) return null;

  const validBouquets = bouquets.filter(Boolean);
  if (!validBouquets.length) return null;

  const sortedByLabelAsc = [...validBouquets].sort((a, b) =>
    a.etiquette!.localeCompare(b.etiquette!)
  );

  switch (strategy) {
    case "Simplicity":
      return sortedByLabelAsc[sortedByLabelAsc.length - 1] || null;
    case "Balanced":
      const middleIndex = Math.floor(sortedByLabelAsc.length / 2);
      return sortedByLabelAsc[middleIndex] || sortedByLabelAsc[0] || null;
    case "Efficient":
      return sortedByLabelAsc[0] || null;
    default:
      return null;
  }
};

export function EnergyLabelSolutions() {
  const quizResults = localStorage.getItem("quizResults");
  const quizResultsData = JSON.parse(quizResults || "{}");
  const { setCostEstimation } = useDesignPageContext();
  const { 
    setIsEnergyLabelSolutionsDisplayed, 
    setEnergyFormCompleted, 
    setIsEnergyFormDisplayed, 
    sessionId 
  } = useEnergyFormContext();

  const [selectedStrategy, setSelectedStrategy] = useState<EnergyLabelSolutionsType>("Balanced");
  const selectedBouquet = selectBouquetForStrategy(quizResultsData.bouquets, selectedStrategy);

  const availableStrategies = STRATEGY_OPTIONS.filter((option, index) => {
    const validBouquets = quizResultsData.bouquets?.filter(Boolean) || [];
    switch (option.type) {
      case "Simplicity":
        return validBouquets.length >= 1;
      case "Balanced":
        return validBouquets.length >= 2;
      case "Efficient":
        return validBouquets.length >= 1;
      default:
        return false;
    }
  });

  useEffect(() => {
    if (!availableStrategies.find(s => s.type === selectedStrategy)) {
      setSelectedStrategy(availableStrategies[0]?.type || "Balanced");
    }
  }, [availableStrategies]);

  useEffect(() => {
    if (!selectedBouquet) return;

    const newEstimation = {
      withAid: Math.floor(selectedBouquet.resteACharge),
      withoutAid: Math.floor(selectedBouquet.coutTotal),
    };

    setCostEstimation(prev => {
      if (prev.withAid === newEstimation.withAid && prev.withoutAid === newEstimation.withoutAid) {
        return prev;
      }
      return newEstimation;
    });
  }, [selectedBouquet, setCostEstimation]);

  const handleFinish = async () => {
    try {
      if (!sessionId || !selectedBouquet) {
        console.error("Session ou bouquet manquant");
        return;
      }

      await saveEnergyChoice(sessionId, selectedStrategy, selectedBouquet);
      setIsEnergyLabelSolutionsDisplayed(false);
      setEnergyFormCompleted(true);
      setIsEnergyFormDisplayed(false);
    } catch (err) {
      console.error("Erreur enregistrement bouquet:", err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-semibold text-xl">
        Des options pour optimiser votre classification énergétique
      </h1>
      
      <div className="flex mt-4 items-center justify-around space-x-2 w-4/5">
        {availableStrategies.map((option) => (
          <StrategyButton
            key={option.type}
            option={option}
            isSelected={selectedStrategy === option.type}
            onClick={() => setSelectedStrategy(option.type)}
          />
        ))}
      </div>

      {selectedBouquet ? (
        <>
          <EnergyLabelTypeCard
            energyLabelSolutionsType={selectedStrategy}
            bouquet={selectedBouquet}
            initialState={quizResultsData}
          />
          <button 
            onClick={handleFinish}
            className="mt-4 px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 font-semibold"
          >
            Terminer
          </button>
        </>
      ) : (
        <p className="mt-4 text-red-500 font-semibold">
          Aucun bouquet ne correspond à la stratégie "{
            STRATEGY_OPTIONS.find(opt => opt.type === selectedStrategy)?.label
          }".
        </p>
      )}
    </div>
  );
}

export default EnergyLabelSolutions;
