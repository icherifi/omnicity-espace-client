"use client";
import React, { createContext, useContext, useState } from "react";
import {
  KelvinInitialStateResponse,
  KelvinProjectedStateResponse,
} from "@/types/simulation.types";

type EnergyMixSolutionsType = "Simplicity" | "Balanced" | "Efficient";

interface SimulationResultsContextType {
  // Kelvin API States
  initialState: KelvinInitialStateResponse | null;
  setInitialState: (state: KelvinInitialStateResponse | null) => void;
  projectedState: KelvinProjectedStateResponse | null;
  setProjectedState: (state: KelvinProjectedStateResponse | null) => void;

  // Simulation Results Data (legacy)
  simulationResults: any;
  setSimulationResults: (results: any) => void;

  // UI State Management
  isEnergyLabelSolutionsDisplayed: boolean;
  setIsEnergyLabelSolutionsDisplayed: (isDisplayed: boolean) => void;

  // Session Management
  sessionId: string;
  setSessionId: (sessionId: string) => void;

  // Location Data
  postalCode: string;
  setPostalCode: (postalCode: string) => void;
  showPostalCode: boolean;
  setShowPostalCode: (showPostalCode: boolean) => void;

  // Address and Location Info
  selectedAddress: string;
  setSelectedAddress: (address: string) => void;
  selectedData: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  };
  setSelectedData: (data: any) => void;

  // Completion State
  simulationCompleted: boolean;
  setSimulationCompleted: (completed: boolean) => void;

  // Bouquet Selection State
  selectedBouquet: any;
  setSelectedBouquet: (bouquet: any) => void;
  selectedStrategy: EnergyMixSolutionsType;
  setSelectedStrategy: (strategy: EnergyMixSolutionsType) => void;
}

const SimulationResultsContext =
  createContext<SimulationResultsContextType | null>(null);

export default function SimulationResultsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Kelvin API States
  const [initialState, setInitialState] =
    useState<KelvinInitialStateResponse | null>(null);
  const [projectedState, setProjectedState] =
    useState<KelvinProjectedStateResponse | null>(null);

  // Legacy simulation results
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // UI States
  const [isEnergyLabelSolutionsDisplayed, setIsEnergyLabelSolutionsDisplayed] =
    useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [postalCode, setPostalCode] = useState("");
  const [showPostalCode, setShowPostalCode] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedData, setSelectedData] = useState({});
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [selectedBouquet, setSelectedBouquet] = useState<any>(null);
  const [selectedStrategy, setSelectedStrategy] =
    useState<EnergyMixSolutionsType>("Balanced");

  return (
    <SimulationResultsContext.Provider
      value={{
        // Kelvin API States
        initialState,
        setInitialState,
        projectedState,
        setProjectedState,

        // Legacy
        simulationResults,
        setSimulationResults,

        // UI States
        isEnergyLabelSolutionsDisplayed,
        setIsEnergyLabelSolutionsDisplayed,
        sessionId,
        setSessionId,
        postalCode,
        setPostalCode,
        showPostalCode,
        setShowPostalCode,
        selectedAddress,
        setSelectedAddress,
        selectedData,
        setSelectedData,
        simulationCompleted,
        setSimulationCompleted,
        selectedBouquet,
        setSelectedBouquet,
        selectedStrategy,
        setSelectedStrategy,
      }}
    >
      {children}
    </SimulationResultsContext.Provider>
  );
}

export function useSimulationResultsContext() {
  const ctx = useContext(SimulationResultsContext);
  if (!ctx) {
    throw new Error(
      "useSimulationResultsContext must be used within SimulationResultsContextProvider",
    );
  }
  return ctx;
}
