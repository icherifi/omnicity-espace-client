"use client"

import { ProjectType } from "@/types/project.types"
import { BadgeEuro, HousePlug, Info, Wrench } from "lucide-react"
import { computeAnnualEnergySavings } from "../utils/energy"
import { computeWorkBreakdown } from "../utils/works"
import EnergyLabel, { EnergyRating } from "./EnergyLabel"
import {
  TooltipProvider,   
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface WorksProps {
  project: ProjectType
}

export const Works = ({ project }: WorksProps) => {
  const totalCost = project.energyMixChoice!.coutTotal
  const energySavingsYear = computeAnnualEnergySavings(project)
  const energySavingsMonth = Math.round(energySavingsYear / 12)

  const works = computeWorkBreakdown(project).map(w => ({
    ...w,
    dpePosition:
      w.code === "renovationMurs"
        ? "25%"
        : w.code === "renoMenuiserie"
        ? "35%"
        : w.code === "typeVentilationExterieur"
        ? "55%"
        : "80%",
    dpeColor: "bg-green-500",
  }))

  return (
    <div className="space-y-6 p-8">
      <div className="rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="mb-4 text-xl font-bold">
          {project.name} – {project.features.size} m²
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex min-w-[200px] flex-1 flex-col items-center rounded-lg bg-background p-4 shadow-md">
            <div className="w-full pb-2">
              <EnergyLabel
                currentRating={project.actualEnergyRating as EnergyRating}
                targetRating={project.targetedEnergyRating as EnergyRating}
              />
            </div>
          </div>

          <div className="flex min-w-[200px] flex-1 items-center gap-4 rounded-lg bg-background p-4 shadow-md">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <HousePlug className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Économie d'énergie</div>
              <div className="font-bold text-foreground">
                {energySavingsMonth.toLocaleString()} €
                <span className="ml-1 text-xs font-normal">/mois</span>
              </div>
            </div>
          </div>

          <div className="flex min-w-[200px] flex-1 items-center gap-4 rounded-lg bg-background p-4 shadow-md">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                <BadgeEuro className="h-6 w-6" color="#8B5CF6" />
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Montant total</div>
              <p className="font-bold text-xl text-black">
                {Math.round(totalCost).toLocaleString()} €
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-2xl font-bold text-[#0a1f33]">Travaux</h2>

        <TooltipProvider> 
          <div className="space-y-3">
            {works.map((work, index) => (
              <div
                key={work.code}
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full">
                    <Wrench className="h-4 w-4" color="#8B5CF6" />
                  </div>
                  <span className="font-medium">
                    {index + 1}. {work.title}
                  </span>
                </div>

                {work.details && (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <span>
                        <Info className="h-4 w-4 cursor-pointer text-gray-400" />
                      </span>
                    </TooltipTrigger>

                    <TooltipContent
                      align="end"
                      className="max-w-xs whitespace-pre-wrap leading-relaxed"
                    >
                      {work.details}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
