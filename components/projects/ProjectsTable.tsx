"use client";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useAppRouter } from "@/hooks/useAppRouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  ListFilter,
  Archive,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import DpeBar from "./components/DpeBar";
import { useDebounce } from "@/hooks/useDebounce";
import NewProjectDialog from "../dialogs/NewProjectDialog";
import EditProjectDialog from "../dialogs/EditProjectDialog";
import { ProjectType } from "@/types/project.types";
import {
  StatusFilter,
  filterProjects,
  paginateProjects,
  formatSalePrice,
  getStatusText,
  getProjectImageUrl,
  generatePageNumbers,
  getPaginationInfo,
  handleProjectArchive,
  handleProjectDelete,
  handleProjectRowClick,
  calculateNewPage,
  calculateProjectPage,
} from "@/app/sections/projects/utils";
import { overallEnergyLabel, getEnergyMetrics } from "@/app/sections/dashboard/utils";

interface ProjectsTableProps {
  navigateToProjectId?: string;
}

export default function ProjectsTable({ navigateToProjectId }: ProjectsTableProps) {
  const { projects, refreshProjects } = useProjectsContext();
  const { currentProjectDisplayed } =
    useDashboardContext();
  const { navigateToProject } = useAppRouter();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);
  const [menuProjectId, setMenuProjectId] = useState<string | null>(null);
  const projectsPerPage = 6;

  const filtered = filterProjects(projects, {
    searchInput: debouncedSearch,
    statusFilter,
  });
  
  const { totalPages, startIndex, paginatedProjects } = paginateProjects(
    filtered,
    { currentPage, projectsPerPage }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  // Navigation automatique vers un projet spécifique
  useEffect(() => {
    if (navigateToProjectId && projects.length > 0) {
      const targetPage = calculateProjectPage(
        navigateToProjectId,
        projects,
        { searchInput: debouncedSearch, statusFilter },
        projectsPerPage
      );
      setCurrentPage(targetPage);
    }
  }, [navigateToProjectId, projects, debouncedSearch, statusFilter, projectsPerPage]);

  const onArchiveProject = (projectId: string) => {
    handleProjectArchive(projectId, refreshProjects);
  };

  const onDeleteProject = (projectId: string) => {
    handleProjectDelete(projectId, refreshProjects);
  };

  const onRowClick = (project: ProjectType) => {
    if (menuProjectId !== null) return;
    
    // Utiliser le nouveau système de routing
    navigateToProject(project.id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(calculateNewPage(currentPage, "previous", totalPages));
  };

  const handleNextPage = () => {
    setCurrentPage(calculateNewPage(currentPage, "next", totalPages));
  };

  return (
    <div className="w-full h-full p-4 pt-0">
      <h1 className="text-2xl sm:text-4xl font-bold mb-6">Projets</h1>
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-8 focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-300 focus:border-purple-400 dark:focus:border-purple-300"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrer</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="px-2 py-1.5 text-sm font-semibold">Statut</div>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "all"}
              onCheckedChange={() => setStatusFilter("all")}
            >
              Tous
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "completed"}
              onCheckedChange={() => setStatusFilter("completed")}
            >
              Terminés
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "draft"}
              onCheckedChange={() => setStatusFilter("draft")}
            >
              Brouillons
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "in_progress"}
              onCheckedChange={() => setStatusFilter("in_progress")}
            >
              En cours
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={statusFilter === "archived"}
              onCheckedChange={() => setStatusFilter("archived")}
            >
              Archivés
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-full sm:w-auto sm:ml-auto">
          <NewProjectDialog />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border shadow bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow
              className="bg-gray-900 dark:bg-gray-800 hover:bg-gray-850 text-white"
            >
              <TableHead className="px-4 py-3 text-white font-bold text-lg w-1/3 min-w-[220px]">Client</TableHead>
              <TableHead className="px-4 py-3 text-white font-bold text-lg hidden lg:table-cell">
                Prix de vente
              </TableHead>
              <TableHead className="px-4 py-3 text-center text-white font-bold text-lg w-1/4 min-w-[180px] hidden lg:table-cell">DPE Projeté</TableHead>
              <TableHead className="px-4 py-3 text-center text-white font-bold text-lg hidden lg:table-cell">
                Statut
              </TableHead>
              <TableHead className="px-4 py-3 text-white font-bold text-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((project) => (
              <TableRow
                key={project.id}
                data-state={
                  currentProjectDisplayed && currentProjectDisplayed.id === project.id
                    ? "selected"
                    : undefined
                }
                className="border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => onRowClick(project)}
              >
                <TableCell className="px-4 py-3 flex items-center gap-2 w-1/3 min-w-[220px]">
                  <Image
                    src={getProjectImageUrl(project.imageFullPath)}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="rounded-xl border object-cover w-12 h-12 md:w-16 md:h-16 mr-4 md:mr-8 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[16px] md:text-[20px] font-bold leading-[20px] md:leading-[26.4px] text-gray-900 dark:text-white mb">{`${project.firstName} ${project.lastName}`}</span>
                    <span className="text-[14px] md:text-[16px] font-normal leading-[20px] md:leading-[28px] text-gray-600 dark:text-gray-300 truncate overflow-hidden whitespace-nowrap max-w-[180px] md:max-w-[260px]">
                      {project.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 font-bold text-lg hidden lg:table-cell text-gray-900 dark:text-white">
                  {formatSalePrice(Number(project.features.baseValue))}
                </TableCell>
                <TableCell className="px-4 py-3 w-1/4 min-w-[180px] hidden lg:table-cell">
                  <DpeBar
                    currentRating={
                      (() => {
                        const metrics = getEnergyMetrics(project);
                        return overallEnergyLabel(metrics.initialCEP, metrics.initialEGES) || project.actualEnergyRating;
                      })()
                    }
                    targetRating={
                      (() => {
                        const metrics = getEnergyMetrics(project);
                        return overallEnergyLabel(metrics.targetCEP, metrics.targetEGES) || project.targetedEnergyRating!;
                      })()
                    }
                  />
                </TableCell>
                <TableCell className="px-4 py-3 text-center hidden lg:table-cell">
                  <Badge variant={project.state} className="mt-4 mb-4 text-gray-900 dark:text-white">
                    {getStatusText(project.state)}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu
                    open={menuProjectId === project.id}
                    onOpenChange={(o) => setMenuProjectId(o ? project.id : null)}
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.stopPropagation();
                          setMenuProjectId(null);
                          setEditingProject(project);
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.stopPropagation();
                          setMenuProjectId(null);
                          onArchiveProject(project.id);
                        }}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={(e) => {
                          e.stopPropagation();
                          setMenuProjectId(null);
                          onDeleteProject(project.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
        <div className="text-sm text-gray-600 text-center sm:text-left">
          {getPaginationInfo(startIndex, projectsPerPage, filtered.length)}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <span className="hidden sm:inline">Précédent</span>
            <span className="sm:hidden">←</span>
          </Button>
          <div className="flex items-center gap-1">
            {generatePageNumbers(totalPages).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Suivant</span>
            <span className="sm:hidden">→</span>
          </Button>
        </div>
      </div>
      <EditProjectDialog
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdated={refreshProjects}
      />
    </div>
  );
}
