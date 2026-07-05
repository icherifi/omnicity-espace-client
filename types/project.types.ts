export type EnergyRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface EnergyMix {
  CEP: number;
  EGES: number;
  confort: number;
  etiquetteEnergetique: string;
  etiquetteEGES?: string;
  etiquette?: string;
  pourcentageGainCEP: number;
  valeurVerte: number;
  coutTotal: number;
  montantAides: number;
  resteACharge: number;
  detailsPrix?: { nom: string; prix: number }[];
  renoMenuiserie?: boolean;
  renovationMurs?: boolean;
  renoComblesPerdus?: boolean;
  renoPorteFenetres?: boolean;
  renoComblesAmenages?: boolean;
  renoPlancherBasSousSol?: boolean;
  renoPlancherBasTerrePlein?: boolean;
  renoIsolationToitureTerrasse?: boolean;
  renoPlancherBasVideSanitaire?: boolean;
  appareilChauffage1?: string | null;
  appareilChauffage2?: string | null;
  typeVentilationExterieur?: string | null;
  remplacementEauChaudeSanitaire?: string | null;
  categoriesAides?: string;
}

export interface ProjectType {
  id: string;
  address: string;
  created_at?: string;
  targetedEnergyRating: EnergyRating;
  baseValue: number;
  stateOfPlay: string;
  costEstimation: {
    withAid: number;
    withoutAid: number;
  };
  state: "draft" | "inprogress" | "completed" | "archived";
  id_design: string | null;
  created_by: string;
  description: string;
  firstName: string;
  lastName: string;
  author?: string | null;
  imageFullPath?: string | null;
  strategy?: string;
  id_energy_choices?: number;
  energyMixChoice?: EnergyMix;
  initial_state?: InitialState;
}

// ---------------------------------------------------------------------------
// Simulation flow types (Kelvin API results — not stored in the project)
// ---------------------------------------------------------------------------

export interface MockEnergyResponse {
  CEP: number;
  EGES: number;
  confort: number;
  etiquetteEnergetique: string;
  etiquetteEGES?: string;
  etiquette?: string;
  bouquets: (EnergyMix | null)[];
  sessionId: string;
  etiquetteInitial: string;
  etiquetteEGESInitial: string;
  etiquetteEnergetiqueInitial: string;
  performanceEnergetique: {
    murs: any;
    toiture: any;
    vitrages: any;
    chauffage: any;
    plancherBas: any;
    ventilation: any;
    plancherHaut: any;
  };
  inputQr?: any;
  dpeNumber?: string;
  dpeData?: any;
  address?: string;
  timestamp?: string;
}

export interface WorkResultProps {
  bouquet: EnergyMix;
  initialState: MockEnergyResponse;
}

export interface GeneralInformation {
  size: string;
  roomsNumber: number;
  floorsNumber: number;
}

export interface StandardProjectFormData {
  firstName: string;
  lastName: string;
  projectName: string;
  projectAddress?: string;
  projectDescription?: string;
  baseValue?: number;
}

export interface DpeInformation {
  dpeNumber: string;
  address?: string;
  fiscalIncome: string;
  householdSize: string;
  occupancyStatus: string;
  baseValue: number;
}

export interface DpeProjectFormData {
  firstName: string;
  lastName: string;
  projectName: string;
  projectDescription?: string;
  dpeInformation: DpeInformation;
}
