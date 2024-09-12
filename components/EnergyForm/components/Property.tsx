"use client"
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
import { useEnergyFormContext } from '@/contexts/energyForm.context'
import { useNewProjectFormContext } from '@/contexts/newProjectForm.context'

function Property() {
    const { selectedProperty, setSelectedProperty  } = useEnergyFormContext()
    const {constructionDate, setConstructionDate } = useEnergyFormContext()
    const { projectAddress, setProjectAddress } = useNewProjectFormContext()
    const {  livingArea, setLivingArea } = useEnergyFormContext()
    const {  averageAnnualIncome, setAverageAnnualIncome } = useEnergyFormContext()
    const { residentsNumber, setResidentsNumber } = useEnergyFormContext()
  return (
    <div className="flex flex-col items-center justify-center space-x-2">
        <div className="flex items-center justify-around space-x-2">
            <div onClick={() => {
                setSelectedProperty("House")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedProperty == "House" && 'bg-black'}`}>
                <House className='w-20 h-20' color={`${selectedProperty == "House" ? "#FFF" : "#000"}`}/>
                <p className={`${selectedProperty == "House" && 'text-white'}`}>Une maison individuelle</p>
            </div>
            <div onClick={() => {
                setSelectedProperty("Apartment")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedProperty == "Apartment" && 'bg-black'}`}>
                <Building className='w-20 h-20' color={`${selectedProperty == "Apartment" ? "#FFF" : "#000"}`}/>
                <p className={`${selectedProperty == "Apartment" && 'text-white'}`}>Un appartement</p>
            </div>
            <div onClick={() => {
                setSelectedProperty("Co-ownership")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${selectedProperty == "Co-ownership" && 'bg-black'}`}>
                <Users className='w-20 h-20' color={`${selectedProperty == "Co-ownership" ? "#FFF" : "#000"}`}/>
                <p className={`${selectedProperty == "Co-ownership" && 'text-white'}`}>Une copropriété</p>
            </div>
        </div>

        <div className="flex items-center mt-8">
            <div className="date flex flex-col p-2">
                <Label htmlFor='constructionDate' className='mb-2'>
                    Date de construction
                </Label>
                <Input type="text" id='constructionDate' placeholder='1956-05-17' value={constructionDate} onChange={(e) => {
                    setConstructionDate(e.currentTarget.value)
                }}/>
            </div>
            <div className="address flex flex-col p-2">
                <Label htmlFor='address' className='mb-2'>
                    Adresse
                </Label>
                <Input type="text" id='address' value={projectAddress} onChange={(e) => {
                    setProjectAddress(e.currentTarget.value)
                }}/>
            </div>
            <div className="address flex flex-col p-2">
                <Label htmlFor='livingArea' className='mb-2'>
                    {`Surface habitable(m²)`}
                </Label>
                <Input type="number" id='livingArea' defaultValue={95} value={livingArea} onChange={(e) => {
                    setLivingArea(e.currentTarget.value)
                }}/>
            </div>
        </div>
        
        
        <div className="flex items-center mt-8 mb-4">
            <div className="date flex flex-col p-2">
                <Label htmlFor='averageAnnualIncome' className='mb-2 text-center'>
                    Revenu annuel moyen de votre foyer fiscal
                </Label>
                <Slider id='averageAnnualIncome' defaultValue={[5000000]} max={25000000} onValueChange={(value) => {
                    setAverageAnnualIncome(value[0])
                }}/>
                <p className='self-end mt-4'>{averageAnnualIncome}€</p>
            </div>
            <div className="date flex flex-col p-2">
                <Label htmlFor='residentsNumber' className='mb-2 text-center'>
                    Nombre d'habitants composant votre foyer fiscal
                </Label>

                <Select defaultValue='1' value={residentsNumber.toString()} onValueChange={(e) => {
                    setResidentsNumber(Number(e))
                }}>
                    <SelectTrigger className="w-[180px] self-center">
                        <SelectValue placeholder="1"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="6">6</SelectItem>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                        <SelectItem value="9">9</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

    </div>
  )
}

export default Property