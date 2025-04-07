export const getEnergyLabelColor = (label: string) => {
  const colors = {
    'A': 'bg-[#319834]',
    'B': 'bg-[#33cc31]',
    'C': 'bg-[#fff200]',
    'D': 'bg-[#ff9a35]',
    'E': 'bg-[#ff5a35]',
    'F': 'bg-[#fe0000]',
    'G': 'bg-[#960032]'
  };
  return colors[label as keyof typeof colors] || 'bg-gray-500';
}; 

export const getConfortLabel = (confort: number): string => {
  switch (confort) {
    case 1:
      return "Confort faible";
    case 2:
      return "Confort moyen";
    case 3:
      return "Confort optimal";
    default:
      return "Confort non défini";
  }
};

export function getFuturEnergyConsumption(currentEnergyConsumption: number, pourcentageGainCEP: number) {
  return Math.round(currentEnergyConsumption * (1 - pourcentageGainCEP));
}