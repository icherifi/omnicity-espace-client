"use client";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, MoreHorizontal, ListFilter, Eye, Archive, Pencil, Trash2, Search } from "lucide-react";
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

export default function ProjectsTable() {
  const { projects } = useProjectsContext();
  const { currentProjectDisplayed, setCurrentProjectDisplayed } =
    useDashboardContext();
  const { setSection } = useSidebarContext();
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in_progress">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  const filtered = projects.filter(p => {
    const searchTerms = debouncedSearch.toLowerCase().trim().split(/\s+/);
    const clientName = p.authorName?.toLowerCase() || "";
    const address = p.address?.toLowerCase() || "";

    const matchesSearch = searchTerms.every((term: string) => 
      clientName.includes(term) || address.includes(term)
    );
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "completed" && p.state === "completed") ||
      (statusFilter === "in_progress" && p.state !== "completed");

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filtered.slice(startIndex, startIndex + projectsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleRowClick = (project: any) => {
    setCurrentProjectDisplayed(project);
    setSection("dashboard");
  };

  return (
    <div className="w-full h-full p-8">
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-8 focus:ring-2 focus:ring-[#a78bfa] focus:border-[#a78bfa]"
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
              Filtrer 
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
              checked={statusFilter === "in_progress"}
              onCheckedChange={() => setStatusFilter("in_progress")}
            >
              En cours
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="ml-auto">
          <Button className="bg-[#a78bfa] text-white h-12 rounded-[12px]">
            Nouveau Projet
            <PlusCircle className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border shadow bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#23263b] text-white" style={{ backgroundColor: '#23263b' }}>
              <TableHead className="px-4 py-3 text-white font-bold text-lg">Client</TableHead>
              <TableHead className="px-4 py-3 text-white font-bold text-lg">Prix de vente</TableHead>
              <TableHead className="px-4 py-3 text-center text-white font-bold text-lg">DPE Projeté</TableHead>
              <TableHead className="px-4 py-3 text-center text-white font-bold text-lg">Statut</TableHead>
              <TableHead className="px-4 py-3 text-white font-bold text-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProjects.map((p, idx) => (
              <TableRow
                key={p.id}
                data-state={
                  currentProjectDisplayed && currentProjectDisplayed.id === p.id
                    ? "selected"
                    : undefined
                }
                className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleRowClick(p)}
              >
                <TableCell className="px-4 py-3 flex items-center gap-2">
                  <Image
                    src={
                      p.imageFullPath
                        ? process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/" + p.imageFullPath
                        : "/placeholder.svg"
                    }
                    alt="avatar"
                    width={64}
                    height={64}
                    className="rounded-xl border object-cover w-16 h-16 mr-8 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[20px] font-bold leading-[26.4px] text-figma-secondary-color mb">{p.authorName}</span>
                    <span className="text-[16px] font-normal leading-[28px] text-figma-secondary-color">{p.address}</span>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 font-bold text-lg">
                  {p.costEstimation?.withoutAid !== undefined
                    ? `${Math.round(p.costEstimation.withoutAid).toLocaleString("fr-FR")} €`
                    : "N/A"}
                </TableCell>
                <TableCell className="px-4 py-3">
                  <DpeBar currentRating={p.actualEnergyRating} targetRating={p.targetedEnergyRating} />
                </TableCell>
                <TableCell className="px-4 py-3 text-center">
                  <Badge
                    variant={p.state}
                    className="mt-4 mb-4 text-black"
                  >
                    {p.state === "completed" ? "Terminé" : "En cours..."}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
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

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Affichage de {startIndex + 1} à {Math.min(startIndex + projectsPerPage, filtered.length)} sur {filtered.length} projets
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="cursor-pointer"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
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
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
}
