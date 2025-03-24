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
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="w-[210mm] h-full overflow-auto">
        <div id="export-view" className="w-[210mm] bg-white p-5 relative">
          <div className="absolute top-0 left-0 w-full h-10 bg-gray-500 bg-opacity-50 flex justify-end items-center opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={onClose} className="mr-4">
              Close
            </button>
            <button onClick={exportToPDF} className="mr-4">
              Export to PDF
            </button>
          </div>
          <p>Projet : {currentProjectDisplayed?.id}</p>
          {currentProjectDisplayed && (
            <StateOfPlay currentProjectDisplayed={currentProjectDisplayed} />
          )}
          <Card>
            <CardHeader>
              <CardTitle> Condition actuelle de votre habitation</CardTitle>
            </CardHeader>
            <PropertyState />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estimations energie</CardTitle>
            </CardHeader>
            {currentProjectDisplayed?.iziResponse && (
              <div className="flex flex-col p-4">
                <div className="flex flex-row justify-center p-4 space-x-10">
                  <CurrentStateDetails
                    bouquet={currentProjectDisplayed!.iziResponse.bouquets[1]}
                    initialState={currentProjectDisplayed!.iziResponse}
                  />
                  <FuturStateDetails
                    bouquet={currentProjectDisplayed!.iziResponse.bouquets[1]}
                    initialState={currentProjectDisplayed!.iziResponse}
                  />
                </div>
                <WorkCost
                  bouquet={currentProjectDisplayed!.iziResponse.bouquets[1]}
                  inPdf={true}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
