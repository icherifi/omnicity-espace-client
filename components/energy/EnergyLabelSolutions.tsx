import {
  EnergyLabelSolutionsType,
  useEnergyFormContext,
} from "@/contexts/energyForm.context";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useDesignPageContext } from "@/contexts/designPage.context";
import WorkResult from "./components/WorkResult";

export function EnergyLabelTypeCard(props: {
  energyLabelSolutionsType: EnergyLabelSolutionsType;
  bouquet: any;
  initialState: any;
}) {
  return (
    <Card className="mt-8 w-full">
      <CardContent className="p-0 flex justify-between">
        <div className="flex flex-col w-1/4 bg-violet-500 p-4 rounded-tl-sm rounded-bl-sm">
          <h1 className="text-4xl font-bold text-white">
            {props.energyLabelSolutionsType == "Simplicity" && "Simplicité"}
            {props.energyLabelSolutionsType == "Balanced" && "Equilibrée"}
            {props.energyLabelSolutionsType == "Efficient" && "Performante"}
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
                {props.bouquet.renovationMurs && "Isolation des murs"}
                {props.bouquet.renoComblesAmenages &&
                  "Isolation des combles aménagés"}
                {props.bouquet.renoIsolationToitureTerrasse &&
                  "Isolation de la toiture terrasse"}
                {props.bouquet.appareilChauffage1 &&
                  props.bouquet.appareilChauffage1}
              </h3>
            </div>
            <ul className="list-disc pl-6 text-white">
              {props.bouquet.renovationMurs && (
                <li>Isolation des murs par l’extérieur</li>
              )}
              {props.bouquet.renoComblesAmenages && (
                <li>Isolation des combles aménagés</li>
              )}
              {props.bouquet.renoIsolationToitureTerrasse && (
                <li>Isolation de la toiture terrasse</li>
              )}
              {props.bouquet.appareilChauffage1 && (
                <li>{props.bouquet.appareilChauffage1}</li>
              )}
            </ul>
          </div>
        </div>

        <WorkResult bouquet={props.bouquet} initialState={props.initialState} />

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
                  <p>{Math.floor(props.bouquet.coutTotal)} €</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-4">
                <p className="w-5/12 whitespace-nowrap text-base">Aides</p>
                <span className="w-5/12 whitespace-nowrap text-base font-bold sm:w-7/12">
                  jusqu’à{" "}
                  <span className="whitespace-nowrap">
                    {Math.floor(props.bouquet.montantAides)} €
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
                  {Math.floor(props.bouquet.resteACharge)} €
                </p>
              </div>
            </div>
            <a className="mx-auto w-full cursor-pointer whitespace-nowrap rounded-md bg-violet-500 px-4 py-3 text-center text-base font-bold text-white shadow-sm transition duration-300 ease-in-out hover:bg-violet-600 sm:w-10/12 md:w-full">
              Obtenir mon devis
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EnergyLabelSolutions() {
  const { iziResponse } = useEnergyFormContext();
  const { setCostEstimation } = useDesignPageContext();
  const [energyLabelSolutionsType, setEnergyLabelSolutionsType] =
    useState<EnergyLabelSolutionsType | null>("Balanced");

  useEffect(() => {
    if (iziResponse && energyLabelSolutionsType) {
      const selectedBouquet = iziResponse.bouquets.find((bouquet) => {
        if (energyLabelSolutionsType === "Simplicity")
          return bouquet.etiquette === "E";
        if (energyLabelSolutionsType === "Balanced")
          return bouquet.etiquette === "D";
        if (energyLabelSolutionsType === "Efficient")
          return bouquet.etiquette === "A";
      });

      if (selectedBouquet) {
        setCostEstimation({
          withAid: Math.floor(selectedBouquet.resteACharge),
          withoutAid: Math.floor(selectedBouquet.coutTotal),
        });
      }
    }
  }, [energyLabelSolutionsType, iziResponse]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="font-semibold text-xl">
        Des options pour optimiser votre classification énergétique
      </h1>
      <div className="flex mt-4 items-center justify-around space-x-2 w-4/5">
        <div
          onClick={() => setEnergyLabelSolutionsType("Simplicity")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType == "Simplicity" &&
            "bg-white border-2 border-violet-500"
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Simplicité</p>
        </div>

        <div
          onClick={() => setEnergyLabelSolutionsType("Balanced")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType == "Balanced" &&
            "bg-white border-2 border-violet-500"
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Equilibrée</p>
        </div>

        <div
          onClick={() => setEnergyLabelSolutionsType("Efficient")}
          className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
            energyLabelSolutionsType == "Efficient" &&
            "bg-white border-2 border-violet-500"
          } hover:cursor-pointer`}
        >
          <p className="font-semibold text-lg">Performante</p>
        </div>
      </div>
      {energyLabelSolutionsType == "Simplicity" && iziResponse && (
        <EnergyLabelTypeCard
          energyLabelSolutionsType={"Simplicity"}
          bouquet={iziResponse.bouquets.find(
            (bouquet) => bouquet.etiquette === "E"
          )}
          initialState={iziResponse}
        />
      )}
      {energyLabelSolutionsType == "Balanced" && iziResponse && (
        <EnergyLabelTypeCard
          energyLabelSolutionsType={"Balanced"}
          bouquet={iziResponse.bouquets.find(
            (bouquet) => bouquet.etiquette === "D"
          )}
          initialState={iziResponse}
        />
      )}
      {energyLabelSolutionsType == "Efficient" && iziResponse && (
        <EnergyLabelTypeCard
          energyLabelSolutionsType={"Efficient"}
          bouquet={iziResponse.bouquets.find(
            (bouquet) => bouquet.etiquette === "A"
          )}
          initialState={iziResponse}
        />
      )}
    </div>
  );
}

export default EnergyLabelSolutions;
