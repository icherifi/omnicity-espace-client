import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { cn } from "@/lib/utils";
import { useState } from "react";

const getEnergyLabelColor = (label: string) => {
  const colors = {
    'A': 'bg-[#319834]',
    'B': 'bg-[#33cc31]',
    'C': 'bg-[#fff200]',
    'D': 'bg-[#ff9a35]',
    'E': 'bg-[#ff5a35]',
    'F': 'bg-[#fe0000]',
    'G': 'bg-[#960032]'
  };
  return colors[label as keyof typeof colors] || 'bg-gray-500';
};

export const exportToPDF = async () => {
  try {
    const contentToExport = document.getElementById("export-view-content");
    
    if (!contentToExport) {
      console.error("Élément non trouvé");
      return;
    }

    const images = contentToExport.getElementsByTagName('img');
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));

    const container = document.createElement('div');
    // Ajustement pour prendre la largeur du contenu
    container.style.width = contentToExport.scrollWidth + 'px';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    
    const contentClone = contentToExport.cloneNode(true) as HTMLElement;
    container.appendChild(contentClone);
    document.body.appendChild(container);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      });

      const options = {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // windowWidth: 900, // Supprimé pour laisser la largeur s'adapter
        backgroundColor: '#ffffff',
        imageTimeout: 15000,
        onclone: (clonedDoc: Document) => {
          const images = clonedDoc.getElementsByTagName('img');
          Array.from(images).forEach(img => {
            img.crossOrigin = "anonymous";
            if (img.complete) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;
              ctx?.drawImage(img, 0, 0);
              img.src = canvas.toDataURL();
            }
          });
        }
      };

      const canvas = await html2canvas(container, options);
      
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 5;

      const imgWidth = pageWidth - (2 * margin);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight > pageHeight - (2 * margin)) {
        const ratio = (pageHeight - (2 * margin)) / imgHeight;
        const newImgWidth = imgWidth * ratio;
        const horizontalMargin = (pageWidth - newImgWidth) / 2;
        
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          horizontalMargin,
          margin,
          newImgWidth,
          pageHeight - (2 * margin)
        );
      } else {
        const verticalMargin = (pageHeight - imgHeight) / 2;
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          margin,
          verticalMargin,
          imgWidth,
          imgHeight
        );
      }

      pdf.save("bilan-energetique-omnicity.pdf");
    } finally {
      document.body.removeChild(container);
    }

  } catch (error) {
    console.error("Erreur lors de l'export PDF:", error);
    alert("Une erreur est survenue lors de l'export du PDF. Veuillez réessayer.");
  }
};

// Déplacer les composants d'icônes dans des fichiers séparés
import { IsolationIcons } from './components/icons/IsolationIcons';
import { ChauffageIcons } from './components/icons/ChauffageIcons';
import { VentilationIcon } from './components/icons/VentilationIcon';

// Composants séparés
import { DocumentHeader } from './components/DocumentHeader';
import { PropertyFeatures } from './components/PropertyFeatures';
import { CurrentCondition } from './components/CurrentCondition';
import { BuildingDetails } from './components/BuildingDetails';
import { WorkSolutions } from './components/WorkSolutions';
import { ExportHeader } from './components/ExportHeader';
function ExportView({ onClose }: { onClose: () => void }) {
  const { currentProjectDisplayed } = useDashboardContext();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[1000px] h-[90vh] bg-white rounded-xl shadow-xl overflow-hidden">
        <ExportHeader onClose={onClose} onExport={handleExport} isExporting={isExporting} />

        <div className="overflow-y-auto h-[calc(90vh-64px)]">
          <div id="export-view-content" className="w-full bg-white print:p-0">
            <DocumentHeader currentProjectDisplayed={currentProjectDisplayed!} />
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
              <PropertyFeatures currentProjectDisplayed={currentProjectDisplayed!} />
              <CurrentCondition currentProjectDisplayed={currentProjectDisplayed!} />
              <BuildingDetails currentProjectDisplayed={currentProjectDisplayed!} />
              <WorkSolutions currentProjectDisplayed={currentProjectDisplayed!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportView;