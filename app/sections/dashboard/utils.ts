import { ProjectType } from "@/types/project.types";
import type { EnergyRating } from "@/components/projects/components/DpeBar";
import type { InitialState } from "@/types/simulation.types";

export interface EnergyMetrics {
  initialCEP: number | undefined;
  initialEGES: number | undefined;
  targetCEP: number | undefined;
  targetEGES: number | undefined;
  gainCEP: number; // rapport 0-1, 0 si inconnu
  gainGES: number; // rapport 0-1, 0 si inconnu
}

export interface InitialStateDiagnostics {
  constructionYear: number | undefined;
  livingArea: number | undefined;
  numberOfLevels: number | undefined;
  hasGarage: boolean;
  wallMaterial: string | undefined;
  generatorType: string | undefined;
  generatorEnergy: string | undefined;
  hotWaterType: string | undefined;
  hotWaterEnergy: string | undefined;
  ventsType: string | undefined;
  hasVents: boolean;
  sharedWalls: boolean;
  closeToHistoricalMonument: boolean;
  confidenceScore: number | undefined;
  energyLossPercentage: {
    walls: number | undefined;
    openings: number | undefined;
    lowFloor: number | undefined;
    highFloor: number | undefined;
  };
}

/**
 * Calcule les métriques CEP / GES avant et après travaux.
 * Priorités:
 * 1. Utilise initial_state.annual_energy_consumption si disponible (valeur CEP fiable du diagnostic)
 * 2. Sinon, rétro-calcule depuis energyMixChoice + gain
 * 3. Pour EGES: utilise energyMixChoice ou retour à undefined
 */
export function getEnergyMetrics(project: ProjectType): EnergyMetrics {
  const mix = project.energyMixChoice;
  const initialState = project.initial_state;

  const targetCEP = mix?.CEP;
  const targetEGES = mix?.EGES;

  // Prioritize initial_state.annual_energy_consumption as the authoritative CEP value
  let initialCEP =
    initialState?.annual_energy_consumption !== undefined
      ? Math.round(initialState.annual_energy_consumption)
      : undefined;

  // If no initial_state CEP, fall back to retro-calculation
  if (initialCEP === undefined && targetCEP !== undefined) {
    const gainRaw = Number(mix?.pourcentageGainCEP);
    const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw;
    if (gain > 0 && gain < 1) {
      initialCEP = Math.round(targetCEP / (1 - gain));
    }
  }

  // EGES: only from energyMixChoice, no diagnostic source available
  let initialEGES: number | undefined = undefined;
  if (
    targetEGES !== undefined &&
    targetCEP !== undefined &&
    initialCEP !== undefined
  ) {
    const gainCEP = (initialCEP - targetCEP) / initialCEP;
    if (gainCEP > 0) {
      initialEGES = Math.round(targetEGES / (1 - gainCEP));
    }
  }

  const gainRaw = Number(mix?.pourcentageGainCEP);
  const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw;

  const gainCEP =
    initialCEP && targetCEP ? (initialCEP - targetCEP) / initialCEP : gain;
  const gainGES =
    initialEGES && targetEGES ? (initialEGES - targetEGES) / initialEGES : gain;

  return { initialCEP, initialEGES, targetCEP, targetEGES, gainCEP, gainGES };
}

/**
 * Extrait les informations de diagnostic du initial_state.
 * Retourne des valeurs lisibles avec fallbacks.
 */
export function getInitialStateDiagnostics(
  initialState: InitialState | undefined,
): InitialStateDiagnostics {
  if (!initialState) {
    return {
      constructionYear: undefined,
      livingArea: undefined,
      numberOfLevels: undefined,
      hasGarage: false,
      wallMaterial: undefined,
      generatorType: undefined,
      generatorEnergy: undefined,
      hotWaterType: undefined,
      hotWaterEnergy: undefined,
      ventsType: undefined,
      hasVents: false,
      sharedWalls: false,
      closeToHistoricalMonument: false,
      confidenceScore: undefined,
      energyLossPercentage: {
        walls: undefined,
        openings: undefined,
        lowFloor: undefined,
        highFloor: undefined,
      },
    };
  }

  return {
    constructionYear: initialState.construction_year,
    livingArea: initialState.living_area,
    numberOfLevels: initialState.house_number_of_levels,
    hasGarage: initialState.garage || false,
    wallMaterial: initialState.wall_material,
    generatorType: initialState.generator_type,
    generatorEnergy: initialState.generator_energy,
    hotWaterType: initialState.hot_water_type,
    hotWaterEnergy: initialState.hot_water_energy,
    ventsType: initialState.vents_type,
    hasVents: initialState.has_vents || false,
    sharedWalls: initialState.shared_walls || false,
    closeToHistoricalMonument:
      initialState.close_to_historical_monument || false,
    confidenceScore: initialState.confidence_score,
    energyLossPercentage: {
      walls: initialState.energy_loss_percentage?.walls,
      openings: initialState.energy_loss_percentage?.openings,
      lowFloor: initialState.energy_loss_percentage?.low_floor,
      highFloor: initialState.energy_loss_percentage?.high_floor,
    },
  };
}

/**
 * Retourne des coûts à zéro — les données de coûts DPE ne sont plus disponibles.
 * Le gainCep/gainGes est dérivé des métriques énergétiques.
 */
export function computeEnergyCosts(project: ProjectType) {
  const metrics = getEnergyMetrics(project);
  const zero = { chauffage: 0, ecs: 0, eclairage: 0, auxiliaires: 0 };
  return {
    before: zero,
    after: zero,
    totalBefore: 0,
    totalAfter: 0,
    monthlyBefore: 0,
    monthlyAfter: 0,
    gainCep: metrics.gainCEP,
    gainGes: metrics.gainGES,
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
