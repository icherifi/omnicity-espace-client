import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EnergyMix } from "@/types/project.types";
import { EnergyMixSolutionsType } from "../EnergyMixSolutions";
import WorkResult from "./WorkResult";
import WorkCost from "./WorkCost";
import WorkDetails from "./WorkDetails";

interface EnergyLabelTypeCardProps {
  energyLabelSolutionsType: EnergyMixSolutionsType;
  bouquet: EnergyMix;
  initialState: any;
}

const STRATEGY_OPTIONS = [
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

const hasAnyWork = (bouquet: EnergyMix): boolean => {
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

export function EnergyLabelTypeCard({ 
  energyLabelSolutionsType, 
  bouquet, 
  initialState 
}: EnergyLabelTypeCardProps) {
  const getStrategyLabel = (type: EnergyMixSolutionsType): string => {
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

export default EnergyLabelTypeCard; 