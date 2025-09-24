import React from "react";
import { EnergyMix } from "@/types/project.types";
import { EnergyMixSolutionsType } from "../EnergyMixSolutions";
import { overallEnergyLabel } from "@/app/sections/dashboard/utils";

interface EnergyLabelTypeCardProps {
  energyLabelSolutionsType: EnergyMixSolutionsType;
  bouquet: EnergyMix;
  initialState: any;
  isSelected: boolean;
}

const STRATEGY_OPTIONS = [
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

const getStrategyLabel = (type: EnergyMixSolutionsType): string => {
  const option = STRATEGY_OPTIONS.find(opt => opt.type === type);
  return option?.label || type;
};

const getDPEColor = (dpe: string) => {
  switch (dpe) {
    case "A": return "bg-green-600 dark:bg-green-500 text-white dark:text-white";
    case "B": return "bg-green-500 dark:bg-green-400 text-white dark:text-white";
    case "C": return "bg-lime-500 dark:bg-lime-400 text-black dark:text-gray-900";
    case "D": return "bg-yellow-400 dark:bg-yellow-300 text-black dark:text-gray-900";
    case "E": return "bg-orange-400 dark:bg-orange-300 text-black dark:text-gray-900";
    case "F": return "bg-red-400 dark:bg-red-300 text-white dark:text-white";
    case "G": return "bg-red-600 dark:bg-red-500 text-white dark:text-white";
    default: return "bg-gray-300 dark:bg-gray-600 text-black dark:text-white";
  }
};

const travauxList = (bouquet: EnergyMix) => {
  const travaux: { label: string; details: string[] }[] = [];

  const isolationDetails = [];
  if (bouquet.renovationMurs) isolationDetails.push("Isolation des murs");
  if (bouquet.renoComblesPerdus) isolationDetails.push("Isolation des combles perdus");
  if (bouquet.renoComblesAmenages) isolationDetails.push("Isolation des combles aménagés");
  if (bouquet.renoIsolationToitureTerrasse) isolationDetails.push("Isolation toiture terrasse");
  if (bouquet.renoPlancherBasVideSanitaire) isolationDetails.push("Isolation plancher bas (vide sanitaire)");
  if (bouquet.renoPlancherBasSousSol) isolationDetails.push("Isolation plancher bas (sous-sol)");
  if (bouquet.renoPlancherBasTerrePlein) isolationDetails.push("Isolation plancher bas (terre-plein)");
  if (isolationDetails.length) travaux.push({ label: "Isolation", details: isolationDetails });

  const menuiserieDetails = [];
  if (bouquet.renoMenuiserie) menuiserieDetails.push("Remplacement des menuiseries");
  if (bouquet.renoPorteFenetres) menuiserieDetails.push("Remplacement des portes-fenêtres");
  if (menuiserieDetails.length) travaux.push({ label: "Menuiserie", details: menuiserieDetails });

  const chauffageDetails = [];
  if (bouquet.appareilChauffage1) chauffageDetails.push(bouquet.appareilChauffage1);
  if (bouquet.appareilChauffage2) chauffageDetails.push(bouquet.appareilChauffage2);
  if (chauffageDetails.length) travaux.push({ label: "Chauffage", details: chauffageDetails });

  const ventilationDetails = [];
  if (bouquet.typeVentilationExterieur) ventilationDetails.push(bouquet.typeVentilationExterieur);
  if (ventilationDetails.length) travaux.push({ label: "Ventilation", details: ventilationDetails });

  return travaux;
};

export function EnergyLabelTypeCard({ 
  energyLabelSolutionsType, 
  bouquet, 
  initialState,
  isSelected
}: EnergyLabelTypeCardProps) {
  let dpe: string = "-";

  // Vérifier si on a des données DPE pour calculer l'étiquette
  const cepAfterStr = initialState?.dpeData?.travaux?.pack?.conso5UsagesApresTravaux;
  const gesAfterStr = initialState?.dpeData?.travaux?.pack?.emissionGes5UsagesApresTravaux;

  // Si on a des données DPE, calculer l'étiquette à partir de ces données
  if (cepAfterStr !== undefined && gesAfterStr !== undefined) {
    const cepAfter = parseFloat(cepAfterStr);
    const gesAfter = parseFloat(gesAfterStr);
    const calculated = overallEnergyLabel(
      isNaN(cepAfter) ? undefined : cepAfter,
      isNaN(gesAfter) ? undefined : gesAfter
    );
    // Désactivable en l'égalant à bouquet.etiquette
    if (calculated) dpe = calculated;
  } else {
    // Pour les projets standard sans données DPE, utiliser l'étiquette fournie par IZI
    dpe = bouquet.etiquette || "-";
  }

  const travaux = travauxList(bouquet);
  const totalTravaux = bouquet.coutTotal ? Math.floor(bouquet.coutTotal).toLocaleString("fr-FR") : "-";
  const aideEtat = bouquet.montantAides ? Math.floor(bouquet.montantAides).toLocaleString("fr-FR") : "-";
  const resteACharge = bouquet.resteACharge ? Math.floor(bouquet.resteACharge).toLocaleString("fr-FR") : "-";

  return (
    <div className="flex flex-col items-center w-full px-2 py-4">
      <div className="w-full flex flex-col items-center">
        <div className="text-3xl font-extrabold mb-0 text-center text-gray-900 dark:text-white">{getStrategyLabel(energyLabelSolutionsType)}</div>
        {energyLabelSolutionsType === "Balanced" && (
          <div className="text-sm text-purple-300 dark:text-purple-200 font-semibold mb-2">Recommandé</div>
        )}
      </div>
      <div className="w-full mt-2 mb-4">
        <div className="font-bold text-md mb-2 text-gray-900 dark:text-white">Travaux à réaliser :</div>
        <ol className="space-y-3">
          {travaux.map((cat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`flex items-center justify-center rounded-full w-7 h-7 font-bold border text-gray-900 dark:text-white ${isSelected ? "bg-white dark:bg-gray-800 border-purple-300 dark:border-purple-200" : "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-600"}`}>{idx + 1}</span>
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">{cat.label}</span>
                <ul className="ml-4 list-disc">
                  {cat.details.map((detail, i) => (
                    <li key={i} className="text-sm text-gray-900 dark:text-white">{detail}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="flex items-center gap-3 mb-4 mt-2">
        <span className={`rounded-[12px] px-4 py-1 font-bold text-lg ${getDPEColor(dpe)}`}>{dpe}</span>
        <span className="font-medium text-gray-700 dark:text-gray-300 text-md">DPE Visé</span>
      </div>
      <div className="flex flex-col justify-between w-full mb-6">
        <div className="font-semibold text-gray-900 dark:text-white">Coût des travaux<br/><span className="text-lg">{totalTravaux} €</span></div>
        <div className="text-right">
          {bouquet.montantAides && bouquet.montantAides > 0 ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-white">Aides de l'État<br/></span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">jusqu'à {aideEtat} €</span>
            </>
          ) : (
            <span className="font-semibold text-gray-900 dark:text-white">Aucune aide disponible</span>
          )}
        </div>
      </div>
      <div className={`w-full rounded-xl py-3 mt-2 text-center ${isSelected ? "bg-white dark:bg-gray-800" : "bg-purple-50 dark:bg-purple-900/20"}`}>
        <div className="font-bold text-gray-900 dark:text-white text-[14px]">
          Total du projet<br/>(aides déduites)
        </div>
        <span className="text-[20px] font-bold text-purple-300 dark:text-purple-200">{resteACharge} €</span>
      </div>
    </div>
  );
}

export default EnergyLabelTypeCard; 