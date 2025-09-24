'use client'

import { ProjectType } from '@/types/project.types'
import { EnergySavingsChart } from './components/EnergySavingsChart'
import React from 'react'
import { computeEnergyCosts, getEnergyMetrics, overallEnergyLabel } from '../../../dashboard/utils'
import { Badge } from '@/components/ui/badge'

interface Props {
  project: ProjectType
  years?: number
  priceRate?: number
}

export const EnergySavings = ({ project, years = 5, priceRate = 0 }: Props) => {
  const costs = computeEnergyCosts(project as any)
  const metrics = getEnergyMetrics(project)
  const hasCosts = costs.totalBefore > 0

  let before = 0
  let after  = 0
  let unit: 'kWh' | '€' = '€'

  if (hasCosts) {
    before = Math.round(costs.totalBefore / 12)
    after  = Math.round(costs.totalAfter  / 12)
    unit = '€'
  } else {
    // Pas de coûts => on passe en mode consommation énergie (kWh)
    const surface = Number((project as any)?.features?.size) || 1 // 1 m² par défaut pour toujours afficher un graphique
    if (!metrics.initialCEP || !metrics.targetCEP) return null // CEP manquant ⇒ pas de données exploitables

    const beforeAnnualKWh = Math.round(metrics.initialCEP * surface)
    const afterAnnualKWh  = Math.round(metrics.targetCEP  * surface)
    before = Math.round(beforeAnnualKWh / 12)
    after  = Math.round(afterAnnualKWh  / 12)
    unit = 'kWh'
  }

  const gainPercent = before > 0 ? Math.round((1 - after / before) * 100) : 0
  const beforeLabel = overallEnergyLabel(metrics.initialCEP, metrics.initialEGES) || '–'
  const afterLabel  = overallEnergyLabel(metrics.targetCEP,  metrics.targetEGES)  || '–'

  return (
    <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">{before.toLocaleString('fr-FR')} {unit}</span>
          <span className="text-gray-500 dark:text-gray-400 text-lg mt-2">Avant rénovation</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-3xl font-extrabold text-green-600 dark:text-green-400">{after.toLocaleString('fr-FR')} {unit}</span>
          <span className="text-gray-500 dark:text-gray-400 text-lg mt-2">Après rénovation</span>
        </div>
      </div>

      <div className="w-full relative" style={{height: 260}}>
        <EnergySavingsChart
          beforeAnnual={before}
          afterAnnual={after}
          years={years}
          priceRate={priceRate}
          gainPercent={gainPercent}
          unit={unit}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
        {hasCosts && Object.entries(costs.before).map(([k, v], idx) => (
          <div
            key={k}
            className="flex items-center justify-between rounded bg-gray-50 dark:bg-gray-800 px-3 py-2"
            style={{ fontSize: 15 }}
          >
            <span className="capitalize text-gray-600 dark:text-gray-300 flex-1">{k}</span>
            <span className="flex items-center gap-2">
              <Badge variant="bad" className="text-base px-3 py-1.5">{Math.round(v/12).toLocaleString('fr-FR')}€</Badge>
              <span className="mx-1 text-gray-400 dark:text-gray-500 text-lg font-bold">→</span>
              <Badge variant="well" className="text-base px-3 py-1.5">{Math.round(((costs.after as any)[k])/12).toLocaleString('fr-FR')}€</Badge>
            </span>
          </div>
        ))}
      </div>

      {!hasCosts && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">Données économiques non disponibles pour ce projet ; le graphique représente la consommation énergétique (kWh).</p>
      )}
    </div>
  )
}
