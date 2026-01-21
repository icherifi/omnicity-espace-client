export type EnergyRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface EnergyResults {
  CEP: number;
  EGES: number;
  confort: number;
  etiquetteEnergetique: string;
  etiquetteEGES?: string;
  etiquette?: string;
}

// Interface simplifiée pour les réponses mock
export interface MockEnergyResponse extends EnergyResults {
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

export interface EnergyMix extends EnergyResults {
  pourcentageGainCEP: number;
  valeurVerte: number;
  coutTotal: number;
  montantAides: number;
  resteACharge: number;
  detailsPrix?: any[];
  renoMenuiserie?: boolean;
  renovationMurs?: boolean;
  renoComblesPerdus?: boolean;
  renoPorteFenetres?: boolean;
  renoComblesAmenages?: boolean;
  renoPlancherBasSousSol?: boolean;
  renoPlancherBasTerrePlein?: boolean;
  renoIsolationToitureTerrasse?: boolean;
  renoPlancherBasVideSanitaire?: boolean;
  appareilChauffage1?: string;
  appareilChauffage2?: string;
  typeVentilationExterieur?: string;
  remplacementEauChaudeSanitaire?: null;
  categoriesAides?: string;
}

export interface WorkResultProps {
  bouquet: EnergyMix;
  initialState: MockEnergyResponse;
}

// TODO: typer dpeData
export interface Dpe {
  id: string;
  created_at: string;
  id_project: string;
  energyResults: any;
  sessionId: string;
  dpeData: any;
}

export interface ProjectType {
  id: string;
  address: string;
  created_at?: string;
  actualEnergyRating: EnergyRating;
  targetedEnergyRating: EnergyRating;
  dpe?: Dpe;
  features: {
    size: string;
    roomsNumber: string;
    floorsNumber: string;
    baseValue?: string;
    fiscalIncome?: string;
    householdSize?: string;
    occupancyStatus?: string;
  };
  stateOfPlay: string;
  costEstimation: {
    withAid: number;
    withoutAid: number;
  };
  state: "draft" | "inprogress" | "completed" | "archived";
  id_bouquet: string;
  id_design: string | null;
  created_by: string;
  description: string;
  firstName: string;
  lastName: string;
  contract_type?: string;
  imageFullPath?: string;
  energyResults?: MockEnergyResponse;
  energyMixChoice?: EnergyMix;
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
  generalInformation: GeneralInformation;
  contractType?: string;
  fiscalIncome?: string;
  householdSize?: string;
  baseValue?: string;
  occupancyStatus?: string;
  image?: File | null;
}

export interface DpeInformation {
  dpeNumber: string;
  address?: string;
  fiscalIncome: string;
  householdSize: string;
  occupancyStatus: string;
  baseValue: string;
}

export interface DpeProjectFormData {
  firstName: string;
  lastName: string;
  projectName: string;
  dpeInformation: DpeInformation;
  projectDescription?: string;
  contract_type?: string;
  image?: File | null;
}
