"use client";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  GlazingType,
  useEnergyFormContext,
  WindowMaterialType,
} from "@/contexts/energyForm.context";

function InsulationWork() {
  const { workPeriodForFloors, setWorkPeriodForFloors } =
    useEnergyFormContext();
  const { workPeriodForWalls, setWorkPeriodForWalls } = useEnergyFormContext();
  const { windowMaterial, setWindowMaterial } = useEnergyFormContext();
  const { glazingType, setGlazingType } = useEnergyFormContext();
  return (
    <div className="flex flex-col items-center justify-center space-x-2">
      <div className="flex flex-col items-center justify-center space-x-2">
        <p className="p-2">
          Avez-vous dejà effectué des travaux d'isolation de vos murs?
        </p>
        <div className="flex items-center justify-around space-x-2">
          <div
            onClick={() => {
              setWorkPeriodForWalls("Pas de travaux");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForWalls == "Pas de travaux" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForWalls == "Pas de travaux" && "text-white"
              }`}
            >{`Non`}</p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForWalls("Il y a moins de 10 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForWalls == "Il y a moins de 10 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForWalls == "Il y a moins de 10 ans" && "text-white"
              }`}
            >{`<10 ans`}</p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForWalls("Entre 10 et 20 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForWalls == "Entre 10 et 20 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForWalls == "Entre 10 et 20 ans" && "text-white"
              }`}
            >
              10ans-20ans
            </p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForWalls("Entre 20 et 30 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForWalls == "Entre 20 et 30 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForWalls == "Entre 20 et 30 ans" && "text-white"
              }`}
            >
              20ans-30ans
            </p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForWalls("Je ne sais pas");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForWalls == "Je ne sais pas" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForWalls == "Je ne sais pas" && "text-white"
              }`}
            >
              Je ne sais pas
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-x-2 mt-4">
        <p className="p-2">
          Avez-vous dejà effectué des travaux d'isolation de vos planchers bas?
        </p>
        <div className="flex items-center justify-around space-x-2">
          <div
            onClick={() => {
              setWorkPeriodForFloors("Pas de travaux");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForFloors == "Pas de travaux" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForFloors == "Pas de travaux" && "text-white"
              }`}
            >{`Non`}</p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForFloors("Il y a moins de 10 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForFloors == "Il y a moins de 10 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForFloors == "Il y a moins de 10 ans" && "text-white"
              }`}
            >{`<10 ans`}</p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForFloors("Entre 10 et 20 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForFloors == "Entre 10 et 20 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForFloors == "Entre 10 et 20 ans" && "text-white"
              }`}
            >
              10ans-20ans
            </p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForFloors("Entre 20 et 30 ans");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForFloors == "Entre 20 et 30 ans" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForFloors == "Entre 20 et 30 ans" && "text-white"
              }`}
            >
              20ans-30ans
            </p>
          </div>
          <div
            onClick={() => {
              setWorkPeriodForWalls("Je ne sais pas");
            }}
            className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
              workPeriodForFloors == "Je ne sais pas" && "bg-black"
            }`}
          >
            <p
              className={`${
                workPeriodForFloors == "Je ne sais pas" && "text-white"
              }`}
            >
              Je ne sais pas
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start space-x-2 mt-4 mb-4">
        <div className="flex flex-col items-center justify-center space-x-2 mt-4 mr-8">
          <Label htmlFor="windowsMaterial" className="mb-2 text-center">
            Quel est le matériau de vos fenetre?
          </Label>

          <RadioGroup
            id="windowMaterial"
            defaultValue="option-one"
            value={windowMaterial}
            onValueChange={(e) => {
              setWindowMaterial(e as WindowMaterialType);
            }}
          >
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
          <Label htmlFor="glazingType" className="mb-2 text-center">
            Quel type de vitrage avez-vous?
          </Label>

          <Select
            defaultValue="Double vitrage"
            value={glazingType}
            onValueChange={(value) => {
              setGlazingType(value as GlazingType);
            }}
          >
            <SelectTrigger className="w-[180px] self-center">
              <SelectValue placeholder="Double vitrage" />
            </SelectTrigger>
            <SelectContent defaultValue={"Double vitrage"}>
              <SelectItem value="Double vitrage ancien (plus de 25 ans)">
                Double vitrage
              </SelectItem>
              <SelectItem value="Simple vitrage">Simple vitrage</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default InsulationWork;
