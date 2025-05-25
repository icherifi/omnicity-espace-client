'use client'

import { ProjectType } from '@/types/project.types'
import { EnergyRating } from '../EnergyLabel'
import { EnergySavingsChart } from './components/EnergySavingsChart'
import MiniEnergyLabel from '../MiniEnergyLabel'

interface Props {
  project: ProjectType
}

export const EnergySavings = ({ project }: Props) => {
  const couts = project.dpe?.dpeData.couts ?? {}
  const beforeHeating = Number(couts.chauffage ?? 0) 
  const beforeHotWater = Number(couts.ecs ?? 0)
  const beforeOther = Number(couts.autres ?? 0)
  const beforeTotal = beforeHeating + beforeHotWater + beforeOther

  const gainRaw = Number(project.energyMixChoice?.pourcentageGainCEP ?? 0)
  const gain = gainRaw > 1 ? gainRaw / 100 : gainRaw         
  const ratio = 1 - gain                                        

  const afterHeating = Math.round(beforeHeating  * ratio)
  const afterHotWater = Math.round(beforeHotWater * ratio)
  const afterOther = Math.round(beforeOther    * ratio)
  const afterTotal = afterHeating + afterHotWater + afterOther

  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-2xl font-bold text-[#0a1f33]">Économie d&apos;énergie</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <CostCard
          title="AVANT RÉNOVATION"
          color="text-red-500"
          heating={beforeHeating/12}
          hotWater={beforeHotWater/12}
          other={beforeOther/12}
          currentRating={project.actualEnergyRating as EnergyRating}
        />
        <CostCard
          title="APRÈS RÉNOVATION"
          color="text-green-600"
          heating={afterHeating/12}
          hotWater={afterHotWater/12}
          other={afterOther/12}
          currentRating={project.targetedEnergyRating as EnergyRating}
        />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <EnergySavingsChart
          beforeAnnual={beforeTotal}
          afterAnnual={afterTotal}
          actualEnergyRating={project.actualEnergyRating as EnergyRating}
          targetEnergyRating={project.targetedEnergyRating as EnergyRating}
        />
      </div>
    </div>
  )
}

interface CardProps {
  title: string
  color: string
  heating: number
  hotWater: number
  other: number
  currentRating: EnergyRating
}

const CostCard = ({
  title,
  color,
  heating,
  hotWater,
  other,
  currentRating,
}: CardProps) => (
  <div className="rounded-xl bg-white p-6 shadow-sm">
    <div className="mb-4 flex justify-between">
      <span className="text-lg font-bold text-[#0a1f33]">{title}</span>
      <MiniEnergyLabel rating={currentRating} />
    </div>

    {[
      { label: 'Chauffage',   value: heating },
      { label: 'Eau chaude',  value: hotWater },
      { label: 'Autres',      value: other },
    ].map(row => (
      <div key={row.label} className="mb-3 flex justify-between last:mb-0">
        <span className="font-medium">{row.label}</span>
        <span className={`font-bold ${color}`}>
          {Math.round(row.value).toLocaleString()} €/mois
        </span>
      </div>
    ))}
  </div>
)
