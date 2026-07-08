import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectForm } from "@/hooks/useProjectForm";

interface Props {
  onNext: () => void;
}

export default function NewProjectCommonForm({ onNext }: Props) {
  const {
    errors,
    isFormValid,
    onImageChange,
    onFieldChange,
    getStandardFormData,
  } = useProjectForm("standard");

  const std = getStandardFormData();

  const handleNext = () => {
    // Forcer la validation des champs requis
    if (!std.firstName?.trim()) {
      onFieldChange("firstName", std.firstName || "");
    }
    if (!std.lastName?.trim()) {
      onFieldChange("lastName", std.lastName || "");
    }
    if (!std.projectAddress?.trim()) {
      onFieldChange("projectAddress", std.projectAddress || "");
    }
    if (!std.baseValue || std.baseValue <= 0) {
      onFieldChange("baseValue", std.baseValue || 0);
    }

    // Vérifier si le formulaire est valide avant de continuer
    if (isFormValid()) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="imageUpload"
            className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]"
          >
            Importer une image
          </Label>
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="col-span-2 rounded-[12px]"
            onChange={(e) => onImageChange(e.target.files?.[0] || null)}
          />
        </div>

        <div className="flex flex-row justify-around gap-4 items-center">
          <div className="flex flex-row flex-1 items-center gap-2">
            <Label
              htmlFor="firstName"
              className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px] min-w-[140px]"
            >
              Prénom du client *
            </Label>
            <Input
              id="firstName"
              value={std.firstName}
              className={`rounded-[12px] flex-1 ${errors.firstName ? "border-red-500" : ""}`}
              onChange={(e) => onFieldChange("firstName", e.target.value)}
            />
            {errors.firstName && (
              <p className="text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>
          <div className="flex flex-row flex-1 items-center gap-2">
            <Label
              htmlFor="lastName"
              className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]"
            >
              Nom du client *
            </Label>
            <Input
              id="lastName"
              value={std.lastName}
              className={`rounded-[12px] flex-1 ${errors.lastName ? "border-red-500" : ""}`}
              onChange={(e) => onFieldChange("lastName", e.target.value)}
            />
            {errors.lastName && (
              <p className="text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="projectAddress"
            className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]"
          >
            Adresse du bien *
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="projectAddress"
              value={std.projectAddress || ""}
              placeholder="237 Rue des Pyrénées, 75020"
              className={`rounded-[12px] ${errors.projectAddress ? "border-red-500" : ""}`}
              onChange={(e) => onFieldChange("projectAddress", e.target.value)}
            />
            {errors.projectAddress && (
              <p className="text-sm text-red-500">{errors.projectAddress}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="baseValue"
            className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]"
          >
            Valeur estimée du bien (€) *
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="baseValue"
              type="number"
              value={std.baseValue || 0}
              className={`rounded-[12px] ${errors.baseValue ? "border-red-500" : ""}`}
              onChange={(e) =>
                onFieldChange(
                  "baseValue",
                  Number(e.target.value) || 0,
                )
              }
            />
            {errors.baseValue && (
              <p className="text-sm text-red-500">{errors.baseValue}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="projectDescription"
            className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]"
          >
            Description
          </Label>
          <div className="col-span-3 space-y-1">
            <Textarea
              id="projectDescription"
              value={std.projectDescription || ""}
              className={`rounded-[1
                2px] ${errors.projectDescription ? "border-red-500" : ""}`}
              onChange={(e) =>
                onFieldChange("projectDescription", e.target.value)
              }
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-500">
                {errors.projectDescription}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!isFormValid()}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
