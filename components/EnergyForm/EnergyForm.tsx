"use client"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Property from "./components/Property"
import InsulationWork from "./components/InsulationWork"
import Energy from "./components/Energy"
import { useNewProjectFormContext } from "@/contexts/newProjectForm.context"

export default function EnergyForm() {
    const [currentPage, setCurrentPage] = React.useState(1)
    const {isEnergyFormDisplayed, setIsEnergyFormDisplayed} = useNewProjectFormContext()

    return (
    <Drawer>
        <DrawerTrigger asChild>
            <div className="flex items-center justify-around space-x-2 mt-4 mb-4">
                <div onClick={() => {
                    setIsEnergyFormDisplayed(true)
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${isEnergyFormDisplayed  && 'border-black'}`}>
                    <p>Oui</p>
                </div>
                <div onClick={(e) => {
                    e.stopPropagation()
                    setIsEnergyFormDisplayed(false)
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${!isEnergyFormDisplayed && 'border-black'}`}>
                    <p>Non</p>
                </div>
            </div>
        </DrawerTrigger>
        
        <DrawerContent>
        <div className="mx-auto w-full flex flex-col items-center">
            <DrawerHeader className="mawx-w-sm">
            <DrawerTitle>Formulaire énergétique</DrawerTitle>
            <DrawerDescription>Complétez ce formulaire pour gérer la partie éléctrique de votre projet.</DrawerDescription>
            </DrawerHeader>

            <div className="p-4 pb-0 max-w-2xl">
                {currentPage == 1 && <Property />}
                {currentPage == 2 && <InsulationWork />}
                {currentPage == 3 && <Energy />}
            </div>

            <DrawerFooter className="max-w-sm w-full">

            {currentPage == 3 ? <DrawerClose asChild>
                <Button>Terminer</Button>
            </DrawerClose> :
                <Button onClick={() => {
                    setCurrentPage(currentPage +1)
                }}>Suivant</Button>
            }

            {currentPage == 1 ? <DrawerClose asChild>
                <Button variant="outline">Annuler</Button>
            </DrawerClose> :
                <Button onClick={() => {
                    setCurrentPage(currentPage - 1)
                }} variant="outline">Retour</Button>
            }
            </DrawerFooter>
        </div>
        </DrawerContent>
    </Drawer>
    )
}
