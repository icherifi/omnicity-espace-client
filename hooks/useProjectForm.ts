import { useState, useCallback } from "react";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import { StandardProjectFormData, DpeProjectFormData } from "@/types/project.types";
import { validateField } from "@/components/forms/newProjectEnergyForm/utils";

export type ProjectFormType = "standard" | "dpe";

export const useProjectForm = (type: ProjectFormType) => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    projectName,
    setProjectName,
    projectAddress,
    setProjectAddress,
    projectDescription,
    setProjectDescription,
    contractType,
    setContractType,
    projectGeneralInformation,
    setProjectGeneralInformation,
    fiscalIncome,
    setFiscalIncome,
    householdSize,
    setHouseholdSize,
    baseValue,
    setBaseValue,
    occupancyStatus,
    setOccupancyStatus,
    image,
    setImage,
  } = useNewProjectStandardFormContext();

  const [dpeNumber, setDpeNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFieldChange = useCallback(
    (field: string, value: any) => {
      const key = field.split(".").pop() as string;
      const errorMsg = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: errorMsg }));

      switch (field) {
        case "firstName":
          setFirstName(value);
          break;
        case "lastName":
          setLastName(value);
          break;
        case "projectName":
          setProjectName(value);
          break;
        case "projectAddress":
          setProjectAddress(value);
          break;
        case "projectDescription":
          setProjectDescription(value);
          break;
        case "contractType":
          setContractType(value);
          break;
        case "generalInformation.size":
          setProjectGeneralInformation({ ...projectGeneralInformation, size: value });
          break;
        case "generalInformation.roomsNumber":
          setProjectGeneralInformation({ ...projectGeneralInformation, roomsNumber: Number(value) });
          break;
        case "generalInformation.floorsNumber":
          setProjectGeneralInformation({ ...projectGeneralInformation, floorsNumber: Number(value) });
          break;
        case "dpeInformation.dpeNumber":
          setDpeNumber(value);
          break;
        case "dpeInformation.fiscalIncome":
          setFiscalIncome(value);
          break;
        case "dpeInformation.householdSize":
          setHouseholdSize(value);
          break;
        case "dpeInformation.baseValue":
          setBaseValue(value);
          break;
        case "dpeInformation.occupancyStatus":
          setOccupancyStatus(value);
          break;
        default:
          break;
      }
    },
    [setFirstName, setLastName, setProjectName, setProjectAddress, setProjectDescription, setProjectGeneralInformation, projectGeneralInformation, setContractType, setFiscalIncome, setHouseholdSize, setBaseValue, setOccupancyStatus]
  );

  const onImageChange = (file: File | null) => {
    setImage(file);
  };

  const isFormValid = () => {
    // Vérifier qu'il n'y a pas d'erreurs de validation
    const hasValidationErrors = Object.values(errors).some((e) => e !== "");
    
    // Vérifier que les champs requis ne sont pas vides
    const hasRequiredFieldsEmpty = !firstName?.trim() || !lastName?.trim();
    
    return !hasValidationErrors && !hasRequiredFieldsEmpty;
  };

  const getStandardFormData = (): StandardProjectFormData => ({
    firstName,
    lastName,
    projectName,
    projectAddress,
    projectDescription,
    generalInformation: {
      size: projectGeneralInformation.size as unknown as string,
      roomsNumber: projectGeneralInformation.roomsNumber as number,
      floorsNumber: projectGeneralInformation.floorsNumber as number,
    },
    contractType,
    fiscalIncome,
    householdSize,
    baseValue,
    occupancyStatus,
    image,
  });

  const getDpeFormData = (): DpeProjectFormData => ({
    firstName,
    lastName,
    projectName,
    projectDescription,
    dpeInformation: {
      dpeNumber,
      fiscalIncome,
      householdSize,
      occupancyStatus,
      baseValue,
    },
    contract_type: contractType,
    image,
  });

  return {
    errors,
    isFormValid,
    selectedImage: image,
    onImageChange,
    onFieldChange,
    getStandardFormData,
    getDpeFormData,
  };
}; 