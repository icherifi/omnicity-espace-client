"use client";
import React, { useRef, useEffect, useCallback } from "react";
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
import NewProjectDialog from "@/components/dialogs/NewProjectDialog";

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

    const cardWidth = 384;
    const scrollAmount = cardWidth * 0.75;
    const newScrollPosition =
      scrollContainer.scrollLeft + scrollAmount * direction;

    scrollContainer.scrollTo({
      left: newScrollPosition,
      behavior: "smooth",
    });

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 300);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        return;
      }

      event.preventDefault();
      const direction = event.deltaX > 0 ? 1 : -1;
      throttledScroll(direction);
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, [throttledScroll]);

  return (
    <div className="relative w-full">
      <button
        onClick={() => throttledScroll(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700
        scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800
        hover:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
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
                      ? "border-purple-500 dark:border-purple-400 border-2"
                      : ""
                  }`}
                >
                  <CardContent className="flex flex-col items-center justify-center p-2">
                    <Carousel
                      className="max-w-40 max-h-48"
                      opts={{ loop: true }}
                    >
                      <CarouselContent>
                        {Array.from({ length: 3 }).map((_, index) => {
                          const imageNumber = i * 3 + index + 1;
                          return (
                            <CarouselItem key={index} className="pr-4">
                              <Image
                                src={
                                  project.imageFullPath
                                    ? process.env.NEXT_PUBLIC_SUPABASE_URL +
                                      "/storage/v1/object/public/" +
                                      project.imageFullPath
                                    : "/placeholderpng.png"
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

                    <CardTitle className="text-center mt-8 text-gray-900 dark:text-white">
                      {project.firstName} {project.lastName}
                    </CardTitle>
                    <CardDescription className="text-center mt-4 text-gray-700 dark:text-gray-300">
                      <span className="font-semibold mt-4">
                        Valeur estimée:{" "}
                        {Number(project.baseValue).toLocaleString()}€
                      </span>
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="flex flex-col p-0 pb-4">
                    <Badge
                      variant={project.state}
                      className="mt-4 mb-4 text-gray-900 dark:text-white"
                    >
                      {project.state == "completed" ? "Terminé" : "En cours..."}
                    </Badge>
                  </CardFooter>
                </Card>
              </div>
            </div>
          ))}

          <div className="w-32 flex-shrink-0 flex items-center justify-center">
            <div className="p-1 w-full h-full flex items-center justify-center">
              <NewProjectDialog>
                <button
                  className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-500 dark:bg-purple-600 text-white text-5xl shadow-lg hover:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-300 focus:ring-offset-2 transition-all"
                  aria-label="Ajouter un projet"
                  type="button"
                >
                  +
                </button>
              </NewProjectDialog>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => throttledScroll(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}

export default DashboardScrollCarousel;
