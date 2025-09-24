"use client";
import { CircleUser, Sun, Moon, FileText } from "lucide-react";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";
import NewProjectDialog from "@/components/dialogs/NewProjectDialog";
import * as React from "react";
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
import { getEnergyMetrics, computeEnergyCosts, getAidCoveragePercentage, overallEnergyLabel } from "./utils";
import { ProjectType } from "@/types/project.types";
import ProjectRecapDialog from "@/components/dialogs/ProjectSummaryDialog/ProjectSummaryDialog";
import { getCompletionPercentage } from "./project-completion";
import ImportPlanCard from "./components/ImportPlanCard";
import ProjectDetailsCard from "./components/ProjectDetailsCard";
import EnergyCurrentCard from "./components/EnergyCurrentCard";
import EnergyTargetCard from "./components/EnergyTargetCard";
import ProjectSummaryCard from "./components/ProjectSummaryCard";
import { useAppRouter } from "@/hooks/useAppRouter";

export default function DashboardSection({ onToggleSummary }: { onToggleSummary: () => void }) {
  const { currentProjectDisplayed } = useDashboardContext();
  const { projects } = useProjectsContext();
  const { navigateToProjectEnergy } = useAppRouter();
  const [openRecap, setOpenRecap] = React.useState(false);

  const {
    targetedEnergyRating,
    iziResponse,
  } = currentProjectDisplayed as any;

  const avanc = getCompletionPercentage(currentProjectDisplayed as ProjectType);
  const router = useRouter();

  const { theme, setTheme } = useTheme();

  const metrics = getEnergyMetrics(currentProjectDisplayed as ProjectType);
  const { initialCEP, initialEGES, targetCEP, targetEGES } = metrics;
  const costs = computeEnergyCosts(currentProjectDisplayed as ProjectType);
  const hasCosts = costs.totalBefore > 0;

  const currentLabel = overallEnergyLabel(initialCEP, initialEGES) || iziResponse?.etiquetteInitial || "-";
  const targetLabel  = overallEnergyLabel(targetCEP,  targetEGES)  || targetedEnergyRating || "-";

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); 
  };

  if (projects.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-muted-foreground">
          Vous n'avez pas encore de projet. Lancez-vous en créant votre premier projet&nbsp;! 🚀
        </p>
        <NewProjectDialog />
      </div>
    );
  }

  if (!currentProjectDisplayed) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Sélectionnez ou créez un projet pour commencer.
      </div>
    );
  }

  const isEnergyDataAvailable = !!iziResponse || !!(currentProjectDisplayed as any)?.dpe?.dpeData;
  const isEnergyMixAvailable = !!(currentProjectDisplayed as any).energyMixChoice;
  const isDraft = currentProjectDisplayed.state === "draft" || (!isEnergyDataAvailable && !isEnergyMixAvailable);

  return (
    <>
      <div className="flex items-center flex-row justify-end gap-4 mb-4">
        <Button variant="outline" size={"lg"} className="w-fit rounded-[12px]" onClick={() => setOpenRecap(true)}>Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
        <p className="text-gray-900 dark:text-white text-center text-[20px] font-bold leading-[26.4px]">
          Omnicity Admin
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
      <main className="flex flex-col xl:flex-row gap-6 p-6">
        <div className="flex flex-col gap-6 w-full xl:w-1/2">
          <ImportPlanCard />

          <ProjectDetailsCard project={currentProjectDisplayed as ProjectType} avanc={avanc} isDraft={isDraft} onToggleSummary={onToggleSummary} />
        </div>

        <div className="flex flex-col gap-6 w-full xl:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <EnergyCurrentCard
              currentLabel={currentLabel}
              initialCEP={initialCEP}
              initialEGES={initialEGES}
              costs={costs}
              hasCosts={hasCosts}
              iziResponse={iziResponse}
              isEnergyDataAvailable={isEnergyDataAvailable}
            />
            <EnergyTargetCard
              targetLabel={targetLabel}
              targetCEP={targetCEP}
              targetEGES={targetEGES}
              iziResponse={iziResponse}
              energyMixChoice={currentProjectDisplayed.energyMixChoice}
              isEnergyDataAvailable={isEnergyDataAvailable}
            />
          </div>

          <ProjectSummaryCard project={currentProjectDisplayed as ProjectType} isEnergyMixAvailable={isEnergyMixAvailable} />
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => {
                if (!isEnergyDataAvailable || !currentProjectDisplayed) return;
                navigateToProjectEnergy(currentProjectDisplayed.id);
              }}
              disabled={!isEnergyDataAvailable}
              className={`bg-[#AF80FF] text-white text-lg font-semibold rounded-xl px-8 py-4 w-full shadow-none border-none ${!isEnergyDataAvailable ? "opacity-40 cursor-not-allowed" : "hover:bg-[#AF80FF]/80"}`}
              style={{ boxShadow: "none" }}
            >
              Consulter le Rapport Énergétique
            </Button>
          </div>
        </div>
      </main>
      <ProjectRecapDialog open={openRecap} onOpenChange={setOpenRecap} project={currentProjectDisplayed} />
    </>
  );
} 