import React from "react";
import { Separator } from "@/components/ui/separator";
import EnergyTag from "@/components/ui/EnergyTag";
import { WorkResultProps } from "@/types/project.types";

const FuturStateDetails = ({ bouquet, initialState }: WorkResultProps) => {
  const gainCEP = Math.floor(initialState.CEP * (1 - bouquet.pourcentageGainCEP));
  const gainEGES = Math.round(initialState.EGES * (1 - bouquet.pourcentageGainCEP));
  
  return (
    <div className="space-y-1 mt-4 pl-6">
      <p className="text-lg font-semibold leading-none">
        Étiquette énergétique visée
      </p>
      <div className="flex items-center">
        <EnergyTag label={bouquet.etiquetteEnergetique} />
        <ul className="pt-2 pl-10 list-disc">
          <li>{gainCEP} kWh/m²/an</li>
          <li>{gainEGES} kgCO2/m²/an</li>
        </ul>
      </div>
      <Separator className="my-6 pl-6" />
      <div className="space-y-1 pl-6">
        <p className="text-lg font-semibold leading-none">Confort</p>
        <div className="flex" style={{ marginTop: "1rem" }}>
          <p>{bouquet.confort === 2 ? "Confort bien" : "Confort moyen"}</p>
        </div>
      </div>
      <Separator className="my-6 pl-6" />
      <div className="space-y-1 pl-6">
        <p className="text-lg font-semibold leading-none">Valeur immobilière</p>
        <div className="flex" style={{ marginTop: "1rem" }}>
          <p>
            Logement revalorisé de{" "}
            {Math.round(bouquet.valeurVerte * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default FuturStateDetails;
