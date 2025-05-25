import React, { useEffect, useState } from "react";
import { useDesignPageContext } from "@/contexts/designPage.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import { EnergyMix } from "@/types/project.types";
import StrategyButton from "./components/StrategyButton";
import EnergyLabelTypeCard from "./components/EnergyLabelTypeCard";

export type EnergyMixSolutionsType = "Simplicity" | "Balanced" | "Efficient";

export const STRATEGY_OPTIONS = [
  {
    type: "Simplicity" as EnergyMixSolutionsType,
    label: "Simplicité",
    description: "Solution simple et accessible",
  },
  {
    type: "Balanced" as EnergyMixSolutionsType,
    label: "Équilibrée",
    description: "Compromis optimal",
  },
  {
    type: "Efficient" as EnergyMixSolutionsType,
    label: "Performante",
    description: "Performance maximale",
  },
];

const selectEnergyMixForStrategy = (
  bouquets: EnergyMix[],
  strategy: EnergyMixSolutionsType
): EnergyMix | null => {
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

interface EnergyMixSolutionsProps {
  onFinish?: (selectedBouquet: EnergyMix, selectedStrategy: EnergyMixSolutionsType) => void;
  initialData?: {
    bouquets: EnergyMix[];
  };
}

export function EnergyMixSolutions({ onFinish, initialData }: EnergyMixSolutionsProps) {
  const quizResults = localStorage.getItem("quizResults");
  const quizResultsData = JSON.parse(quizResults || "{}");
  const { setCostEstimation } = useDesignPageContext();
  const { 
    setIsEnergyLabelSolutionsDisplayed, 
    setEnergyFormCompleted, 
    setIsEnergyFormDisplayed, 
    sessionId 
  } = useEnergyFormContext();

  const [selectedStrategy, setSelectedStrategy] = useState<EnergyMixSolutionsType>("Balanced");
  const selectedEnergyMix = selectEnergyMixForStrategy(
    initialData?.bouquets || quizResultsData.bouquets, 
    selectedStrategy
  );

  const availableStrategies = STRATEGY_OPTIONS.filter((option, index) => {
    const validBouquets = (initialData?.bouquets || quizResultsData.bouquets)?.filter(Boolean) || [];
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
    if (!selectedEnergyMix) return;

    const newEstimation = {
      withAid: Math.floor(selectedEnergyMix.resteACharge),
      withoutAid: Math.floor(selectedEnergyMix.coutTotal),
    };

    setCostEstimation(prev => {
      if (prev.withAid === newEstimation.withAid && prev.withoutAid === newEstimation.withoutAid) {
        return prev;
      }
      return newEstimation;
    });
  }, [selectedEnergyMix, setCostEstimation]);

  const handleFinish = async () => {
    try {
      if (!selectedEnergyMix) {
        console.error("EnergyMix manquant");
        return;
      }

      if (onFinish) {
        onFinish(selectedEnergyMix, selectedStrategy);
      } else if (sessionId) {
        await saveEnergyChoice(sessionId, selectedStrategy, selectedEnergyMix);
      }

      setIsEnergyLabelSolutionsDisplayed(false);
      setEnergyFormCompleted(true);
      setIsEnergyFormDisplayed(false);
    } catch (err) {
      console.error("Erreur enregistrement EnergyMix:", err);
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

      {selectedEnergyMix ? (
        <>
          <EnergyLabelTypeCard
            energyLabelSolutionsType={selectedStrategy}
            bouquet={selectedEnergyMix}
            initialState={initialData || quizResultsData}
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

export default EnergyMixSolutions;
