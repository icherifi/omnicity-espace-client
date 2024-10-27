import { EnergyLabelSolutionsType, useEnergyFormContext } from '@/contexts/energyForm.context'
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { useDesignPageContext } from '@/contexts/designPage.context'

function EnergyLabelTypeCard (props: {
  energyLabelSolutionsType: EnergyLabelSolutionsType
}) {
  const [selected, setSelected] = useState<"avant" | "apres">("apres")

  return (
    <Card className='mt-8 w-full'>
      <CardContent className='p-0 flex justify-between'>
        <div className="flex flex-col w-1/4 bg-violet-500 p-4 rounded-tl-sm rounded-bl-sm">
          <h1 className='text-4xl font-bold text-white'>
            {props.energyLabelSolutionsType == "Simplicity" && "Simplicité"}
            {props.energyLabelSolutionsType == "Balanced" && "Equilibrée"}
            {props.energyLabelSolutionsType == "Efficient" && "Performante"}
          </h1>
          <p className='font-semibold text-md mt-4 text-white'>Travaux à réaliser</p>

          <div className="flex flex-col">
            <div className="flex p-4 pl-0 items-center">
              <div className="rounded-full bg-white w-8 h-8 flex flex-col items-center justify-center">
                <span className='text-2xl font-bold text-violet-500'>1</span>
              </div>
              <h3 className='ml-2 text-white font-semibold text-md'>
                {props.energyLabelSolutionsType == "Simplicity" && "Chauffage"}
                {props.energyLabelSolutionsType == "Balanced" && "Isolation"}
                {props.energyLabelSolutionsType == "Efficient" && "Isolation"}
              </h3>
            </div>
            <ul className='list-disc pl-6 text-white'>
              <li>
                {props.energyLabelSolutionsType == "Simplicity" && "Installation d’un(e) Chauffe-eau thermodynamique"}
                {props.energyLabelSolutionsType == "Balanced" && "Isolation des murs par l’extérieur"}
                {props.energyLabelSolutionsType == "Efficient" && "Isolation des combles aménagés"}
              </li>
              {props.energyLabelSolutionsType == "Efficient" && <li>
                {props.energyLabelSolutionsType == "Efficient" && "Isolation des murs par l’extérieur"}
              </li>}
            </ul>
          </div>
        </div>

        <div className="flex flex-col w-1/3 p-4 mb-4">
          <h3 className='font-bold text-lg self-center'>Résultat des travaux</h3>

          <div className="flex rounded-full bg-blue-100 p-1 my-2 self-center">
            <button
              className={`${
                selected === "avant" ? "bg-violet-500 text-white" : "bg-transparent text-gray-600"
              } rounded-full px-4 py-2 focus:outline-none transition-colors duration-200`}
              onClick={() => setSelected("avant")}
            >
              Avant
            </button>
            <button
              className={`${
                selected === "apres" ? "bg-violet-500 text-white" : "bg-transparent text-gray-600"
              } rounded-full px-4 py-2 focus:outline-none transition-colors duration-200`}
              onClick={() => setSelected("apres")}
            >
              Après
            </button>
          </div>

          {selected == "apres" ? <div className="space-y-1 mt-4 pl-6">
              <p className="text-lg font-semibold leading-none">
                Étiquette énergétique
              </p>

              {props.energyLabelSolutionsType == "Efficient" ? <div className="flex items-center">
                <div className="bg-grade-a h-min p-6 pt-2 pb-2 rounded-lg">
                  <span>B</span>
                </div>
                <ul className='pt-2 pl-10 list-disc'>
                    <li>71 à 110 kWh/m²/an</li>
                    <li>7 à 11 kgCO2/m²/an</li>
                </ul>
              </div> :
              <div className="flex items-center">
              <div className="bg-grade-b h-min p-6 pt-2 pb-2 rounded-lg">
                <span>C</span>
              </div>
              <ul className='pt-2 pl-10 list-disc'>
                  <li>111 à 180 kWh/m²/an</li>
                  <li>12 à 30 kgCO2/m²/an</li>
              </ul>
            </div>
            }
          </div> :
          <div className="space-y-1 mt-4 pl-6">
          <p className="text-lg font-semibold leading-none">
            Étiquette énergétique
          </p>

          <div className="flex items-center">
            <div className="bg-grade-c h-min p-6 pt-2 pb-2 rounded-lg">
              <span>D</span>
            </div>
            <ul className='pt-2 pl-10 list-disc'>
                <li>181 à 250 kWh/m²/an</li>
                <li>31 à 50 kgCO2/m²/an</li>
            </ul>
          </div>
      </div>}
          
          <Separator className='my-6 pl-6' />

          {selected == "apres" ? <div className="space-y-1 pl-6">
              {props.energyLabelSolutionsType == "Efficient" ? <>
                <p className="text-lg font-semibold leading-none">
                Confort
              </p>

              <div className="flex" style={{marginTop: "1rem"}}>
                <p>Confort bien</p>
              </div></> :
              <>
              <p className="text-lg font-semibold leading-none">
                Confort
              </p>

              <div className="flex" style={{marginTop: "1rem"}}>
                <p>Confort moyen</p>
              </div></>}
          </div> :
          <div className="space-y-1 pl-6">
            <p className="text-lg font-semibold leading-none">
              Confort
            </p>

            <div className="flex" style={{marginTop: "1rem"}}>
              <p>Confort moyen</p>
            </div>
          </div>}

          {selected == 'apres' && <>
            <Separator className='my-6 pl-6' />

          <div className="space-y-1 pl-6">
              <p className="text-lg font-semibold leading-none">
                Valeur immobilière
              </p>

              {props.energyLabelSolutionsType == "Efficient" ? <div className="flex" style={{marginTop: "1rem"}}>
                <p>Logement revalorisé à 11 %</p>
              </div> : <div className="flex" style={{marginTop: "1rem"}}>
                <p>Logement revalorisé à 4 %</p>
              </div>}
          </div>
          </>}

        </div>

        <div className={`flex flex-col items-center justify-center w-1/3 pr-8 ${selected == "avant" && "pb-4 pt-4"}`}>
          <div className="flex flex-col gap-6 bg-slate-100 px-4 py-6 rounded-2xl">
              <h4 className="text-lg font-bold text-secondary-500 @md:text-xl self-center">Coût du projet</h4>
              <div className="flex flex-col">
                  <div className="flex justify-between gap-2 border-b-2 border-white pb-4">
                      <p className="w-5/12 whitespace-nowrap text-base">Coût des travaux</p>
                      {props.energyLabelSolutionsType == "Simplicity" && <div className="flex w-5/12 flex-col flex-wrap gap-1 whitespace-nowrap text-base font-bold @sm:w-7/12 @sm:flex-row">
                          <p>entre <span className="whitespace-nowrap">2 250 €</span></p>
                          <p>et <span className="whitespace-nowrap">2 750 €</span></p>
                      </div>}
                      {props.energyLabelSolutionsType == "Balanced" && <div className="flex w-5/12 flex-col flex-wrap gap-1 whitespace-nowrap text-base font-bold @sm:w-7/12 @sm:flex-row">
                          <p>entre <span className="whitespace-nowrap">10 250 €</span></p>
                          <p>et <span className="whitespace-nowrap">12 500 €</span></p>
                      </div>}
                      {props.energyLabelSolutionsType == "Efficient" && <div className="flex w-5/12 flex-col flex-wrap gap-1 whitespace-nowrap text-base font-bold @sm:w-7/12 @sm:flex-row">
                          <p>entre <span className="whitespace-nowrap">19 500 €</span></p>
                          <p>et <span className="whitespace-nowrap">24 000 €</span></p>
                      </div>}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-4">
                      <p className="w-5/12 whitespace-nowrap text-base">Aides</p>
                      {props.energyLabelSolutionsType == "Simplicity" &&  <span className="w-5/12 whitespace-nowrap text-base font-bold sm:w-7/12">jusqu’à <span className="whitespace-nowrap">0 €</span></span>}
                      {props.energyLabelSolutionsType == "Balanced" &&  <span className="w-5/12 whitespace-nowrap text-base font-bold sm:w-7/12">jusqu’à <span className="whitespace-nowrap">500 €</span></span>}
                      {props.energyLabelSolutionsType == "Efficient" &&  <span className="w-5/12 whitespace-nowrap text-base font-bold sm:w-7/12">jusqu’à <span className="whitespace-nowrap">750 €</span></span>}
                  </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                  <div className="flex w-full flex-col items-center gap-2 rounded-2xl bg-white p-4">
                      {props.energyLabelSolutionsType == "Simplicity" && <>
                        <p className="self-center text-base">
                        <span className="font-bold">Total du projet</span> (aides déduites)</p>
                        <p className="flex items-center text-sm text-violet-500">entre<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">2 250 €</span>
                        et<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">2 750 €</span>
                      </p>
                      </>}
                      {props.energyLabelSolutionsType == "Balanced" && <>
                        <p className="self-center text-base">
                        <span className="font-bold">Total du projet</span> (aides déduites)</p>
                        <p className="flex items-center text-sm text-violet-500">entre<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">9 750 €</span>
                        et<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">12 000 €</span>
                      </p>
                      </>}
                      {props.energyLabelSolutionsType == "Efficient" && <>
                        <p className="self-center text-base">
                        <span className="font-bold">Total du projet</span> (aides déduites)</p>
                        <p className="flex items-center text-sm text-violet-500">entre<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">18 750 €</span>
                        et<span className="whitespace-nowrap px-2 text-xl font-bold sm:text-2xl">23 250 €</span>
                      </p>
                      </>}
                  </div>
              </div>
              {<a className="mx-auto w-full cursor-pointer whitespace-nowrap rounded-md bg-violet-500 px-4 py-3 text-center text-base font-bold text-white shadow-sm transition duration-300 ease-in-out hover:bg-violet-600 sm:w-10/12 md:w-full">Obtenir mon devis</a>}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

function EnergyLabelSolutions() {
  const { energyLabelSolutionsType, setEnergyLabelSolutionsType } = useEnergyFormContext()
  const { setCostEstimation } = useDesignPageContext()

  useEffect(() => {
    setCostEstimation({
      withAid: 11125,
      withoutAid: 12500
    })
  }, [])

  return (
    <div className='flex flex-col items-center'>
      <h1 className='font-semibold text-xl'>Des options pour optimiser votre classification énergétique</h1>
      <div className="flex mt-4 items-center justify-around space-x-2 w-4/5">
            <div onClick={() => {
              setEnergyLabelSolutionsType("Simplicity")
              setCostEstimation({
                withAid: 2750,
                withoutAid: 2750
              })

            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Simplicity" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Simplicité</p>
            </div>

            <div onClick={() => {
              setEnergyLabelSolutionsType("Balanced")
              setCostEstimation({
                withAid: 11125,
                withoutAid: 12500
              })
            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Balanced" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Equilibrée</p>
            </div>

            <div onClick={() => {
              setEnergyLabelSolutionsType("Efficient")
              setCostEstimation({
                withAid: 21000,
                withoutAid: 24000
              })
            }} className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${energyLabelSolutionsType == "Efficient" && "bg-white border-2 border-violet-500"} hover:cursor-pointer`}>
              <p className='font-semibold text-lg'>Performante</p>
            </div>
      </div>
            {energyLabelSolutionsType == "Simplicity" && <EnergyLabelTypeCard energyLabelSolutionsType={"Simplicity"}/>}
            {energyLabelSolutionsType == "Balanced" && <EnergyLabelTypeCard energyLabelSolutionsType={"Balanced"}/>}
            {energyLabelSolutionsType == "Efficient" && <EnergyLabelTypeCard energyLabelSolutionsType={"Efficient"}/>}
    </div>
  )
}

export default EnergyLabelSolutions