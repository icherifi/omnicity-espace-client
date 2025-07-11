"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { useSidebarContext } from "@/contexts/sidebar.context";
import { useAppRouter } from "@/hooks/useAppRouter";
import { File, Download, Trash2, Upload, Settings } from "lucide-react";
import USDZViewer from "./components/USDZViewer";

interface USDZDocument {
  name: string;
  path: string;
  updated_at?: string;
  category: string;
}

export default function RenovationSection() {
  const { currentProjectDisplayed } = useDashboardContext();
  const { setSection, selectedRenovationDocument, setSelectedRenovationDocument } = useSidebarContext();
  const { navigateToDocuments } = useAppRouter();
  const [usdzDocuments, setUsdzDocuments] = useState<USDZDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<USDZDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const supabase = createClient();

  const fetchUSDZDocuments = async () => {
    if (!currentProjectDisplayed?.id) {
      setUsdzDocuments([]);
      setLoading(false);
      return;
    }

    try {
      const categories = ["plans", "devis", "photos", "autres"];
      const documents: USDZDocument[] = [];

      for (const category of categories) {
        const folder = `${category}-${currentProjectDisplayed.id}`;
        const { data, error } = await supabase.storage
          .from("documents")
          .list(folder);

        if (!error && data) {
          const usdzFiles = data
            .filter(file => file.name.toLowerCase().endsWith('.usdz'))
            .map(file => ({
              name: file.name,
              path: `${folder}/${file.name}`,
              updated_at: file.updated_at,
              category
            }));
          documents.push(...usdzFiles);
        }
      }

      setUsdzDocuments(documents);
      
      // Si un document est sélectionné depuis le contexte, l'utiliser
      if (selectedRenovationDocument) {
        const docFromContext = documents.find(d => d.path === selectedRenovationDocument);
        if (docFromContext) {
          setSelectedDocument(docFromContext);
          // Nettoyer la sélection du contexte après l'avoir utilisée
          setSelectedRenovationDocument(null);
        } else if (documents.length > 0) {
          setSelectedDocument(documents[0]);
        }
      } else if (documents.length > 0 && !selectedDocument) {
        setSelectedDocument(documents[0]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des documents USDZ:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentChange = (documentPath: string) => {
    const doc = usdzDocuments.find(d => d.path === documentPath);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const handleDownloadDocument = async (document: USDZDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(document.path);

      if (error) {
        console.error("Erreur lors du téléchargement:", error);
        return;
      }

      if (data) {
        const url = URL.createObjectURL(data);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
    }
  };

  const handleDeleteDocument = async (document: USDZDocument) => {
    try {
      const { error } = await supabase.storage
        .from("documents")
        .remove([document.path]);

      if (error) {
        console.error("Erreur lors de la suppression:", error);
        return;
      }

      // Rafraîchir la liste des documents
      await fetchUSDZDocuments();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  useEffect(() => {
    fetchUSDZDocuments();
  }, [currentProjectDisplayed]);

  // Sélectionner automatiquement le premier document quand les documents changent
  useEffect(() => {
    if (usdzDocuments.length > 0 && !selectedDocument && !selectedRenovationDocument) {
      setSelectedDocument(usdzDocuments[0]);
    }
  }, [usdzDocuments, selectedDocument, selectedRenovationDocument]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {usdzDocuments.length === 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Rénovation
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visualisez et analysez vos plans 3D USDZ pour la rénovation
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
            <File className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun plan USDZ disponible</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Importez des fichiers USDZ depuis la section Documents pour commencer la visualisation 3D.
            </p>
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
                Visualisation 3D des plans
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sélecteur de plan */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Plan :
                </span>
                <Select
                  value={selectedDocument?.path || ""}
                  onValueChange={handleDocumentChange}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sélectionner un plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {usdzDocuments.map((doc) => (
                      <SelectItem key={doc.path} value={doc.path}>
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{doc.name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {doc.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

          {/* Contrôles des documents (optionnel) */}
          {showControls && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {usdzDocuments.map((document) => (
                  <Card key={document.path} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm truncate">{document.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {document.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-xs text-gray-500">
                        Modifié le {document.updated_at ? new Date(document.updated_at).toLocaleDateString('fr-FR') : 'N/A'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadDocument(document)}
                          className="flex-1 text-xs"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Télécharger
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteDocument(document)}
                          className="text-red-600 hover:text-red-700 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Viewer 3D - prend tout l'espace restant */}
          <div className="flex-1 relative">
            {selectedDocument ? (
              <USDZViewer
                documentPath={selectedDocument.path}
                documentName={selectedDocument.name}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <File className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun plan sélectionné</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sélectionnez un plan dans le menu déroulant ci-dessus.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 