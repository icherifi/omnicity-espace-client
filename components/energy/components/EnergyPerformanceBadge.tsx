import { Badge } from "@/components/ui/badge";
import React from "react";

function EnergyPerformanceBadge(props: { state: 1 | 2 | 3 }) {
  const stateMap: { [key in 1 | 2 | 3]: "well" | "average" | "bad" } = {
    1: "well",
    2: "average",
    3: "bad",
  };
  const badgeValueMap = {
    1: "Bien",
    2: "Moyen",
    3: "Mauvais",
  };

  return (
    <div className="pl-2 w-min">
      <Badge variant={stateMap[props.state]}>
        {badgeValueMap[props.state]}
      </Badge>
    </div>
  );
}

export default EnergyPerformanceBadge;
