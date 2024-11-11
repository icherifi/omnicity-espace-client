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
import Property from "@/components/EnergyForm/components/Property";
import InsulationWork from "@/components/EnergyForm/components/InsulationWork";
import Energy from "@/components/EnergyForm/components/Energy";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import PropertyState from "./EnergyForm/components/PropertyState";
import EnergyLabelSolutions from "./EnergyForm/components/EnergyLabelSolutions";
import { useRouter } from "next/navigation";
import { handleImageChange } from "@/utils/handleImages";

function NewProjectForm(props: { onProjectsPage?: boolean }) {
  const {
    isEnergyFormDisplayed,
    setIsEnergyFormDisplayed,
    setEnergyFormGotOpened,
    energyFormGotOpened,
  } = useEnergyFormContext();
  const { currentEnergyFormPage, setCurrentEnergyFormPage } =
    useEnergyFormContext();
  const { projectAuthorName, setProjectAuthorName } =
    useNewProjectFormContext();
  const { projectName, setProjectName } = useNewProjectFormContext();
  const { projectAddress, setProjectAddress } = useNewProjectFormContext();
  const { projectDescription, setProjectDescription } =
    useNewProjectFormContext();
  const { projectGeneralInformation, setProjectGeneralInformation } =
    useNewProjectFormContext();
  const { resetProjectForm } = useNewProjectFormContext();
  const { resetEnergyForm } = useEnergyFormContext();
  const router = useRouter();

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

  const handleSubmit = async () => {
    const projectData = {
      authorName: projectAuthorName,
      name: projectName,
      address: projectAddress,
      description: projectDescription,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Project created successfully:", data);
      // Reset the form after successful submission
      resetProjectForm();
      resetEnergyForm();
      setEnergyFormGotOpened(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        resetProjectForm();
        resetEnergyForm();
        setEnergyFormGotOpened(false);
      }}
    >
      <DialogTrigger asChild>
        {props.onProjectsPage ? (
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Nouveau projet
          </span>
        ) : (
          <Button>Nouveau projet</Button>
        )}
      </DialogTrigger>

      {isEnergyFormDisplayed ? (
        <DialogContent
          className={`${
            currentEnergyFormPage == 5
              ? "sm:max-w-[1050px]"
              : "sm:max-w-[750px]"
          }`}
        >
          <DialogHeader>
            <DialogTitle>Formulaire energétique</DialogTitle>
            <DialogDescription>
              Complétez ce formulaire pour gérer la partie éléctrique de votre
              projet.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pb-0">
            {currentEnergyFormPage == 1 && <Property />}
            {currentEnergyFormPage == 2 && <InsulationWork />}
            {currentEnergyFormPage == 3 && <Energy />}
            {currentEnergyFormPage == 4 && <PropertyState />}
            {currentEnergyFormPage == 5 && <EnergyLabelSolutions />}
          </div>

          <DialogFooter>
            {currentEnergyFormPage == 5 ? (
              <Button
                onClick={() => {
                  router.push("/design");
                  //setCurrentEnergyFormPage(1)
                  //setIsEnergyFormDisplayed(false)
                }}
              >
                Terminer
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setCurrentEnergyFormPage(currentEnergyFormPage + 1);
                }}
              >
                Suivant
              </Button>
            )}

            {currentEnergyFormPage == 1 ? (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEnergyFormDisplayed(false);
                }}
              >
                Annuler
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setCurrentEnergyFormPage(currentEnergyFormPage - 1);
                }}
                variant="outline"
              >
                Retour
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Nouveau projet</DialogTitle>
            <DialogDescription>
              C'est ici que tout commence, complétez le formulaire, on s'occupe
              du reste.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authorName" className="text-right">
                Nom de l'auteur
              </Label>
              <Input
                id="authorName"
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
              <Label className="text-right w-full">
                Informations générales
              </Label>
              <div className="flex w-full items-center justify-around col-span-3">
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
                <div className="flex flex-col w-1/3">
                  <Label htmlFor="roomsNumber">Nombre de pièces</Label>
                  <Input
                    id="roomsNumber"
                    value={projectGeneralInformation.roomsNumber}
                    placeholder="5"
                    className="col-span-3 mt-2"
                    onChange={handleGeneralInformationInputChange}
                  />
                </div>
                <div className="flex flex-col w-1/3">
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
                  <>
                    <div
                      className="flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer"
                      onClick={() => {
                        setIsEnergyFormDisplayed(true);
                      }}
                    >
                      <p>Modifier</p>
                    </div>
                    <div
                      className="flex flex-col items-center border-solid border-2 rounded-lg p-4 hover:cursor-pointer"
                      onClick={() => {
                        setIsEnergyFormDisplayed(false);
                        setEnergyFormGotOpened(false);
                      }}
                    >
                      <p>Annuler</p>
                    </div>
                  </>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUpload" className="text-right">
                Importer une image
              </Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="col-span-3"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Créer le projet</Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default NewProjectForm;
