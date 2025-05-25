export type EnergyRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface EnergyResults {
  CEP: number;
  EGES: number;
  confort: number;
  etiquetteEnergetique: string;
  etiquetteEGES?: string;
  etiquette?: string;
}

export interface IziResponse extends EnergyResults {
  bouquets: (EnergyMix | null)[];
  inputQr: any;
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
  initialState: IziResponse;
}

// TODO: typer dpeData
export interface Dpe {
  id: number;
  created_at: string;
  id_project: string;
  iziResponse: any;
  sessionId: string;
  dpeData: any;
}

export interface ProjectType {
  id: number;
  name: string;
  address: string;
  created_at?: string;
  actualEnergyRating: EnergyRating;
  targetedEnergyRating: EnergyRating;
  dpe?: Dpe;
  features: {
    size: string;
    roomsNumber: string;
    floorsNumber: string;
    baseValue: string;
  };
  stateOfPlay: string;
  costEstimation: {
    withAid: number;
    withoutAid: number;
  };
  state: "inprogress" | "completed";
  id_bouquet: string;
  id_design: string | null;
  created_by: string;
  description: string;
  authorName: string;
  imageFullPath?: string;
  iziResponse?: IziResponse;
  energyMixChoice?: EnergyMix;
}

export interface GeneralInformation {
  size: string;
  roomsNumber: number;
  floorsNumber: number;
}

export interface StandardProjectFormData {
  authorName: string;
  projectName: string;
  projectAddress?: string;
  projectDescription?: string;
  generalInformation: GeneralInformation;
  image?: File | null;
}

export interface DpeInformation {
  dpeNumber: string;
  fiscalIncome: string;
  householdSize: string;
  occupancyStatus: string;
  baseValue: string;
}

export interface DpeProjectFormData {
  authorName: string;
  projectName: string;
  dpeInformation: DpeInformation;
  image?: File | null;
}