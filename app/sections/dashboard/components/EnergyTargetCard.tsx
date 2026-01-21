"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPerfBadge, getChauffageNote } from "../utils";

interface EnergyTargetCardProps {
  targetLabel: string;
  targetCEP?: number;
  targetEGES?: number;
  energyResults: any;
  energyMixChoice?: any;
  isEnergyDataAvailable: boolean;
}

const EnergyTargetCard: React.FC<EnergyTargetCardProps> = ({
  targetLabel,
  targetCEP,
  targetEGES,
  energyResults,
  energyMixChoice,
  isEnergyDataAvailable,
}) => {
  return (
    <Card
      className={`flex-1 flex flex-col border-black dark:border-gray-600 border border-solid bg-card shadow-sm rounded-[16px] p-0 ${!isEnergyDataAvailable ? "opacity-40 grayscale pointer-events-none" : ""}`}
    >
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-2xl font-bold text-foreground">
          Visé
        </CardTitle>
      </CardHeader>
      <div className="p-0 flex-1 flex flex-col">
        <div className="bg-green-100 dark:bg-green-400 mx-6 rounded-xl p-6 flex flex-col justify-around items-center gap-2 mb-6 2xl:flex-row h-[200px]">
          <span className="text-5xl font-bold text-foreground dark:text-black">
            {targetLabel}
          </span>
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-foreground dark:text-black">
              Étiquette énergétique
            </p>
            <ul className="text-sm list-disc list-inside text-foreground dark:text-black">
              <li>
                {targetCEP !== undefined ? `${targetCEP} kWh/m²/an` : "–"}
              </li>
              <li>
                {targetEGES !== undefined ? `${targetEGES} kgCO₂/m²/an` : "–"}
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-4 text-sm mx-6">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Isolation</span>
            {(() => {
              const note =
                energyResults?.performanceEnergetique?.murs?.EtatApresTravaux
                  ?.Note;
              const badge = {
                label: "Bien",
                color:
                  "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
              };
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                >
                  {badge.label}
                </span>
              );
            })()}
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span>Chauffage</span>
            {(() => {
              const note = getChauffageNote(
                energyResults?.performanceEnergetique?.chauffage,
              );
              const badge = {
                label: "Bien",
                color:
                  "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
              };
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                >
                  {badge.label}
                </span>
              );
            })()}
          </div>
          <div className="flex justify-between items-center">
            <span>Ventilation</span>
            {(() => {
              const note =
                energyResults?.performanceEnergetique?.ventilation
                  ?.EtatApresTravaux?.Note;
              const badge = {
                label: "Bien",
                color:
                  "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
              };
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                >
                  {badge.label}
                </span>
              );
            })()}
          </div>
        </div>
        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-b-[16px] mt-auto p-4 flex justify-between text-sm font-semibold">
          <span>Coût total des travaux</span>
          <span>
            {energyMixChoice?.coutTotal
              ? `${Math.round(energyMixChoice.coutTotal).toLocaleString("fr-FR")} €`
              : "42 000€"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default EnergyTargetCard;
