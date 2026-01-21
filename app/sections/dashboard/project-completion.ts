import { ProjectType } from "@/types/project.types";

export interface ProjectStep {
  id: string;
  name: string;
  description: string;
  percentage: number;
  isCompleted: (project: ProjectType) => boolean;
  nextStepAction: string;
  isRequired: boolean;
}

export interface ProjectCompletion {
  currentStep: ProjectStep;
  nextStep: ProjectStep | null;
  completionPercentage: number;
  completedSteps: ProjectStep[];
  remainingSteps: ProjectStep[];
}

/**
 * Vérifie si un projet a des plans importés (fonction utilitaire pour les composants)
 */
export function checkPlansImported(
  project: ProjectType,
  hasPlans?: boolean,
): boolean {
  if (hasPlans !== undefined) {
    return hasPlans;
  }

  return project.state === "completed" || project.id_design !== null;
}

export const PROJECT_STEPS: ProjectStep[] = [
  {
    id: "project_creation",
    name: "Création du projet",
    description:
      "Informations de base du projet (client, adresse, caractéristiques)",
    percentage: 10,
    isCompleted: (project: ProjectType) => {
      return !!(project.firstName && project.lastName && project.address);
    },
    nextStepAction: "Compléter les informations du client",
    isRequired: true,
  },
  {
    id: "energy_assessment",
    name: "Diagnostic énergétique",
    description: "Évaluation de la performance énergétique actuelle",
    percentage: 25,
    isCompleted: (project: ProjectType) => {
      return !!(project.energyResults || project.dpe?.dpeData);
    },
    nextStepAction: "Effectuer le diagnostic énergétique",
    isRequired: true,
  },
  {
    id: "energy_analysis",
    name: "Analyse énergétique",
    description: "Analyse détaillée des consommations et émissions",
    percentage: 40,
    isCompleted: (project: ProjectType) => {
      return !!(project.energyResults?.CEP && project.energyResults?.EGES);
    },
    nextStepAction: "Analyser les données énergétiques",
    isRequired: true,
  },
  {
    id: "work_planning",
    name: "Planification des travaux",
    description: "Définition des solutions de rénovation et choix du bouquet",
    percentage: 60,
    isCompleted: (project: ProjectType) => {
      return !!project.energyMixChoice;
    },
    nextStepAction: "Choisir le plan de rénovation",
    isRequired: true,
  },
  {
    id: "cost_estimation",
    name: "Estimation des coûts",
    description: "Calcul des coûts et des aides disponibles",
    percentage: 75,
    isCompleted: (project: ProjectType) => {
      return !!(
        project.energyMixChoice?.coutTotal &&
        project.energyMixChoice?.montantAides
      );
    },
    nextStepAction: "Finaliser l'estimation des coûts",
    isRequired: true,
  },
  {
    id: "scan_import",
    name: "Import du plan LiDAR",
    description: "Import du plan 3D pour la visualisation",
    percentage: 85,
    isCompleted: (project: ProjectType) => {
      return checkPlansImported(project);
    },
    nextStepAction: "Importer le plan avec LiDAR",
    isRequired: false,
  },
  {
    id: "professional_contact",
    name: "Contact professionnel",
    description: "Mise en relation avec les professionnels",
    percentage: 90,
    isCompleted: (project: ProjectType) => {
      return project.state === "completed";
    },
    nextStepAction: "Prendre contact avec un professionnel",
    isRequired: true,
  },
  {
    id: "project_completion",
    name: "Finalisation du projet",
    description: "Validation et finalisation du projet de rénovation",
    percentage: 100,
    isCompleted: (project: ProjectType) => {
      return project.state === "completed";
    },
    nextStepAction: "Finaliser le projet",
    isRequired: true,
  },
];

/**
 * Calcule la complétion d'un projet en fonction des étapes définies
 */
export function calculateProjectCompletion(
  project: ProjectType,
): ProjectCompletion {
  const completedSteps = PROJECT_STEPS.filter((step) =>
    step.isCompleted(project),
  );
  const remainingSteps = PROJECT_STEPS.filter(
    (step) => !step.isCompleted(project),
  );

  let completionPercentage = 0;
  if (completedSteps.length > 0) {
    completionPercentage = Math.max(
      ...completedSteps.map((step) => step.percentage),
    );
  }

  const currentStep =
    completedSteps.length > 0
      ? completedSteps[completedSteps.length - 1]
      : PROJECT_STEPS[0];

  const nextStep = remainingSteps.length > 0 ? remainingSteps[0] : null;

  return {
    currentStep,
    nextStep,
    completionPercentage,
    completedSteps,
    remainingSteps,
  };
}

/**
 * Obtient l'étape actuelle d'un projet
 */
export function getCurrentStep(project: ProjectType): ProjectStep {
  const completion = calculateProjectCompletion(project);
  return completion.currentStep;
}

/**
 * Obtient la prochaine étape recommandée
 */
export function getNextStep(project: ProjectType): ProjectStep | null {
  const completion = calculateProjectCompletion(project);
  return completion.nextStep;
}

/**
 * Obtient le pourcentage de complétion d'un projet
 */
export function getCompletionPercentage(project: ProjectType): number {
  const completion = calculateProjectCompletion(project);
  return completion.completionPercentage;
}

/**
 * Obtient l'action recommandée pour la prochaine étape
 */
export function getNextStepAction(project: ProjectType): string {
  const nextStep = getNextStep(project);
  return nextStep ? nextStep.nextStepAction : "Projet terminé";
}

/**
 * Vérifie si une étape spécifique est complétée
 */
export function isStepCompleted(project: ProjectType, stepId: string): boolean {
  const step = PROJECT_STEPS.find((s) => s.id === stepId);
  return step ? step.isCompleted(project) : false;
}

/**
 * Obtient toutes les étapes d'un projet avec leur statut
 */
export function getProjectStepsStatus(
  project: ProjectType,
): Array<Omit<ProjectStep, "isCompleted"> & { isCompleted: boolean }> {
  return PROJECT_STEPS.map((step) => ({
    id: step.id,
    name: step.name,
    description: step.description,
    percentage: step.percentage,
    nextStepAction: step.nextStepAction,
    isRequired: step.isRequired,
    isCompleted: step.isCompleted(project),
  }));
}
