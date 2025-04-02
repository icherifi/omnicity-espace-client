import React, { useEffect, useState } from "react";
import { useDesignPageContext } from "@/contexts/designPage.context";
import { Card, CardContent } from "@/components/ui/card";
import WorkResult from "./components/WorkResult";
import WorkCost from "./components/WorkCost";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { saveEnergyChoice } from "@/utils/handleEnergyChoiceData";
import { Bouquet } from "@/types/project.types";

export type EnergyLabelSolutionsType = "Simplicity" | "Balanced" | "Efficient";
interface StrategyOption {
  type: EnergyLabelSolutionsType;
  label: string;
  description: string;
}

const STRATEGY_OPTIONS: StrategyOption[] = [
  {
    type: "Simplicity",
    label: "Simplicité",
    description: "Solution simple et accessible",
  },
  {
    type: "Balanced",
    label: "Équilibrée",
    description: "Compromis optimal",
  },
  {
    type: "Efficient",
    label: "Performante",
    description: "Performance maximale",
  },
];

const StrategyButton: React.FC<{
  option: StrategyOption;
  isSelected: boolean;
  onClick: () => void;
}> = ({ option, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
      isSelected ? "bg-white border-2 border-violet-500" : ""
    } hover:cursor-pointer`}
  >
    <p className="font-semibold text-lg">{option.label}</p>
  </div>
);

const hasAnyWork = (bouquet: Bouquet): boolean => {
  return Boolean(
    bouquet.renovationMurs ||
    bouquet.renoComblesPerdus ||
    bouquet.renoComblesAmenages ||
    bouquet.renoIsolationToitureTerrasse ||
    bouquet.renoPlancherBasVideSanitaire ||
    bouquet.renoPlancherBasSousSol ||
    bouquet.renoPlancherBasTerrePlein ||
    bouquet.renoMenuiserie ||
    bouquet.renoPorteFenetres ||
    bouquet.appareilChauffage1 ||
    bouquet.appareilChauffage2 ||
    bouquet.typeVentilationExterieur
  );
};

const WorkDetails: React.FC<{ bouquet: Bouquet }> = ({ bouquet }) => {
  const works = [
    { condition: bouquet.renovationMurs, label: "Isolation des murs", detail: "Isolation des murs par l'extérieur" },
    { condition: bouquet.renoComblesPerdus, label: "Isolation des combles perdus", detail: "Isolation des combles perdus" },
    { condition: bouquet.renoComblesAmenages, label: "Isolation des combles aménagés", detail: "Isolation des combles aménagés" },
    { condition: bouquet.renoIsolationToitureTerrasse, label: "Isolation de la toiture terrasse", detail: "Isolation de la toiture terrasse" },
    { condition: bouquet.appareilChauffage1, label: "Chauffage principal", detail: bouquet.appareilChauffage1 },
    { condition: bouquet.appareilChauffage2, label: "Chauffage secondaire", detail: bouquet.appareilChauffage2 }
  ].filter(work => work.condition);

  if (works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center p-4">
        <p className="text-sm">Aucun travaux nécessaire pour cette stratégie</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {works.map((work, index) => (
        <div key={index} className="flex flex-col mb-4 last:mb-0">
          <div className="flex items-start mb-2">
            <div className="rounded-full bg-white w-8 h-8 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
              <span className="text-xl font-bold text-violet-500">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-md">{work.label}</h3>
              <p className="text-white/90 text-sm mt-1">{work.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function EnergyLabelTypeCard({ 
  energyLabelSolutionsType, 
  bouquet, 
  initialState 
}: {
  energyLabelSolutionsType: EnergyLabelSolutionsType;
  bouquet: Bouquet;
  initialState: any;
}) {
  const getStrategyLabel = (type: EnergyLabelSolutionsType): string => {
    const option = STRATEGY_OPTIONS.find(opt => opt.type === type);
    return option?.label || type;
  };

  return (
    <Card className="mt-8 w-full">
      <CardContent className="p-0 flex justify-between">
        <div className="flex flex-col bg-violet-500 p-6 rounded-tl-sm rounded-bl-sm">
          <h1 className="text-4xl font-bold text-white mb-8">
            {getStrategyLabel(energyLabelSolutionsType)}
          </h1>
          {hasAnyWork(bouquet) && (
            <p className="font-semibold text-md mb-6 text-white">
              Travaux à réaliser
            </p>
          )}
          <WorkDetails bouquet={bouquet} />
        </div>

        <div className="flex">
          <div className="w-1/2 p-6 space-y-8">
            <WorkResult bouquet={bouquet} initialState={initialState} />
          </div>
          <div className="w-1/2 p-6 bg-gray-50">
            <WorkCost bouquet={bouquet} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

interface InitialState {
  etiquetteInitial: string;
  etiquetteEnergetiqueInitial: string;
  etiquetteEGESInitial: string;
  CEP: number;
  EGES: number;
  confort: number;
  bouquets: Bouquet[];
  performanceEnergetique: {
    murs: { EtatInitial: { Note: number; Label: string } };
    toiture: { EtatInitial: { Note: number; Label: string } };
    vitrages: { EtatInitial: { Note: number; Label: string } };
    plancherBas: { EtatInitial: { Note: number; Label: string } };
    plancherHaut: { EtatInitial: { Note: number | null; Label: string | null } };
    ventilation: { EtatInitial: { Note: number; Label: string } };
    chauffage: {
      EtatInitial: {
        ApCh1: { Note: number; Label: string };
        ApCh2: { Note: number | null; Label: string | null };
        ECS: { Note: number; Label: string };
      };
    };
  };
  inputQr: Record<string, string | string[]>;
  sessionId: string;
}

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
