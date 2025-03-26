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

const DocumentHeader = ({ currentProjectDisplayed }: { currentProjectDisplayed: any }) => (
  <div className="w-full bg-violet-500 text-white p-6 flex justify-between items-start">
    <div className="w-32">
      <img
        src={`${window.location.origin}/logo.png`}
        alt="Omnicity"
        className="w-[40px] h-[40px] object-contain"
      />
    </div>
    <div className="space-y-1 text-sm">
      <div className="flex gap-2">
        <span className="font-bold">Adresse :</span>
        <span>{currentProjectDisplayed?.address}</span>
      </div>
      <div className="flex gap-2">
        <span className="font-bold">Année de construction :</span>
        <span>{currentProjectDisplayed?.iziResponse?.inputQr?.["L'année de construction du logement :"]?.[0]}</span>
      </div>
    </div>
  </div>
);

const IsolationIcons = {
  Toit: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M3 18h18M5 10l7-7 7 7M7 21V11m10 10V11" />
    </svg>
  ),
  Sols: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20h16M4 20v-4M4 12v-4M4 4h16M4 4v4M20 4v4M20 12v4M20 20v-4M8 12h8M8 8h8M8 16h8" />
    </svg>
  ),
  Murs: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 4v16H4V4h16zM4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16" />
    </svg>
  ),
  Vitrage: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm9 0v18M3 12h18" />
    </svg>
  )
};

const ChauffageIcons = {
  AppareilPrincipal: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  AppareilSecondaire: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  EauChaude: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  )
};

