"use client";

import React, { useEffect, useCallback } from "react";
import EnergyForm from "@/components/energy/EnergyForm";
import EnergyMixSolutions from "@/components/energy/EnergyMixSolutions";
import { useProjectForm } from "@/hooks/useProjectForm";
import { useSimulationResultsContext } from "@/contexts/simulationResults.context";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { ProjectService } from "@/services/project.service";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";

interface Props {
  onError?: (error: string) => void;
  onSuccess?: () => void;
  onQuit?: () => void;
}

export default function NewProjectEnergyForm({
  onError,
  onSuccess,
  onQuit,
}: Props) {
  const { getStandardFormData } = useProjectForm("standard");
  const {
    simulationCompleted,
    setSimulationCompleted,
    sessionId,
    isEnergyLabelSolutionsDisplayed,
  } = useSimulationResultsContext();

  const { refreshProjects, projects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const { resetProjectStandardForm } = useNewProjectStandardFormContext();

  // Remove the useEffect as we no longer need to track energy form display state

  const handleSubmit = useCallback(async () => {
    try {
      const standardData = getStandardFormData();
      // Vérifier si un projet brouillon existe déjà
      const storedId =
        typeof window !== "undefined"
          ? localStorage.getItem("newProjectId")
          : null;
      let projectId: string;

      if (storedId) {
        // Mise à jour du projet existant
        projectId = await ProjectService.updateStandardProject(
          storedId,
          standardData,
          {
            idBouquet: sessionId,
            energyFormCompleted: simulationCompleted,
            quizResults: JSON.parse(
              localStorage.getItem("quizResults") || "{}",
            ),
          },
        );
      } else {
        // Création d'un nouveau projet si aucun brouillon
        projectId = await ProjectService.createStandardProject(standardData, {
          idBouquet: sessionId,
          energyFormCompleted: simulationCompleted,
          quizResults: JSON.parse(localStorage.getItem("quizResults") || "{}"),
        });
        // Stocker l'ID du nouveau projet pour navigation automatique
        localStorage.setItem("newProjectId", projectId);
      }

      refreshProjects();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newProject = projects.find((p) => p.id === projectId);
      if (newProject) setCurrentProjectDisplayed(newProject);

      setSimulationCompleted(false);
      localStorage.removeItem("quizResults");
      resetProjectStandardForm();

      onSuccess?.();
    } catch (e: any) {
      console.error("Failed to create/update project", e);
      onError?.(
        e.message || "Une erreur est survenue lors de la sauvegarde du projet",
      );
    }
  }, [
    getStandardFormData,
    sessionId,
    simulationCompleted,
    projects,
    setCurrentProjectDisplayed,
    setSimulationCompleted,
    resetProjectStandardForm,
    onSuccess,
    onError,
  ]);

  useEffect(() => {
    if (simulationCompleted) {
      handleSubmit();
    }
  }, [simulationCompleted, handleSubmit]);

  return isEnergyLabelSolutionsDisplayed ? (
    <EnergyMixSolutions />
  ) : (
    <EnergyForm onQuit={onQuit} />
  );
}
