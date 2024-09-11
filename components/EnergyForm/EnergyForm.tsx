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

export default function EnergyForm() {
    const [currentPage, setCurrentPage] = React.useState(1)
    
    return (
    <Drawer>
        <DrawerTrigger asChild>
        <Button>Créer le projet</Button>
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
