import { ProjectType } from "@/types/project.types";
import type { EnergyRating } from "@/components/projects/components/DpeBar";

export interface EnergyMetrics {
  initialCEP: number | undefined;
  initialEGES: number | undefined;
  targetCEP: number | undefined;
  targetEGES: number | undefined;
  gainCEP: number; // rapport 0-1, 0 si inconnu
  gainGES: number; // rapport 0-1, 0 si inconnu
}

/**
 * Calcule les métriques CEP / GES avant et après travaux.
 * – Utilise en priorité les données DPE (valeurs déjà exprimées par m²).
 * – Sinon retombe sur les valeurs énergétiques.
 */
export function getEnergyMetrics(project: ProjectType): EnergyMetrics {
  const dpeData = project.dpe?.dpeData;
  const hasDpe = !!dpeData;

  let initialCEP: number | undefined;
  let initialEGES: number | undefined;
  let targetCEP: number | undefined;
  let targetEGES: number | undefined;

  if (hasDpe) {
    const dpeConsoAvant = parseFloat(
      dpeData?.conso?.conso5UsagesAvantTravaux ?? "",
    );
    const dpeGesAvant = parseFloat(
      dpeData?.conso?.emissionGes5UsagesAvantTravaux ?? "",
    );
    if (!isNaN(dpeConsoAvant)) initialCEP = Math.round(dpeConsoAvant);
    if (!isNaN(dpeGesAvant)) initialEGES = Math.round(dpeGesAvant);

    const dpeConsoApres = parseFloat(
      dpeData?.travaux?.pack?.conso5UsagesApresTravaux ?? "",
    );
    const dpeGesApres = parseFloat(
      dpeData?.travaux?.pack?.emissionGes5UsagesApresTravaux ?? "",
    );
    if (!isNaN(dpeConsoApres)) targetCEP = Math.round(dpeConsoApres);
    if (!isNaN(dpeGesApres)) targetEGES = Math.round(dpeGesApres);
  }

  if (initialCEP === undefined) initialCEP = project.energyResults?.CEP;
  if (initialEGES === undefined) initialEGES = project.energyResults?.EGES;

  if (targetCEP === undefined || targetEGES === undefined) {
    const gainRaw = Number(project.energyMixChoice?.pourcentageGainCEP);
    const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw;
    if (targetCEP === undefined && initialCEP !== undefined)
      targetCEP = Math.round(initialCEP * (1 - gain));
    if (targetEGES === undefined && initialEGES !== undefined)
      targetEGES = Math.round(initialEGES * (1 - gain));
  }

  const gainCEP =
    initialCEP && targetCEP ? (initialCEP - targetCEP) / initialCEP : 0;
  const gainGES =
    initialEGES && targetEGES ? (initialEGES - targetEGES) / initialEGES : 0;

  return { initialCEP, initialEGES, targetCEP, targetEGES, gainCEP, gainGES };
}

/**
 * Calcule les dépenses énergétiques avant/après travaux (€/an)
 * – Utilise les coûts du DPE quand ils existent.
 * – Applique le gain CEP (consommation) sur chaque poste pour estimer l'après.
 */
