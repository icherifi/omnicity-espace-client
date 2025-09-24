import { ProjectType } from "@/types/project.types";
import { archiveProject, deleteProject } from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { SidebarSection } from "@/contexts/sidebar.context";
import { Dispatch, SetStateAction } from "react";

export type StatusFilter = "all" | "completed" | "in_progress" | "draft" | "archived";

export interface FilterOptions {
  searchInput: string;
  statusFilter: StatusFilter;
}

export interface PaginationOptions {
  currentPage: number;
  projectsPerPage: number;
}

export interface FilteredProjectsResult {
  filtered: ProjectType[];
  totalPages: number;
  startIndex: number;
  paginatedProjects: ProjectType[];
}

export interface ProjectActions {
  refreshProjects: () => void;
  setCurrentProjectDisplayed: (project: ProjectType) => void;
  setSection: Dispatch<SetStateAction<SidebarSection>>;
}

export const filterProjects = (
  projects: ProjectType[],
  { searchInput, statusFilter }: FilterOptions
): ProjectType[] => {
  const searchTerms = searchInput.toLowerCase().trim().split(/\s+/);
  
  const filtered = projects.filter((project) => {
    const clientName = `${project.firstName ?? ""} ${project.lastName ?? ""}`.toLowerCase();
    const address = project.address?.toLowerCase() || "";

    const matchesSearch = searchTerms.every(
      (term: string) => clientName.includes(term) || address.includes(term)
    );

    const matchesStatus =
      (statusFilter === "all" && project.state !== "archived") ||
      (statusFilter === "completed" && project.state === "completed") ||
      (statusFilter === "draft" && project.state === "draft") ||
      (statusFilter === "in_progress" && project.state === "inprogress") ||
      (statusFilter === "archived" && project.state === "archived");

    return matchesSearch && matchesStatus;
  });

  // Trier les projets par date de création, les plus récents en premier
  return filtered.sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return dateB.getTime() - dateA.getTime(); // Ordre décroissant (plus récent en premier)
  });
};

export const paginateProjects = (
  filteredProjects: ProjectType[],
  { currentPage, projectsPerPage }: PaginationOptions
): FilteredProjectsResult => {
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + projectsPerPage
  );

  return {
    filtered: filteredProjects,
    totalPages,
    startIndex,
    paginatedProjects,
  };
};

export const formatSalePrice = (baseValue?: number): string => {
  if (baseValue !== undefined) {
    return `${Math.round(baseValue).toLocaleString("fr-FR")} €`;
  }
  return "N/A";
};

export const getStatusText = (state: string): string => {
  switch (state) {
    case "completed":
      return "Terminé";
    case "draft":
      return "Brouillon";
    case "archived":
      return "Archivé";
    default:
      return "En cours...";
  }
};

export const getProjectImageUrl = (imageFullPath?: string): string => {
  if (imageFullPath) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${imageFullPath}`;
  }
  return "/placeholder.svg";
};

export const generatePageNumbers = (totalPages: number): number[] => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export const getPaginationInfo = (
  startIndex: number,
  projectsPerPage: number,
  filteredLength: number
): string => {
  const endIndex = Math.min(startIndex + projectsPerPage, filteredLength);
  return `Affichage de ${startIndex + 1} à ${endIndex} sur ${filteredLength} projets`;
};

export const handleProjectArchive = async (
  projectId: string,
  refreshProjects: () => void
): Promise<void> => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return;
  }
  const success = await archiveProject(projectId, token);
  if (success) {
    refreshProjects();
  }
};

export const handleProjectDelete = async (
  projectId: string,
  refreshProjects: () => void
): Promise<void> => {
  const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
  if (!confirmed) {
    return;
  }
  
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return;
  }
  const success = await deleteProject(projectId, token);
  if (success) {
    refreshProjects();
  }
};

export const handleProjectRowClick = (
  project: ProjectType,
  menuProjectId: string | null,
  actions: ProjectActions
): void => {
  if (menuProjectId !== null) return;
  actions.setCurrentProjectDisplayed(project);
  actions.setSection("dashboard");
};
  
export const calculateNewPage = (
  currentPage: number,
  direction: "previous" | "next",
  totalPages: number
): number => {
  if (direction === "previous") {
    return Math.max(currentPage - 1, 1);
  }
  return Math.min(currentPage + 1, totalPages);
};

export const calculateProjectPage = (
  projectId: string,
  projects: ProjectType[],
  filterOptions: FilterOptions,
  projectsPerPage: number
): number => {
  const filteredProjects = filterProjects(projects, filterOptions);
  const projectIndex = filteredProjects.findIndex(project => project.id === projectId);
  
  if (projectIndex === -1) return 1;
  
  return Math.floor(projectIndex / projectsPerPage) + 1;
};
