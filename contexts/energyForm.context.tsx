"use client";
import React, { createContext, useContext, useState } from "react";

interface Step {
  "@context"?: string;
  "@id"?: string;
  "@type"?: string;
  id: string;
  node?: {
    "@type"?: string;
    "@id"?: string;
    question?: {
      "@type"?: string;
      "@id"?: string;
      choices?: Array<{
        "@type"?: string;
        "@id"?: string;
        id: string;
        label: string;
        position: number;
      }>;
      multiple?: boolean;
      select?: boolean;
      horizontal?: boolean;
      id: string;
      label: string;
      summaryLabel?: string;
      titleInfos?: string;
      descriptionInfos?: string;
      type: string;
    };
    graph?: {
      "@type"?: string;
      "@id"?: string;
      parcours?: {
        "@type"?: string;
        "@id"?: string;
        name: string;
        essentials: any[];
      };
    };
  };
  answer?: any;
  previousStep?: Step;
  nextStep?: Step;
}

interface EnergyFormContext {
  isEnergyFormDisplayed: boolean;
  setIsEnergyFormDisplayed: (isDisplayed: boolean) => void;
  energyFormGotOpened: boolean;
  setEnergyFormGotOpened: (gotOpened: boolean) => void;
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  showPostalCode: boolean;
  setShowPostalCode: (showPostalCode: boolean) => void;
  steps: Step[];
  setSteps: (steps: Step[]) => void;
  activeStepIndex: number;
  setActiveStepIndex: (activeStepIndex: number) => void;
  answerState: any;
  setAnswerState: (answerState: any) => void;
  energyFormCompleted: boolean;
  setEnergyFormCompleted: (energyFormCompleted: boolean) => void;
  isEnergyLabelSolutionsDisplayed: boolean;
  setIsEnergyLabelSolutionsDisplayed: (isEnergyLabelSolutionsDisplayed: boolean) => void;
}

const EnergyFormContext = createContext<EnergyFormContext | null>(null);

export default function EnergyFormContextProvider({ children }: { children: React.ReactNode }) {
  const [isEnergyFormDisplayed, setIsEnergyFormDisplayed] = useState(false);
  const [energyFormGotOpened, setEnergyFormGotOpened] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [postalCode, setPostalCode] = useState("");
  const [showPostalCode, setShowPostalCode] = useState(true);

  const [steps, setSteps] = useState<Step[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [answerState, setAnswerState] = useState<any>(null);
  const [energyFormCompleted, setEnergyFormCompleted] = useState(false);
  const [isEnergyLabelSolutionsDisplayed, setIsEnergyLabelSolutionsDisplayed] = useState(false);
  
  return (
    <EnergyFormContext.Provider
      value={{
        isEnergyFormDisplayed,
        setIsEnergyFormDisplayed,
        energyFormGotOpened,
        setEnergyFormGotOpened,
        sessionId,
        setSessionId,
        postalCode,
        setPostalCode,
        showPostalCode,
        setShowPostalCode,
        steps,
        setSteps,
        activeStepIndex,
        setActiveStepIndex,
        answerState,
        setAnswerState,
        energyFormCompleted,
        setEnergyFormCompleted,
        isEnergyLabelSolutionsDisplayed,
        setIsEnergyLabelSolutionsDisplayed
      }}
    >
      {children}
    </EnergyFormContext.Provider>
  );
}

export function useEnergyFormContext() {
  const ctx = useContext(EnergyFormContext);
  if (!ctx) {
    throw new Error("useEnergyFormContext must be used within provider");
  }
  return ctx;
}