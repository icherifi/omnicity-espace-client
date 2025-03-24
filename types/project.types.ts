interface IziResponse {
    CEP: number;
    EGES: number;
    confort: number;
    etiquetteInitial: string;
    etiquetteEnergetiqueInitial: string;
    bouquets: (Bouquet | null)[];
}

interface Bouquet {
    confort: number;
    etiquette: string;
    etiquetteEnergetique: string;
    etiquetteEGES: string;
    pourcentageGainCEP: number;
    EGES: number;
    valeurVerte: number;
    coutTotal: number;
    montantAides: number;
    resteACharge: number;
}

export interface WorkResultProps {
    bouquet: Bouquet;
    initialState: IziResponse;
}