import React, { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { AlertCircle, CircleUser, FileText, Sun, Moon } from "lucide-react";
import {
  Professional,
  filterProfessionals,
  loadSearchResults,
  loadProfessionals,
  loadProQualifications,
  handleInfiniteScroll,
} from "./utils";
import SearchBar from "./components/SearchBar";
import ProfessionalCard from "./components/ProfessionalCard";
import ProfessionalDialog from "./components/ProfessionalDialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme.context";
import { createClient } from "@/utils/supabase/client";
import ProjectRecapDialog from "@/components/dialogs/ProjectSummaryDialog/ProjectSummaryDialog";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useSignOut } from "@/hooks/useSignOut";
import CurrentUserLabel from "@/components/CurrentUserLabel";

export default function RelationSection() {
  const [tab, setTab] = useState("professionals");
  const [search, setSearch] = useState("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [searchResults, setSearchResults] = useState<Professional[]>([]);
  const debouncedSearch = useDebounce(search, 300);
  const [isSearchFullscreen, setIsSearchFullscreen] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(6);
  const [displayedSearchCount, setDisplayedSearchCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [proQualifications, setProQualifications] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [openRecap, setOpenRecap] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { currentProjectDisplayed } = useDashboardContext();

  const handleLogout = useSignOut();

  const handleLoadSearchResults = async (query: string, cursor: string | null, append = false) => {
    await loadSearchResults(
      query,
      "all",
      cursor,
      append,
      setSearchResults,
      setHasMoreData,
      setSearchError,
      setIsLoading,
      setNextCursor
    );
  };

  const handleLoadProfessionals = async (page: number = 1, append: boolean = false) => {
    await loadProfessionals(
      page,
      append,
      setProfessionals,
      setHasMoreData,
      setSearchError,
      setIsLoading
    );
  };

  useEffect(() => {
    handleLoadProfessionals(1, false);
  }, []);

  useEffect(() => {
    if (isSearchFullscreen) {
      setCurrentPage(0);
      setHasMoreData(true);
      handleLoadSearchResults(debouncedSearch, null, false);
    }
  }, [debouncedSearch, isSearchFullscreen]);

  const filteredProfessionals = filterProfessionals(professionals, search, showNearbyOnly, activeFilters);

  const displayedProfessionals = isSearchFullscreen
    ? searchResults.slice(0, displayedSearchCount)
    : filteredProfessionals.slice(0, displayedCount);
  
  const hasMoreLocal = isSearchFullscreen 
    ? displayedSearchCount < searchResults.length
    : displayedProfessionals.length < filteredProfessionals.length;

  const hasMore = !isSearchFullscreen && displayedProfessionals.length < filteredProfessionals.length;

  const handleSearchFocus = () => {
    setCurrentPage(0);
    setHasMoreData(true);
    setIsSearchFullscreen(true);
    setDisplayedSearchCount(6);
  };

  const handleSearchClose = () => {
    setCurrentPage(1);
    setHasMoreData(true);
    setIsSearchFullscreen(false);
    setSearch("");
    setSearchResults([]);
    setDisplayedSearchCount(6);
  };

  const loadMore = useCallback(() => {
    if (isSearchFullscreen) {      
      if (displayedSearchCount < searchResults.length) {
        const increment = Math.min(6, searchResults.length - displayedSearchCount);
        setDisplayedSearchCount(prev => prev + increment);
        return;
      }
      
      if (hasMoreData && !isLoading && nextCursor) {
        handleLoadSearchResults(search, nextCursor, true);
      }
    } else {
      if (hasMore) {
        setDisplayedCount(prev => prev + 6);
      } else if (hasMoreData && !isLoading) {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        handleLoadProfessionals(nextPage, true);
      }
    }
  }, [isSearchFullscreen, hasMoreData, isLoading, currentPage, search, hasMore, displayedSearchCount, searchResults.length, nextCursor]);

  const resetDisplayCount = () => {
    setDisplayedCount(6);
    setDisplayedSearchCount(6);
  };

  useEffect(() => {
    resetDisplayCount();
  }, [search, activeFilters, showNearbyOnly]);

  useEffect(() => {
    const handleScroll = () => {
      handleInfiniteScroll(isLoading, hasMoreData, loadMore);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading, hasMoreData, loadMore]);

  const handleOpenDialog = async (pro: Professional) => {
    setSelectedPro(pro);
    setIsDialogOpen(true);
    await loadProQualifications(pro, setProQualifications, setIsDialogLoading);
  };

  if (isSearchFullscreen) {
    return (
      <div className="flex flex-1 w-full px-8 pb-8">
        <div className="flex-1">
          <div className="flex items-center flex-row justify-end gap-4 mb-4">
            <Button variant="outline" size={"lg"} className="w-fit rounded-[12px]" onClick={() => setOpenRecap(true)}>Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
            <p className="text-gray-900 dark:text-white text-center text-[20px] font-bold leading-[26.4px]">
              <CurrentUserLabel />
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Se déconnecter
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-center p-2">
                  <Sun className="h-4 w-4 mr-2" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                  <Moon className="h-4 w-4 ml-2" />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <SearchBar
              search={search}
              onSearchChange={setSearch}
              onSearchClose={handleSearchClose}
              placeholder="Ex: Architecte Paris, Ventilation, Etude solaire photovoltaïque, ..."
              isFullscreen={true}
            />
          </div>
          
          {searchError && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{searchError}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedProfessionals.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                pro={pro}
                onOpenDialog={handleOpenDialog}
              />
            ))}
          </div>
          
          {isLoading && (
            <div className="flex justify-center mt-8">
              <div className="text-gray-500 dark:text-gray-400">Chargement en cours...</div>
            </div>
          )}
          
          {displayedProfessionals.length === 0 && !isLoading && !searchError && (
            <div className="text-center text-gray-400 dark:text-gray-500 italic p-8">
              Aucun professionnel trouvé pour "{search}"
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 w-full px-8 pb-8 h-[calc(100vh-32px)]">
        <div className="flex-1 flex flex-col h-full">
          <div className="sticky top-0 z-20 pb-2">
            <div className="flex items-center flex-row justify-end gap-4 mb-4">
              <Button variant="outline" size={"lg"} className="w-fit rounded-[12px]" onClick={() => setOpenRecap(true)}>Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
              <p className="text-gray-900 dark:text-white text-center text-[20px] font-bold leading-[26.4px]">
                <CurrentUserLabel />
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Se déconnecter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <div className="flex items-center justify-center p-2">
                    <Sun className="h-4 w-4 mr-2" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                    <Moon className="h-4 w-4 ml-2" />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h1 className="text-4xl font-bold mb-6 pt-4 text-gray-900 dark:text-white">Mise en relation</h1>
            <div className="mb-6">
              <SearchBar
                search={search}
                onSearchChange={setSearch}
                onSearchFocus={handleSearchFocus}
                placeholder="Ex: isolation combles perdus paris, architecte lyon, ..."
                readOnly={true}
              />
            </div>
            <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                className={`pb-2 font-semibold text-lg border-b-2 transition-colors ${tab === "professionals" ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-400 dark:text-gray-500"}`}
                onClick={() => setTab("professionals")}
              >
                Professionnels
              </button>
              <button
                className={`pb-2 font-semibold text-lg border-b-2 transition-colors ${tab === "contacts" ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-400 dark:text-gray-500"}`}
                onClick={() => setTab("contacts")}
              >
                Autres contacts
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2">
            {tab === "professionals" && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {displayedProfessionals.map((pro) => (
                    <ProfessionalCard
                      key={pro.id}
                      pro={pro}
                      onOpenDialog={handleOpenDialog}
                    />
                  ))}
                </div>
                {isLoading && (
                  <div className="flex justify-center mt-8">
                    <div className="text-gray-500 dark:text-gray-400">Chargement en cours...</div>
                  </div>
                )}
              </>
            )}
            {tab === "contacts" && (
              <div className="text-gray-400 dark:text-gray-500 italic p-8">Aucun contact pour le moment.</div>
            )}
          </div>
        </div>
      </div>
      
      <ProfessionalDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedPro={selectedPro}
        proQualifications={proQualifications}
        isDialogLoading={isDialogLoading}
      />
      <ProjectRecapDialog open={openRecap} onOpenChange={setOpenRecap} project={currentProjectDisplayed} />
    </>
  );
} 