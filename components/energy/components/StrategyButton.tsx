import React from "react";
import { EnergyLabelSolutionsType } from "../EnergyLabelSolutions";

interface StrategyOption {
  type: EnergyLabelSolutionsType;
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
    className={`flex flex-col items-center border-solid border-2 bg-slate-200 rounded-lg p-4 ${
      isSelected ? "bg-white border-2 border-violet-500" : ""
    } hover:cursor-pointer`}
  >
    <p className="font-semibold text-lg">{option.label}</p>
  </div>
);

export default StrategyButton; 