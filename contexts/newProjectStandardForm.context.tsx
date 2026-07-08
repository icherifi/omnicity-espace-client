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
  firstName: string;
  setFirstName: Dispatch<SetStateAction<string>>;
  lastName: string;
  setLastName: Dispatch<SetStateAction<string>>;
  projectName: string;
  setProjectName: Dispatch<SetStateAction<string>>;
  projectAddress: string;
  setProjectAddress: Dispatch<SetStateAction<string>>;
  projectDescription: string;
  setProjectDescription: Dispatch<SetStateAction<string>>;
  contractType: string;
  setContractType: Dispatch<SetStateAction<string>>;
  projectDate: Date | undefined;
  setProjectDate: Dispatch<SetStateAction<Date | undefined>>;
  projectGeneralInformation: GeneralInformationType;
  setProjectGeneralInformation: Dispatch<
    SetStateAction<GeneralInformationType>
  >;
  fiscalIncome: string;
  setFiscalIncome: Dispatch<SetStateAction<string>>;
  householdSize: string;
  setHouseholdSize: Dispatch<SetStateAction<string>>;
  baseValue: number;
  setBaseValue: Dispatch<SetStateAction<number>>;
  occupancyStatus: string;
  setOccupancyStatus: Dispatch<SetStateAction<string>>;
  image: File | null;
  setImage: Dispatch<SetStateAction<File | null>>;
  resetProjectStandardForm: () => void;
}

export const NewProjectStandardFormContext =
  createContext<NewProjectStandardFormType | null>(null);

const initialState = {
  firstName: "",
  lastName: "",
  projectName: "",
  projectAddress: "",
  projectDescription: "",
  contractType: "",
  fiscalIncome: "",
  householdSize: "",
  baseValue: 0,
  occupancyStatus: "primaryOwner",
  image: null as File | null,
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
  const [firstName, setFirstName] = useState(initialState.firstName);
  const [lastName, setLastName] = useState(initialState.lastName);
  const [projectName, setProjectName] = useState(initialState.projectName);
  const [projectAddress, setProjectAddress] = useState(
    initialState.projectAddress,
  );
  const [projectDescription, setProjectDescription] = useState(
    initialState.projectDescription,
  );
  const [contractType, setContractType] = useState(initialState.contractType);
  const [projectDate, setProjectDate] = useState<Date | undefined>(
    initialState.projectDate,
  );
  const [fiscalIncome, setFiscalIncome] = useState(initialState.fiscalIncome);
  const [householdSize, setHouseholdSize] = useState(
    initialState.householdSize,
  );
  const [baseValue, setBaseValue] = useState(initialState.baseValue);
  const [occupancyStatus, setOccupancyStatus] = useState(
    initialState.occupancyStatus,
  );
  const [image, setImage] = useState<File | null>(initialState.image);
  const [projectGeneralInformation, setProjectGeneralInformation] =
    useState<GeneralInformationType>(initialState.projectGeneralInformation);

  const resetProjectStandardForm = () => {
    setFirstName(initialState.firstName);
    setLastName(initialState.lastName);
    setProjectName(initialState.projectName);
    setProjectAddress(initialState.projectAddress);
    setProjectDescription(initialState.projectDescription);
    setContractType(initialState.contractType);
    setProjectDate(initialState.projectDate);
    setFiscalIncome(initialState.fiscalIncome);
    setHouseholdSize(initialState.householdSize);
    setBaseValue(initialState.baseValue);
    setOccupancyStatus(initialState.occupancyStatus);
    setImage(initialState.image);
    setProjectGeneralInformation(initialState.projectGeneralInformation);
  };

  return (
    <NewProjectStandardFormContext.Provider
      value={{
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
        projectDate,
        setProjectDate,
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
      "useNewProjectStandardFormContext must be used within NewProjectStandardFormContextProvider",
    );
  }
  return context;
}
