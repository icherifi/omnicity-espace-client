import React from "react";

interface EnergyLabelProps {
  label: string;
}

const EnergyTag: React.FC<EnergyLabelProps> = ({ label }) => {
  const getLabelClass = (label: string) => {
    switch (label) {
      case "A":
        return "bg-grade-a";
      case "B":
        return "bg-grade-b";
      case "C":
        return "bg-grade-c";
      case "D":
        return "bg-grade-d";
      case "E":
        return "bg-grade-e";
      default:
        return "bg-grade-f";
    }
  };

  return (
    <div className={`${getLabelClass(label)} h-min p-6 pt-2 pb-2 rounded-lg`}>
      <span>{label}</span>
    </div>
  );
};

export default EnergyTag;
