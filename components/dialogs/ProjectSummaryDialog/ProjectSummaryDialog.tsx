import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProjectType } from "@/types/project.types";
import ProjectRecapPreview from "./ProjectSummaryPreview";


interface ProjectRecapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: ProjectType | null;
}

const ProjectRecapDialog: React.FC<ProjectRecapDialogProps> = ({ open, onOpenChange, project }) => {
  const previewRef = React.useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    const el = previewRef.current;
    if (!el) return;

    el.classList.remove("dark");
    el.style.backgroundColor = "#ffffff";
    
    el.style.width = "100%";
    el.style.maxWidth = "none";
    el.style.display = "block";

    const html2pdf = (await import("html2pdf.js")).default;

    const options = {
      margin:    [0, 0, 0, 0],  
      filename:  `recap-${project?.id || "project"}.pdf`,
      image:     { type: "jpeg", quality: 1.0 },
      jsPDF:     { unit: "mm", format: "a4", orientation: "portrait" },
      html2canvas: {
        scale:            2,          
        dpi:              300,        
        letterRendering:  true,       
        useCORS:          true,       
        allowTaint:       false,      
        backgroundColor:  "#ffffff", 
        imageTimeout:     15000,
        logging:          false,
      }
    };

    html2pdf()
      .set(options)
      .from(el)
      .save();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 flex items-center justify-between mt-4">
          <DialogTitle className="text-2xl font-bold">Récapitulatif du projet</DialogTitle>
          <Button onClick={handleExport} className="px-6">
            Exporter en PDF
          </Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <ProjectRecapPreview ref={previewRef} project={project} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRecapDialog;