const VentilationIcon = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

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
        <div className="sticky top-0 w-full h-16 bg-white flex justify-between items-center px-4 sm:px-6 border-b z-10 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Aperçu du document</h2>
          <div className="flex gap-2 sm:gap-3">
            <button 
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-200 rounded-md hover:bg-gray-50 transition-all text-sm sm:text-base"
            >
              Fermer
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-3 sm:px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-all flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
            >
              {isExporting ? (
                <span>Export en cours...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">Exporter en PDF</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(90vh-64px)]">
          <div id="export-view-content" className="w-full bg-white print:p-0">
            <DocumentHeader currentProjectDisplayed={currentProjectDisplayed} />
            
            <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 my-6 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { label: 'Surface', value: `${currentProjectDisplayed?.features.size} m²`, icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                    </svg>
                  )},
                  { label: 'Nombre de pièces', value: currentProjectDisplayed?.features.roomsNumber, icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )},
                  { label: "Nombre d'étages", value: currentProjectDisplayed?.features.floorsNumber, icon: (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                    </svg>
                  )}
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          {item.icon}
                        </div>
                        <span className="text-sm text-gray-600">{item.label}</span>
                      </div>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl text-center font-bold mb-6">
                  Condition actuelle de votre habitation
                </h2>
                <div className="flex justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Étiquette énergétique</h3>
                    <div className="flex items-center gap-4">
                      <div className={`bg-orange-500 text-white font-bold px-4 py-2 rounded ${getEnergyLabelColor(currentProjectDisplayed!.actualEnergyRating)}`}>
                        {currentProjectDisplayed!.actualEnergyRating}
                      </div>
                      <div>
                        <p>{currentProjectDisplayed!.iziResponse?.CEP} à {currentProjectDisplayed!.iziResponse!.CEP + 89} kwh/m2/an</p>
                        <p>{currentProjectDisplayed!.iziResponse?.EGES} à {currentProjectDisplayed!.iziResponse!.EGES + 29} kgCO2/m2/an</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Étiquette énergétique</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">{currentProjectDisplayed!.iziResponse?.confort === 2 ? "😊" : "😔"}</span>
                      <span>Confort {currentProjectDisplayed!.iziResponse?.confort === 2 ? "bien" : "moyen"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Isolation & menuiserie</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {IsolationIcons.Toit}
                        <span>Toit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {IsolationIcons.Sols}
                        <span>Sols</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {IsolationIcons.Murs}
                        <span>Murs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {IsolationIcons.Vitrage}
                        <span>Vitrage</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Chauffage</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {ChauffageIcons.AppareilPrincipal}
                        <span>Appareil principal</span>
                      </div>
                      {currentProjectDisplayed!.iziResponse?.performanceEnergetique?.chauffage?.EtatInitial?.ApCh2?.Label && (
                        <div className="flex items-center gap-2">
                          {ChauffageIcons.AppareilSecondaire}
                          <span>Appareil secondaire</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {ChauffageIcons.EauChaude}
                        <span>Eau chaude sanitaire</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Ventilation</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {VentilationIcon}
                        <span>Installation</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl text-center font-bold mb-6 text-violet-500">
                  Les solutions de travaux pour améliorer votre étiquette énergétique
                </h2>
                
                {(() => {
                  const bouquets = currentProjectDisplayed?.iziResponse?.bouquets.filter(bouquet => bouquet !== null) || [];
                  const gridClassName = cn(
                    "grid gap-4 sm:gap-6 mx-auto",
                    {
                      'grid-cols-1 max-w-md': bouquets.length === 1,
                      'grid-cols-2 max-w-2xl': bouquets.length === 2,
                      'grid-cols-1 md:grid-cols-3 max-w-4xl': bouquets.length === 3
                    }
                  );

                  return (
                    <div className={gridClassName}>
                      {bouquets.map((bouquet, index) => {
                        const isSelected = JSON.stringify(currentProjectDisplayed!.choice) === JSON.stringify(bouquet);
                        const solutionType = index === 0 ? "Simplicité" : index === 1 ? "Équilibrée" : "Performante";
                        
                        const worksList = [
                          bouquet.renoComblesPerdus && "Isolation des combles",
                          bouquet.renovationMurs && "Isolation des murs",
                          bouquet.renoMenuiserie && "Remplacement menuiseries",
                          bouquet.appareilChauffage1 && `Nouveau chauffage: ${bouquet.appareilChauffage1}`,
                          bouquet.appareilChauffage2 && `Chauffage secondaire: ${bouquet.appareilChauffage2}`,
                          bouquet.remplacementEauChaudeSanitaire && "Remplacement eau chaude sanitaire"
                        ].filter(Boolean);

                        return (
                          <div 
                            key={index}
                            className={cn(
                              "rounded-2xl p-4 sm:p-6 relative",
                              isSelected ? 'bg-violet-500 text-white' : 'bg-gray-50'
                            )}
                          >
                            {isSelected && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-violet-500 text-white px-4 py-1 rounded-full text-sm">
                                Votre choix
                              </div>
                            )}
                            
                            <h3 className={`text-lg font-semibold mb-4 ${
                              isSelected ? 'text-white' : 'text-violet-500'
                            }`}>
                              {solutionType}
                            </h3>
                            
                            <div className="mb-6">
                              <h4 className="font-medium mb-3">Travaux à réaliser</h4>
                              {worksList.map((work, idx) => (
                                <div key={idx} className="flex items-start gap-3 mb-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                                    isSelected 
                                      ? 'bg-white text-violet-500' 
                                      : 'bg-violet-500 text-white'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <span className="flex-1">{work}</span>
                                </div>
                              ))}
                            </div>

                            <div className="mb-6">
                              <h4 className="font-medium mb-2">Résultat des travaux</h4>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`px-3 py-1 font-bold rounded text-white ${getEnergyLabelColor(bouquet.etiquette)}`}>
                                  {bouquet.etiquette}
                                </div>
                                <div className="text-sm">
                                  <p>{Math.round(currentProjectDisplayed!.iziResponse!.CEP * (1 - bouquet.pourcentageGainCEP))} kwh/m2/an</p>
                                  <p>Étiquette GES: {bouquet.etiquetteEGES}</p>
                                </div>
                              </div>
                            </div>

                            <div className="mb-6">
                              <h4 className="font-medium mb-2">Confort</h4>
                              <p>{bouquet.confort === 3 ? 'Bien' : bouquet.confort === 2 ? 'Moyen' : 'Faible'}</p>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-medium">Coût du projet</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm">Coût travaux</span>
                                  <span className="text-sm font-medium">
                                    {bouquet.coutTotal.toLocaleString('fr-FR')}€
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Aides de l'État</span>
                                  <span className="text-sm font-medium">
                                    {bouquet.montantAides.toLocaleString('fr-FR')}€
                                  </span>
                                </div>
                                <div className={`mt-4 p-3 rounded-lg ${
                                  isSelected ? 'bg-violet-600' : 'bg-white'
                                }`}>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Total aides déduites: </span>
                                    <span className="text-sm font-medium">
                                      {bouquet.resteACharge.toLocaleString('fr-FR')}€
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportView;