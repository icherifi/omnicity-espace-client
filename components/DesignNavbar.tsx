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
  Flower2,
  Bookmark
} from "lucide-react"
import { Separator } from './ui/separator'
import { useDesignPageContext } from '@/contexts/designPage.context'
import Cards from '@/app/temp/components/assets'

function DesignNavbar() {
  const {isDesignPageAssetsDisplayed, setIsDesignPageAssetsDisplayed} = useDesignPageContext()
  const {currentDesignPageAssetsDisplayed, setCurrentDesignPageAssetsDisplayed} = useDesignPageContext()
  return (
    <aside onClick={(e) => {
      e.stopPropagation()
    }} className={`fixed inset-y-0 left-0 z-50 hidden flex-row justify-center border-r bg-background sm:flex`}>
        <div className={`flex-col w-28 ${isDesignPageAssetsDisplayed && "border-r"}`}>
          <nav className="flex flex-col items-center gap-4 sm:py-4">
            <Link
              href="#"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
            >
              <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
              <span className="sr-only">Omnicity</span>
            </Link>

            <Separator />

            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "chambre" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "chambre" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("chambre");
              (currentDesignPageAssetsDisplayed !== "chambre" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("chambre"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <BedSingle className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Chambre</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "cuisine" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "cuisine" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("cuisine");
              (currentDesignPageAssetsDisplayed !== "cuisine" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("cuisine"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <Microwave className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Cuisine</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "salle de bain" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "salle de bain" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("salle de bain");
              (currentDesignPageAssetsDisplayed !== "salle de bain" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("salle de bain"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <Bath className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Salle de bain</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "salon" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "salon" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("salon");
              (currentDesignPageAssetsDisplayed !== "salon" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("salon"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <Sofa className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Salon</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "entrée" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "entrée" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("entrée");
              (currentDesignPageAssetsDisplayed !== "entrée" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("entrée"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <DoorOpen className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Entrée</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "buandrie" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "buandrie" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("buandrie");
              (currentDesignPageAssetsDisplayed !== "buandrie" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("buandrie"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <WashingMachine className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Buandrie</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "luminaires" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "luminaires" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("luminaires");
              (currentDesignPageAssetsDisplayed !== "luminaires" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("luminaires"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <LampCeiling className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Luminaires</span>
            </div>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "plantes" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "plantes" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("plantes");
              (currentDesignPageAssetsDisplayed !== "plantes" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("plantes"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <Flower2 className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Plantes</span>
            </div>
          </nav>

          <nav className="mt-auto mb-4 flex flex-col items-center gap-4 sm:py-4">
            <Separator className='mb-2'/>
            <div className="flex w-full flex-col items-center hover:cursor-pointer" onClick={() => {
              (currentDesignPageAssetsDisplayed == "collections" && isDesignPageAssetsDisplayed) && (setIsDesignPageAssetsDisplayed(false), setCurrentDesignPageAssetsDisplayed(""));
              (currentDesignPageAssetsDisplayed !== "collections" && isDesignPageAssetsDisplayed) && setCurrentDesignPageAssetsDisplayed("collections");
              (currentDesignPageAssetsDisplayed !== "collections" && !isDesignPageAssetsDisplayed) && (setCurrentDesignPageAssetsDisplayed("collections"), setIsDesignPageAssetsDisplayed(true))
            }}>
              <Bookmark className="h-8 w-8" />
              <span className='pt-2 text-center text-sm select-none'>Collections</span>
            </div>
          
          </nav>
        </div>
        {/*<div className={`bg-background h-full w-full ${!isDesignPageAssetsDisplayed && "hidden"}`}></div> */}
        {(currentDesignPageAssetsDisplayed != "" && isDesignPageAssetsDisplayed) && <Cards room={currentDesignPageAssetsDisplayed} />}
    </aside>
  )
}

export default DesignNavbar