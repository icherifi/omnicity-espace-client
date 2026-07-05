import { getEnergyLabelColor } from "../utils";
import { ProjectType } from "@/types/project.types";
import {
  getEnergyMetrics,
  overallEnergyLabel,
} from "@/app/sections/dashboard/utils";

interface CurrentConditionProps {
  currentProjectDisplayed: ProjectType;
}

export const CurrentCondition = ({
  currentProjectDisplayed,
}: CurrentConditionProps) => {
  const metrics = getEnergyMetrics(currentProjectDisplayed);
  const initialLabel =
    overallEnergyLabel(metrics.initialCEP, metrics.initialEGES) || "G";

  return (
    <div className="bg-muted mb-8 rounded-2xl p-4 sm:p-6">
      <h2 className="text-xl text-center font-bold mb-6">
        Condition actuelle de votre habitation
      </h2>
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Étiquette énergétique</h3>
          <div className="flex items-center gap-4">
            <div
              className={`text-white font-bold px-4 py-2 rounded ${getEnergyLabelColor(initialLabel)}`}
            >
              {initialLabel}
            </div>
            <div>
              {metrics.initialCEP ? (
                <>
                  <p className="text-foreground">
                    {metrics.initialCEP} kWh/m2/an
                  </p>
                  <p className="text-foreground">
                    {metrics.initialEGES} kgCO2/m2/an
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Données non disponibles</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Confort</h3>
          <div className="flex items-center gap-2">
            <span className="text-foreground">
              {energyData?.confort === 3
                ? "😊"
                : energyData?.confort === 2
                  ? "😐"
                  : energyData?.confort === 1
                    ? "😔"
                    : "❓"}
            </span>
            <span className="text-foreground">
              Confort{" "}
              {energyData?.confort === 3
                ? "bon"
                : energyData?.confort === 2
                  ? "moyen"
                  : energyData?.confort === 1
                    ? "faible"
                    : "non évalué"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
