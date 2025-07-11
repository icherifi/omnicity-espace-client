import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import EnergyTag from "@/components/ui/EnergyTag";
import { WorkResultProps } from "@/types/project.types";

export function WorkResult({ bouquet, initialState }: WorkResultProps) {
  const [selected, setSelected] = useState<"avant" | "apres">("apres");

  const gainCEP = Math.floor(initialState.CEP * (1 - bouquet.pourcentageGainCEP));
  const gainEGES = Math.round(initialState.EGES * (1 - bouquet.pourcentageGainCEP));

  return (
    <div className="flex flex-col w-full items-center">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Résultat des travaux</h3>

      <div className="flex rounded-full bg-gray-100 dark:bg-gray-800 p-1 mb-8">
        <button
          onClick={() => setSelected("avant")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === "avant"
              ? "bg-purple-500 dark:bg-purple-400 text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Avant
        </button>
        <button
          onClick={() => setSelected("apres")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected === "apres"
              ? "bg-purple-500 dark:bg-purple-400 text-white"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Après
        </button>
      </div>

      <div className="space-y-8">
        <div>
          <h4 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">
            Étiquette énergétique {selected === "avant" ? "initiale" : "visée"}
          </h4>
          <div className="flex items-start space-x-6">
            <EnergyTag
              label={selected === "avant" ? initialState.etiquetteInitial : bouquet.etiquetteEnergetique}
            />
            <ul className="space-y-2 text-sm text-gray-900 dark:text-white">
              <li>{selected === "avant" ? initialState.CEP : gainCEP} kWh/m²/an</li>
              <li>{selected === "avant" ? initialState.EGES : gainEGES} kgCO2/m²/an</li>
            </ul>
          </div>
        </div>

        <Separator className="my-4 w-full" />

        <div>
          <h4 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Confort</h4>
          <p className="text-sm text-gray-900 dark:text-white">
            {selected === "avant"
              ? initialState.confort === 2
                ? "Confort moyen"
                : initialState.confort === 3
                ? "Confort optimal"
                : "Confort faible"
              : bouquet.confort === 2
              ? "Confort moyen"
              : bouquet.confort === 3
              ? "Confort optimal"
              : "Confort faible"}
          </p>
        </div>

        <Separator className="my-4 w-full" />

        <div>
          <h4 className="text-base font-semibold mb-4 text-gray-900 dark:text-white">Valeur immobilière</h4>
          <p className="text-sm text-gray-900 dark:text-white">
            {selected === "apres" && (
              <>Logement revalorisé de {Math.round(bouquet.valeurVerte * 100)}%</>
            )}
            {selected === "avant" && <>Valeur actuelle</>}
          </p>
        </div>
      </div>
    </div>
  );
}

export default WorkResult;
