"use client"
import DatePicker from '@/components/DatePicker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Building, House, Users } from 'lucide-react'
import React, { useState } from 'react'
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Select = "None" |"Under10" | "Between10And20" | "Between20And30" | "Between30And40"

function InsulationWork() {
    const [selectedForWalls, setSelectedForWalls] = useState<Select>("Under10")
    const [selectedForFloors, setSelectedForFloors] = useState<Select>("Between10And20")
    
    return (
    <div className='flex flex-col items-center justify-center space-x-2'>
        <div className="flex flex-col items-center justify-center space-x-2">
            <p className='p-2'>Avez-vous dejà effectué des travaux d'isolation de vos murs?</p>
            <div className="flex items-center justify-around space-x-2">
                <div onClick={() => {
                    setSelectedForWalls("None")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "None" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "None" && 'text-white'}`}>{`Non`}</p>
                </div>
                <div onClick={() => {
                    setSelectedForWalls("Under10")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "Under10" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "Under10" && 'text-white'}`}>{`<10 ans`}</p>
                </div>
                <div onClick={() => {
                    setSelectedForWalls("Between10And20")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "Between10And20" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "Between10And20" && 'text-white'}`}>10ans - 20ans</p>
                </div>
                <div onClick={() => {
                    setSelectedForWalls("Between20And30")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "Between20And30" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "Between20And30" && 'text-white'}`}>20ans -30ans</p>
                </div>
                <div onClick={() => {
                    setSelectedForWalls("Between30And40")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "Between30And40" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "Between30And40" && 'text-white'}`}>30ans - 40ans</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center space-x-2 mt-4">
            <p className='p-2'>Avez-vous dejà effectué des travaux d'isolation de vos planchers bas?</p>
            <div className="flex items-center justify-around space-x-2">
                <div onClick={() => {
                    setSelectedForFloors("None")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForFloors == "None" && 'bg-black'}`}>
                    <p className={`${selectedForFloors == "None" && 'text-white'}`}>{`Non`}</p>
                </div>
                <div onClick={() => {
                    setSelectedForFloors("Under10")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForFloors == "Under10" && 'bg-black'}`}>
                    <p className={`${selectedForFloors == "Under10" && 'text-white'}`}>{`<10 ans`}</p>
                </div>
                <div onClick={() => {
                    setSelectedForFloors("Between10And20")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForFloors == "Between10And20" && 'bg-black'}`}>
                    <p className={`${selectedForFloors == "Between10And20" && 'text-white'}`}>10ans - 20ans</p>
                </div>
                <div onClick={() => {
                    setSelectedForFloors("Between20And30")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForFloors == "Between20And30" && 'bg-black'}`}>
                    <p className={`${selectedForFloors == "Between20And30" && 'text-white'}`}>20ans -30ans</p>
                </div>
                <div onClick={() => {
                    setSelectedForFloors("Between30And40")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedForWalls == "Between30And40" && 'bg-black'}`}>
                    <p className={`${selectedForWalls == "Between30And40" && 'text-white'}`}>30ans - 40ans</p>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-start space-x-2 mt-4 mb-4">
            <div className="flex flex-col items-center justify-center space-x-2 mt-4 mr-8">
                <Label htmlFor='glazingType' className='mb-2 text-center'>Quel est le matériau de vos fenetre?</Label>
                
                <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Bois / Bois métal</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">PVC</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-three" id="option-three" />
                    <Label htmlFor="option-three">Aluminium</Label>
                </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col items-center justify-center space-x-2 mt-4">
                <Label htmlFor='glazingType' className='mb-2 text-center'>Quel type de vitrage avez-vous?</Label>
                
                <Select defaultValue='Double vitrage'>
                    <SelectTrigger className="w-[180px] self-center">
                        <SelectValue placeholder="Double vitrage"/>
                    </SelectTrigger>
                    <SelectContent defaultValue={"Double vitrage"}>
                        <SelectItem value="Double vitrage">Double vitrage</SelectItem>
                        <SelectItem value="Simple vitrage">Simple vitrage</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
  )
}

export default InsulationWork