"use client"
import React, { useState } from 'react'
import Link from "next/link"
import {
  LifeBuoy,
  Package2,
  Settings,
  BedSingle,
  Microwave,
  Bath,
  Sofa,
  DoorOpen,
  WashingMachine,
  LampCeiling,
  Flower2
} from "lucide-react"
import { Separator } from './ui/separator'

function DesignNavbar() {
  const [designDisplayed, setDesignDisplayed] = useState(false)
  return (
    <aside className={`fixed inset-y-0 left-0 z-50 hidden ${designDisplayed ? "w-1/3" : "w-28"} flex-row justify-center border-r bg-background sm:flex`}>
        <div className={`flex-col w-28 ${designDisplayed && "border-r"}`}>
          <nav className="flex flex-col items-center gap-4 sm:py-4">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Omnicity</span>
            </Link>

            <Separator />

            <div className="flex flex-col items-center hover:cursor-pointer">
              <BedSingle className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Chambre</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <Microwave className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Cuisine</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <Bath className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Salle de bain</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <Sofa className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Salon</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <DoorOpen className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Entrée</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <WashingMachine className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Buandrie</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <LampCeiling className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Luminaires</span>
            </div>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <Flower2 className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Plantes</span>
            </div>
          </nav>

          <nav className="mt-auto mb-4 flex flex-col items-center gap-4 sm:py-4">
            <Separator className='mb-2'/>
            <div className="flex flex-col items-center hover:cursor-pointer">
              <LifeBuoy className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Aide</span>
            </div>
          
            <div className="flex flex-col items-center hover:cursor-pointer">
              <Settings className="h-8 w-8" />
              <span className='pt-2 text-center text-sm'>Parametres</span>
            </div>
          </nav>
        </div>
        <div className={`bg-background h-full w-full ${!designDisplayed && "hidden"}`}></div>
    </aside>
  )
}

export default DesignNavbar