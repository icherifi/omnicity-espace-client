"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectType } from "@/types/project.types";
import { getAidCoveragePercentage } from "../utils";

interface ProjectSummaryCardProps {
  project: ProjectType;
  isEnergyMixAvailable: boolean;
}

const ProjectSummaryCard: React.FC<ProjectSummaryCardProps> = ({
  project,
  isEnergyMixAvailable,
}) => {
  return (
    <Card
      className={`border-black dark:border-gray-600 border border-solid bg-card shadow-sm rounded-[16px] p-0 ${!isEnergyMixAvailable ? "opacity-40 grayscale pointer-events-none" : ""}`}
    >
      <CardHeader className="px-8 pt-8 pb-0">
        <CardTitle className="text-3xl font-bold text-foreground mb-10">
          Bilan de votre projet de rénovation
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pt-4 pb-8">
        <p className="text-base mb-8 text-foreground">
          Vous avez opté pour le plan <span className="font-semibold">suivant&nbsp;:</span>
        </p>
        <div className="flex justify-between font-semibold mb-4 text-base text-foreground">
          <span>Détail</span>
          <span>Montant</span>
        </div>
        <div className="space-y-6 text-base text-foreground">
          <div className="flex justify-between">
            <span>Coût estimé des travaux</span>
            <span className="font-semibold">
              {project.energyMixChoice?.coutTotal
                ? `${Math.round(project.energyMixChoice.coutTotal).toLocaleString("fr-FR")} €`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="whitespace-pre-line">
              Aides potentielles{"\n"}(MaPrimeRénov', CEE...)
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              -
              {project.energyMixChoice?.montantAides
                ? `${Math.round(project.energyMixChoice.montantAides).toLocaleString("fr-FR")} €`
                : "-"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coût restant à charge</span>
            <span className="font-semibold">
              {project.energyMixChoice?.resteACharge
                ? `${Math.round(project.energyMixChoice.resteACharge).toLocaleString("fr-FR")} €`
                : "-"}
            </span>
          </div>
        </div>
        <Separator className="my-4 bg-border" />
        <div className="flex items-start text-xs gap-2 mt-2">
          <svg
            className="mt-[2px]"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <circle cx="6" cy="6" r="6" fill="currentColor" className="text-violet-500 dark:text-violet-400" />
          </svg>
          <span className="text-foreground">
            {(() => {
              const pourcentage = getAidCoveragePercentage(project);
              return (
                <>
                  Le + : Jusqu'à {pourcentage}% de vos travaux pris en charge par
                  les aides publiques.
                  <a
                    href="https://www.economie.gouv.fr/particuliers/aides-renovation-energetique"
                    target="_blank"
                    className="underline ml-1"
                    rel="noopener noreferrer"
                  >
                    En savoir plus
                  </a>
                </>
              );
            })()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummaryCard; 