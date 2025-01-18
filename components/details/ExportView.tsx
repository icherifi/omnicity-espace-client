export default ExportView;
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { StateOfPlay } from "./component/StateOfPlay";
import PropertyState from "../energy/components/PropertyState";
import EnergyLabelSolutions from "../energy/EnergyLabelSolutions";
import WorkResult from "../energy/components/WorkResult";

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

function ExportView({ onClose }) {
  const { currentProjectDisplayed } = useDashboardContext();

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="w-[210mm] h-full overflow-auto">
        <div
          id="export-view"
          className="w-[210mm] h-[296mm] bg-white p-5 relative"
        >
          <div className="absolute top-0 left-0 w-full h-10 bg-gray-500 bg-opacity-50 flex justify-end items-center opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={onClose} className="mr-4">
              Close
            </button>
            <button onClick={exportToPDF} className="mr-4">
              Export to PDF
            </button>
          </div>
          <h1>Project Details</h1>
          <p>Details for project {currentProjectDisplayed.id}</p>
          <StateOfPlay currentProjectDisplayed={currentProjectDisplayed} />
          <PropertyState />
          {currentProjectDisplayed.iziResponse && (
            <WorkResult
              bouquet={currentProjectDisplayed.iziResponse.bouquets.find(
                (bouquet) => bouquet.etiquette === "E"
              )}
              initialState={currentProjectDisplayed.iziResponse}
            />
          )}
        </div>
      </div>
    </div>
  );
}
