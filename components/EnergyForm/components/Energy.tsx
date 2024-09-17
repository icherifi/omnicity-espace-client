"use client"
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import Image from 'next/image'
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { useEnergyFormContext } from '@/contexts/energyForm.context'



function Energy () {
    const {selectedEnergyType, setSelectedEnergyType} = useEnergyFormContext()
    const {selectedHeatingType, setSelectedHeatingType} = useEnergyFormContext()
    const {hotWaterProductType, setHotWaterProductType} = useEnergyFormContext()
    const {ventilationType, setVentilationType} = useEnergyFormContext()
    return (
    <div className="flex flex-col items-center justify-center space-x-2">
        <Label className='mb-2 text-center'>Quelle est la source d'énergie de chauffage principale?</Label>
        <div className="flex items-center justify-around space-x-2 mt-4 mb-4">
            <div onClick={() => {
                setSelectedEnergyType("Electricity")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedEnergyType == "Electricity" && 'border-black'}`}>
                <Image src={"/electricity.svg"} width={70} height={70} alt='Electricity icon' style={{fill: "red"}}/>
                <p>Electricité</p>
            </div>
            <div onClick={() => {
                setSelectedEnergyType("Wood")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedEnergyType == "Wood" && 'border-black'}`}>
                <Image src={"/wood.svg"} width={70} height={70} alt='Wood icon'/>
                <p>Bois</p>
            </div>
            <div onClick={() => {
                setSelectedEnergyType("Gas or propane")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedEnergyType == "Gas or propane" && 'border-black'}`}>
                <Image src={"/gas.svg"} width={70} height={70} alt='Gas icon'/>
                <p>Gaz ou propane</p>
            </div>
            <div onClick={() => {
                setSelectedEnergyType("Fuel oil")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedEnergyType == "Fuel oil" && 'border-black'}`}>
                <Image src={"/fuel.svg"} width={70} height={70} alt='Fuel oil icon'/>
                <p>Fioul</p>
            </div>
            <div onClick={() => {
                setSelectedEnergyType("Coal")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedEnergyType == "Coal" && 'border-black'}`}>
                <Image src={"/coal.svg"} width={70} height={70} alt='Coal icon'/>
                <p>Charbon</p>
            </div>
        </div>
        <div className="flex flex-col mt-4 items-center justify-around space-x-2">
            <Label className='mb-2 text-center'>Type de chauffage/chauffe-eau</Label>
            <div className="flex items-center justify-around space-x-2">
                <div onClick={() => {
                    setSelectedHeatingType("Heat pumps")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedHeatingType == "Heat pumps" && 'bg-black'}`}>
                    <p className={`${selectedHeatingType == "Heat pumps" && 'text-white'}`}>Pompes à chaleur à air/eau</p>
                </div>
                <div onClick={() => {
                    setSelectedHeatingType("Electric Transmitters")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedHeatingType == "Electric Transmitters" && 'bg-black'}`}>
                    <p className={`${selectedHeatingType == "Electric Transmitters" && 'text-white'}`}>Emetteurs électriques</p>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-start space-x-2 mt-4 mb-4">
            <div className="flex flex-col items-center justify-center space-x-2 mt-4">
                <Label htmlFor='hotWaterProductType' className='mb-2 text-center'>Quel appareil produit votre eau chaude sanitaire?</Label>
                
                <Select defaultValue='Mon systeme de chauffage' value={hotWaterProductType} onValueChange={(e) => {
                    setHotWaterProductType(e)
                }}>
                    <SelectTrigger className="w-[250px] self-center">
                        <SelectValue placeholder="Mon systeme de chauffage"/>
                    </SelectTrigger>
                    <SelectContent defaultValue={"Mon systeme de chauffage"}>
                        <SelectItem value="Mon systeme de chauffage">Mon systeme de chauffage</SelectItem>
                        <SelectItem value="Un chauffe-eau electrique">Un chauffe-eau electrique</SelectItem>
                        <SelectItem value="Un chauffe-eau au gaz">Un chauffe-eau au gaz</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col items-center justify-center space-x-2 mt-4">
                <Label htmlFor='ventilationType' className='mb-2 text-center'>Type de ventilation</Label>
                
                <Select defaultValue='Ventilation naturelle' value={ventilationType} onValueChange={(e) => {
                    setVentilationType(e)
                }}>
                    <SelectTrigger className="w-[275px] self-center">
                        <SelectValue placeholder="Ventilation naturelle"/>
                    </SelectTrigger>
                    <SelectContent defaultValue={"Ventilation naturelle"}>
                        <SelectItem value="Ventilation naturelle">Ventilation naturelle</SelectItem>
                        <SelectItem value="Ventilation mécanique simple flux">Ventilation mécanique simple flux</SelectItem>
                        <SelectItem value="Ventilation mécanique double flux">Ventilation mécanique double flux</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  )
}

export default Energy