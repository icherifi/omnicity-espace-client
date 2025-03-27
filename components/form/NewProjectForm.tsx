"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useNewProjectFormContext } from "@/contexts/newProjectForm.context";
import {
  handleImageChange,
  handleNewProject,
  saveIziResponseToBackend,
  updateProjectImage,
} from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { useProjectsContext } from "@/contexts/projects.context";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import EnergyForm from "../energy/EnergyForm";
import EnergyLabelSolutions from "../energy/EnergyLabelSolutions";

function NewProjectForm(props: { onProjectsPage?: boolean }) {
  const { projectAuthorName, setProjectAuthorName } =
    useNewProjectFormContext();
  const { projectName, setProjectName } = useNewProjectFormContext();
  const { projectAddress, setProjectAddress } = useNewProjectFormContext();
  const { projectDescription, setProjectDescription } =
    useNewProjectFormContext();
  const { projectGeneralInformation, setProjectGeneralInformation } =
    useNewProjectFormContext();
  const { resetProjectForm } = useNewProjectFormContext();
  const { refreshProjects } = useProjectsContext();
  const {
    isEnergyFormDisplayed,
    setIsEnergyFormDisplayed,
    setEnergyFormGotOpened,
    energyFormGotOpened,
    sessionId,
    energyFormCompleted,
    setEnergyFormCompleted,
    isEnergyLabelSolutionsDisplayed  } = useEnergyFormContext();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);


  function handleGeneralInformationInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.currentTarget;

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
      id_bouquet: sessionId ? sessionId : null,
      state: "inprogress",
      features: {
        size: projectGeneralInformation.size,
        roomsNumber: projectGeneralInformation.roomsNumber,
        floorsNumber: projectGeneralInformation.floorsNumber,
      },
    };
  
    try {
      const token = await getToken();
      if (!token) {
        console.error("You are not authenticated");
        return;
      }
  
      const data = await handleNewProject(projectData, token);
      const projectId = data.data[0].id;
  
      let imageFullPath: string | null = null;
  
      if (selectedImage) {
        imageFullPath = await handleImageChange(selectedImage, token, projectId);
      }
  
      if (imageFullPath) {
        await updateProjectImage(projectId, imageFullPath, token);
      }

      if (energyFormCompleted) {
        const quizResults = localStorage.getItem("quizResults");
        const quizResultsData = JSON.parse(quizResults || "{}");

        saveIziResponseToBackend(quizResultsData, projectId, token);
      }
  
      refreshProjects();
      resetProjectForm();
      setEnergyFormGotOpened(false);
      setIsEnergyFormDisplayed(false);
      setEnergyFormCompleted(false);
      localStorage.removeItem("quizResults");
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog
      onOpenChange={() => {
        resetProjectForm();
        //resetEnergyForm();
        setIsEnergyFormDisplayed(false);
        setEnergyFormCompleted(false);
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
          className={`${isEnergyLabelSolutionsDisplayed ? "sm:max-w-[950px]" : "sm:max-w-[750px]"} max-h-[85vh] overflow-y-auto`}
          noClose={true}
        >
          <DialogHeader>
            <DialogTitle>Formulaire energétique</DialogTitle>
            <DialogDescription>
              Complétez ce formulaire pour gérer la partie éléctrique de votre
              projet.
            </DialogDescription>
          </DialogHeader>

          {isEnergyLabelSolutionsDisplayed ? <EnergyLabelSolutions /> : <EnergyForm />}
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
              <Label htmlFor="imageUpload" className="text-right">
                Importer une image
              </Label>
              <Input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="col-span-3"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setSelectedImage(file);
                }}
              />
            </div>
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
                        setEnergyFormCompleted(false);
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
                {energyFormCompleted && (
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <span>Validé</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleSubmit}>Créer le projet</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default NewProjectForm;
