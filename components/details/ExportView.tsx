export default ExportView;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { StateOfPlay } from "./component/StateOfPlay";
import PropertyState from "../energy/components/PropertyState";
import FuturStateDetails from "./component/FuturStateDetails";
import CurrentStateDetails from "./component/CurrentStateDetails";
import WorkCost from "../energy/components/WorkCost";
import { Card, CardHeader, CardTitle } from "../ui/card";

export const exportToPDF = async () => {
  const input = document.getElementById("export-view");
  if (input) {
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("download.pdf");
  } else {
    console.error("Element with id 'export-view' not found.");
  }
};

function ExportView({ onClose }: { onClose: () => void }) {
  const { currentProjectDisplayed } = useDashboardContext();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center p-8">
      <div className="w-[210mm] h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="sticky top-0 w-full h-12 bg-gray-100 flex justify-end items-center px-4 border-b z-10">
          <button 
            onClick={onClose}
            className="mr-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Fermer
          </button>
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 transition-colors"
          >
            Exporter en PDF
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(90vh-48px)]">
          <div id="export-view" className="w-full bg-white p-8">
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h1 className="text-3xl font-bold mb-3">{currentProjectDisplayed?.name}</h1>
                <p className="text-gray-700 text-lg mb-2">{currentProjectDisplayed?.address}</p>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <p>Créé par: {currentProjectDisplayed?.authorName}</p>
                  <p>Date de création: {new Date(currentProjectDisplayed?.created_at!).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="border p-4 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-700 mb-1">Surface</p>
                  <p className="text-xl">{currentProjectDisplayed?.features.size} m²</p>
                </div>
                <div className="border p-4 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-700 mb-1">Nombre de pièces</p>
                  <p className="text-xl">{currentProjectDisplayed?.features.roomsNumber}</p>
                </div>
                <div className="border p-4 rounded-lg bg-gray-50">
                  <p className="font-semibold text-gray-700 mb-1">Nombre d'étages</p>
                  <p className="text-xl">{currentProjectDisplayed?.features.floorsNumber}</p>
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">État des lieux</h2>
                <p>{currentProjectDisplayed?.stateOfPlay}</p>
              </div>
            </div>

            {currentProjectDisplayed && (
              <StateOfPlay currentProjectDisplayed={currentProjectDisplayed} />
            )}
            <Card>
              <CardHeader>
                <CardTitle> Condition actuelle de votre habitation</CardTitle>
              </CardHeader>
              <PropertyState project={currentProjectDisplayed!} />
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Estimations energie</CardTitle>
              </CardHeader>
              {currentProjectDisplayed?.iziResponse && (
                <div className="flex flex-col p-4">
                  <div className="flex flex-row justify-center p-4 space-x-10">
                    <CurrentStateDetails
                      initialState={currentProjectDisplayed.iziResponse}
                    />
                    <FuturStateDetails
                      bouquet={currentProjectDisplayed.iziResponse.bouquets[2]!}
                      initialState={currentProjectDisplayed.iziResponse}
                    />
                  </div>
                  <WorkCost
                    bouquet={currentProjectDisplayed.iziResponse.bouquets[2]!}
                    inPdf={true}
                  />
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
