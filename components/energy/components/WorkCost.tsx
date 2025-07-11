import { Separator } from "@/components/ui/separator";
import React from "react";

export interface WorkCostProps {
  bouquet: {
    coutTotal: number;
    montantAides: number;
    resteACharge: number;
  };
  inPdf?: boolean;
}

export function WorkCost({ bouquet, inPdf }: WorkCostProps) {
  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col gap-4 bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl w-full">
        <h4 className="text-xl font-bold text-gray-900 dark:text-white">
          Coût du projet
        </h4>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-800 dark:text-gray-200">
              Coût des travaux
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">{Math.floor(bouquet.coutTotal).toLocaleString('fr-FR')} €</p>
          </div>
          <Separator className="w-full bg-gray-200 dark:bg-gray-600 my-2 h-1" />
          <div className="flex justify-between items-center">
            <p className="text-gray-800 dark:text-gray-200">Aides de l'État</p>
            <p className="font-semibold text-gray-900 dark:text-white">
              jusqu'à {Math.floor(bouquet.montantAides).toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 p-4 rounded-xl">
          <p className="text-center text-gray-900 dark:text-white">
            <span className="font-bold">Total du projet</span>{" "}
            <span className="text-gray-600 dark:text-gray-400">(aides déduites)</span>
          </p>
          <div className="text-purple-600 dark:text-purple-400 font-bold text-xl">
            {Math.floor(bouquet.resteACharge).toLocaleString('fr-FR')} €
          </div>
        </div>
        {!inPdf && (
          <button className="w-full py-3 bg-purple-600 dark:bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors">
            Obtenir mon devis
          </button>
        )}
      </div>
    </div>
  );
}

export default WorkCost;
