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

function Property() {
    const [select, setSelected] = useState<"House" | "Apartment" | "Co-ownership">("House")
    const [sliderValue, setSliderValue] = useState<number>(5000000)
  return (
    <div className="flex flex-col items-center justify-center space-x-2">
        <div className="flex items-center justify-around space-x-2">
            <div onClick={() => {
                setSelected("House")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${select == "House" && 'bg-black'}`}>
                <House className='w-20 h-20' color={`${select == "House" ? "#FFF" : "#000"}`}/>
                <p className={`${select == "House" && 'text-white'}`}>Une maison individuelle</p>
            </div>
            <div onClick={() => {
                setSelected("Apartment")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${select == "Apartment" && 'bg-black'}`}>
                <Building className='w-20 h-20' color={`${select == "Apartment" ? "#FFF" : "#000"}`}/>
                <p className={`${select == "Apartment" && 'text-white'}`}>Un appartement</p>
            </div>
            <div onClick={() => {
                setSelected("Co-ownership")
            }} className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${select == "Co-ownership" && 'bg-black'}`}>
                <Users className='w-20 h-20' color={`${select == "Co-ownership" ? "#FFF" : "#000"}`}/>
                <p className={`${select == "Co-ownership" && 'text-white'}`}>Une copropriété</p>
            </div>
        </div>

        <div className="flex items-center mt-8">
            <div className="date flex flex-col p-2">
                <Label htmlFor='constructionDate' className='mb-2'>
                    Date de construction
                </Label>
                <Input type="date" id='constructionDate' value={"1956-05-12"}/>
            </div>
            <div className="address flex flex-col p-2">
                <Label htmlFor='address' className='mb-2'>
                    Adresse
                </Label>
                <Input type="text" id='address' value={"30, Boulevard Mcdonald"}/>
            </div>
            <div className="address flex flex-col p-2">
                <Label htmlFor='livingArea' className='mb-2'>
                    {`Surface habitable(m²)`}
                </Label>
                <Input type="number" id='livingArea' value={95}/>
            </div>
        </div>
        
        
        <div className="flex items-center mt-8 mb-4">
            <div className="date flex flex-col p-2">
                <Label htmlFor='averageAnnualIncome' className='mb-2 text-center'>
                    Revenu annuel moyen de votre foyer fiscal
                </Label>
                <Slider id='averageAnnualIncome' defaultValue={[5000000]} max={25000000} onValueChange={(value) => {
                    setSliderValue(value[0])
                }}/>
                <p className='self-end mt-4'>{sliderValue}€</p>
            </div>
            <div className="date flex flex-col p-2">
                <Label htmlFor='residentsNumber' className='mb-2 text-center'>
                    Nombre d'habitants composant votre foyer fiscal
                </Label>

                <Select defaultValue='1'>
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