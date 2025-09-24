import * as React from "react";
import { useEffect, useState } from "react";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { NoScansMessage } from "./NoScansMessage";
import { draw } from "./utils";
import { Wrench } from "lucide-react";

export default function Plan() {
  const { projects } = useProjectsContext();
  const { currentProjectDisplayed, setCurrentProjectDisplayed } = useDashboardContext();
  const [scansAvailable, setScansAvailable] = useState(false);

  useEffect(() => {
    if (!currentProjectDisplayed) return;
    
    const fetchAndDraw = async () => {
      try {
        const available = await draw(currentProjectDisplayed.id.toString());
        setScansAvailable(available);
      } catch (error) {
        console.error("Erreur lors du chargement des scans:", error);
        setScansAvailable(false);
      }
    };
    
    fetchAndDraw();
  }, [currentProjectDisplayed]);

  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const canvas = document.getElementById("floorPlanCanvas") as HTMLCanvasElement;
    if (canvas) {
      canvas.remove();
    }
    const selectedProject = projects.find(
      (project) => project.firstName + " " + project.lastName === e.target.value
    );
    if (selectedProject) {
      setCurrentProjectDisplayed(selectedProject);
    }
  };

  if (!currentProjectDisplayed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Wrench className="mb-4 text-zinc-800" size={48} />
        <h2 className="font-semibold text-[22px] mb-2">Aucun projet sélectionné</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div id="canvasContainer" className="w-full flex flex-col items-center justify-center">
        {scansAvailable ? null : (
          <>
            <Wrench className="mb-4 text-zinc-800" size={48} />
            <h2 className="font-semibold text-[22px] mb-2">Aucun scan disponible pour ce projet</h2>
            <div className="text-center max-w-[500px] mb-6 text-zinc-600">
              Vous n'avez pas encore importé de plans, scans 3D ou relevés pour le projet <a href="#" className="text-primary underline">{currentProjectDisplayed.firstName} {currentProjectDisplayed.lastName}</a>.<br /><br />
              Importez vos fichiers (plans PDF, scans LIDAR, etc.) pour commencer la modélisation et profiter pleinement des fonctionnalités de visualisation et d'estimation.
            </div>
            <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 w-[400px] text-center bg-zinc-50 mb-4">
              <div className="font-semibold text-lg mb-2">Glisser-déposer des fichiers ici</div>
              <div className="mb-2">ou</div>
              <label htmlFor="file-upload" className="text-primary font-semibold cursor-pointer underline">Parcourir</label>
              <input id="file-upload" type="file" multiple className="hidden" />
              <div className="text-xs text-zinc-400 mt-3">
                Formats supportés : PDF, JPG, PNG, OBJ, PLY (max : 300Mo)
              </div>
            </div>
          </>
        )}
        <div className="flex justify-center mt-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-4h-4v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </span>
            <select
              onChange={handlePlanChange}
              value={currentProjectDisplayed.firstName + " " + currentProjectDisplayed.lastName}
              className="pl-10 pr-4 py-2 rounded-xl border border-zinc-300 shadow-sm focus:ring-2 focus:ring-primary focus:border-primary transition text-zinc-700 bg-white min-w-[220px] text-base appearance-none"
            >
              {projects.map((project) => (
                <option key={project.firstName + " " + project.lastName} value={project.firstName + " " + project.lastName}>
                  {project.firstName} {project.lastName}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
