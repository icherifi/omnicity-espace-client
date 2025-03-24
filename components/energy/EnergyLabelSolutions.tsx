import React, { useEffect, useMemo, useState } from "react";
import {
  EnergyLabelSolutionsType,
  useEnergyFormContext,
} from "@/contexts/energyForm.context";
import { useDesignPageContext } from "@/contexts/designPage.context";
import { Card, CardContent } from "@/components/ui/card";

import WorkResult from "./components/WorkResult";
import WorkCost from "./components/WorkCost";

function getBouquetByStrategy(
  bouquets: any[],
  strategy: EnergyLabelSolutionsType
): any | null {
  if (!bouquets?.length) return null;

  const validBouquets = bouquets.filter(Boolean);
  if (!validBouquets.length) return null;

  const sortedByLabelAsc = [...validBouquets].sort((a, b) =>
    a.etiquette.localeCompare(b.etiquette)
  );

  switch (strategy) {
    case "Simplicity":
      return sortedByLabelAsc[sortedByLabelAsc.length - 1] || null;

    case "Balanced":
  
      if (sortedByLabelAsc.length > 1) {
        return sortedByLabelAsc[1];
      }

      return sortedByLabelAsc[0] || null;

    case "Efficient":
      return sortedByLabelAsc[0] || null;

    default:
      return null;
  }
}

export function EnergyLabelTypeCard(props: {
  energyLabelSolutionsType: EnergyLabelSolutionsType;
  bouquet: any;
  initialState: any;
}) {
  const { energyLabelSolutionsType, bouquet, initialState } = props;

  return (
    <Card className="mt-8 w-full">
      <CardContent className="p-0 flex justify-between">
        <div className="flex flex-col w-1/4 bg-violet-500 p-4 rounded-tl-sm rounded-bl-sm">
          <h1 className="text-4xl font-bold text-white">
            {energyLabelSolutionsType === "Simplicity" && "Simplicité"}
            {energyLabelSolutionsType === "Balanced" && "Équilibrée"}
            {energyLabelSolutionsType === "Efficient" && "Performante"}
          </h1>
          <p className="font-semibold text-md mt-4 text-white">
            Travaux à réaliser
          </p>

          <div className="flex flex-col">
            <div className="flex p-4 pl-0 items-center">
              <div className="rounded-full bg-white w-8 h-8 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-violet-500">1</span>
              </div>
              <h3 className="ml-2 text-white font-semibold text-md">
                {bouquet?.renovationMurs && "Isolation des murs"}
                {bouquet?.renoComblesAmenages && "Isolation des combles aménagés"}
                {bouquet?.renoIsolationToitureTerrasse &&
                  "Isolation de la toiture terrasse"}
                {bouquet?.appareilChauffage1 && bouquet?.appareilChauffage1}
              </h3>
            </div>
            <ul className="list-disc pl-6 text-white">
              {bouquet?.renovationMurs && (
                <li>Isolation des murs par l’extérieur</li>
              )}
              {bouquet?.renoComblesAmenages && (
                <li>Isolation des combles aménagés</li>
              )}
              {bouquet?.renoIsolationToitureTerrasse && (
                <li>Isolation de la toiture terrasse</li>
              )}
              {bouquet?.appareilChauffage1 && (
                <li>{bouquet?.appareilChauffage1}</li>
              )}
            </ul>
          </div>
        </div>

        <WorkResult bouquet={bouquet} initialState={initialState} />
        <WorkCost bouquet={bouquet} />
      </CardContent>
    </Card>
  );
}

export function EnergyLabelSolutions() {
  const { iziResponse } = useEnergyFormContext();
  const { setCostEstimation } = useDesignPageContext();
  const [energyLabelSolutionsType, setEnergyLabelSolutionsType] =
    useState<EnergyLabelSolutionsType>("Balanced");

  const selectedBouquet = useMemo(() => {
    if (!iziResponse || !energyLabelSolutionsType) return null;
    return getBouquetByStrategy(iziResponse.bouquets, energyLabelSolutionsType);
  }, [iziResponse, energyLabelSolutionsType]);

  useEffect(() => {
    if (selectedBouquet) {
      setCostEstimation({
        withAid: Math.floor(selectedBouquet.resteACharge),
        withoutAid: Math.floor(selectedBouquet.coutTotal),
      });
    }
  }, [selectedBouquet, setCostEstimation]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-semibold text-xl">
        Des options pour optimiser votre classification énergétique
      </h1>
      <div className="flex mt-4 items-center justify-around space-x-2 w-4/5">
        <div
          onClick={() => setEnergyLabelSolutionsType("Simplicity")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType === "Simplicity"
              ? "bg-white border-2 border-violet-500"
              : ""
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Simplicité</p>
        </div>

        <div
          onClick={() => setEnergyLabelSolutionsType("Balanced")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType === "Balanced"
              ? "bg-white border-2 border-violet-500"
              : ""
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Équilibrée</p>
        </div>

        <div
          onClick={() => setEnergyLabelSolutionsType("Efficient")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType === "Efficient"
              ? "bg-white border-2 border-violet-500"
              : ""
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Performante</p>
        </div>
      </div>

      {selectedBouquet ? (
        <EnergyLabelTypeCard
          energyLabelSolutionsType={energyLabelSolutionsType}
          bouquet={selectedBouquet}
          initialState={iziResponse}
        />
      ) : (
        <p className="mt-4 text-red-500 font-semibold">
          Aucun bouquet ne correspond à la stratégie "
          {energyLabelSolutionsType === "Simplicity" && "Simplicité"}
          {energyLabelSolutionsType === "Balanced" && "Équilibrée"}
          {energyLabelSolutionsType === "Efficient" && "Performante"}
          ". 
        </p>
      )}
    </div>
  );
}

export default EnergyLabelSolutions;
