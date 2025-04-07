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
  bouquets: (Bouquet | null)[];
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

export interface Bouquet extends EnergyResults {
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
  bouquet: Bouquet;
  initialState: IziResponse;
}

export interface Dpe {
  administratif: any;
  logement: any;
  logement_sortie: any;
  id_project: string

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
  choice?: Bouquet;
}