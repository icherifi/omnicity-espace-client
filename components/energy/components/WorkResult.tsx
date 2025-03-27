import React, { useState } from "react";
import ToggleButton from "@/components/omnicity/buttons/toggle";
import FuturStateDetails from "@/components/details/components/FuturStateDetails";
import CurrentStateDetails from "@/components/details/components/CurrentStateDetails";
import { WorkResultProps } from "@/types/project.types";

export function WorkResult({ bouquet, initialState }: WorkResultProps) {
  const [selected, setSelected] = useState<"avant" | "apres">("apres");

  return (
    <div className="flex flex-col w-1/3 p-4 mb-4">
      <h3 className="font-bold text-lg self-center">Résultat des travaux</h3>

      <div className="flex rounded-full bg-blue-100 p-1 my-2 self-center">
        <ToggleButton
          isSelected={selected === "avant"}
          onClick={() => setSelected("avant")}
        >
          Avant
        </ToggleButton>
        <ToggleButton
          isSelected={selected === "apres"}
          onClick={() => setSelected("apres")}
        >
          Après
        </ToggleButton>
      </div>

      {selected === "apres" ? (
        <FuturStateDetails 
          bouquet={bouquet} 
          initialState={initialState} 
        />
      ) : (
        <CurrentStateDetails 
          initialState={initialState} 
        />
      )}
    </div>
  );
}

export default WorkResult;
