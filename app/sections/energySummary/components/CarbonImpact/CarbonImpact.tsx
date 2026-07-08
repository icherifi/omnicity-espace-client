"use client";
import { ProjectType } from "@/types/project.types";
import { CarbonImpactChart } from "./CarbonImpactChart";

interface CarbonImpactProps {
  project: ProjectType;
}

const HORIZON = 20;
const CO2_PARIS_LISBONNE = 390; // kg CO2 par vol/passager

export const CarbonImpact = ({ project }: CarbonImpactProps) => {
  const surface = 0; // Surface habitable not available in ProjectType

  const gainRaw = Number(project.energyMixChoice?.pourcentageGainCEP) || 0;
  const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw;

  let egesBeforeM2 = 0;
  let egesAfterM2 = 0;

  // Use energyMixChoice EGES values when available
  egesBeforeM2 = Math.round(Number(project.energyMixChoice?.EGES) || 0);
  egesAfterM2 = Math.round(egesBeforeM2 * (1 - gain));

  const gesBeforeKg = egesBeforeM2 * surface;
  const gesAfterKg = egesAfterM2 * surface;

  const beforeT = Math.round((gesBeforeKg * HORIZON) / 1_000);
  const afterT = Math.round((gesAfterKg * HORIZON) / 1_000);
  const nbVols = Math.round((gesBeforeKg * HORIZON) / CO2_PARIS_LISBONNE);

  return (
    <section className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-8 flex-1">
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {egesBeforeM2.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                kgCO₂/m²/an
              </span>
            </span>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Avant rénovation
            </div>
          </div>
          <div className="h-[2px] w-2/3 bg-gray-300 dark:bg-gray-600 my-2 md:hidden" />
          <div>
            <span className="text-2xl md:text-3xl font-extrabold text-green-600 dark:text-green-400">
              {egesAfterM2.toLocaleString("fr-FR")}{" "}
              <span className="text-xs font-bold text-green-600 dark:text-green-400">
                kgCO₂/m²/an
              </span>
            </span>
            <div className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Après rénovation
            </div>
          </div>
        </div>
        <div className="flex-1 w-full min-w-[320px] max-w-md">
          <CarbonImpactChart before={egesBeforeM2} after={egesAfterM2} />
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600 my-8" />
      <div>
        <span className="text-xl font-extrabold text-gray-900 dark:text-white block mb-2">
          Impact carbone
        </span>
        <span className="text-gray-700 dark:text-gray-300 text-lg block">
          Cela correspond à <span className="font-bold">{nbVols}</span> vols
          Paris - Lisbonne en avion évités sur 20 ans
        </span>
      </div>
    </section>
  );
};
