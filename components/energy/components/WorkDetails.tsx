import React from "react";
import { EnergyMix } from "@/types/project.types";

interface WorkDetailsProps {
  bouquet: EnergyMix;
}

const WorkDetails: React.FC<WorkDetailsProps> = ({ bouquet }) => {
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
      <div className="flex flex-col items-center justify-center h-full text-gray-900 dark:text-white text-center p-4">
        <p className="text-sm">Aucun travaux nécessaire pour cette stratégie</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {works.map((work, index) => (
        <div key={index} className="flex flex-col mb-4 last:mb-0">
          <div className="flex items-start mb-2">
            <div className="rounded-full bg-white dark:bg-gray-800 w-8 h-8 flex-shrink-0 flex items-center justify-center mr-3 mt-1">
              <span className="text-xl font-bold text-purple-500 dark:text-purple-400">{index + 1}</span>
            </div>
            <div>
              <h3 className="text-gray-900 dark:text-white font-semibold text-md">{work.label}</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">{work.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkDetails; 