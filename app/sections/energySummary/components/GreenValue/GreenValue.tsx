"use client"

import { ProjectType } from "@/types/project.types"
import { GreenValueChart } from "./GreenValueChart"

interface GreenValueProps {
  project: ProjectType
}

export const GreenValue = ({ project }: GreenValueProps) => {
  const baseValue = Number(project.features?.baseValue) || 0
  const greenRate = project.energyMixChoice?.valeurVerte ?? 0
  const before = baseValue
  const after = Math.round(baseValue * (1 + greenRate))

  return (
    <section className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex gap-8 flex-1">
          <div>
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">{before.toLocaleString()}€</span>
            <div className="text-gray-500 dark:text-gray-400 text-lg mt-2">Avant rénovation</div>
          </div>
          <div className="h-[2px] w-2/3 bg-gray-300 dark:bg-gray-600 my-2 md:hidden" />
          <div>
            <span className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">{after.toLocaleString()}€</span>
            <div className="text-gray-500 dark:text-gray-400 text-lg mt-2">Après rénovation</div>
          </div>
        </div>
        <div className="flex-1 w-full min-w-[320px] w-[400px]">
          {/* <GreenValueChart before={before} after={after} /> */}
        </div>
      </div>
      <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-600 my-8" />
      <div>
        <span className="text-3xl font-extrabold text-gray-900 dark:text-white block mb-2">Valeur verte</span>
        <span className="text-gray-700 dark:text-gray-300 text-lg block">La valeur verte est la hausse de valeur d'un bien immobilier grâce à son amélioration énergétique</span>
      </div>
    </section>
  )
}
