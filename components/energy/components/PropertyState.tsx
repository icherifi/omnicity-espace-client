import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EnergyRating from "@/components/energy/components/EnergyRating";
import EnergyPerformanceBadge from "@/components/energy/components/EnergyPerformanceBadge";
import Image from "next/image";
import { ProjectType } from "@/types/project.types";
import {
  getEnergyMetrics,
  overallEnergyLabel,
} from "@/app/sections/dashboard/utils";

function PropertyState({ project }: { project: ProjectType }) {
  if (!project) {
    return <div>Chargement du projet...</div>;
  }

  const metrics = getEnergyMetrics(project);
  const currentLabel =
    overallEnergyLabel(metrics.initialCEP, metrics.initialEGES) || "g";

  return (
    <div className="flex flex-col items-center justify-center space-x-2">
      <div className="flex items-center p-4 pt-0 2xl:flex-row flex-col">
        <EnergyRating
          energyRatingValue={
            currentLabel as "a" | "b" | "c" | "d" | "e" | "f" | "g"
          }
        />

        <div className="flex justify-between items-center space-x-4 rounded-md border p-4">
          <div className="space-y-1">
            <p className="text-md font-semibold leading-none">
              Étiquette énergétique
            </p>

            <ul className="pt-2 pl-6 list-disc">
              <li>{metrics.initialCEP || "N/A"} kWh/m²/an</li>
              <li>{metrics.initialEGES || "N/A"} kgCO2/m²/an</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-4/5 mb-4">
        <p className="text-lg font-semibold leading-none mb-2">
          Performance énergétique
        </p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <span className="flex">
                Isolation & menuiserie:{" "}
                <EnergyPerformanceBadge
                  state={
                    energyData?.performanceEnergetique?.murs?.EtatInitial?.Note
                  }
                />
              </span>{" "}
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                {energyData?.performanceEnergetique?.murs?.EtatInitial && (
                  <li className="flex items-center py-0.5">
                    <Image
                      className="mr-2"
                      src={"/wall.svg"}
                      width={16}
                      height={16}
                      alt="wall icon"
                    />
                    {
                      energyData?.performanceEnergetique?.murs?.EtatInitial
                        ?.Label
                    }
                  </li>
                )}

                <li className="flex items-center py-0.5">
                  <Image
                    className="mr-2"
                    src={"/window.svg"}
                    width={16}
                    height={16}
                    alt="window icon"
                  />
                  {energyData?.performanceEnergetique?.vitrages?.EtatInitial
                    ?.Label || "Menuiseries"}
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <span className="flex">
                Chauffage:{" "}
                <EnergyPerformanceBadge
                  state={
                    (energyData?.performanceEnergetique?.chauffage?.EtatInitial
                      ?.ApCh1?.Note || 2) as 1 | 2 | 3
                  }
                />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                {energyData?.performanceEnergetique?.chauffage?.EtatInitial
                  ?.ApCh1 && (
                  <li className="flex items-center py-0.5">
                    <Image
                      className="mr-2"
                      src={"/heating.svg"}
                      width={16}
                      height={16}
                      alt="heating icon"
                    />
                    {energyData?.performanceEnergetique?.chauffage?.EtatInitial
                      ?.ApCh1?.Label || "Système de chauffage"}
                  </li>
                )}
                {energyData?.performanceEnergetique?.chauffage?.EtatInitial
                  ?.ECS && (
                  <li className="flex items-center py-0.5">
                    <Image
                      className="mr-2"
                      src={"/water.svg"}
                      width={16}
                      height={16}
                      alt="water icon"
                    />
                    {energyData?.performanceEnergetique?.chauffage?.EtatInitial
                      ?.ECS?.Label || "Production d'eau chaude"}
                  </li>
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <span className="flex">
                Ventilation:{" "}
                <EnergyPerformanceBadge
                  state={
                    energyData?.performanceEnergetique?.ventilation?.EtatInitial
                      ?.Note || 2
                  }
                />
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                <li className="flex items-center py-0.5">
                  <Image
                    className="mr-2"
                    src={"/ventilation.svg"}
                    width={16}
                    height={16}
                    alt="ventilation icon"
                  />
                  {energyData?.performanceEnergetique?.ventilation?.EtatInitial
                    ?.Label || "Système de ventilation"}
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default PropertyState;
