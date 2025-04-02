import React from "react";
import { Separator } from "@/components/ui/separator";
import EnergyTag from "@/components/ui/EnergyTag";
import { WorkResultProps } from "@/types/project.types";
import { getConfortLabel } from "../utils";

const getConfortLabel = (confort: number): string => {
  switch (confort) {
    case 1:
      return "Confort faible";
    case 2:
      return "Confort moyen";
    case 3:
      return "Confort optimal";
    default:
      return "Confort non défini";
  }
};

const CurrentStateDetails = ({ initialState }: Omit<WorkResultProps, 'bouquet'>) => {
  return (
    <div className="space-y-1 mt-4 pl-6">
      <p className="text-lg font-semibold leading-none">
        Étiquette énergétique initiale
      </p>
      <div className="flex items-center">
        <EnergyTag label={initialState.etiquetteInitial} />
        <ul className="pt-2 pl-10 list-disc">
          <li>{initialState.CEP} kWh/m²/an</li>
          <li>{initialState.EGES} kgCO2/m²/an</li>
        </ul>
      </div>
      <Separator className="my-6 pl-6" />
      <div className="space-y-1 pl-6">
        <p className="text-lg font-semibold leading-none">Confort</p>
        <div className="flex" style={{ marginTop: "1rem" }}>
          <p>{getConfortLabel(initialState.confort)}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentStateDetails;
