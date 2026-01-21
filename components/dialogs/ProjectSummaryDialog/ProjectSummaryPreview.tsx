import * as React from "react";
import { ProjectType } from "@/types/project.types";
import {
  computeEnergyCosts,
  getEnergyMetrics,
  overallEnergyLabel,
  ratingFromGes,
  getPerfBadge,
} from "@/app/sections/dashboard/utils";
import { getAidCategoryInfo } from "@/app/sections/energySummary/components/FinancialAid/utils";
import MiniEnergyLabel from "@/app/sections/energySummary/components/MiniEnergyLabel";
import MiniGESLabel from "@/app/sections/energySummary/components/MiniGESLabel";
import {
  BadgeEuro,
  Flame,
  Droplet,
  SunMedium,
  Wind,
  TrendingUp,
  ArrowDownRight,
  PiggyBank,
  Leaf,
} from "lucide-react";

interface ProjectRecapPreviewProps {
  project: ProjectType | null;
}

const HORIZON = 20;
const CO2_PARIS_LISBONNE = 390; // kg CO2 par vol/passager

const ProjectRecapPreview = React.forwardRef<
  HTMLDivElement,
  ProjectRecapPreviewProps
>(({ project }, ref) => {
  if (!project) {
    return (
      <div className="text-center text-gray-400">Aucun projet sélectionné</div>
    );
  }

  const dpeNumber =
    project.dpe?.dpeData?.features?.numeroDpe || "Non disponible";
  const address = project.address || "Non disponible";
  const typeBien = project.dpe?.dpeData?.typeBien || "Non disponible";
  const surface = project.features?.size || "Non disponible";

  // ----- Étiquettes et métriques -----
  const metrics = getEnergyMetrics(project);
  const initialLabel =
    overallEnergyLabel(metrics.initialCEP, metrics.initialEGES) ||
    project.energyResults?.etiquetteInitial ||
    "-";
  const targetLabel =
    overallEnergyLabel(metrics.targetCEP, metrics.targetEGES) ||
    project.targetedEnergyRating ||
    "-";

  const cepBefore = metrics.initialCEP ?? "-";
  const egesBefore = metrics.initialEGES ?? "-";
  const cepAfter = metrics.targetCEP ?? "-";
  const egesAfter = metrics.targetEGES ?? "-";

  const consoGain =
    metrics.initialCEP && metrics.targetCEP
      ? metrics.initialCEP - metrics.targetCEP
      : undefined;

  // ----- Coûts et économies -----
  const costs = computeEnergyCosts(project);
  const costsBefore = costs.totalBefore;
  const costsAfter = costs.totalAfter;

  const gainFinancier10 = (costsBefore - costsAfter) * 10;
  const gainFinancier15 = (costsBefore - costsAfter) * 15;

  // ----- Empreinte carbone -----
  const surfaceHab = Number(surface) || 0;
  const egesBeforeKg = (metrics.initialEGES ?? 0) * surfaceHab;
  const egesAfterKg = (metrics.targetEGES ?? 0) * surfaceHab;

  const beforeT = Math.round((egesBeforeKg * HORIZON) / 1000);
  const afterT = Math.round((egesAfterKg * HORIZON) / 1000);
  const nbVols = Math.round((egesBeforeKg * HORIZON) / CO2_PARIS_LISBONNE);

  // ----- Aides -----
  const totalAides = project.energyMixChoice?.montantAides;
  const categoriesAides = project.energyMixChoice?.categoriesAides;
  const catInfo = getAidCategoryInfo(categoriesAides || "");

  const valeurActuelle = project.features?.baseValue
    ? Number(project.features.baseValue)
    : undefined;
  const valeurVerteRate = project.energyMixChoice?.valeurVerte ?? 0;
  const valeurApres = valeurActuelle
    ? Math.round(valeurActuelle * (1 + valeurVerteRate))
    : undefined;

  // ----- Équipements (notes) -----
  const perf = project.energyResults?.performanceEnergetique;
  const mursNote = perf?.murs?.EtatInitial?.Note;
  const plancherNote = perf?.plancherBas?.EtatInitial?.Note;
  const plafondNote = perf?.plancherHaut?.EtatInitial?.Note;
  const fenetresNote = perf?.vitrages?.EtatInitial?.Note;

  return (
    <div
      ref={ref}
      className="bg-white rounded-xl shadow w-full flex flex-col gap-8 border border-gray-200 text-base md:text-lg"
    >
      <div className="w-full bg-[#AF80FF] flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="logo"
            width={120}
            height={40}
            crossOrigin="anonymous"
          />
        </div>
        <div className="text-white text-sm flex flex-col items-end">
          {dpeNumber !== "Non disponible" && (
            <span>N° DPE&nbsp;: {dpeNumber}</span>
          )}
          <span>Adresse&nbsp;: {address}</span>
          <span>Surface&nbsp;: {surface} m²</span>
          <span>
            Date du jour&nbsp;: {new Date().toLocaleDateString("fr-FR")}
          </span>
          {project.created_at && (
            <span>
              Créé le&nbsp;:{" "}
              {new Date(project.created_at).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 pt-0 flex flex-col gap-8">
        {/* ÉTAT ACTUEL */}
        <section className="mt-[100px] mb-[150px] border border-gray-200 rounded-2xl bg-white p-6 space-y-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900">État actuel</h3>
          <div className="w-full mt-6 flex items-center justify-around gap-12">
            <div className="mt-10 flex flex-col justify-center items-center w-40">
              <MiniEnergyLabel
                rating={initialLabel as any}
                className="scale-150"
              />
              <span className="text-xs mt-2 text-gray-900">Énergie</span>
              <span className="font-medium mt-1 text-gray-900">
                {cepBefore} kWh/m²/an
              </span>
            </div>
            <div className="mt-10 flex flex-col justify-center items-center w-40">
              <MiniGESLabel
                rating={
                  (project.energyResults?.etiquetteEGESInitial || "G") as any
                }
                className="scale-150"
              />
              <span className="text-xs mt-2 text-gray-900">GES</span>
              <span className="font-medium mt-1 text-gray-900">
                {egesBefore} kgCO₂/m²/an
              </span>
            </div>
          </div>

          {/* Consommation énergie actuelle */}
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-gray-900">
              Consommation d'énergie actuelle
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Flame className="h-6 w-6 text-red-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Chauffage</div>
                  <div className="text-gray-700">
                    {costs.before.chauffage?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Droplet className="h-6 w-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">ECS</div>
                  <div className="text-gray-700">
                    {costs.before.ecs?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <SunMedium className="h-6 w-6 text-yellow-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Éclairage</div>
                  <div className="text-gray-700">
                    {costs.before.eclairage?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Wind className="h-6 w-6 text-cyan-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Ventilation</div>
                  <div className="text-gray-700">
                    {costs.before.auxiliaires?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <BadgeEuro className="h-6 w-6 text-green-600" />
                <div className="flex-1 font-bold text-gray-900">
                  Coût total&nbsp;: {costsBefore?.toLocaleString("fr-FR")} € /
                  an
                </div>
              </div>
            </div>
          </div>

          {/* État équipements */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4 text-gray-900">
              État des équipements
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Murs", note: mursNote },
                { label: "Plancher", note: plancherNote },
                { label: "Plafond", note: plafondNote },
                { label: "Portes/Fenêtres", note: fenetresNote },
              ]
                .filter(
                  ({ note }) =>
                    note !== undefined && note !== null && note !== "",
                )
                .map(({ label, note }) => {
                  const badge = getPerfBadge(note);
                  return (
                    <div
                      key={label}
                      className={`flex flex-col items-center p-4 rounded-xl ${badge.color.replace("text-", "bg-").split(" ")[0]}`}
                    >
                      <span className="text-xs font-semibold mb-1 text-gray-900">
                        {label}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </section>

        {/* CONSOMMATION APRÈS RÉNOVATION */}
        <section className="mt-[50px] border border-gray-200 rounded-2xl bg-white p-6 space-y-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            Après rénovation
          </h3>
          <div className="flex flex-col md:flex-row md:items-center md:gap-6">
            <div className="w-full mt-6 flex items-center justify-around gap-12">
              <div className="mt-10 flex flex-col justify-center items-center w-40">
                <MiniEnergyLabel
                  rating={targetLabel as any}
                  className="scale-150"
                />
                <span className="text-xs mt-2 text-gray-900">Énergie</span>
                <span className="font-medium mt-1 text-gray-900">
                  {cepAfter} kWh/m²/an
                </span>
              </div>
              <div className="mt-10 flex flex-col justify-center items-center w-40">
                <MiniGESLabel
                  rating={(ratingFromGes(metrics.targetEGES) || "G") as any}
                  className="scale-150"
                />
                <span className="text-xs mt-2 text-gray-900">GES</span>
                <span className="font-medium mt-1 text-gray-900">
                  {egesAfter} kgCO₂/m²/an
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2 text-gray-900">
              Consommation d'énergie après rénovation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Flame className="h-6 w-6 text-red-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Chauffage</div>
                  <div className="text-gray-700">
                    {costs.after.chauffage?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Droplet className="h-6 w-6 text-blue-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">ECS</div>
                  <div className="text-gray-700">
                    {costs.after.ecs?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <SunMedium className="h-6 w-6 text-yellow-500" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Éclairage</div>
                  <div className="text-gray-700">
                    {costs.after.eclairage?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Wind className="h-6 w-6 text-cyan-600" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Ventilation</div>
                  <div className="text-gray-700">
                    {costs.after.auxiliaires?.toLocaleString("fr-FR")} € / an
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                <BadgeEuro className="h-6 w-6 text-green-600" />
                <div className="flex-1 font-bold text-gray-900">
                  Coût total&nbsp;: {costsAfter?.toLocaleString("fr-FR")} € / an
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINANCES */}
        <section className="mb-[200px] border border-gray-200 rounded-2xl bg-white p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-900">Finances</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-lime-50 rounded-xl flex items-center gap-4">
              <BadgeEuro className="h-8 w-8 text-lime-600" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900">
                  Aides publiques
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalAides
                    ? Math.round(totalAides).toLocaleString("fr-FR")
                    : "-"}{" "}
                  €
                </div>
                <div className="text-xs text-gray-600">
                  {catInfo?.label || "Catégorie inconnue"}
                </div>
              </div>
            </div>
            {valeurActuelle && valeurApres && (
              <div className="p-4 bg-indigo-50 rounded-xl flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                  <div className="font-semibold text-gray-900">
                    Valeur verte
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Avant</span>
                  <span className="font-bold text-gray-900">
                    {valeurActuelle.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-900">Après</span>
                  <span className="font-bold text-indigo-700 text-gray-900">
                    {valeurApres.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium text-indigo-700">
                  +{Math.round(valeurVerteRate * 100)}% (
                  {(valeurApres - valeurActuelle).toLocaleString("fr-FR")} €)
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BILAN FUTUR */}
        <section className="border border-gray-200 rounded-2xl bg-white p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
            Bilan après travaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-green-50 flex flex-col items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="text-sm uppercase font-semibold text-green-700">
                Amélioration DPE
              </div>
              <div className="text-3xl font-extrabold text-green-700">
                {initialLabel} → {targetLabel}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-cyan-50 flex flex-col items-center gap-2">
              <ArrowDownRight className="h-8 w-8 text-cyan-600" />
              <div className="text-sm uppercase font-semibold text-cyan-700">
                Conso&nbsp;↓
              </div>
              <div className="text-3xl font-extrabold text-cyan-700">
                {consoGain ? consoGain.toLocaleString("fr-FR") : "-"} kWh
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 flex flex-col items-center gap-2">
              <BadgeEuro className="h-8 w-8 text-amber-600" />
              <div className="text-sm uppercase font-semibold text-amber-700">
                Économie annuelle
              </div>
              <div className="text-3xl font-extrabold text-amber-700">
                {(costsBefore - costsAfter).toLocaleString("fr-FR")} €
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-purple-50 rounded-xl flex items-center gap-4">
              <PiggyBank className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Gain financier sur 10 ans
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {gainFinancier10.toLocaleString("fr-FR")} €
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl flex items-center gap-4">
              <PiggyBank className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  Gain financier sur 15 ans
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {gainFinancier15.toLocaleString("fr-FR")} €
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INDICATEURS ÉNERGÉTIQUES */}
        <section className="border border-gray-200 rounded-2xl bg-white p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-900">
            Indicateurs énergétiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 flex flex-col items-center gap-2">
              <Leaf className="h-8 w-8 text-emerald-600" />
              <div className="text-sm uppercase font-semibold text-emerald-700">
                CO₂ après travaux
              </div>
              <div className="text-3xl font-extrabold text-emerald-700">
                {egesAfterKg.toLocaleString("fr-FR")} kg
              </div>
            </div>
            <div className="p-4 rounded-xl bg-sky-50 flex flex-col items-center gap-2">
              <TrendingUp className="h-8 w-8 text-sky-600" />
              <div className="text-sm uppercase font-semibold text-sky-700">
                Économie 20 ans
              </div>
              <div className="text-xl font-bold text-sky-700">
                {beforeT - afterT} t CO₂ = {nbVols} vols
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

export default ProjectRecapPreview;
