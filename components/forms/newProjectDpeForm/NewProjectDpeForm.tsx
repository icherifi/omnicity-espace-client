"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ImageUpload from "../common/ImageUpload";
import FormField from "../common/FormField";
import { useProjectForm } from "@/hooks/useProjectForm";
import { fetchDpeFormData } from "@/utils/handleDpeFormData";
import { ProjectService } from "@/services/project.service";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import EnergyMixSolutions, { EnergyMixSolutionsType } from "@/components/energy/EnergyMixSolutions";
import LoadingSpinner from "@/components/LoadingSpinner";
import { EnergyMix } from "@/types/project.types";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useProjectsContext } from "@/contexts/projects.context";

interface NewProjectDpeFormProps {
  onError?: (error: string) => void;
  onClose?: () => void;
}

function NewProjectDpeForm({ onError, onClose }: NewProjectDpeFormProps) {
  const {
    errors,
    isFormValid,
    onImageChange,
    onFieldChange,
    getDpeFormData,
  } = useProjectForm("dpe");

  const [isLoading, setIsLoading] = useState(false);
  const [dpeData, setDpeData] = useState<any>(null);
  const [showEnergySolutions, setShowEnergySolutions] = useState(false);

  const { sessionId, setSessionId } = useEnergyFormContext();

  const { refreshProjects, projects } = useProjectsContext();
  const { setCurrentProjectDisplayed } = useDashboardContext();

  const handleDpeSubmit = async () => {
    try {
      setIsLoading(true);
      const data = await fetchDpeFormData(getDpeFormData().dpeInformation);
      setDpeData(data);
      setSessionId(data.sessionId);
      setShowEnergySolutions(true);
    } catch (e: any) {
      console.error("Erreur dans handleDpeSubmit", e);
      onError?.(e.message || "Une erreur est survenue lors de l'analyse du DPE");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (
    selectedBouquet: EnergyMix,
    selectedStrategy: EnergyMixSolutionsType
  ) => {
    try {
      const formData = getDpeFormData();
      const projectId = await ProjectService.createProjectFromDpe(
        formData,
        dpeData,
        sessionId,
        selectedBouquet,
        selectedStrategy
      );

      refreshProjects();
      await new Promise((res) => setTimeout(res, 100));
      const newProject = projects.find((p) => p.id === projectId);
      if (newProject) setCurrentProjectDisplayed(newProject);

      onClose?.();
    } catch (e: any) {
      console.error("Erreur dans handleCreateProject", e);
      onError?.(e.message || "Une erreur est survenue lors de la création du projet");
    }
  };

  if (showEnergySolutions && dpeData) {
    return (
      <EnergyMixSolutions
        onFinish={handleCreateProject}
        initialData={dpeData.iziResponse}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <ImageUpload onImageChange={onImageChange} />

        <FormField
          label="Nom de l'auteur"
          id="authorName"
          value={getDpeFormData().authorName}
          error={errors.authorName}
          onChange={(value) => onFieldChange("authorName", value)}
        />

        <FormField
          label="Nom du projet"
          id="projectName"
          value={getDpeFormData().projectName}
          error={errors.projectName}
          onChange={(value) => onFieldChange("projectName", value)}
        />

        <FormField
          label="Numéro DPE"
          id="dpeNumber"
          value={getDpeFormData().dpeInformation.dpeNumber}
          error={errors.dpeNumber}
          onChange={(value) => onFieldChange("dpeInformation.dpeNumber", value)}
          placeholder="2324D1234567"
        />

        <FormField
          label="Revenus fiscaux"
          id="fiscalIncome"
          type="number"
          value={getDpeFormData().dpeInformation.fiscalIncome}
          error={errors.fiscalIncome}
          onChange={(value) => onFieldChange("dpeInformation.fiscalIncome", value)}
          placeholder="30000"
        />

        <FormField
          label="Nombre de personnes"
          id="householdSize"
          type="number"
          value={getDpeFormData().dpeInformation.householdSize}
          error={errors.householdSize}
          onChange={(value) => onFieldChange("dpeInformation.householdSize", value)}
          placeholder="2"
        />

        <FormField
          label="Valeur estimée du bien (€)"
          id="baseValue"
          type="number"
          value={getDpeFormData().dpeInformation.baseValue}
          error={errors.baseValue}
          onChange={(value) => onFieldChange("dpeInformation.baseValue", value)}
          placeholder="250000"
        />

        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="occupancyStatus" className="text-right">
            Statut de résidence
          </label>
          <Select
            value={getDpeFormData().dpeInformation.occupancyStatus}
            onValueChange={(value) => onFieldChange("dpeInformation.occupancyStatus", value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Sélectionnez..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primaryOwner">Propriétaire résidence principale</SelectItem>
              <SelectItem value="secondaryOwner">Propriétaire résidence secondaire</SelectItem>
              <SelectItem value="ownerTenant">Propriétaire bailleur</SelectItem>
              <SelectItem value="tenant">Locataire</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        {isLoading ? (
          <div className="flex items-center">
            <LoadingSpinner size="lg" />
            <span className="ml-2 text-sm text-gray-500">Analyse du DPE en cours...</span>
          </div>
        ) : (
          <Button onClick={handleDpeSubmit} disabled={!isFormValid()}>
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
}

export default NewProjectDpeForm;
