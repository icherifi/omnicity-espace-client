"use client";

import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";
import { CostBreakdown } from "@/app/sections/energySummary/components/CostBreakdown";
import { EnergySavings } from "@/app/sections/energySummary/components/EnergySavings/EnergySavings";
import { CarbonImpact } from "@/app/sections/energySummary/components/CarbonImpact/CarbonImpact";
import { FinancialAid } from "@/app/sections/energySummary/components/FinancialAid/FinancialAid";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, TrendingUp } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import {
  computeEnergyCosts,
  getEnergyMetrics,
} from "@/app/sections/dashboard/utils";
import { useAppRouter } from "@/hooks/useAppRouter";

export default function EnergySummarySection({
  onClose,
}: {
  onClose: () => void;
}) {
  const { currentProjectDisplayed } = useDashboardContext();
  const { projects } = useProjectsContext();
  const { navigateBackToProject } = useAppRouter();

  const [years, setYears] = useState(5);
  const [priceRate, setPriceRate] = useState(0.03);

  const greenValue = useMemo(() => {
    const baseValue = Number(currentProjectDisplayed?.baseValue) || 0;
    const greenRate =
      currentProjectDisplayed?.energyMixChoice?.valeurVerte ?? 0;
    const before = baseValue;
    const after = Math.round(baseValue * (1 + greenRate));
    return {
      before: before ? before.toLocaleString("fr-FR") : "—",
      after: after ? after.toLocaleString("fr-FR") : "—",
    };
  }, [currentProjectDisplayed]);

  const costs = computeEnergyCosts(currentProjectDisplayed as any);
  const metrics = getEnergyMetrics(currentProjectDisplayed as any);
  const showEnergySavings =
    costs.totalBefore > 0 || metrics.initialCEP !== undefined;

  if (projects.length === 0) {
    return null;
  }

  if (!currentProjectDisplayed) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Sélectionnez ou créez un projet pour commencer.
      </div>
    );
  }

  const handleBackToDashboard = () => {
    if (currentProjectDisplayed) {
      navigateBackToProject(currentProjectDisplayed.id);
    }
  };

  return (
    <div className="space-y-6 mx-auto px-4">
      <div className="flex justify-end">
        <Button
          onClick={handleBackToDashboard}
          variant="outline"
          size="lg"
          className="rounded-[12px]"
        >
          Retourner sur le Tableau de bord{" "}
          <ChevronLeft className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-8 w-full max-w-full h-full">
          <CostBreakdown project={currentProjectDisplayed} />
          <CarbonImpact project={currentProjectDisplayed} />
          <div className="flex-1 flex items-end w-full">
            <div className="w-full h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-2 flex flex-col items-center shadow-sm">
              <div className="flex gap-2 items-end mb-2">
                <div className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
                  {greenValue.before}€
                </div>
                <span className="text-md text-muted-foreground">→</span>
                <div className="text-2xl font-bold leading-tight text-green-600 dark:text-green-400">
                  {greenValue.after}€
                </div>
              </div>
              <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700 my-2" />
              <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                Valeur verte
              </div>
              <div className="text-base md:text-lg text-center mb-2 flex justify-center gap-2 text-gray-700 dark:text-gray-300">
                <Info
                  className="inline-block mt-2 ml-2 w-5 h-5 text-blue-400 dark:text-blue-300"
                  aria-hidden="true"
                />
                La valeur verte est la hausse de valeur d'un bien immobilier
                grâce à son amélioration énergétique
              </div>
              {Number(currentProjectDisplayed?.baseValue) > 0 &&
                typeof currentProjectDisplayed?.energyMixChoice?.valeurVerte ===
                  "number" && (
                  <div className="text-base md:text-lg text-center text-green-700 dark:text-green-400 font-semibold mt-1 flex items-center justify-center gap-2">
                    <TrendingUp
                      className="inline-block w-5 h-5 text-green-600 dark:text-green-400"
                      aria-hidden="true"
                    />
                    La valeur de votre bien a augmenté de&nbsp;
                    {Math.round(
                      (currentProjectDisplayed.energyMixChoice.valeurVerte ??
                        0) * 100,
                    )}
                    % &nbsp;grâce à la rénovation énergétique.
                  </div>
                )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-full">
          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <Select
                value={years.toString()}
                onValueChange={(v) => setYears(parseInt(v, 10))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prévisions" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 15, 20].map((y) => (
                    <SelectItem
                      key={y}
                      value={y.toString()}
                    >{`Prévisions sur ${y} ans`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-0">
              <Select
                value={priceRate.toString()}
                onValueChange={(v) => setPriceRate(parseFloat(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Prix énergie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Prix énergie stable</SelectItem>
                  <SelectItem value="0.03">Prix énergie +3 % / an</SelectItem>
                  <SelectItem value="0.04">Prix énergie +4 % / an</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FinancialAid project={currentProjectDisplayed} />
          <EnergySavings
            project={currentProjectDisplayed}
            years={years}
            priceRate={priceRate}
          />
          {!showEnergySavings && (
            <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400 w-full">
              Données détaillées d'économies d'énergie indisponibles pour ce
              projet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
