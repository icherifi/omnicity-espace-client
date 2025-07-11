"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog";
import { ProjectType } from "@/types/project.types";
import { getNextStepAction } from "../project-completion";

interface ProjectDetailsCardProps {
  project: ProjectType;
  avanc: number;
  isDraft: boolean;
  onToggleSummary: () => void;
}

const ProjectDetailsCard: React.FC<ProjectDetailsCardProps> = ({
  project,
  avanc,
  isDraft,
  onToggleSummary,
}) => {
  const {
    firstName,
    lastName,
    address,
    contract_type,
    created_at,
    features,
  } = project as any;

  return (
    <Card className="border-none bg-card shadow-sm rounded-[16px] p-0">
      <CardHeader className="px-8 pt-8 pb-0">
        <CardTitle className="text-3xl font-bold text-foreground mb-6">
          Détails du Projet
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 pt-4 pb-8">
        <div className="grid grid-cols-2 gap-y-2 text-base text-foreground">
          <span className="font-semibold">Client</span>
          <span>
            {firstName} {lastName || "–"}
          </span>
          <span className="font-semibold">Adresse</span>
          <span>{address || "–"}</span>
          <span className="font-semibold">Contrat</span>
          <span>{contract_type || "–"}</span>
          <span className="font-semibold">Créé le</span>
          <span>
            {created_at ? new Date(created_at).toLocaleDateString() : "–"}
          </span>
          <span className="font-semibold">Coût du bien</span>
          <span>
            {features?.baseValue
              ? `${features.baseValue.toLocaleString("fr-FR")} €`
              : "–"}
          </span>
          <span className="font-semibold">Surface</span>
          <span>
            {features?.size
              ? `${features.size.toLocaleString("fr-FR")} m²`
              : "–"}
          </span>
          <span className="font-semibold">Revenus fiscaux</span>
          <span>
            {features?.fiscalIncome
              ? `${features.fiscalIncome.toLocaleString("fr-FR")} €`
              : "–"}
          </span>
        </div>
        <div className="mt-6">
          <p className="font-semibold mb-2 text-base text-foreground">
            Pourcentage de complétion du projet
          </p>
          <div className="relative w-full">
            <Progress
              value={avanc}
              gradient={true}
              className="h-[38px] rounded-[10px] bg-[linear-gradient(90deg,_#E6E6E6_69.23%,_#FCFBFD_100%)]"
            />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-white font-bold select-none">
              {avanc}%
            </span>
          </div>
        </div>
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-between px-4 py-2 bg-card text-foreground text-base">
          <span className="font-semibold">Prochaine étape recommandée&nbsp;:</span>
          {isDraft ? (
            <NewProjectDialog draftProjectId={project.id}>
              <span className="underline cursor-pointer text-primary">
                {getNextStepAction(project)}
              </span>
            </NewProjectDialog>
          ) : (
            <span
              className="underline cursor-pointer"
            >
              {getNextStepAction(project)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsCard; 