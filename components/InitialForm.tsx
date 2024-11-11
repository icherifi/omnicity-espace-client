"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import DatePicker from "./DatePicker";
import { useNewProjectFormContext } from "@/contexts/newProjectForm.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";

function InitialForm() {
  const {
    isEnergyFormDisplayed,
    setIsEnergyFormDisplayed,
    setEnergyFormGotOpened,
    energyFormGotOpened,
  } = useEnergyFormContext();
  const { projectAuthorName, setProjectAuthorName } =
    useNewProjectFormContext();
  const { projectName, setProjectName } = useNewProjectFormContext();
  const { projectAddress, setProjectAddress } = useNewProjectFormContext();
  const { projectDescription, setProjectDescription } =
    useNewProjectFormContext();
  const { projectGeneralInformation, setProjectGeneralInformation } =
    useNewProjectFormContext();

  function handleGeneralInformationInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.currentTarget;

    // Met à jour seulement la clé qui correspond à l'ID de l'input
    setProjectGeneralInformation((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }
  return (
    <DialogContent className="sm:max-w-[650px]">
      <DialogHeader>
        <DialogTitle>Nouveau projet</DialogTitle>
        <DialogDescription>
          C'est ici que tout commence, complétez le formulaire, on s'occupe du
          reste.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="authorName" className="text-right">
            Nom de l'auteur
          </Label>
          <Input
            id="authorName"
            defaultValue="Saikou Sow"
            value={projectAuthorName}
            className="col-span-3"
            onChange={(e) => {
              setProjectAuthorName(e.currentTarget.value);
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectName" className="text-right">
            Nom du projet
          </Label>
          <Input
            id="projectName"
            value={projectName}
            className="col-span-3"
            onChange={(e) => {
              setProjectName(e.currentTarget.value);
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="address" className="text-right">
            Adresse du bien
          </Label>
          <Input
            id="address"
            value={projectAddress}
            placeholder="237 Rue des Pyrénées, 75020"
            className="col-span-3"
            onChange={(e) => {
              setProjectAddress(e.currentTarget.value);
            }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={projectDescription}
            className="col-span-3"
            onChange={(e) => {
              setProjectDescription(e.currentTarget.value);
            }}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="date" className="text-right">
            Date
          </Label>
          <DatePicker />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">Informations générales</Label>
          <div className="flex w-full justify-around col-span-3">
            <div className="flex flex-col w-1/4">
              <Label htmlFor="size">Taille du bien</Label>
              <Input
                id="size"
                value={projectGeneralInformation.size}
                placeholder="44m²"
                className="col-span-3 mt-2"
                onChange={handleGeneralInformationInputChange}
              />
            </div>
            <div className="flex flex-col w-1/4">
              <Label htmlFor="roomsNumber">Nombre de pièces</Label>
              <Input
                id="roomsNumber"
                value={projectGeneralInformation.roomsNumber}
                placeholder="5"
                className="col-span-3 mt-2"
                onChange={handleGeneralInformationInputChange}
              />
            </div>
            <div className="flex flex-col w-1/4">
              <Label htmlFor="floorsNumber">Nombre d'étages</Label>
              <Input
                id="floorsNumber"
                value={projectGeneralInformation.floorsNumber}
                placeholder="0"
                className="col-span-3 mt-2"
                onChange={handleGeneralInformationInputChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="energyForm" className="text-center">
            Partie énergétique
          </Label>
          <div className="flex items-center justify-around space-x-2 mt-4 mb-4">
            {energyFormGotOpened ? (
              <div
                className="flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer"
                onClick={() => {
                  setIsEnergyFormDisplayed(true);
                }}
              >
                <p>Modifier</p>
              </div>
            ) : (
              <>
                <div
                  onClick={() => {
                    setEnergyFormGotOpened(true);
                    setIsEnergyFormDisplayed(true);
                  }}
                  className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
                    energyFormGotOpened && "border-black"
                  }`}
                >
                  <p>Oui</p>
                </div>
                <div
                  onClick={() => {
                    setIsEnergyFormDisplayed(false);
                  }}
                  className={`flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer ${
                    !isEnergyFormDisplayed &&
                    !energyFormGotOpened &&
                    "border-black"
                  }`}
                >
                  <p>Non</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Créer le projet</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

export default InitialForm;
