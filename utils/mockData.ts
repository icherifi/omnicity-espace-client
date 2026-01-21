// Mock data pour remplacer la logique complexe du formulaire énergétique
export const mockEnergyResults = {
  sessionId: "mock-session-id",
  CEP: 250,
  EGES: 45,
  confort: 2,
  etiquetteEnergetique: "D",
  etiquetteEGES: "D",
  etiquette: "D",
  etiquetteInitial: "D",
  etiquetteEGESInitial: "D",
  etiquetteEnergetiqueInitial: "D",
  bouquets: [
    {
      CEP: 180,
      EGES: 30,
      confort: 3,
      etiquetteEnergetique: "C",
      etiquetteEGES: "C",
      etiquette: "C",
      pourcentageGainCEP: 28,
      valeurVerte: 15000,
      coutTotal: 25000,
      montantAides: 8000,
      resteACharge: 17000,
      detailsPrix: [
        { nom: "Isolation des combles", prix: 8000 },
        { nom: "Changement de chauffage", prix: 12000 },
        { nom: "Isolation des murs", prix: 5000 },
      ],
      renoMenuiserie: false,
      renovationMurs: true,
      renoComblesPerdus: true,
      renoPorteFenetres: false,
      renoComblesAmenages: false,
      renoPlancherBasSousSol: false,
      renoPlancherBasTerrePlein: false,
      renoIsolationToitureTerrasse: false,
      renoPlancherBasVideSanitaire: false,
      appareilChauffage1: "Pompe à chaleur air/eau",
      appareilChauffage2: null,
      typeVentilationExterieur: "VMC double flux",
      remplacementEauChaudeSanitaire: null,
      categoriesAides: "MaPrimeRénov",
    },
    {
      CEP: 150,
      EGES: 25,
      confort: 3,
      etiquetteEnergetique: "B",
      etiquetteEGES: "B",
      etiquette: "B",
      pourcentageGainCEP: 40,
      valeurVerte: 25000,
      coutTotal: 40000,
      montantAides: 15000,
      resteACharge: 25000,
      detailsPrix: [
        { nom: "Isolation complète", prix: 15000 },
        { nom: "Pompe à chaleur", prix: 18000 },
        { nom: "VMC double flux", prix: 4000 },
        { nom: "Menuiseries", prix: 3000 },
      ],
      renoMenuiserie: true,
      renovationMurs: true,
      renoComblesPerdus: true,
      renoPorteFenetres: true,
      renoComblesAmenages: true,
      renoPlancherBasSousSol: true,
      renoPlancherBasTerrePlein: false,
      renoIsolationToitureTerrasse: false,
      renoPlancherBasVideSanitaire: false,
      appareilChauffage1: "Pompe à chaleur air/eau haute performance",
      appareilChauffage2: "Chauffe-eau thermodynamique",
      typeVentilationExterieur: "VMC double flux haut rendement",
      remplacementEauChaudeSanitaire: "Thermodynamique",
      categoriesAides: "MaPrimeRénov + CEE",
    },
  ],
  inputQr: {},
  performanceEnergetique: {
    murs: {
      EtatInitial: {
        Note: 2,
        Label: "Isolation insuffisante",
        Description: "Murs peu isolés, pertes importantes",
      },
      EtatRenove: {
        Note: 4,
        Label: "Bien isolé",
        Description: "Isolation performante par l'extérieur",
      },
    },
    toiture: {
      EtatInitial: {
        Note: 1,
        Label: "Non isolé",
        Description: "Combles perdus sans isolation",
      },
      EtatRenove: {
        Note: 5,
        Label: "Très bien isolé",
        Description: "Isolation renforcée 300mm",
      },
    },
    vitrages: {
      EtatInitial: {
        Note: 2,
        Label: "Simple vitrage",
        Description: "Menuiseries anciennes",
      },
      EtatRenove: {
        Note: 4,
        Label: "Double vitrage performant",
        Description: "Menuiseries PVC triple vitrage",
      },
    },
    chauffage: {
      EtatInitial: {
        Note: 2,
        Label: "Chaudière gaz ancienne",
        Description: "Rendement 75%",
        Energie: "Gaz",
        Type: "Chaudière conventionnelle",
      },
      EtatRenove: {
        Note: 5,
        Label: "Pompe à chaleur",
        Description: "COP 4.2",
        Energie: "Électricité",
        Type: "PAC air/eau",
      },
    },
    plancherBas: {
      EtatInitial: {
        Note: 3,
        Label: "Moyennement isolé",
        Description: "Isolation partielle",
      },
    },
    ventilation: {
      EtatInitial: {
        Note: 2,
        Label: "VMC simple flux",
        Description: "Ventilation basique",
      },
      EtatRenove: {
        Note: 4,
        Label: "VMC double flux",
        Description: "Récupération de chaleur",
      },
    },
    plancherHaut: {
      EtatInitial: {
        Note: 1,
        Label: "Non isolé",
        Description: "Plancher combles sans isolation",
      },
    },
  },
};

