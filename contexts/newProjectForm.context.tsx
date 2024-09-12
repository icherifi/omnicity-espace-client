"use client"
import { useCustomHook } from "@/app/layout";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";

interface NewProjectFormType {
    isEnergyFormDisplayed: boolean,
    setIsEnergyFormDisplayed: Dispatch<SetStateAction<boolean>>
}

export const NewProjectFormContext = createContext<NewProjectFormType | null>(null)

export default function NewProjectFormContextProvider ({children}: useCustomHook) {
    const [isEnergyFormDisplayed, setIsEnergyFormDisplayed] = useState(false)
    return (
        <NewProjectFormContext.Provider value={{
            isEnergyFormDisplayed: isEnergyFormDisplayed,
            setIsEnergyFormDisplayed: setIsEnergyFormDisplayed
        }}>
            {children}
        </NewProjectFormContext.Provider>
    )
}

export function useNewProjectFormContext () {
    const context = useContext(NewProjectFormContext)
    if(!context) {
        throw new Error("useNewProjectFormContext must be used within NewProjectFormContextProvider")
    }
    return context
}