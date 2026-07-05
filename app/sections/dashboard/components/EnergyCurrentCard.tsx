"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import type { InitialState } from "@/types/simulation.types";
import InitialStateDiagnosticsDisplay from "@/components/forms/InitialStateDiagnosticsDisplay";

interface EnergyCurrentCardProps {
  currentLabel: string;
  initialCEP?: number;
  initialEGES?: number;
  isEnergyDataAvailable: boolean;
  initial_state?: InitialState;
  address?: string;
}

const DPE_BANDS = [
  { label: "A", width: 136.416, color: "#21803D" },
  { label: "B", width: 160.416, color: "#59AB3F" },
  { label: "C", width: 184.416, color: "#A5C140" },
  { label: "D", width: 206.416, color: "#F1D11D" },
  { label: "E", width: 229.416, color: "#F27C11" },
  { label: "F", width: 252.416, color: "#E93B19" },
  { label: "G", width: 276.416, color: "#B91C1C" },
];

function DpeScaleGraphic() {
  return (
    <svg
      width="210"
      height="320"
      viewBox="0 0 296 406"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fontWeight="bold" fontSize="24">
        {DPE_BANDS.map((band, index) => {
          const y = index * 58;
          const tipX = band.width + 19.584;
          const d = `M${band.width} 0H0V58H${band.width}L${tipX} 29L${band.width} 0Z`;

          return (
            <g key={band.label} transform={`translate(0,${y})`}>
              <path d={d} fill={band.color} />
              <text x="18" y="38" fill="white">
                {band.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function DpeInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
          <Info className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 pb-6">
        <div className="flex flex-row items-stretch w-full">
          <div className="flex-1 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              Diagnostic de Performance Énergétique (DPE)
            </h2>
            <p className="text-lg mb-8">
              Le DPE donne des informations sur la performance énergétique et
              climatique d'un logement ou d'un bâtiment.
            </p>
            <a
              href="https://www.service-public.fr/particuliers/vosdroits/F16096"
              target="_blank"
              rel="noreferrer"
              className="text-xs underline text-foreground mt-2 w-fit"
            >
              En savoir plus
            </a>
          </div>
          <div className="flex flex-col items-center pr-8 pt-8">
            <DpeScaleGraphic />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getInsulationBadge(initialState: InitialState | undefined) {
  if (!initialState) {
    return {
      label: "-",
      color: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
    };
  }

  // Evaluate insulation quality based on U-values and materials
  const uWalls = initialState.u_walls;
  const uWindows = initialState.u_windows;
  const uHighFloor = initialState.u_high_floor;
  const uLowFloor = initialState.u_low_floor;

  // Count "good" quality items
  const goodItems = [uWalls, uWindows, uHighFloor, uLowFloor].filter((u) =>
    ["very_good", "good"].includes(u),
  ).length;

  if (goodItems >= 3) {
    return {
      label: "Bien",
      color:
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
    };
  } else if (goodItems >= 1) {
    return {
      label: "Moyen",
      color:
        "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900",
    };
  }
  return {
    label: "Mauvais",
    color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900",
  };
}

function getChauffageBadge(initialState: InitialState | undefined) {
  if (!initialState || !initialState.generator_type) {
    return {
      label: "-",
      color: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
    };
  }

  // Modern/efficient heating systems
  const efficientSystems = ["heat_pump", "boiler", "gas_boiler"];
  const legacySystems = ["electric_heater", "boiler"];

  if (
    efficientSystems.includes(initialState.generator_type) &&
    initialState.generator_energy !== "fuel"
  ) {
    return {
      label: "Bien",
      color:
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
    };
  } else if (initialState.generator_type === "boiler") {
    return {
      label: "Moyen",
      color:
        "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900",
    };
  }
  return {
    label: "Mauvais",
    color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900",
  };
}

function getVentilationBadge(initialState: InitialState | undefined) {
  if (!initialState) {
    return {
      label: "-",
      color: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
    };
  }

  if (!initialState.has_vents) {
    return {
      label: "Mauvais",
      color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900",
    };
  }

  // Good ventilation systems
  const goodVents = ["vmc", "vmr", "natural_ventilation"];
  if (goodVents.includes(initialState.vents_type)) {
    return {
      label: "Bien",
      color:
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
    };
  }

  return {
    label: "Moyen",
    color:
      "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900",
  };
}

const EnergyCurrentCard: React.FC<EnergyCurrentCardProps> = ({
  currentLabel,
  initialCEP,
  initialEGES,
  isEnergyDataAvailable,
  initial_state,
  address = "",
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const isolationBadge = getInsulationBadge(initial_state);
  const chauffageBadge = getChauffageBadge(initial_state);
  const ventilationBadge = getVentilationBadge(initial_state);

  return (
    <Card
      className={`flex-1 flex flex-col border-black dark:border-gray-600 border border-solid bg-card shadow-sm rounded-[16px] p-0 ${!isEnergyDataAvailable ? "opacity-40 grayscale pointer-events-none" : ""}`}
    >
      <CardHeader className="pb-4 px-6 pt-6 flex flex-row items-start justify-between">
        <CardTitle className="text-2xl font-bold text-foreground">
          Actuel
        </CardTitle>
        <DpeInfoDialog />
      </CardHeader>

      <div className="p-0 flex-1 flex flex-col">
        {/* Energy Label Summary */}
        <div className="bg-red-100 dark:bg-red-400 mx-6 rounded-xl p-6 flex flex-col justify-around items-center gap-2 mb-6 2xl:flex-row h-[200px]">
          <span className="text-5xl font-bold text-foreground dark:text-black">
            {currentLabel}
          </span>
          <div className="flex flex-col items-center gap-2">
            <p className="font-semibold text-foreground dark:text-black">
              Étiquette énergétique
            </p>
            <ul className="text-sm list-disc list-inside text-foreground dark:text-black">
              <li>
                {initialCEP !== undefined ? `${initialCEP} kWh/m²/an` : "–"}
              </li>
              <li>
                {initialEGES !== undefined ? `${initialEGES} kgCO₂/m²/an` : "–"}
              </li>
            </ul>
          </div>
        </div>

        {/* Building State Badges - Mirror EnergyTargetCard */}
        <div className="space-y-4 text-sm mx-6 flex-1">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Isolation</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${isolationBadge.color}`}
            >
              {isolationBadge.label}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span>Chauffage</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${chauffageBadge.color}`}
            >
              {chauffageBadge.label}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Ventilation</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${ventilationBadge.color}`}
            >
              {ventilationBadge.label}
            </span>
          </div>
        </div>

        {/* Footer Link to Details */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-b-[16px] mt-auto p-4 w-full text-left text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            En savoir plus
          </button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {initial_state && address ? (
              <InitialStateDiagnosticsDisplay
                initialState={initial_state}
                address={address}
              />
            ) : (
              <div className="p-6 text-center text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default EnergyCurrentCard;
