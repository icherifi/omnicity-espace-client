"use client";
import React, { useRef, useEffect, useCallback, useState } from "react";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

function DashboardScrollCarousel() {
  const { currentProjectDisplayed, setCurrentProjectDisplayed } =
    useDashboardContext();
  const { projects } = useProjectsContext();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const throttledScroll = useCallback((direction: number) => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const cardWidth = 384; // Largeur d'une carte (w-96 = 24rem = 384px)
    const newScrollPosition =
      scrollContainer.scrollLeft + cardWidth * direction;

    scrollContainer.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 300); // Ajustez ce délai selon vos besoins
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const direction = event.deltaY > 0 ? 1 : -1; // 1 pour droite, -1 pour gauche
      throttledScroll(direction);
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, [throttledScroll]);

  return (
    <div
      ref={scrollContainerRef}
      className="w-full overflow-x-auto rounded-lg border border-gray-200
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200
      hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
    >
      <div className="flex space-x-4 p-4" style={{ width: "max-content" }}>
        {projects.map((project, i) => (
          <div
            key={i}
            className="w-96 flex-shrink-0 hover:cursor-pointer"
            onClick={() => {
              setCurrentProjectDisplayed(project);
            }}
          >
            <div className="p-1">
              <Card
                className={`${
                  currentProjectDisplayed?.id === project.id
                    ? "border-violet-500 border-2"
                    : ""
                }`}
              >
                <CardContent className="flex flex-col items-center justify-center p-2">
                  <Carousel className="max-w-40 max-h-48" opts={{ loop: true }}>
                    <CarouselContent>
                      {Array.from({ length: 3 }).map((_, index) => {
                        const imageNumber = i * 3 + index + 1;
                        return (
                          <CarouselItem key={index} className="pr-4">
                            <Image
                              src={
                                process.env.NEXT_PUBLIC_SUPABASE_URL +
                                "/storage/v1/object/public/" +
                                project.imageFullPath! || "/placeholder.svg"
                              }
                              alt="property image"
                              width={250}
                              height={250}
                            />
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  <CardTitle className="text-center mt-8">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-center mt-4">
                    <span className="font-semibold mt-4">
                      {project.features?.roomsNumber} pièce
                      {project.features?.roomsNumber > 1 && "s"} &bull;
                      {` `} {project.features?.size}m² &bull;
                      {` `} {project.features?.floorsNumber} étages
                    </span>
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col p-0 pb-4">
                  <Badge
                    variant={project.state}
                    className="mt-4 mb-4 text-black"
                  >
                    {project.state == "completed" ? "Terminé" : "En cours..."}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Dernière modification: <br></br> {project.lastUpdate}
                  </p>
                </CardFooter>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardScrollCarousel;
