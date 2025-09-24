"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";

export type AppRoute = "/" | "/project/[id]" | "/project/[id]/energy" | "/project/[id]/documents" | "/project/[id]/renovation" | "/project/[id]/relation" | "/assistance" | "/settings";

export const useAppRouter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setSection, setShowEnergySummary } = useSidebarContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const { projects } = useProjectsContext();

  const navigateToProjects = useCallback(() => {
    window.history.pushState({}, "", "/");
    setSection("projects");
    setShowEnergySummary(false);
  }, [setSection, setShowEnergySummary]);

  const navigateToProject = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}`);
    setSection("dashboard");
    setShowEnergySummary(false);
    
    // Trouver et définir le projet actuel
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectDisplayed(project);
    }
  }, [setSection, setShowEnergySummary, setCurrentProjectDisplayed, projects]);

  // Fonction pour naviguer vers le résumé énergétique d'un projet
  const navigateToProjectEnergy = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}/energy`);
    setSection("dashboard");
    setShowEnergySummary(true);
    
    // Trouver et définir le projet actuel
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProjectDisplayed(project);
    }
    
    // Scroll vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSection, setShowEnergySummary, setCurrentProjectDisplayed, projects]);

  // Fonction pour naviguer vers les documents d'un projet
  const navigateToDocuments = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}/documents`);
    setSection("documents");
    setShowEnergySummary(false);

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProjectDisplayed(project);
    }
  }, [setSection, setShowEnergySummary, setCurrentProjectDisplayed, projects]);

  // Fonction pour naviguer vers la section rénovation d'un projet
  const navigateToRenovation = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}/renovation`);
    setSection("renovation");
    setShowEnergySummary(false);

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProjectDisplayed(project);
    }
  }, [setSection, setShowEnergySummary, setCurrentProjectDisplayed, projects]);

  // Fonction pour naviguer vers la section relation d'un projet
  const navigateToRelation = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}/relation`);
    setSection("relation");
    setShowEnergySummary(false);

    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setCurrentProjectDisplayed(project);
    }
  }, [setSection, setShowEnergySummary, setCurrentProjectDisplayed, projects]);

  // Fonction pour naviguer vers la section assistance
  const navigateToAssistance = useCallback(() => {
    window.history.pushState({}, "", `/assistance`);
    setSection("assistance");
    setShowEnergySummary(false);
  }, [setSection, setShowEnergySummary]);

  // Fonction pour naviguer vers la section paramètres
  const navigateToSettings = useCallback(() => {
    window.history.pushState({}, "", `/settings`);
    setSection("settings");
    setShowEnergySummary(false);
  }, [setSection, setShowEnergySummary]);

  // Fonction pour revenir au tableau de bord d'un projet
  const navigateBackToProject = useCallback((projectId: string) => {
    window.history.pushState({}, "", `/project/${projectId}`);
    setShowEnergySummary(false);
  }, [setShowEnergySummary]);

  // Fonction pour revenir à la liste des projets
  const navigateBackToProjects = useCallback(() => {
    window.history.pushState({}, "", "/");
    setSection("projects");
    setShowEnergySummary(false);
  }, [setSection, setShowEnergySummary]);

  return {
    pathname,
    searchParams,
    navigateToProjects,
    navigateToProject,
    navigateToProjectEnergy,
    navigateToDocuments,
    navigateToRenovation,
    navigateToRelation,
    navigateToAssistance,
    navigateToSettings,
    navigateBackToProject,
    navigateBackToProjects,
  };
}; 