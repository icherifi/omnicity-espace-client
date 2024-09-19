"use client"
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface GeneralInformationType {
    size?: string,
    roomsNumber?: number,
    floorsNumber?: number
}

interface NewProjectFormType {
    projectAuthorName: string,
    setProjectAuthorName: Dispatch<SetStateAction<string>>,
    projectName: string,
    setProjectName: Dispatch<SetStateAction<string>>,
    projectAddress: string,
    setProjectAddress: Dispatch<SetStateAction<string>>,
    projectDescription: string,
    setProjectDescription: Dispatch<SetStateAction<string>>,
    projectDate: Date | undefined,
    setProjectDate: Dispatch<SetStateAction<Date | undefined>>,
    projectGeneralInformation: GeneralInformationType,
    setProjectGeneralInformation: Dispatch<SetStateAction<GeneralInformationType>>,
    resetProjectForm: () => void
}

export const NewProjectFormContext = createContext<NewProjectFormType | null>(null)

// Valeurs initiales du formulaire
const initialState = {
    projectAuthorName: "",
    projectName: "",
    projectAddress: "",
    projectDescription: "",
    projectDate: undefined,
    projectGeneralInformation: {
        size: "",
        roomsNumber: undefined,
        floorsNumber: undefined
    }
};

export default function NewProjectFormContextProvider({ children }: useCustomHook) {
    const [projectAuthorName, setProjectAuthorName] = useState(initialState.projectAuthorName);
    const [projectName, setProjectName] = useState(initialState.projectName);
    const [projectAddress, setProjectAddress] = useState(initialState.projectAddress);
    const [projectDescription, setProjectDescription] = useState(initialState.projectDescription);
    const [projectDate, setProjectDate] = useState<Date | undefined>(initialState.projectDate);
    const [projectGeneralInformation, setProjectGeneralInformation] = useState<GeneralInformationType>(initialState.projectGeneralInformation);

    // Fonction pour réinitialiser tous les états
    const resetProjectForm = () => {
        setProjectAuthorName(initialState.projectAuthorName);
        setProjectName(initialState.projectName);
        setProjectAddress(initialState.projectAddress);
        setProjectDescription(initialState.projectDescription);
        setProjectDate(initialState.projectDate);
        setProjectGeneralInformation(initialState.projectGeneralInformation);
    };

    return (
        <NewProjectFormContext.Provider value={{
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
            resetProjectForm 
        }}>
            {children}
        </NewProjectFormContext.Provider>
    );
}
export function useNewProjectFormContext () {
    const context = useContext(NewProjectFormContext)
    if(!context) {
        throw new Error("useNewProjectFormContext must be used within NewProjectFormContextProvider")
    }
    return context
}