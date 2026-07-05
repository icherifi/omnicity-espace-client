import { cn } from "@/lib/utils";
import { getEnergyLabelColor, getFuturEnergyConsumption } from "../utils";
import { ProjectType } from "@/types/project.types";

interface WorkSolutionsProps {
  currentProjectDisplayed: ProjectType;
}

export const WorkSolutions = ({
  currentProjectDisplayed,
}: WorkSolutionsProps) => {
  const bouquets = currentProjectDisplayed?.energyMixChoice
    ? [currentProjectDisplayed.energyMixChoice]
    : [];

  const gridClassName = cn("grid gap-4 sm:gap-6 mx-auto", {
    "grid-cols-1 max-w-md": bouquets.length === 1,
    "grid-cols-2 max-w-2xl": bouquets.length === 2,
    "grid-cols-1 md:grid-cols-3 max-w-4xl": bouquets.length === 3,
  });

  return (
    <div className="mt-8">
      <h2 className="text-xl text-center font-bold mb-6 text-purple-500 dark:text-purple-400">
        Les solutions de travaux pour améliorer votre étiquette énergétique
      </h2>

      <div className={gridClassName}>
        {bouquets.map((bouquet, index) => {
          const isSelected =
            JSON.stringify(currentProjectDisplayed.energyMixChoice) ===
            JSON.stringify(bouquet);
          const solutionType =
            index === 0
              ? "Simplicité"
              : index === 1
                ? "Équilibrée"
                : "Performante";

          const worksList = bouquet
            ? [
                bouquet.renoComblesPerdus && "Isolation des combles",
                bouquet.renovationMurs && "Isolation des murs",
                bouquet.renoMenuiserie && "Remplacement menuiseries",
                bouquet.appareilChauffage1 &&
                  `Nouveau chauffage: ${bouquet.appareilChauffage1}`,
                bouquet.appareilChauffage2 &&
                  `Chauffage secondaire: ${bouquet.appareilChauffage2}`,
                bouquet.remplacementEauChaudeSanitaire &&
                  "Remplacement eau chaude sanitaire",
              ].filter(Boolean)
            : [];

          return (
            <div
              key={index}
              className={cn(
                "rounded-2xl p-4 sm:p-6 relative",
                isSelected
                  ? "bg-purple-500 dark:bg-purple-600 text-white"
                  : "bg-gray-50 dark:bg-gray-800",
              )}
            >
              {isSelected && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 dark:bg-purple-600 text-white px-4 py-1 rounded-full text-sm">
                  Votre choix
                </div>
              )}

              <h3
                className={cn(
                  "text-lg font-semibold mb-4",
                  isSelected
                    ? "text-white"
                    : "text-purple-500 dark:text-purple-400",
                )}
              >
                {solutionType}
              </h3>

              <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                  Travaux à réaliser
                </h4>
                {worksList.map((work, idx) => (
                  <div key={idx} className="flex items-start gap-3 mb-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                        isSelected
                          ? "bg-white text-purple-500 dark:text-purple-400"
                          : "bg-purple-500 dark:bg-purple-400 text-white",
                      )}
                    >
                      {idx + 1}
                    </div>
                    <span className="flex-1 text-gray-900 dark:text-white">
                      {work}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                  Résultat des travaux
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={cn(
                      "px-3 py-1 font-bold rounded text-white",
                      bouquet?.etiquette
                        ? getEnergyLabelColor(bouquet.etiquette)
                        : "",
                    )}
                  >
                    {bouquet?.etiquette}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {bouquet && currentProjectDisplayed.energyResults && (
                      <>
                        <p>
                          {getFuturEnergyConsumption(
                            currentProjectDisplayed.energyResults.CEP,
                            bouquet.pourcentageGainCEP,
                          )}{" "}
                          kwh/m2/an
                        </p>
                        <p>Étiquette GES: {bouquet.etiquetteEGES}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">
                  Confort
                </h4>
                <div className="flex items-center gap-2">
                  <span className={cn("text-2xl", isSelected && "text-white")}>
                    {bouquet?.confort === 3
                      ? "😊"
                      : bouquet?.confort === 2
                        ? "😐"
                        : bouquet?.confort === 1
                          ? "😔"
                          : "❓"}
                  </span>
                  <span
                    className={cn(
                      isSelected
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    Confort{" "}
                    {bouquet?.confort === 3
                      ? "bon"
                      : bouquet?.confort === 2
                        ? "moyen"
                        : bouquet?.confort === 1
                          ? "faible"
                          : "non évalué"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Coût du projet
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Coût travaux
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {bouquet?.coutTotal?.toLocaleString("fr-FR")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Aides financières
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {bouquet?.montantAides?.toLocaleString("fr-FR")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Reste à charge
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {bouquet?.resteACharge?.toLocaleString("fr-FR")}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
