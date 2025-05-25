"use client"
import { ProjectType } from "@/types/project.types"
import { Card } from "@/components/ui/card"
import { CarbonImpactChart } from "./CarbonImpactChart"

interface CarbonImpactProps {
  project: ProjectType
}

const HORIZON = 20

export const CarbonImpact = ({ project }: CarbonImpactProps) => {
  const surface = Number(project.dpe?.dpeData?.surfaceHabitable) || 0

  const egesBeforeM2 = Number(project.iziResponse?.EGES) || 0
  const gesBeforeKg = egesBeforeM2 * surface

  const egesAfterM2 =
  Number(project.dpe?.dpeData?.travaux.pack?.emissionGes5UsagesApresTravaux) || 0
  const gesAfterKg = egesAfterM2 * surface

  const beforeT = (gesBeforeKg * HORIZON) / 1_000
  const afterT = (gesAfterKg * HORIZON) / 1_000

  return (
    <div className="space-y-6 p-6">
      <h2 className="mb-4 text-2xl font-bold text-[#0a1f33] relative inline-block">
        Impact carbone
      </h2>

      <div>
        <Card className="p-6">
          <div className="mb-2 text-sm font-medium text-gray-500">
            Cumul tonnes CO₂ évitées
          </div>
          
          <CarbonImpactChart project={project} key={project.id}/>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardCO2 title="AVANT RÉNOVATION" value={beforeT} color="#0084ff" />
        <CardCO2 title="APRÈS RÉNOVATION" value={afterT} color="#65a30d" />
      </div>
    </div>
  )
}

const CardCO2 = ({
  title,
  value,
  color,
}: {
  title: string
  value: number
  color: string
}) => (
  <Card className="p-6 text-center">
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: `${color}22` }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="transition-transform duration-300 hover:rotate-90"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      </div>
      <div 
        className="text-3xl font-bold transition-all duration-300 hover:scale-110" 
        style={{ color }}
      >
        {Math.round(value)}
      </div>
      <div className="text-sm text-gray-500">Tonnes de CO₂ (20 ans)</div>
    </div>
  </Card>
)
