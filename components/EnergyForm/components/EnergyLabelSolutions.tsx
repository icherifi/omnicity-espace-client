"use clienv"
import { useEnergyFormContext } from '@/contexts/energyForm.context'
import React from 'react'

function EnergyLabelSolutions() {
  const {energyLabelSolutionsType, setEnergyLabelSolutionsType} = useEnergyFormContext()
  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-xl'>Des options pour optimiser votre classification énergétique</h1>
      <div className="flex mt-4 items-center justify-around space-x-2 w-4/5">
            <div onClick={() => {
              setEnergyLabelSolutionsType("Simplicity")
            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Simplicity" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Simplicité</p>
            </div>

            <div onClick={() => {
              setEnergyLabelSolutionsType("Balance")
            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Balance" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Equilibre</p>
            </div>

            <div onClick={() => {
              setEnergyLabelSolutionsType("Performance")
            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Performance" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Performance</p>
            </div>
      </div>
    </div>
  )
}

export default EnergyLabelSolutions