// Mock data pour les résultats par adresse (nouveau flow simplifié)
export const mockAddressResults = {
  energyRating: "D",
  recommendations: [
    "Isolation des combles perdus",
    "Remplacement du chauffage",
    "Isolation des murs par l'extérieur",
    "Installation VMC double flux",
  ],
  estimatedSavings: "35%",
  currentCEP: 280,
  currentEGES: 52,
  targetCEP: 180,
  targetEGES: 30,
  estimatedCost: {
    withAid: 18000,
    withoutAid: 32000,
    subsidies: 14000,
  },
  comfort: {
    current: 2,
    target: 4,
    improvements: [
      "Température homogène",
      "Réduction courants d'air",
      "Meilleure qualité d'air",
    ],
  },
};

// Mock data pour les résultats par DPE (flow existant simplifié)
export const mockDpeResults = {
  dpeNumber: "",
  energyRating: "C",
  recommendations: [
    "Optimisation du chauffage",
    "Amélioration de l'isolation",
    "Installation d'une VMC performante",
  ],
  estimatedSavings: "25%",
  currentCEP: 200,
  currentEGES: 35,
  targetCEP: 150,
  targetEGES: 25,
  estimatedCost: {
    withAid: 12000,
    withoutAid: 20000,
    subsidies: 8000,
  },
  comfort: {
    current: 3,
    target: 4,
    improvements: ["Meilleur contrôle température", "Réduction bruit"],
  },
};

// Fonction pour générer des résultats mockés basés sur l'adresse
export function generateMockResultsByAddress(address: string) {
  // Générer des variations basées sur l'adresse
  const addressHash = address.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const variation = Math.abs(addressHash) % 100;

  return {
    ...mockEnergyResults,
    sessionId: "address-session-" + Date.now(),
    CEP: 200 + variation,
    EGES: 35 + Math.floor(variation / 3),
    etiquetteInitial: variation < 30 ? "C" : variation < 60 ? "D" : "E",
    etiquetteEnergetique: variation < 40 ? "B" : variation < 70 ? "C" : "D",
    address: address,
    timestamp: new Date().toISOString(),
  };
}

// Fonction pour générer des résultats mockés basés sur le DPE
export function generateMockResultsByDpe(dpeNumber: string) {
  // Générer des variations basées sur le numéro DPE
  const dpeHash = dpeNumber.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const variation = Math.abs(dpeHash) % 100;

  const baseResults = {
    ...mockEnergyResults,
    sessionId: "dpe-session-" + Date.now(),
    CEP: 150 + variation,
    EGES: 25 + Math.floor(variation / 4),
    etiquetteInitial: variation < 25 ? "B" : variation < 50 ? "C" : "D",
    etiquetteEnergetique: variation < 30 ? "A" : variation < 60 ? "B" : "C",
    dpeNumber: dpeNumber,
    timestamp: new Date().toISOString(),
  };

  return {
    dpeData: {
      numero_dpe: dpeNumber,
      adresse: "Adresse générée depuis DPE " + dpeNumber.slice(-4),
      caracteristiques: {
        taille: 80 + variation,
        nombrePieces: Math.floor(variation / 20) + 3,
        nombreEtages: Math.floor(variation / 40) + 1,
      },
    },
    energyResults: baseResults,
  };
}
