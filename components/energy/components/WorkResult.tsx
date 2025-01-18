import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import EnergyTag from "@/components/ui/EnergyTag";

interface WorkResultProps {
  bouquet: {
    etiquette: string;
    pourcentageGainCEP: number;
    EGES: number;
    confort: number;
    valeurVerte: number;
  };
  initialState: {
    CEP: number;
    etiquetteInitial: string;
  };
}

export function WorkResult({ bouquet, initialState }: WorkResultProps) {
  const [selected, setSelected] = useState<"avant" | "apres">("apres");

  return (
    <div className="flex flex-col w-1/3 p-4 mb-4">
      <h3 className="font-bold text-lg self-center">Résultat des travaux</h3>

      <div className="flex rounded-full bg-blue-100 p-1 my-2 self-center">
        <button
          className={`${
            selected === "avant"
              ? "bg-violet-500 text-white"
              : "bg-transparent text-gray-600"
          } rounded-full px-4 py-2 focus:outline-none transition-colors duration-200`}
          onClick={() => setSelected("avant")}
        >
          Avant
        </button>
        <button
          className={`${
            selected === "apres"
              ? "bg-violet-500 text-white"
              : "bg-transparent text-gray-600"
          } rounded-full px-4 py-2 focus:outline-none transition-colors duration-200`}
          onClick={() => setSelected("apres")}
        >
          Après
        </button>
      </div>

      {selected == "apres" ? (
        <div className="space-y-1 mt-4 pl-6">
          <p className="text-lg font-semibold leading-none">
            Étiquette énergétique
          </p>

          <div className="flex items-center">
            <EnergyTag label={bouquet.etiquette} />
            <ul className="pt-2 pl-10 list-disc">
              <li>
                {Math.floor(
                  (1 - bouquet.pourcentageGainCEP) * initialState.CEP
                )}{" "}
                kWh/m²/an
              </li>
              <li>{bouquet.EGES} kgCO2/m²/an</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-1 mt-4 pl-6">
          <p className="text-lg font-semibold leading-none">
            Étiquette énergétique
          </p>

          <div className="flex items-center">
            <EnergyTag label={initialState.etiquetteInitial} />
            <ul className="pt-2 pl-10 list-disc">
              <li>181 à 250 kWh/m²/an</li>
              <li>31 à 50 kgCO2/m²/an</li>
            </ul>
          </div>
        </div>
      )}

      <Separator className="my-6 pl-6" />

      {selected == "apres" ? (
        <div className="space-y-1 pl-6">
          <p className="text-lg font-semibold leading-none">Confort</p>

          <div className="flex" style={{ marginTop: "1rem" }}>
            <p>{bouquet.confort == 2 ? "Confort bien" : "Confort moyen"}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1 pl-6">
          <p className="text-lg font-semibold leading-none">Confort</p>

          <div className="flex" style={{ marginTop: "1rem" }}>
            <p>Confort moyen</p>
          </div>
        </div>
      )}

      {selected == "apres" && (
        <>
          <Separator className="my-6 pl-6" />

          <div className="space-y-1 pl-6">
            <p className="text-lg font-semibold leading-none">
              Valeur immobilière
            </p>

            <div className="flex" style={{ marginTop: "1rem" }}>
              <p>
                Logement revalorisé à {Math.round(bouquet.valeurVerte * 100)} %
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WorkResult;
