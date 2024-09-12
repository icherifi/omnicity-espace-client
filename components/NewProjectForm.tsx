"use client"
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import DatePicker from './DatePicker'
import EnergyForm from './EnergyForm/EnergyForm'
import { useNewProjectFormContext } from '@/contexts/newProjectForm.context'

function NewProjectForm() {
    const {isEnergyFormDisplayed} = useNewProjectFormContext()
  return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Nouveau projet</Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>Nouveau projet</DialogTitle>
                <DialogDescription>
                    Je ne sais pas quoi mettre comme description mais ça arrive pas de panique.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="authorName" className="text-right">
                        Nom de l'auteur
                        </Label>
                        <Input id="authorName" value="Saikou Sow" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="projectName" className="text-right">
                        Nom du projet
                        </Label>
                        <Input id="projectName" value="" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                        Adresse du bien
                        </Label>
                        <Input id="address" placeholder="237 Rue des Pyrénées, 75020" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                        Description
                        </Label>
                        <Textarea id="description" className="col-span-3" />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                        Date
                        </Label>
                        <DatePicker />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">
                        Informations générales
                        </Label>
                        <div className="flex w-full justify-around col-span-3">
                            <div className="flex flex-col w-1/4">
                                <Label htmlFor='size'>
                                    Taille du bien
                                </Label>
                                <Input id="size" placeholder="44m²" className="col-span-3 mt-2" />
                            </div>
                            <div className="flex flex-col w-1/4">
                                <Label htmlFor='roomsNumber'>
                                    Nombre de pièces
                                </Label>
                                <Input id="roomsNumber" placeholder="5" className="col-span-3 mt-2" />
                            </div>
                            <div className="flex flex-col w-1/4">
                                <Label htmlFor='floorsNumber'>
                                    Nombre d'étages
                                </Label>
                                <Input id="floorsNumber" placeholder="0" className="col-span-3 mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="energyForm" className="text-center">
                            Partie energétique
                        </Label>
                        <EnergyForm />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit">Créer le projet</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
  )
}

export default NewProjectForm