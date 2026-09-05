"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { useAppRouter } from "@/hooks/useAppRouter";
import { File, Upload, Settings, Box } from "lucide-react";
import Plan from "@/components/scans/Plan";
import {
  fetchScanData,
  exampleScanData,
  type Scan,
} from "@/components/scans/threeJSUtils";
import AIStagingPanel from "./components/AIStagingPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

interface ScanDocument {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
  updated_at?: string;
}

export default function RenovationSection() {
  const { currentProjectDisplayed } = useDashboardContext();
  const { setSection } = useSidebarContext();
  const { navigateToDocuments } = useAppRouter();
  const [scanDocuments, setScanDocuments] = useState<ScanDocument[]>([]);
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [scanData, setScanData] = useState<Scan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);

  const fetchScanDocuments = async () => {
    if (!currentProjectDisplayed?.id) {
      setScanDocuments([]);
      setLoading(false);
      return;
    }

    try {
      // For now, we'll use mock data or fetch from your scan endpoint
      // Replace this with your actual scan data fetching logic
      const mockScans: ScanDocument[] = [
        {
          id: "scan-1",
          name: "Living Room Scan",
          project_id: currentProjectDisplayed.id.toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "scan-2",
          name: "Kitchen Scan",
          project_id: currentProjectDisplayed.id.toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setScanDocuments(mockScans);

      if (mockScans.length > 0 && !selectedScanId) {
        setSelectedScanId(mockScans[0].id);
        // Load the scan data for the first scan
        await loadScanData(mockScans[0].id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des scans:", error);
      setError("Failed to load scan data");
    } finally {
      setLoading(false);
    }
  };

  const loadScanData = async (scanId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch real scan data, fallback to example data
      const data = await fetchScanData(scanId);
      setScanData(data || exampleScanData);
    } catch (error) {
      console.error("Error loading scan data:", error);
      // Use example data as fallback
      setScanData(exampleScanData);
    } finally {
      setLoading(false);
    }
  };

  const handleScanChange = async (scanId: string) => {
    setSelectedScanId(scanId);
    await loadScanData(scanId);
  };

  useEffect(() => {
    fetchScanDocuments();
  }, [currentProjectDisplayed]);

  // Auto-select first scan when scans change
  useEffect(() => {
    if (scanDocuments.length > 0 && !selectedScanId) {
      setSelectedScanId(scanDocuments[0].id);
      loadScanData(scanDocuments[0].id);
    }
  }, [scanDocuments, selectedScanId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {scanDocuments.length === 0 && !loading ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Rénovation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visualisez et analysez vos plans 3D pour la rénovation
              </p>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                if (currentProjectDisplayed) {
                  navigateToDocuments(currentProjectDisplayed.id);
                } else {
                  setSection("documents");
                }
              }}
            >
              <Upload className="h-4 w-4" />
              Importer des plans
            </Button>
          </div>

          <Card className="p-8 text-center">
            <Box className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Aucun scan 3D disponible
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Importez des fichiers de scan ou utilisez l'exemple pour commencer
              la visualisation 3D.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => {
                  if (currentProjectDisplayed) {
                    navigateToDocuments(currentProjectDisplayed.id);
                  } else {
                    setSection("documents");
                  }
                }}
                className="bg-primary text-white"
              >
                Aller aux Documents
              </Button>
              <Button
                onClick={() => setScanData(exampleScanData)}
                variant="outline"
              >
                Voir un exemple
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="h-full flex flex-col">
          {/* Header avec contrôles */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Rénovation
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Visualisation 3D des scans
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sélecteur de scan */}
              {scanDocuments.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Scan :
                  </span>
                  <Select
                    value={selectedScanId || ""}
                    onValueChange={handleScanChange}
                  >
                    <SelectTrigger className="w-64">
                      <SelectValue placeholder="Sélectionner un scan" />
                    </SelectTrigger>
                    <SelectContent>
                      {scanDocuments.map((scan) => (
                        <SelectItem key={scan.id} value={scan.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="truncate">{scan.name}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              3D
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bouton paramètres */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowControls(!showControls)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Contrôles
              </Button>

              {/* Bouton importer */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentProjectDisplayed) {
                    navigateToDocuments(currentProjectDisplayed.id);
                  } else {
                    setSection("documents");
                  }
                }}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Importer
              </Button>
            </div>
          </div>

          {/* Contrôles des scans (optionnel) */}
          {showControls && scanDocuments.length > 0 && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scanDocuments.map((scan) => (
                  <Card
                    key={scan.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm truncate">
                          {scan.name}
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          3D Scan
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-gray-500">
                        Créé le{" "}
                        {new Date(scan.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={
                            selectedScanId === scan.id ? "default" : "outline"
                          }
                          onClick={() => handleScanChange(scan.id)}
                          className="flex-1 text-xs"
                        >
                          {selectedScanId === scan.id
                            ? "Sélectionné"
                            : "Sélectionner"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Viewer 3D - prend tout l'espace restant */}
          <div className="flex-1 relative overflow-hidden">
            <Tabs defaultValue="plan" className="h-full flex flex-col">
              <TabsList className="mx-4 mt-4 w-fit">
                <TabsTrigger value="plan">Plan</TabsTrigger>
                <TabsTrigger value="staging" className="gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Aménagement IA
                </TabsTrigger>
              </TabsList>
              <TabsContent value="plan" className="flex-1 p-4 mt-0">
                <Plan displayMode="full" />
              </TabsContent>
              <TabsContent value="staging" className="flex-1 mt-0">
                <AIStagingPanel />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
