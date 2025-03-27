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