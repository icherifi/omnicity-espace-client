import { ProjectType } from "@/types/project.types";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  project: ProjectType;
}

export const CostBreakdown = ({ project }: CostBreakdownProps) => {
  const coutTravaux = project.energyMixChoice?.coutTotal ?? 0;
  const aides = project.energyMixChoice?.montantAides ?? 0;
  const resteACharge = project.energyMixChoice?.resteACharge ?? coutTravaux - aides;

  const planType = (project.energyMixChoice as any)?.planType ?? "equilibre"; // "simplicite" | "equilibre" | "optimal"

  const Chip = ({ label, value }: { label: string; value: string }) => (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold border",
        value === planType
          ? "bg-violet-600 text-white border-violet-600"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-transparent"
      )}
    >
      {label}
    </span>
  );

  return (
    <section className="space-y-6 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Rapport Energétique</h1>
      <div className="bg-gray-900 dark:bg-gray-100 w-full h-[2px]"></div>
      <div>
        <div className="grid grid-cols-2 font-semibold mb-3 text-sm text-gray-900 dark:text-white">
          <span className="text-2xl font-bold">Détail</span>
          <span className="text-right text-2xl font-bold">Montant</span>
        </div>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex justify-between">
            <span>Coût estimé des travaux</span>
            <span className="font-semibold">
              {Math.round(coutTravaux).toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="flex justify-between">
            <span className="whitespace-pre-line">
              Aides potentielles
              {"\n"}
              (MaPrimeRénov', CEE...)
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              -{Math.round(aides).toLocaleString("fr-FR")} €
            </span>
          </div>
          <div className="flex justify-between">
            <span>Coût restant à charge</span>
            <span className="font-semibold">
              {Math.round(resteACharge).toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </div>

      <Separator />

      {/*<div className="flex gap-3">
        <Chip label="Simplicité" value="simplicite" />
        <Chip label="Équilibre" value="equilibre" />
        <Chip label="Optimal" value="optimal" />
      </div>*/}
    </section>
  );
}; 