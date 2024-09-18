import React, { useState } from 'react'
import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion"
import EnergyRating from '@/components/energyRating'
import EnergyPerformanceBadge from '@/components/EnergyPerformanceBadge'

function PropertyState() {

  return (
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
                    Yes. It adheres to the WAI-ARIA design pattern.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger><span className='flex'>Chauffage: <EnergyPerformanceBadge state='average' badgeValue='Moyen'/></span></AccordionTrigger>
                    <AccordionContent>
                    Yes. It comes with default styles that matches the other
                    components&apos; aesthetic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger><span className='flex'>Ventilation: <EnergyPerformanceBadge state='bad' badgeValue='Mauvais'/></span></AccordionTrigger>
                    <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you prefer.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

    </div>
  )
}

export default PropertyState