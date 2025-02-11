import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState, useRef } from "react";
import Construction from "./components/construction";
import EnergySaving from "./components/energySaving";
import GreenValue from "./components/greenValue";
import CarbonImpact from "./components/carbonImpact";
import Aids from "./components/aids";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fetchDpeData } from "@/utils/handleDpeData";
import EnergyTag from "@/components/ui/EnergyTag";
import { DPE, GES } from "react-dpe-generator";
import { getOpenAISummary } from "@/utils/openai/utils";

export default function FormPage() {
  const [dpeNumber, setDpeNumber] = useState("");
  const [dpeData, setDpeData] = useState<any>(null);
  const [showRawData, setShowRawData] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aiSummary, setAiSummary] = useState("");
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  const handleDpeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProgress(0);
    setShowRawData(false);

    try {
      const data = await fetchDpeData(dpeNumber);
      setDpeData(data[0]);
      setIsDataLoaded(true);

      setIsLoadingSummary(true);
      const summary = (await getOpenAISummary(data[0])) || "";
      setAiSummary(summary);
      setIsLoadingSummary(false);
    } catch (error) {
      console.error(error);
      setIsLoadingSummary(false);
    }
  };

  const handleBack = () => {
    setDpeNumber("");
    setDpeData(null);
    setIsDataLoaded(false);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {!isDataLoaded ? (
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">
            Entrez votre numéro DPE
          </h2>
          <form onSubmit={handleDpeSubmit} className="space-y-4">
            <Input
              type="text"
              value={dpeNumber}
              onChange={(e) => setDpeNumber(e.target.value)}
              placeholder="Numéro DPE"
              required
            />
            <Button type="submit">Soumettre</Button>
          </form>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Résultats DPE</h2>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Date d'établissement DPE: </span>
              {dpeData.Date_établissement_DPE}
            </div>
            <div>
              <span className="font-semibold">Note DPE: </span>
              <DPE value={dpeData.Etiquette_DPE} />
            </div>
            <div>
              <span className="font-semibold">Note GES: </span>
              <GES value={dpeData.Etiquette_GES} />
            </div>
            <div>
              <span className="font-semibold">AI Summary: </span>
              {isLoadingSummary ? (
                <div>Loading summary...</div>
              ) : (
                <div>{aiSummary}</div>
              )}
            </div>
            <Button
              onClick={() => setShowRawData(!showRawData)}
              className="mt-4"
            >
              {showRawData ? "Hide Raw Data" : "Show Raw Data"}
            </Button>
            {showRawData && (
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(dpeData, null, 2)}</pre>
              </div>
            )}
          </div>
          <Button onClick={handleBack} className="mt-4">
            Retour
          </Button>
        </div>
      )}
    </div>
  );
}