export function computeEnergyCosts(project: ProjectType) {
  const dpeCosts = project.dpe?.dpeData?.couts as any | undefined;
  const before = {
    chauffage: Number(dpeCosts?.chauffage) || 0,
    ecs: Number(dpeCosts?.ecs) || 0,
    eclairage: Number(dpeCosts?.eclairage) || 0,
    auxiliaires: Number(dpeCosts?.auxiliaires) || 0,
  };
  const totalBefore = Object.values(before).reduce((s, n) => s + n, 0);

  // --- NOUVEAU : calcul du facteur réel si DPE ---
  let factor = 1;
  let gainCep = 0;
  let gainGes = 0;
  const dpeData = project.dpe?.dpeData;
  const avantStr = dpeData?.conso?.conso5UsagesAvantTravaux;
  const apresStr = dpeData?.travaux?.pack?.conso5UsagesApresTravaux;
  const avant = avantStr ? parseFloat(avantStr) : undefined;
  const apres = apresStr ? parseFloat(apresStr) : undefined;
  if (avant && apres !== undefined && avant > 0) {
    factor = apres / avant;
    gainCep = 1 - factor;
  } else {
    // fallback : gainCEP du bouquet
    const metrics = getEnergyMetrics(project);
    gainCep = metrics.gainCEP;
    factor = 1 - gainCep;
  }

  // --- GES ---
  let factorGes = 1;
  const avantGesStr = dpeData?.conso?.emissionGes5UsagesAvantTravaux;
  const apresGesStr = dpeData?.travaux?.pack?.emissionGes5UsagesApresTravaux;
  const avantGes = avantGesStr ? parseFloat(avantGesStr) : undefined;
  const apresGes = apresGesStr ? parseFloat(apresGesStr) : undefined;
  if (avantGes && apresGes !== undefined && avantGes > 0) {
    factorGes = apresGes / avantGes;
    gainGes = 1 - factorGes;
  } else {
    // fallback : gainGES du bouquet
    const metrics = getEnergyMetrics(project);
    gainGes = metrics.gainGES;
    factorGes = 1 - gainGes;
  }

  const after = {
    chauffage: Math.round(before.chauffage * factor),
    ecs: Math.round(before.ecs * factor),
    eclairage: Math.round(before.eclairage * factor),
    auxiliaires: Math.round(before.auxiliaires * factor),
  };
  const totalAfter = Object.values(after).reduce((s, n) => s + n, 0);

  const monthlyBefore = Math.round(totalBefore / 12);
  const monthlyAfter = Math.round(totalAfter / 12);

  return {
    before,
    after,
    totalBefore,
    totalAfter,
    monthlyBefore,
    monthlyAfter,
    gainCep,
    gainGes,
  };
}

/** Pourcentage des aides publiques par rapport au coût total des travaux (0-100). */
export function getAidCoveragePercentage(
  project: ProjectType,
): number | undefined {
  const total = project.energyMixChoice?.coutTotal;
  const aides = project.energyMixChoice?.montantAides;
  if (!total || !aides) return undefined;
  return Math.round((aides / total) * 100);
}

export function getPerfBadge(note: number | undefined) {
  if (note === 1)
    return {
      label: "Bien",
      color:
        "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900",
    };
  if (note === 2)
    return {
      label: "Moyen",
      color:
        "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900",
    };
  if (note === 3)
    return {
      label: "Mauvais",
      color: "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900",
    };
  return {
    label: "-",
    color: "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300",
  };
}

export function getChauffageNote(chauffage: any) {
  const keys = ["ApCh1", "ApCh2", "ECS"];
  const notes = keys
    .map((key) => chauffage?.EtatInitial?.[key]?.Note)
    .filter((n) => n != null);
  if (!notes.length) return undefined;
  return Math.round(
    notes.reduce((a: number, b: number) => a + b, 0) / notes.length,
  );
}

// --------------------------- Étiquette énergétique ---------------------------

// Seuils DPE 2021 (maison / appartement)
const CEP_THRESHOLDS = [70, 110, 180, 250, 330, 420]; // kWh/m²/an
const GES_THRESHOLDS = [6, 11, 30, 50, 70, 100]; // kgCO₂/m²/an
const LETTERS: EnergyRating[] = ["A", "B", "C", "D", "E", "F", "G"];

export function ratingFromCep(
  cep: number | undefined,
): EnergyRating | undefined {
  if (cep === undefined || isNaN(cep)) return undefined;
  for (let i = 0; i < CEP_THRESHOLDS.length; i++) {
    if (cep <= CEP_THRESHOLDS[i]) return LETTERS[i];
  }
  return "G";
}

export function ratingFromGes(
  ges: number | undefined,
): EnergyRating | undefined {
  if (ges === undefined || isNaN(ges)) return undefined;
  for (let i = 0; i < GES_THRESHOLDS.length; i++) {
    if (ges <= GES_THRESHOLDS[i]) return LETTERS[i];
  }
  return "G";
}

export function overallEnergyLabel(
  cep: number | undefined,
  ges: number | undefined,
): EnergyRating | undefined {
  const lCep = ratingFromCep(cep);
  const lGes = ratingFromGes(ges);
  if (!lCep) return lGes;
  if (!lGes) return lCep;
  return LETTERS[Math.max(LETTERS.indexOf(lCep), LETTERS.indexOf(lGes))];
}
