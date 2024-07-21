// utils/formatNumber.ts
export function formatNumber(value: number) {
    return new Intl.NumberFormat('fr-FR').format(value); // Choisis la locale appropriée
  }
  