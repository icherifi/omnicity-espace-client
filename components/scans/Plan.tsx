"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useProjectsContext } from "@/contexts/projects.context";
import { useDashboardContext } from "@/contexts/dashboard.context";
import ModelViewer from "./ModelViewer3D";
import { fetchScanData, exampleScanData, type Scan } from "./threeJSUtils";
import { Wrench, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Plan({
  displayMode,
}: {
  displayMode: "full" | "embedded";
}) {
  const { currentProjectDisplayed, setCurrentProjectDisplayed } =
    useDashboardContext();
  const [scanData, setScanData] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentProjectDisplayed) return;

    const fetchAndSetScanData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchScanData(currentProjectDisplayed.id.toString());
        setScanData(data);
        if (!data) {
          console.error("No scan data available for this project");
        }
      } catch (error) {
        console.error("Error loading scan data:", error);
        setScanData(null);
        setError("Failed to load scan data");
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetScanData();
  }, [currentProjectDisplayed]);

  // Old methode use to change project, maybe usefull later to change scan
  // const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selectedProject = projects.find(
  //     (project) => project.firstName + " " + project.lastName === e.target.value
  //   );
  //   if (selectedProject) {
  //     setCurrentProjectDisplayed(selectedProject);
  //   }
  // };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // TODO: Implement file upload logic
      console.log("Files selected:", files);
      // This would typically upload files to your backend
    }
  };

  if (!currentProjectDisplayed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Wrench className="mb-4 text-zinc-800" size={48} />
        <h2 className="font-semibold text-[22px] mb-2">
          Aucun projet sélectionné
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh] p-4">
      {/* Scan Selector (TODO)*/}
      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-zinc-600">Loading scan data...</p>
        </div>
      ) : scanData ? (
        <div className="flex-1">
          <ModelViewer
            scanData={scanData}
            loading={loading}
            error={error}
            displayMode={displayMode}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1">
          <Wrench className="mb-4 text-zinc-800" size={48} />
          <h2 className="font-semibold text-[22px] mb-2">
            Aucun scan disponible pour ce projet
          </h2>
          <div className="text-center max-w-[500px] mb-6 text-zinc-600">
            Vous n'avez pas encore importé de plans, scans 3D ou relevés pour le
            projet{" "}
            <span className="text-primary font-medium">
              {currentProjectDisplayed.firstName}{" "}
              {currentProjectDisplayed.lastName}
            </span>
            .<br />
            <br />
            Importez vos fichiers (plans PDF, scans LIDAR, etc.) pour commencer
            la modélisation et profiter pleinement des fonctionnalités de
            visualisation et d'estimation.
          </div>

          <Card className="w-[400px] mb-4">
            <CardContent className="p-8">
              <div className="border-2 border-dashed border-zinc-300 rounded-xl p-8 text-center bg-zinc-50">
                <Upload className="mx-auto mb-4 h-8 w-8 text-zinc-400" />
                <div className="font-semibold text-lg mb-2">
                  Glisser-déposer des fichiers ici
                </div>
                <div className="mb-4">ou</div>
                <Button asChild variant="outline">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    Parcourir les fichiers
                  </label>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf,.jpg,.jpeg,.png,.obj,.ply"
                />
                <div className="text-xs text-zinc-400 mt-3">
                  Formats supportés : PDF, JPG, PNG, OBJ, PLY (max : 300Mo)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Button */}
          <Button
            onClick={() => setScanData(exampleScanData)}
            variant="outline"
            className="mt-4"
          >
            Voir un exemple de scan 3D
          </Button>
        </div>
      )}
    </div>
  );
}
