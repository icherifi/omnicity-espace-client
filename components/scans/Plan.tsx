import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { NoScansMessage } from "./NoScansMessage";
import { draw } from "./utils";

export default function Plan() {
  const { projects } = useProjectsContext();
  const { currentProjectDisplayed, setCurrentProjectDisplayed } =
    useDashboardContext();
  const [scansAvailable, setScansAvailable] = useState(true);

  useEffect(() => { 
    const fetchAndDraw = async () => {
      const available = await draw(currentProjectDisplayed!.id.toString()); // Call draw when the component mounts
      setScansAvailable(available);
    };
    fetchAndDraw();
  }, []);

  useEffect(() => {
    const fetchAndDraw = async () => {
      setCurrentProjectDisplayed(currentProjectDisplayed);
      const available = await draw(currentProjectDisplayed!.id.toString()); // Call draw when the component mounts
      setScansAvailable(available);
    };
    fetchAndDraw();
  }, [currentProjectDisplayed]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = document.getElementById(
      "floorPlanCanvas"
    ) as HTMLCanvasElement;
    if (canvas) {
      console.log("remove canavas");
      canvas.remove();
    }
    const selectedProject = projects.find(
      (project) => project.name === e.target.value
    );
    if (selectedProject) {
      setCurrentProjectDisplayed(selectedProject);
    }
  };

  return (
    <>
      <div id="canvasContainer">
        {scansAvailable ? null : <NoScansMessage />}
      </div>
      <div className="mt-4">
        <select
          onChange={handlePlanChange}
          value={currentProjectDisplayed!.name}
          className="p-2 border rounded"
        >
          {projects.map((project) => (
            <option key={project.name} value={project.name}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
