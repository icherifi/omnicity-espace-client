import React, { useState } from 'react'
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion"
import EnergyRating from '@/components/energyRating'
import EnergyPerformanceBadge from '@/components/EnergyPerformanceBadge'
import { useEnergyFormContext } from '@/contexts/energyForm.context'
import { Progress } from "@/components/ui/progress"

function PropertyState() {
    const {workPeriodForWalls, workPeriodForFloors, glazingType} = useEnergyFormContext()
    const {selectedEnergyType, hotWaterProductType, ventilationType} = useEnergyFormContext()
    const [progress, setProgress] = useState(13)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setProgress(45)
                const timer2 = setTimeout(() => {
                setProgress(80)
                const timer3 = setTimeout(() => {
                    setProgress(100)
                }, 1000)
                return () => clearTimeout(timer3)
            }, 1000)
            return () => clearTimeout(timer2)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
    <>
        {progress != 100 ? <div className="flex w-full justify-center mt-8 mb-8">
            <Progress value={progress} className="w-[60%]" />
        </div> :
        <div className="flex flex-col items-center justify-center space-x-2">
        <h1 className='text-2xl font-semibold p-2 pb-0'>Condition actuelle de votre habitation</h1>
        {/* <p className='text-center'>Selon vos réponses, votre logement semble être classé en étiquette énergétique D. Cela signifie que vos consommations d'énergie sont bien gérées, mais qu'il est encore possible d'optimiser les performances énergétiques de votre maison.</p> */}
        
        <div className="flex items-center p-4 pt-0">
            <EnergyRating energyRatingValue='d'/>

            <div className="flex justify-between items-center space-x-4 rounded-md border p-4">
                <div className="space-y-1">
                    <p className="text-md font-semibold leading-none">
                        Étiquette énergétique
                    </p>

                    <ul className='pt-2 pl-6 list-disc'>
                        <li>181 à 250 kWh/m²/an</li>
                        <li>31 à 50 kgCO2/m²/an</li>
                    </ul>
                </div>
            </div>
        </div>
        
        
        <div className="flex flex-col items-center w-4/5 mb-4">
            <p className='text-lg font-semibold leading-none mb-2'>Performance énergétique</p>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger><span className='flex'>Isolation & menuiserie: <EnergyPerformanceBadge state='average' badgeValue='Moyen'/></span> </AccordionTrigger>
                    <AccordionContent>
                        <ul>
                            {workPeriodForFloors != "None" &&
                            <li>
                            {workPeriodForFloors == "Between10And20" && "Sols: Entre 10 et 20 ans"}
                            {workPeriodForFloors == "Between20And30" && "Sols: Entre 20 et 30 ans"}
                            {workPeriodForFloors == "Between30And40" && "Sols: Entre 30 et 40 ans"}
                            {workPeriodForFloors == "Under10" && "Récent (moins de 10 ans)"}
                            </li>
                            }
                            {workPeriodForWalls != "None" &&
                            <li>
                            {workPeriodForWalls == "Between10And20" && "Murs: Entre 10 et 20 ans"}
                            {workPeriodForWalls == "Between20And30" && "Murs: Entre 20 et 30 ans"}
                            {workPeriodForWalls == "Between30And40" && "Murs: Entre 30 et 40 ans"}
                            {workPeriodForWalls == "Under10" && "Récent (moins de 10 ans)"}
                            </li>
                            }
                            {glazingType == "Double vitrage" ? <li>Vitrage: Double vitragre</li> : <li>Vitrage: Simple vitrage</li>}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className='flex'>Chauffage: <EnergyPerformanceBadge state='average' badgeValue='Moyen'/></span></AccordionTrigger>
                    <AccordionContent>
                        <ul>
                            <li>
                                {selectedEnergyType == "Coal" && "Source principal: Charbon"}
                                {selectedEnergyType == "Electricity" && "Source principal: Electricité"}
                                {selectedEnergyType == "Fuel oil" && "Source principal: Fioul"}
                                {selectedEnergyType == "Gas or propane" && "Source principal: Gaz/Propane"}
                                {selectedEnergyType == "Wood" && "Source principal: Bois"}
                            </li>
                            <li>
                                {hotWaterProductType == "Un chauffe-eau electrique" && "Eau chaude sanitaire: Chauffe-eau electrique"}
                                {hotWaterProductType == "Un chauffe-eau au gaz" && "Eau chaude sanitaire: Chauffe-eau au gaz"}
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className='flex'>Ventilation: <EnergyPerformanceBadge state='bad' badgeValue='Mauvais'/></span></AccordionTrigger>
                    <AccordionContent>
                        <ul>
                            <li>
                                {ventilationType == "Ventilation naturelle" && "Installation: Ventilation naturelle"}
                                {ventilationType == "Ventilation mécanique simple flux" && "Installation: Ventilation mécanique simple flux"}
                                {ventilationType == "Ventilation mécanique double flux" && "Installation: Ventilation mécanique double flux"}
                            </li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

    </div>}
    </>
  )
}

export default PropertyState