import { ProjectType } from '@/types/project.types'

export function getUnitPriceFromDpe(project: ProjectType): number {
  const dpe = project.dpe?.dpeData
  const totalEuro   = Number(dpe?.couts?.cout_5_usages)
  const totalkWh = Number(dpe?.consommation?.conso_5_usages)

  if (totalEuro > 0 && totalkWh > 0) return +(totalEuro / totalkWh).toFixed(4)

  return 0.20                     // valeur plafond réglementaire 2024 élec.
}

export function computeAnnualEnergySavings(project: ProjectType): number {
  const beforeEF = Number(project.dpe?.dpeData?.consommation?.conso_5_usages)
  const gainRaw  = Number(project.energyMixChoice?.pourcentageGainCEP)

  if (!beforeEF || !gainRaw) return 0

  const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw  
  const deltaKWh = beforeEF * gain
  const unitEuro = getUnitPriceFromDpe(project)

  return Math.round(deltaKWh * unitEuro)
}
