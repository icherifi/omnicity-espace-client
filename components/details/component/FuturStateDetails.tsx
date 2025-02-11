import React from "react";
import { Separator } from "@/components/ui/separator";
import EnergyTag from "@/components/ui/EnergyTag";
import { WorkResultProps } from "@/components/energy/components/WorkResult";

const FuturStateDetails = ({ bouquet, initialState }: WorkResultProps) => {
  return (
    <div className="space-y-1 mt-4 pl-6">
      <p className="text-lg font-semibold leading-none">
        Étiquette énergétique visée
      </p>
      <div className="flex items-center">
        <EnergyTag label={bouquet.etiquette} />
        <ul className="pt-2 pl-10 list-disc">
          <li>
            {Math.floor((1 - bouquet.pourcentageGainCEP) * initialState.CEP)}{" "}
            kWh/m²/an
          </li>
          <li>{bouquet.EGES} kgCO2/m²/an</li>
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
          <p>Logement revalorisé à {Math.round(bouquet.valeurVerte * 100)} %</p>
        </div>
      </div>
    </div>
  );
};

export default FuturStateDetails;
