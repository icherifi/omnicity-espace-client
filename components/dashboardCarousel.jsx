"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { Badge } from "./ui/badge"

export default function DashboardCarousel() {
  const [api, setApi] = React.useState(null);

  React.useEffect(() => {
    if (!api) return;

    const updateVisibility = () => {
      const items = document.querySelectorAll('.carousel-item');
      const visibleIndexes = api.slidesInView(); // Récupère les indexes des items visibles

      items.forEach((item, index) => {
        if (visibleIndexes.includes(index)) {
          item.style.display = "block";  // Montre les items visibles
        } else {
          item.style.display = "none";   // Cache les items non visibles
        }
      });
    };

    api.on('select', updateVisibility);  // Mets à jour la visibilité lors de la sélection d'un nouvel item

    updateVisibility();  // Mets à jour immédiatement après l'initialisation

    return () => {
      api.off('select', updateVisibility);  // Nettoie les événements lorsque le composant est démonté
    };
  }, [api]);

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
        
      }}
      className="w-11/12 justify-self-center"
      style={{maxWidth: "945px"}}
      setApi={setApi}
    >
      <CarouselContent className="h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className={`h-full xl:basis-1/2 3xl:basis-1/3 carousel-item`}>
            <div className="p-1 h-full">
              <Card className="h-full hover:cursor-pointer">
                <CardContent className="flex flex-col items-center p-6 h-full">
                  
                  <Carousel className="w-44" opts={{loop: true}}>
                    <CarouselContent>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-4xl font-semibold">{index + 1}</span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                    <CardTitle className="text-center mt-8">
                        <h1>T4 Villeneuve</h1>
                    </CardTitle>
                    <CardDescription className="text-center mt-4">
                        <p className="font-semibold mt-4">1 pièce &bull;
                            45 m² &bull;
                            Étage 1/4</p>
                        <Badge variant={"inprogress"} className="mt-4 mb-4 text-black">En cours...</Badge>
                        <p className="text-xs text-muted-foreground">Dernière modification: <br></br> 23 Novembre 2023</p>
                    </CardDescription>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
