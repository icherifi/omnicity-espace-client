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
      <div className="flex flex-col gap-4 bg-slate-100 p-6 rounded-2xl w-full">
        <h4 className="text-xl font-bold text-secondary-500">
          Coût du projet
        </h4>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-800">
              Coût des travaux
            </p>
            <p className="font-semibold">{Math.floor(bouquet.coutTotal).toLocaleString('fr-FR')} €</p>
          </div>
          <Separator className="w-full bg-white my-2 h-1" />
          <div className="flex justify-between items-center">
            <p className="text-gray-800">Aides de l'État</p>
            <p className="font-semibold">
              jusqu'à {Math.floor(bouquet.montantAides).toLocaleString('fr-FR')} €
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl">
          <p className="text-center">
            <span className="font-bold">Total du projet</span>{" "}
            <span className="text-gray-600">(aides déduites)</span>
          </p>
          <div className="text-violet-600 font-bold text-xl">
            {Math.floor(bouquet.resteACharge).toLocaleString('fr-FR')} €
          </div>
        </div>
        {!inPdf && (
          <button className="w-full py-3 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 transition-colors">
            Obtenir mon devis
          </button>
        )}
      </div>
    </div>
  );
}

export default WorkCost;
