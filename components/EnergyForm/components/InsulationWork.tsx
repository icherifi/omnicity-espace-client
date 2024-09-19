"use client"
import { Label } from '@/components/ui/label'
import React, { ChangeEvent, useState } from 'react'
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { GlazingType, useEnergyFormContext, WindowMaterialType } from '@/contexts/energyForm.context'


function InsulationWork() {
    const { workPeriodForFloors, setWorkPeriodForFloors } = useEnergyFormContext()
    const { workPeriodForWalls, setWorkPeriodForWalls } = useEnergyFormContext()
    const { windowMaterial, setWindowMaterial } = useEnergyFormContext()
    const { glazingType, setGlazingType } = useEnergyFormContext()
    return (
    <div className='flex flex-col items-center justify-center space-x-2'>
        <div className="flex flex-col items-center justify-center space-x-2">
            <p className='p-2'>Avez-vous dejà effectué des travaux d'isolation de vos murs?</p>
            <div className="flex items-center justify-around space-x-2">
                <div onClick={() => {
                    setWorkPeriodForWalls("None")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForWalls == "None" && 'bg-black'}`}>
                    <p className={`${workPeriodForWalls == "None" && 'text-white'}`}>{`Non`}</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForWalls("Under10")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForWalls == "Under10" && 'bg-black'}`}>
                    <p className={`${workPeriodForWalls == "Under10" && 'text-white'}`}>{`<10 ans`}</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForWalls("Between10And20")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForWalls == "Between10And20" && 'bg-black'}`}>
                    <p className={`${workPeriodForWalls == "Between10And20" && 'text-white'}`}>10ans-20ans</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForWalls("Between20And30")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForWalls == "Between20And30" && 'bg-black'}`}>
                    <p className={`${workPeriodForWalls == "Between20And30" && 'text-white'}`}>20ans-30ans</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForWalls("Between30And40")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForWalls == "Between30And40" && 'bg-black'}`}>
                    <p className={`${workPeriodForWalls == "Between30And40" && 'text-white'}`}>30ans-40ans</p>
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center justify-center space-x-2 mt-4">
            <p className='p-2'>Avez-vous dejà effectué des travaux d'isolation de vos planchers bas?</p>
            <div className="flex items-center justify-around space-x-2">
                <div onClick={() => {
                    setWorkPeriodForFloors("None")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForFloors == "None" && 'bg-black'}`}>
                    <p className={`${workPeriodForFloors == "None" && 'text-white'}`}>{`Non`}</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForFloors("Under10")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForFloors == "Under10" && 'bg-black'}`}>
                    <p className={`${workPeriodForFloors == "Under10" && 'text-white'}`}>{`<10 ans`}</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForFloors("Between10And20")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForFloors == "Between10And20" && 'bg-black'}`}>
                    <p className={`${workPeriodForFloors == "Between10And20" && 'text-white'}`}>10ans-20ans</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForFloors("Between20And30")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForFloors == "Between20And30" && 'bg-black'}`}>
                    <p className={`${workPeriodForFloors == "Between20And30" && 'text-white'}`}>20ans-30ans</p>
                </div>
                <div onClick={() => {
                    setWorkPeriodForFloors("Between30And40")
                }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${workPeriodForFloors == "Between30And40" && 'bg-black'}`}>
                    <p className={`${workPeriodForFloors == "Between30And40" && 'text-white'}`}>30ans-40ans</p>
                </div>
            </div>
        </div>

        <div className="flex justify-between items-start space-x-2 mt-4 mb-4">
            <div className="flex flex-col items-center justify-center space-x-2 mt-4 mr-8">
                <Label htmlFor='windowsMaterial' className='mb-2 text-center'>Quel est le matériau de vos fenetre?</Label>
                
                <RadioGroup id='windowMaterial' defaultValue="option-one" value={windowMaterial} onValueChange={(e) => {
                    setWindowMaterial(e as WindowMaterialType)
                }}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Bois / Bois métal" id="option-one" />
                    <Label htmlFor="option-one">Bois / Bois métal</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PVC" id="option-two" />
                    <Label htmlFor="option-two">PVC</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Aluminium" id="option-three" />
                    <Label htmlFor="option-three">Aluminium</Label>
                </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col items-center justify-center space-x-2 mt-4">
                <Label htmlFor='glazingType' className='mb-2 text-center'>Quel type de vitrage avez-vous?</Label>
                
                <Select defaultValue='Double vitrage' value={glazingType} onValueChange={(value) => {
                    setGlazingType(value as GlazingType)
                }}>
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