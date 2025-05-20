import { useState, useCallback } from "react";
import { useNewProjectStandardFormContext } from "@/contexts/newProjectStandardForm.context";
import { StandardProjectFormData, DpeProjectFormData } from "@/types/project.types";
import { validateField } from "@/components/forms/newProjectStandardForm/utils";

export type ProjectFormType = "standard" | "dpe";

export const useProjectForm = (type: ProjectFormType) => {
  const {
    projectAuthorName,
    setProjectAuthorName,
    projectName,
    setProjectName,
    projectAddress,
    setProjectAddress,
    projectDescription,
    setProjectDescription,
    projectGeneralInformation,
    setProjectGeneralInformation,
  } = useNewProjectStandardFormContext();

  const [dpeInformation, setDpeInformation] = useState<DpeProjectFormData["dpeInformation"] | undefined>(
    type === "dpe"
      ? {
          dpeNumber: "",
          fiscalIncome: "",
          householdSize: "",
          occupancyStatus: "primaryOwner",
          baseValue: "",
        }
      : undefined
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onFieldChange = useCallback(
    (field: string, value: any) => {
      const key = field.split(".").pop() as string;
      const errorMsg = validateField(key, value);
      setErrors((prev) => ({ ...prev, [key]: errorMsg }));

      switch (field) {
        case "authorName":
          setProjectAuthorName(value);
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
        case "generalInformation.size":
          setProjectGeneralInformation({ ...projectGeneralInformation, size: value });
          break;
        case "generalInformation.roomsNumber":
          setProjectGeneralInformation({ ...projectGeneralInformation, roomsNumber: Number(value) });
          break;
        case "generalInformation.floorsNumber":
          setProjectGeneralInformation({ ...projectGeneralInformation, floorsNumber: Number(value) });
          break;
        default:
          if (type === "dpe" && dpeInformation) {
            const key = field.replace("dpeInformation.", "") as keyof typeof dpeInformation;
            setDpeInformation({ ...dpeInformation, [key]: value });
          }
          break;
      }
    },
    [type, setProjectAuthorName, setProjectName, setProjectAddress, setProjectDescription, setProjectGeneralInformation, projectGeneralInformation, dpeInformation]
  );

  const onImageChange = (file: File | null) => {
    setSelectedImage(file);
  };

  const isFormValid = () => Object.values(errors).every((e) => e === "");

  const getStandardFormData = (): StandardProjectFormData => ({
    authorName: projectAuthorName,
    projectName,
    projectAddress,
    projectDescription,
    generalInformation: {
      size: projectGeneralInformation.size as unknown as string,
      roomsNumber: projectGeneralInformation.roomsNumber as number,
      floorsNumber: projectGeneralInformation.floorsNumber as number,
    },
    image: selectedImage,
  });

  const getDpeFormData = (): DpeProjectFormData => ({
    authorName: projectAuthorName,
    projectName,
    dpeInformation: dpeInformation!,
    image: selectedImage,
  });

  return {
    errors,
    isFormValid,
    selectedImage,
    onImageChange,
    onFieldChange,
    getStandardFormData,
    getDpeFormData,
  };
}; 