import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjectForm } from "@/hooks/useProjectForm";

interface Props {
  onNext: () => void;
}

export default function NewProjectCommonForm({ onNext }: Props) {
  const { errors, isFormValid, onImageChange, onFieldChange, getStandardFormData } = useProjectForm("standard");

  const std = getStandardFormData();

  const handleNext = () => {
    // Forcer la validation des champs requis
    if (!std.firstName?.trim()) {
      onFieldChange("firstName", std.firstName || "");
    }
    if (!std.lastName?.trim()) {
      onFieldChange("lastName", std.lastName || "");
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
          <Label htmlFor="imageUpload" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
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
            <Label htmlFor="firstName" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px] min-w-[140px]">
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
            <Label htmlFor="lastName" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
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
          <Label htmlFor="contractType" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Type de contrat
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="contractType"
              value={std.contractType || ""}
              className={`rounded-[12px] ${errors.contractType ? "border-red-500" : ""}`}
              onChange={(e) => onFieldChange("contractType", e.target.value)}
            />
            {errors.contractType && (
              <p className="text-sm text-red-500">{errors.contractType}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectAddress" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Adresse du bien
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
          <Label htmlFor="fiscalIncome" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Revenus fiscaux
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="fiscalIncome"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={std.fiscalIncome || ""}
              className={`rounded-[12px] ${errors.fiscalIncome ? "border-red-500" : ""}`}
              onChange={(e) =>
                onFieldChange(
                  "dpeInformation.fiscalIncome",
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
            {errors.fiscalIncome && (
              <p className="text-sm text-red-500">{errors.fiscalIncome}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="householdSize" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Nombre de personnes
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="householdSize"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={std.householdSize || ""}
              className={`rounded-[12px] ${errors.householdSize ? "border-red-500" : ""}`}
              onChange={(e) =>
                onFieldChange(
                  "dpeInformation.householdSize",
                  e.target.value.replace(/\D/g, "")
                )
              }
            />
            {errors.householdSize && (
              <p className="text-sm text-red-500">{errors.householdSize}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="baseValue" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Valeur estimée du bien (€)
          </Label>
          <div className="col-span-3 space-y-1">
            <Input
              id="baseValue"
              type="text"
              inputMode="decimal"
              pattern="[0-9]*[.,]?[0-9]*"
              value={std.baseValue || ""}
              className={`rounded-[12px] ${errors.baseValue ? "border-red-500" : ""}`}
              onChange={(e) =>
                onFieldChange(
                  "dpeInformation.baseValue",
                  e.target.value.replace(/[^\d.,]/g, "").replace(/,/g, ".")
                )
              }
            />
            {errors.baseValue && (
              <p className="text-sm text-red-500">{errors.baseValue}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="occupancyStatus" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Statut de résidence
          </Label>
          <Select
            value={std.occupancyStatus}
            onValueChange={(value) => onFieldChange("dpeInformation.occupancyStatus", value)}
          >
            <SelectTrigger className="col-span-3 rounded-[12px]">
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

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="projectDescription" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
            Description
          </Label>
          <div className="col-span-3 space-y-1">
            <Textarea
              id="projectDescription"
              value={std.projectDescription || ""}
              className={`rounded-[12px] ${errors.projectDescription ? "border-red-500" : ""}`}
              onChange={(e) => onFieldChange("projectDescription", e.target.value)}
            />
            {errors.projectDescription && (
              <p className="text-sm text-red-500">{errors.projectDescription}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px] w-full">
            Informations générales
          </Label>
          <div className="flex w-full items-center justify-around col-span-3">
            <div className="flex flex-col w-1/4">
              <Label htmlFor="size" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
                Taille du bien
              </Label>
              <div className="space-y-1">
                <Input
                  id="size"
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={std.generalInformation.size}
                  placeholder="44m²"
                  className={`col-span-3 mt-2 rounded-[12px] ${errors.size ? "border-red-500" : ""}`}
                  onChange={(e) =>
                    onFieldChange(
                      "generalInformation.size",
                      e.target.value.replace(/[^\d.,]/g, "").replace(/,/g, ".")
                    )
                  }
                />
                {errors.size && (
                  <p className="text-sm text-red-500">{errors.size}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <Label htmlFor="roomsNumber" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
                Nombre de pièces
              </Label>
              <div className="space-y-1">
                <Input
                  id="roomsNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={std.generalInformation.roomsNumber}
                  placeholder="5"
                  className={`col-span-3 mt-2 rounded-[12px] ${errors.roomsNumber ? "border-red-500" : ""}`}
                  onChange={(e) =>
                    onFieldChange(
                      "generalInformation.roomsNumber",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                />
                {errors.roomsNumber && (
                  <p className="text-sm text-red-500">{errors.roomsNumber}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col w-1/3">
              <Label htmlFor="floorsNumber" className="[color:var(--figma-secondary-color)] text-right text-[14px] font-bold leading-[19.6px]">
                Nombre d'étages
              </Label>
              <div className="space-y-1">
                <Input
                  id="floorsNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={std.generalInformation.floorsNumber}
                  placeholder="0"
                  className={`col-span-3 mt-2 rounded-[12px] ${errors.floorsNumber ? "border-red-500" : ""}`}
                  onChange={(e) =>
                    onFieldChange(
                      "generalInformation.floorsNumber",
                      e.target.value.replace(/\D/g, "")
                    )
                  }
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
        <Button onClick={handleNext} disabled={!isFormValid()}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
