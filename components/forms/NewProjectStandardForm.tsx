"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import {
  handleImageChange,
  handleNewProject,
  saveIziResponseToBackend,
  updateProjectImage,
} from "@/utils/handleProjectDetails";
import { getToken } from "@/utils/supabase/client";
import { useProjectsContext } from "@/contexts/projects.context";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import EnergyForm from "../energy/EnergyForm";
import EnergyLabelSolutions from "../energy/EnergyLabelSolutions";
import { DialogClose } from "../ui/dialog";
import { useDashboardContext } from "@/contexts/dashboard.context";

interface NewProjectStandardFormProps {
  onError?: (error: string) => void;
}

function NewProjectForm({ onError }: NewProjectStandardFormProps) {
  const { projectAuthorName, setProjectAuthorName } =
    useNewProjectStandardFormContext();
  const { projectName, setProjectName } = useNewProjectStandardFormContext();
  const { projectAddress, setProjectAddress } = useNewProjectStandardFormContext();
  const { projectDescription, setProjectDescription } =
    useNewProjectStandardFormContext();
  const { projectGeneralInformation, setProjectGeneralInformation } =
    useNewProjectStandardFormContext();
  const { resetProjectStandardForm } = useNewProjectStandardFormContext();
  const { refreshProjects, projects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const {
    isEnergyFormDisplayed,
    setIsEnergyFormDisplayed,
    setEnergyFormGotOpened,
    sessionId,
    energyFormCompleted,
    setEnergyFormCompleted,
    isEnergyLabelSolutionsDisplayed
  } = useEnergyFormContext();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleGeneralInformationInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.currentTarget;

    setProjectGeneralInformation((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'authorName':
        return value.trim() === '' ? 'Le nom de l\'auteur est requis' : '';
      case 'projectName':
        return value.trim() === '' ? 'Le nom du projet est requis' : '';
      case 'projectAddress':
        return value.trim() === '' ? 'L\'adresse est requise' : '';
      case 'projectDescription':
        return value.trim() === '' ? 'La description est requise' : '';
      case 'size':
        return !value || isNaN(Number(value)) || Number(value) <= 0 
          ? 'La taille doit être un nombre positif' 
          : '';
      case 'roomsNumber':
        return !value || isNaN(Number(value)) || Number(value) <= 0 
          ? 'Le nombre de pièces doit être un nombre positif' 
          : '';
      case 'floorsNumber':
        return !value || isNaN(Number(value)) || Number(value) < 0 
          ? 'Le nombre d\'étages doit être un nombre positif ou nul' 
          : '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.currentTarget;
    const error = validateField(id, value);
    setErrors(prev => ({ ...prev, [id]: error }));

    if (id === 'size' || id === 'roomsNumber' || id === 'floorsNumber') {
      handleGeneralInformationInputChange(e as React.ChangeEvent<HTMLInputElement>);
    } else {
      switch (id) {
        case 'authorName':
          setProjectAuthorName(value);
          break;
        case 'projectName':
          setProjectName(value);
          break;
        case 'projectAddress':
          setProjectAddress(value);
          break;
        case 'projectDescription':
          setProjectDescription(value);
          break;
      }
    }
  };

  const handleNext = () => {
    setIsEnergyFormDisplayed(true);
  };

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
  
      await refreshProjects();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const newProject = projects.find(project => project.id === projectId);
      if (newProject) {
        setCurrentProjectDisplayed(newProject);
      }
      
      resetProjectStandardForm();
      setEnergyFormGotOpened(false);
      setIsEnergyFormDisplayed(false);
      setEnergyFormCompleted(false);
      localStorage.removeItem("quizResults");
    } catch (error) {
      console.error("Failed to create project:", error);
      onError?.("Une erreur est survenue lors de la création du projet.");
    }
  };

  const isFormValid = () => {
    return Object.values(errors).every(error => error === '');
  };

  if (isEnergyFormDisplayed) {
    return isEnergyLabelSolutionsDisplayed ? <EnergyLabelSolutions /> : <EnergyForm />;
  }

  return (
    <div className="space-y-4">
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
          <div className="col-span-3 space-y-1">
            <Input
              id="authorName"
              value={projectAuthorName}
              className={errors.authorName ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.authorName && (
              <p className="text-sm text-red-500">{errors.authorName}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectName" className="text-right">
            Nom du projet
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="projectName"
              value={projectName}
              className={errors.projectName ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.projectName && (
              <p className="text-sm text-red-500">{errors.projectName}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectAddress" className="text-right">
            Adresse du bien
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="projectAddress"
              value={projectAddress}
              placeholder="237 Rue des Pyrénées, 75020"
              className={errors.projectAddress ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.projectAddress && (
              <p className="text-sm text-red-500">{errors.projectAddress}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectDescription" className="text-right">
            Description
          </Label>
          <div className="col-span-3 space-y-1">
            <Textarea
              id="projectDescription"
              value={projectDescription}
              className={errors.projectDescription ? "border-red-500" : ""}
              onChange={handleInputChange}
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-500">{errors.projectDescription}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right w-full">
            Informations générales
          </Label>
          <div className="flex w-full items-center justify-around col-span-3">
            <div className="flex flex-col w-1/4">
              <Label htmlFor="size">Taille du bien</Label>
              <div className="space-y-1">
                <Input
                  id="size"
                  type="number"
                  min="0"
                  step="0.1"
                  value={projectGeneralInformation.size}
                  placeholder="44m²"
                  className={`col-span-3 mt-2 ${errors.size ? "border-red-500" : ""}`}
                  onChange={handleInputChange}
                />
                {errors.size && (
                  <p className="text-sm text-red-500">{errors.size}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <Label htmlFor="roomsNumber">Nombre de pièces</Label>
              <div className="space-y-1">
                <Input
                  id="roomsNumber"
                  type="number"
                  min="0"
                  step="1"
                  value={projectGeneralInformation.roomsNumber}
                  placeholder="5"
                  className={`col-span-3 mt-2 ${errors.roomsNumber ? "border-red-500" : ""}`}
                  onChange={handleInputChange}
                />
                {errors.roomsNumber && (
                  <p className="text-sm text-red-500">{errors.roomsNumber}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <Label htmlFor="floorsNumber">Nombre d'étages</Label>
              <div className="space-y-1">
                <Input
                  id="floorsNumber"
                  type="number"
                  min="0"
                  step="1"
                  value={projectGeneralInformation.floorsNumber}
                  placeholder="0"
                  className={`col-span-3 mt-2 ${errors.floorsNumber ? "border-red-500" : ""}`}
                  onChange={handleInputChange}
                />
                {errors.floorsNumber && (
                  <p className="text-sm text-red-500">{errors.floorsNumber}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        {energyFormCompleted ? (
          <DialogClose asChild>
            <Button onClick={handleSubmit} disabled={!isFormValid()}>
              Créer le projet
            </Button>
          </DialogClose>
        ) : (
          <Button onClick={handleNext} disabled={!isFormValid()}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
}

export default NewProjectForm;
