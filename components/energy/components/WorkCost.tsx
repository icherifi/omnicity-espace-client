import React from "react";

export interface WorkCostProps {
  bouquet: {
    coutTotal: number;
    montantAides: number;
    resteACharge: number;
  };
  inPdf?: boolean; // Add inPdf to the props
}

export function WorkCost({ bouquet, inPdf }: WorkCostProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-6 bg-slate-100 px-4 py-6 rounded-2xl">
        <h4 className="text-lg font-bold text-secondary-500 @md:text-xl self-center">
          Coût du projet
        </h4>
        <div className="flex flex-col">
          <div className="flex justify-between gap-2 border-b-2 border-white pb-4">
            <p className="w-5/12 whitespace-nowrap text-base">
              Coût des travaux
            </p>
            <div className="flex w-5/12 flex-col flex-wrap gap-1 whitespace-nowrap text-base font-bold @sm:w-7/12 @sm:flex-row">
              <p>{Math.floor(bouquet.coutTotal)} €</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-4">
            <p className="w-5/12 whitespace-nowrap text-base">Aides</p>
            <span className="w-5/12 whitespace-nowrap text-base font-bold sm:w-7/12">
              jusqu’à{" "}
              <span className="whitespace-nowrap">
                {Math.floor(bouquet.montantAides)} €
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white p-4">
            <p className="self-center text-base">
              <span className="font-bold">Total du projet</span> (aides
              déduites)
            </p>
            <p className="flex items-center text-sm text-violet-500">
              {Math.floor(bouquet.resteACharge)} €
            </p>
          </div>
        </div>
        {!inPdf && (
          <a className="mx-auto w-full cursor-pointer whitespace-nowrap rounded-md bg-violet-500 px-4 py-3 text-center text-base font-bold text-white shadow-sm transition duration-300 ease-in-out hover:bg-violet-600 sm:w-10/12 md:w-full">
            Obtenir mon devis
          </a>
        )}
      </div>
    </div>
  );
}

export default WorkCost;
