// Mapping des catégories d'aides MaPrimeRénov'
// Source : https://www.service-public.fr/particuliers/vosdroits/F35083

export const AID_CATEGORIES = {
  bleu: {
    label: "Ménage très modeste (Bleu)",
    taux: [
      { gain: 2, taux: 80, plafond: 40000 },
      { gain: 3, taux: 80, plafond: 55000 },
      { gain: 4, taux: 80, plafond: 70000 },
    ],
    bonification: 10,
    maxAidPercent: 100,
    incomeCeilings: {1:17173,2:25115,3:30206,4:35285,5:40388,add:5094},
    description: "80% du montant HT des travaux dans la limite d'un plafond selon le gain de classes DPE. +10% si sortie de passoire thermique (atteinte au moins D)."
  },
  jaune: {
    label: "Ménage modeste (Jaune)",
    taux: [
      { gain: 2, taux: 60, plafond: 40000 },
      { gain: 3, taux: 60, plafond: 55000 },
      { gain: 4, taux: 60, plafond: 70000 },
    ],
    bonification: 10,
    maxAidPercent: 80,
    incomeCeilings: {1:22015,2:32197,3:38719,4:45234,5:51775,add:6525},
    description: "60% du montant HT des travaux dans la limite d'un plafond selon le gain de classes DPE. +10% si sortie de passoire thermique (atteinte au moins D)."
  },
  violet: {
    label: "Ménage intermédiaire (Violet)",
    taux: [
      { gain: 2, taux: 45, plafond: 40000 },
      { gain: 3, taux: 50, plafond: 55000 },
      { gain: 4, taux: 50, plafond: 70000 },
    ],
    bonification: 10,
    maxAidPercent: 80,
    incomeCeilings: {1:30844,2:45340,3:54592,4:63844,5:73098,add:9254},
    description: "45 à 50% du montant HT des travaux dans la limite d'un plafond selon le gain de classes DPE. +10% si sortie de passoire thermique (atteinte au moins D)."
  },
  rose: {
    label: "Ménage supérieur (Rose)",
    taux: [
      { gain: 2, taux: 10, plafond: 40000 },
      { gain: 3, taux: 15, plafond: 55000 },
      { gain: 4, taux: 20, plafond: 70000 },
    ],
    bonification: 10,
    maxAidPercent: 50,
    incomeCeilings: {1:30844,2:45340,3:54592,4:63844,5:73098,add:9254},
    description: "10 à 20% du montant HT des travaux dans la limite d'un plafond selon le gain de classes DPE. +10% si sortie de passoire thermique (atteinte au moins D)."
  },
};

export function getAidCategoryInfo(category: string) {
  if (!category) return null;
  const key = category.toLowerCase() as keyof typeof AID_CATEGORIES;
  return AID_CATEGORIES[key] || null;
}

export function getTauxForGain(cat: any, gainGroup: number) {
  if (!cat || !cat.taux) return null;
  const t = cat.taux.find((x: any) => x.gain === gainGroup);
  return t || cat.taux[0];
}

export function getIncomeLimit(cat:any, persons:number){
  if(!cat||!cat.incomeCeilings)return null;
  const p=Math.min(persons,5);
  const base=cat.incomeCeilings[p];
  if(persons>5) return base+cat.incomeCeilings.add*(persons-5);
  return base;
}
