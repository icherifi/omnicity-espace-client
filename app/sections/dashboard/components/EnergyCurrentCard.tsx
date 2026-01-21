"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { getPerfBadge, getChauffageNote } from "../utils";

interface EnergyCurrentCardProps {
  currentLabel: string;
  initialCEP?: number;
  initialEGES?: number;
  costs: { monthlyBefore: number; monthlyAfter: number };
  hasCosts: boolean;
  energyResults: any;
  isEnergyDataAvailable: boolean;
}

const EnergyCurrentCard: React.FC<EnergyCurrentCardProps> = ({
  currentLabel,
  initialCEP,
  initialEGES,
  costs,
  hasCosts,
  energyResults,
  isEnergyDataAvailable,
}) => {
  return (
    <Card
      className={`relative flex-1 flex flex-col border-black dark:border-gray-600 border border-solid bg-card shadow-sm rounded-[16px] p-0 ${!isEnergyDataAvailable ? "opacity-40 grayscale pointer-events-none" : ""}`}
    >
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start justify-between">
          <CardTitle className="text-2xl font-bold text-foreground">
            Actuel
          </CardTitle>
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
                    Le DPE donne des informations sur la performance énergétique
                    et climatique d'un logement ou d'un bâtiment.
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
                  <svg
                    width="210"
                    height="320"
                    viewBox="0 0 296 406"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fontWeight="bold" fontSize="24">
                      <g transform="translate(0,0)">
                        <path
                          d="M136.416 0H0V58H136.416L156 29L136.416 0Z"
                          fill="#21803D"
                        />
                        <text x="18" y="38" fill="white">
                          A
                        </text>
                      </g>
                      <g transform="translate(0,58)">
                        <path
                          d="M160.416 0H0V58H160.416L180 29L160.416 0Z"
                          fill="#59AB3F"
                        />
                        <text x="18" y="38" fill="white">
                          B
                        </text>
                      </g>
                      <g transform="translate(0,116)">
                        <path
                          d="M184.416 0H0V58H184.416L204 29L184.416 0Z"
                          fill="#A5C140"
                        />
                        <text x="18" y="38" fill="white">
                          C
                        </text>
                      </g>
                      <g transform="translate(0,174)">
                        <path
                          d="M206.416 0H0V58H206.416L226 29L206.416 0Z"
                          fill="#F1D11D"
                        />
                        <text x="18" y="38" fill="white">
                          D
                        </text>
                      </g>
                      <g transform="translate(0,232)">
                        <path
                          d="M229.416 0H0V58H229.416L249 29L229.416 0Z"
                          fill="#F27C11"
                        />
                        <text x="18" y="38" fill="white">
                          E
                        </text>
                      </g>
                      <g transform="translate(0,290)">
                        <path
                          d="M252.416 0H0V58H252.416L272 29L252.416 0Z"
                          fill="#E93B19"
                        />
                        <text x="18" y="38" fill="white">
                          F
                        </text>
                      </g>
                      <g transform="translate(0,348)">
                        <path
                          d="M276.416 0H0V58H276.416L296 29L276.416 0Z"
                          fill="#B91C1C"
                        />
                        <text x="18" y="38" fill="white">
                          G
                        </text>
                      </g>
                    </g>
                  </svg>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <div className="p-0">
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
        <div className="space-y-4 text-sm mx-6">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Isolation</span>
            {(() => {
              const note =
                energyResults?.performanceEnergetique?.murs?.EtatInitial?.Note;
              const badge = getPerfBadge(note);
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
              const badge = getPerfBadge(note);
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
                energyResults?.performanceEnergetique?.ventilation?.EtatInitial
                  ?.Note;
              const badge = getPerfBadge(note);
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
        <div className="bg-gray-900 dark:bg-gray-100 w-full text-white dark:text-gray-900 rounded-b-[16px] mt-6 p-4 flex justify-around text-sm font-semibold">
          <span>
            Avant :{" "}
            {hasCosts
              ? `${costs.monthlyBefore.toLocaleString("fr-FR")}€/mois`
              : "—"}
          </span>
          <span className="text-end">
            Après :{" "}
            {hasCosts
              ? `${costs.monthlyAfter.toLocaleString("fr-FR")}€/mois`
              : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default EnergyCurrentCard;
