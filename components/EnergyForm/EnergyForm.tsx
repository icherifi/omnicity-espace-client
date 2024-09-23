"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { useNewProjectFormContext } from '@/contexts/newProjectForm.context'
import Property from "@/components/EnergyForm/components/Property"
import InsulationWork from "@/components/EnergyForm/components/InsulationWork"
import Energy from "@/components/EnergyForm/components/Energy"
import { useEnergyFormContext } from '@/contexts/energyForm.context'

function EnergyForm() {
    const {setIsEnergyFormDisplayed} = useEnergyFormContext()
    const {currentEnergyFormPage, setCurrentEnergyFormPage} = useEnergyFormContext()
  return (
    <DialogContent className="sm:max-w-[750px]">
        <DialogHeader>
            <DialogTitle>Formulaire energétique</DialogTitle>
            <DialogDescription>
                Complétez ce formulaire pour gérer la partie éléctrique de votre projet.
            </DialogDescription>
        </DialogHeader>

        <div className="p-4 pb-0">
            {currentEnergyFormPage == 1 && <Property />}
            {currentEnergyFormPage == 2 && <InsulationWork />}
            {currentEnergyFormPage == 3 && <Energy />}
        </div>

        <DialogFooter>
        {currentEnergyFormPage == 3 ? 
            <Button onClick={() => {
                setIsEnergyFormDisplayed(false)
                setCurrentEnergyFormPage(1)
            }}>Terminer</Button>
            :
            <Button onClick={() => {
                setCurrentEnergyFormPage(currentEnergyFormPage +1)
            }}>Suivant</Button>
        }

        {currentEnergyFormPage == 1 ? 
            <Button variant="outline" onClick={() => {
                setIsEnergyFormDisplayed(false)
            }}>Annuler</Button>
            :
            <Button onClick={() => {
                setCurrentEnergyFormPage(currentEnergyFormPage - 1)
            }} variant="outline">Retour</Button>
        }
        </DialogFooter>
    </DialogContent>  
  )
}

export default EnergyForm