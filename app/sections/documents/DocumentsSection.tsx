"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/utils/supabase/client";
import { useDashboardContext } from "@/contexts/dashboard.context";
import DocumentItem from "./components/DocumentItem";
import { allowedExtensions, getCategoryFromName, isImageFile } from "./utils";
import { CircleUser, FileText, Sun, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/theme.context";
import ProjectRecapDialog from "@/components/dialogs/ProjectSummaryDialog/ProjectSummaryDialog";

export default function DocumentsSection() {
  const { currentProjectDisplayed } = useDashboardContext();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Record<string, {name:string,path:string,updated_at?:string}[]>>({
    plans: [],
    devis: [],
    photos: [],
    autres: [],
  });
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [category, setCategory] = useState<string>("autres");
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [openRecap, setOpenRecap] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const resetImportForm = () => {
    setSelectedFile(null);
    setFileName("");
    setCategory("autres");
  };

  const toggleBookmark = (name: string) => {
    setBookmarks((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handleLogout = async () => {
    await createClient().auth.signOut();
    router.push("/login"); 
  };

  const supabase = createClient();

  const fetchDocuments = async () => {
    const projectId = currentProjectDisplayed?.id;
    const cats = ["plans", "devis", "photos", "autres"];
    const docs: Record<string, { name: string; path: string; updated_at?: string }[]> = {
      plans: [],
      devis: [],
      photos: [],
      autres: [],
    };

    if (!projectId) {
      setDocuments(docs);
      return;
    }

    for (const c of cats) {
      const folder = `${c}-${projectId}`;
      const { data, error } = await supabase.storage.from("documents").list(folder);
      if (!error && data) {
        docs[c] = data.map((d) => ({ name: d.name, path: `${folder}/${d.name}`, updated_at: d.updated_at }));
      }
    }
    setDocuments(docs);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;
  
    const ext = file.name.split('.').pop()?.toLowerCase() || "";
  
    if (!allowedExtensions.includes(ext)) {
      alert(`Le type de fichier .${ext} n'est pas autorisé.`);
      return;
    }
  
    setSelectedFile(file);
    setFileName(file.name);
    setCategory(getCategoryFromName(file.name));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const projectId = currentProjectDisplayed?.id;
    if (!projectId) return;
    const folder = `${category}-${projectId}`;
    const { data, error } = await supabase.storage
      .from("documents")
      .upload(`${folder}/${fileName}`, selectedFile, { upsert: true });
    if (error) {
      console.error("Error uploading file", error);
    }
    await fetchDocuments();
    setImportOpen(false);
    resetImportForm();
  };

  const handleDownload = async (path: string, name: string) => {
    const { data } = await supabase.storage.from("documents").download(path);
    if (data) {
      const { saveAs } = await import("file-saver");
      saveAs(data, name);
    }
  };

  const handleDelete = async (path: string) => {
    const { error } = await supabase.storage.from("documents").remove([path]);
    if (error) {
      console.error("Erreur lors de la suppression", error);
    } else {
      await fetchDocuments(); 
    }
  };

  const handleExportSelected = async () => {
    if (selectedExports.length === 0) return;
  
    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");
    const zip = new JSZip();
  
    const orderedPaths = [...selectedExports].sort((a, b) => {
      const aIsBookmarked = bookmarks.includes(a);
      const bIsBookmarked = bookmarks.includes(b);
  
      if (aIsBookmarked && !bIsBookmarked) return -1;
      if (!aIsBookmarked && bIsBookmarked) return 1;
  
      return a.localeCompare(b); 
    });
  
    for (const path of orderedPaths) {
      const name = path.split('/').pop() || path;
      const { data } = await supabase.storage.from("documents").download(path);
      if (data) {
        zip.file(name, data);
      }
    }
  
    const content = await zip.generateAsync({ type: "blob" });
    const date = new Date().toLocaleDateString('fr-CA');
    const projectName = currentProjectDisplayed?.firstName + " " + currentProjectDisplayed?.lastName || "Projet";
    saveAs(content, `Export_${projectName}_${date}.zip`);
    setExportOpen(false);
    setSelectedExports([]);
  };

  useEffect(() => {
    fetchDocuments();
  }, [currentProjectDisplayed]);

  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedFiles");
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("bookmarkedFiles", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const generatePreviews = async () => {
      const flatDocs = Object.values(documents).flat();
      const imagePaths = flatDocs.filter((doc) => isImageFile(doc.name))
        .map((doc) => doc.path);
  
      const newPreviews: Record<string, string> = {};
  
      await Promise.all(
        imagePaths.map(async (path) => {
          const { data, error } = await supabase
            .storage
            .from("documents")
            .createSignedUrl(path, 300); 
  
          if (data?.signedUrl) {
            newPreviews[path] = data.signedUrl;
          }
        })
      );
  
      setPreviews(newPreviews);
    };
  
    generatePreviews();
  }, [documents]);
  
  return (
    <>
      <div className="flex items-center flex-row justify-end gap-4 mb-4">
        <Button variant="outline" size={"lg"} className="w-fit rounded-[12px]" onClick={() => setOpenRecap(true)}>Récapitulatif <FileText className="ml-2 w-4 h-4" /></Button>
        <p className="text-gray-900 dark:text-white text-center text-[20px] font-bold leading-[26.4px]">
          Omnicity Admin
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Se déconnecter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-center p-2">
              <Sun className="h-4 w-4 mr-2" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
              <Moon className="h-4 w-4 ml-2" />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 mt-2">Documents</h1>
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="secondary"
          className="rounded-lg font-semibold px-6 py-2 text-base bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => setImportOpen(true)}
        >
          Importer un document
        </Button>
        <Button
          className="bg-primary text-white font-semibold px-8 py-2 rounded-lg hover:bg-purple-600 dark:hover:bg-purple-700 transition-colors"
          style={{ minWidth: 120 }}
          onClick={() => setExportOpen(true)}
        >
          Exporter
        </Button>
      </div>
      <div className="flex flex-col gap-6 flex-1">
        <Accordion type="single" collapsible className="space-y-4">
          {(
            [
              { key: "plans", label: "Plans 2D/3D" },
              { key: "devis", label: "Devis & Estimations" },
              { key: "photos", label: "Photos" },
              { key: "autres", label: "Autres documents" },
            ] as const
          ).map((cat) => (
            <AccordionItem key={cat.key} value={cat.key}>
              <AccordionTrigger className="text-xl font-semibold bg-gray-800 dark:bg-gray-900 text-white px-6 py-4 rounded-lg data-[state=open]:rounded-b-none">
                {cat.label}
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-gray-900 rounded-b-lg px-0">
                <div className="py-2 space-y-2">
                  {documents[cat.key].map((file) => {
                    return (
                      <DocumentItem
                        key={file.path}
                        file={file}
                        previewUrl={previews[file.path]}
                        isBookmarked={bookmarks.includes(file.path)}
                        isSelected={selectedExports.includes(file.path)}
                        onPreview={async () => {
                          const { data, error } = await supabase.storage.from("documents").createSignedUrl(file.path, 60);
                          if (!error && data?.signedUrl) {
                            window.open(data.signedUrl, "_blank");
                          }
                        }}
                        onDownload={() => handleDownload(file.path, file.name)}
                        onToggleBookmark={() => toggleBookmark(file.path)}
                        onDelete={() => handleDelete(file.path)}
                        onSelectChange={(checked) => {
                          setSelectedExports((prev) =>
                            checked ? [...prev, file.path] : prev.filter((p) => p !== file.path)
                          );
                        }}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Dialog open={importOpen} onOpenChange={(open) => {
        setImportOpen(open);
        if (!open) {
          resetImportForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer un document</DialogTitle>
          </DialogHeader>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
          >
            {selectedFile ? selectedFile.name : "Déposez votre fichier"}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp,.glb,.obj,.usdz,.fbx,.zip"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="docName">Nom du fichier</Label>
            <Input id="docName" value={fileName} onChange={(e) => setFileName(e.target.value)} />
          </div>
          <RadioGroup value={category} onValueChange={setCategory} className="grid grid-cols-2 gap-2 mt-4">
            {[
              { value: "plans", label: "Plans" },
              { value: "devis", label: "Devis" },
              { value: "photos", label: "Photos" },
              { value: "autres", label: "Autres" },
            ].map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={opt.value} />
                <Label htmlFor={opt.value}>{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpload} disabled={!selectedFile}>Confirmer l'importation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exporter des documents</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.values(documents).flat()
            .sort((a, b) => {
              const aIsBookmarked = bookmarks.includes(a.path);
              const bIsBookmarked = bookmarks.includes(b.path);
              if (aIsBookmarked && !bIsBookmarked) return -1;
              if (!aIsBookmarked && bIsBookmarked) return 1;
              return a.name.localeCompare(b.name);
            })
            .map((file) => (
              <div key={`exp-${file.path}`} className="flex items-center justify-between">
                <span className="text-gray-900 dark:text-white">{file.name}</span>
                <Checkbox
                  checked={selectedExports.includes(file.path)}
                  onCheckedChange={(checked) => {
                    setSelectedExports((prev) =>
                      checked ? [...prev, file.path] : prev.filter((p) => p !== file.path)
                    );
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="secondary"
              onClick={() => setSelectedExports([])}
            >
              Tout désélectionner
            </Button>
            <Button onClick={() => setSelectedExports(Object.values(documents).flat().map((f) => f.path))}>
              Tout sélectionner
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleExportSelected} disabled={selectedExports.length === 0}>
              Confirmer / Exporter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ProjectRecapDialog open={openRecap} onOpenChange={setOpenRecap} project={currentProjectDisplayed} />
    </>
  );
}  