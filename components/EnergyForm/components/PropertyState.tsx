import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EnergyRating from "@/components/energyRating";
import EnergyPerformanceBadge from "@/components/EnergyPerformanceBadge";
import { useEnergyFormContext } from "@/contexts/energyForm.context";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

function PropertyState() {
  const { iziResponse } = useEnergyFormContext();
  useEnergyFormContext();
  const [progress, setProgress] = useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(45);
      const timer2 = setTimeout(() => {
        setProgress(80);
        const timer3 = setTimeout(() => {
          setProgress(100);
        }, 1000);
        return () => clearTimeout(timer3);
      }, 1000);
      return () => clearTimeout(timer2);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!iziResponse) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {progress != 100 ? (
        <div className="flex w-full justify-center mt-8 mb-8">
          <Progress value={progress} className="w-[60%]" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-x-2">
          <h1 className="text-2xl font-semibold p-2 pb-0">
            Condition actuelle de votre habitation
          </h1>
          {/* <p className='text-center'>Selon vos réponses, votre logement semble être classé en étiquette énergétique D. Cela signifie que vos consommations d'énergie sont bien gérées, mais qu'il est encore possible d'optimiser les performances énergétiques de votre maison.</p> */}

          <div className="flex items-center p-4 pt-0">
            <EnergyRating
              energyRatingValue={iziResponse.etiquetteInitial.toLowerCase()}
            />

            <div className="flex justify-between items-center space-x-4 rounded-md border p-4">
              <div className="space-y-1">
                <p className="text-md font-semibold leading-none">
                  Étiquette énergétique
                </p>

                <ul className="pt-2 pl-6 list-disc">
                  <li>{iziResponse.CEP} kWh/m²/an</li>
                  <li>{iziResponse.EGES} kgCO2/m²/an</li>
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
                        iziResponse.performanceEnergetique.murs.EtatInitial.Note
                      }
                    />
                  </span>{" "}
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {iziResponse.performanceEnergetique.murs.EtatInitial && (
                      <li className="flex items-center py-0.5">
                        <Image
                          className="mr-2"
                          src={"/wall.svg"}
                          width={16}
                          height={16}
                          alt="wall icon"
                        />
                        {
                          iziResponse.performanceEnergetique.murs.EtatInitial
                            .Label
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
                      {
                        iziResponse.performanceEnergetique.vitrages.EtatInitial
                          .Label
                      }
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
                        Math.round(
                          ["ApCh1", "ApCh2", "ECS"]
                            .map(
                              (key) =>
                                iziResponse.performanceEnergetique.chauffage
                                  .EtatInitial[key].Note
                            )
                            .filter((note) => note !== null)
                            .reduce((acc, note) => acc + (note || 0), 0) /
                            ["ApCh1", "ApCh2", "ECS"].filter(
                              (key) =>
                                iziResponse.performanceEnergetique.chauffage
                                  .EtatInitial[key].Note !== null
                            ).length
                        ) as 1 | 2 | 3
                      }
                    />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {iziResponse.performanceEnergetique.chauffage.EtatInitial
                      .ApCh1 && (
                      <li className="flex items-center py-0.5">
                        <Image
                          className="mr-2"
                          src={"/heating.svg"}
                          width={16}
                          height={16}
                          alt="heating icon"
                        />
                        {
                          iziResponse.performanceEnergetique.chauffage
                            .EtatInitial.ApCh1.Label
                        }
                      </li>
                    )}
                    {iziResponse.performanceEnergetique.chauffage.EtatInitial
                      .ECS && (
                      <li className="flex items-center py-0.5">
                        <Image
                          className="mr-2"
                          src={"/water.svg"}
                          width={16}
                          height={16}
                          alt="water icon"
                        />
                        {
                          iziResponse.performanceEnergetique.chauffage
                            .EtatInitial.ECS.Label
                        }
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
                        iziResponse.performanceEnergetique.ventilation
                          .EtatInitial.Note
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
                      {
                        iziResponse.performanceEnergetique.ventilation
                          .EtatInitial.Label
                      }
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyState;
