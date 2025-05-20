import React from "react";
import { EnergyMixSolutionsType } from "../EnergyMixSolutions";

interface StrategyOption {
  type: EnergyMixSolutionsType;
  label: string;
  description: string;
}

interface StrategyButtonProps {
  option: StrategyOption;
  isSelected: boolean;
  onClick: () => void;
}

const StrategyButton: React.FC<StrategyButtonProps> = ({ option, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center border-solid border-2 bg-muted rounded-lg p-4 ${
      isSelected ? "bg-background border-2 border-primary" : ""
    } hover:cursor-pointer`}
  >
    <p className="font-semibold text-lg text-foreground">{option.label}</p>
  </div>
);

export default StrategyButton; 