"use client";
import { useCustomHook } from "@/app/layout";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface GeneralInformationType {
  size?: string;
  roomsNumber?: number;
  floorsNumber?: number;
}

interface NewProjectStandardFormType {
  projectAuthorName: string;
  setProjectAuthorName: Dispatch<SetStateAction<string>>;
  projectName: string;
  setProjectName: Dispatch<SetStateAction<string>>;
  projectAddress: string;
  setProjectAddress: Dispatch<SetStateAction<string>>;
  projectDescription: string;
  setProjectDescription: Dispatch<SetStateAction<string>>;
  projectDate: Date | undefined;
  setProjectDate: Dispatch<SetStateAction<Date | undefined>>;
  projectGeneralInformation: GeneralInformationType;
  setProjectGeneralInformation: Dispatch<
    SetStateAction<GeneralInformationType>
  >;
  resetProjectStandardForm: () => void;
}

export const NewProjectStandardFormContext = createContext<NewProjectStandardFormType | null>(
  null
);

const initialState = {
  projectAuthorName: "",
  projectName: "",
  projectAddress: "",
  projectDescription: "",
  projectDate: undefined,
  projectGeneralInformation: {
    size: "",
    roomsNumber: undefined,
    floorsNumber: undefined,
  },
};

export default function NewProjectStandardFormContextProvider({
  children,
}: useCustomHook) {
  const [projectAuthorName, setProjectAuthorName] = useState(
    initialState.projectAuthorName
  );
  const [projectName, setProjectName] = useState(initialState.projectName);
  const [projectAddress, setProjectAddress] = useState(
    initialState.projectAddress
  );
  const [projectDescription, setProjectDescription] = useState(
    initialState.projectDescription
  );
  const [projectDate, setProjectDate] = useState<Date | undefined>(
    initialState.projectDate
  );
  const [projectGeneralInformation, setProjectGeneralInformation] =
    useState<GeneralInformationType>(initialState.projectGeneralInformation);

  const resetProjectStandardForm = () => {
    setProjectAuthorName(initialState.projectAuthorName);
    setProjectName(initialState.projectName);
    setProjectAddress(initialState.projectAddress);
    setProjectDescription(initialState.projectDescription);
    setProjectDate(initialState.projectDate);
    setProjectGeneralInformation(initialState.projectGeneralInformation);
  };

  return (
    <NewProjectStandardFormContext.Provider
      value={{
        projectAuthorName,
        setProjectAuthorName,
        projectName,
        setProjectName,
        projectAddress,
        setProjectAddress,
        projectDescription,
        setProjectDescription,
        projectDate,
        setProjectDate,
        projectGeneralInformation,
        setProjectGeneralInformation,
        resetProjectStandardForm,
      }}
    >
      {children}
    </NewProjectStandardFormContext.Provider>
  );
}
export function useNewProjectStandardFormContext() {
  const context = useContext(NewProjectStandardFormContext);
  if (!context) {
    throw new Error(
      "useNewProjectStandardFormContext must be used within NewProjectStandardFormContextProvider"
    );
  }
  return context;
}
