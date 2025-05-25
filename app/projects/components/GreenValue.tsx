"use client"

import { ProjectType } from "@/types/project.types"
import { Euro, Hammer, Info } from "lucide-react"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"

interface GreenValueProps {
  project: ProjectType
}

export const GreenValue = ({ project }: GreenValueProps) => {
  const baseValue = Number(project.features?.baseValue) || 0
  const greenRate = project.energyMixChoice?.valeurVerte ?? 0
  const todayGreenValue = Math.round(baseValue * greenRate)
  const projected = Math.round(todayGreenValue * Math.pow(1.03, 8))
  const worksTotal = Math.round(project.energyMixChoice?.coutTotal ?? 0)

  return (
    <section className="space-y-8 rounded-3xl p-8">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-bold text-[#0a1f33]">
          Valeur verte
        </h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-6 w-6 text-violet-500 cursor-pointer mt-2" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs leading-relaxed">
            La valeur verte correspond à l’augmentation de valeur générée par
            la rénovation énergétique, calculée selon votre région et le nouveau
            classement&nbsp;DPE.
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-4 rounded-2xl bg-white/70 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
          <Hammer className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Montant total des travaux</p>
          <p className="text-2xl font-semibold">
            {worksTotal.toLocaleString()} €
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-8 text-center space-y-3">
          <p className="text-xs uppercase text-gray-500">Aujourd’hui</p>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-100">
            <Euro className="h-7 w-7 text-sky-600" />
          </div>
          <p className="text-3xl font-bold">
            {todayGreenValue.toLocaleString()} €
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center space-y-3">
          <p className="text-xs uppercase text-gray-500">Dans 8 ans</p>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-100">
            <Euro className="h-7 w-7 text-lime-600" />
          </div>
          <p className="text-3xl font-bold text-lime-600">
            {projected.toLocaleString()} €
          </p>
          <p className="text-sm font-medium text-lime-600">
            +{(projected - todayGreenValue).toLocaleString()} €
          </p>
        </div>
      </div>
    </section>
  )
}
