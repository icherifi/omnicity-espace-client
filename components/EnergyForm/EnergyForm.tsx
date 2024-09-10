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
                <Property />
            </div>

            <DrawerFooter className="max-w-sm w-full">
            <Button onClick={() => {
                currentPage == 3 ? {/* onSubmit */} : setCurrentPage(currentPage + 1)
            }}>{`${currentPage == 3 ? "Terminer" : "Suivant"}`}</Button>
            <DrawerClose asChild>
                <Button onClick={() => {
                    currentPage == 1 ? {/* back */} : setCurrentPage(currentPage - 1)
                }} variant="outline">{`${currentPage == 1 ? "Annuler" : "Retour"}`}</Button>
            </DrawerClose>
            </DrawerFooter>
        </div>
        </DrawerContent>
    </Drawer>
    )
}
