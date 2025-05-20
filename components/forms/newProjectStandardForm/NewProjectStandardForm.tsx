"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useProjectForm } from "@/hooks/useProjectForm";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { useProjectsContext } from "@/contexts/projects.context";
import { ProjectService } from "@/services/project.service";
import EnergyForm from "@/components/energy/EnergyForm";
import EnergyMixSolutions from "@/components/energy/EnergyMixSolutions";
import { DialogClose } from "@/components/ui/dialog";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";

interface NewProjectStandardFormProps {
  onError?: (error: string) => void;
  onClose: () => void;
}

function NewProjectStandardForm({ onError, onClose }: NewProjectStandardFormProps) {
  const {
    errors,
    isFormValid,
    selectedImage,
    onImageChange,
    onFieldChange,
    getStandardFormData,
  } = useProjectForm("standard");

  const {
    isEnergyFormDisplayed,
    setIsEnergyFormDisplayed,
    setEnergyFormGotOpened,
    energyFormCompleted,
    setEnergyFormCompleted,
    sessionId,
    isEnergyLabelSolutionsDisplayed,
  } = useEnergyFormContext();

  const { refreshProjects, projects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();
  const { resetProjectStandardForm } = useNewProjectStandardFormContext();

  const handleNext = () => {
    setIsEnergyFormDisplayed(true);
    setEnergyFormGotOpened(true);
  };

  const handleSubmit = async () => {
    try {
      const standardData = getStandardFormData();
      const projectId = await ProjectService.createStandardProject(standardData, {
        idBouquet: sessionId,
        energyFormCompleted,
        quizResults: JSON.parse(localStorage.getItem("quizResults") || "{}"),
      });

      refreshProjects();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newProject = projects.find((p) => p.id === projectId);
      if (newProject) setCurrentProjectDisplayed(newProject);

      setEnergyFormGotOpened(false);
      setIsEnergyFormDisplayed(false);
      setEnergyFormCompleted(false);
      localStorage.removeItem("quizResults");
      resetProjectStandardForm();
    } catch (e: any) {
      console.error("Failed to create project", e);
      onError?.(e.message || "Une erreur est survenue lors de la création du projet");
    }
  };

  useEffect(() => {
    if (energyFormCompleted) {
      handleSubmit();
      onClose();
    }
  }, [energyFormCompleted]);

  if (isEnergyFormDisplayed) {
    return isEnergyLabelSolutionsDisplayed ? <EnergyMixSolutions /> : <EnergyForm />;
  }

  const std = getStandardFormData();

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
              onImageChange(file);
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
              value={std.authorName}
              className={errors.authorName ? "border-red-500" : ""}
              onChange={e => onFieldChange("authorName", e.target.value)}
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
              value={std.projectName}
              className={errors.projectName ? "border-red-500" : ""}
              onChange={e => onFieldChange("projectName", e.target.value)}
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
              value={std.projectAddress || ""}
              placeholder="237 Rue des Pyrénées, 75020"
              className={errors.projectAddress ? "border-red-500" : ""}
              onChange={e => onFieldChange("projectAddress", e.target.value)}
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
              value={std.projectDescription || ""}
              className={errors.projectDescription ? "border-red-500" : ""}
              onChange={e => onFieldChange("projectDescription", e.target.value)}
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
                  value={std.generalInformation.size}
                  placeholder="44m²"
                  className={`col-span-3 mt-2 ${errors.size ? "border-red-500" : ""}`}
                  onChange={e => onFieldChange("generalInformation.size", e.target.value)}
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
                  value={std.generalInformation.roomsNumber}
                  placeholder="5"
                  className={`col-span-3 mt-2 ${errors.roomsNumber ? "border-red-500" : ""}`}
                  onChange={e => onFieldChange("generalInformation.roomsNumber", e.target.value)}
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
                  value={std.generalInformation.floorsNumber}
                  placeholder="0"
                  className={`col-span-3 mt-2 ${errors.floorsNumber ? "border-red-500" : ""}`}
                  onChange={e => onFieldChange("generalInformation.floorsNumber", e.target.value)}
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

export default NewProjectStandardForm;
