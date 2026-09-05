"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboardContext } from "@/contexts/dashboard.context";
import { getScans } from "@/utils/handleProjectDetails";
import { startStaging, getStagingState, type ScanStagingState } from "@/utils/handleStaging";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import USDZViewer from "./USDZViewer";

const POLL_INTERVAL_MS = 8000;

interface RawScan extends ScanStagingState {
  usdz_path: string | null;
}

export default function AIStagingPanel() {
  const { currentProjectDisplayed } = useDashboardContext();
  const [scan, setScan] = useState<RawScan | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const pollStatus = (scanId: number) => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const state = await getStagingState(scanId);
      if (!state) return;
      setScan((prev) => (prev ? { ...prev, ...state } : prev));
      if (state.staging_status === "done" || state.staging_status === "error") {
        stopPolling();
      }
    }, POLL_INTERVAL_MS);
  };

  useEffect(() => {
    if (!currentProjectDisplayed?.id) {
      setScan(null);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      const scans = await getScans(currentProjectDisplayed.id.toString());
      const first = scans?.[0] ?? null;
      setScan(first);
      setLoading(false);
      if (first && (first.staging_status === "processing" || first.staging_status === "pending")) {
        pollStatus(first.id);
      }
    };

    load();
    return stopPolling;
  }, [currentProjectDisplayed]);

  const handleStart = async () => {
    if (!scan) return;
    setStarting(true);
    const ok = await startStaging(scan.id);
    setStarting(false);
    if (ok) {
      setScan({ ...scan, staging_status: "processing" });
      pollStatus(scan.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!scan || !scan.usdz_path) {
    return (
      <Card className="p-8 text-center">
        <Sparkles className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucun scan disponible</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Un scan 3D (USDZ) est nécessaire pour lancer l'aménagement automatique.
        </p>
      </Card>
    );
  }

  const status = scan.staging_status;

  return (
    <div className="h-full flex flex-col gap-4 p-4">
      {(status === "none" || status === "error") && (
        <Card className="p-8 text-center">
          <Sparkles className="h-12 w-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aménagement automatique par IA</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Claude va rechercher du mobilier IKEA, l'agencer dans la pièce, et choisir
            des couleurs de mur et un matériau de sol — un premier jet en quelques minutes.
          </p>
          {status === "error" && (
            <p className="text-sm text-red-600 mb-4">
              La dernière tentative a échoué
              {scan.staging_summary?.errors?.length ? ` : ${scan.staging_summary.errors[0]}` : ""}.
            </p>
          )}
          <Button onClick={handleStart} disabled={starting} className="gap-2">
            {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {status === "error" ? "Réessayer" : "Lancer l'aménagement"}
          </Button>
        </Card>
      )}

      {(status === "pending" || status === "processing") && (
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 mx-auto text-primary mb-4 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Aménagement en cours…</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Ça peut prendre plusieurs minutes selon la taille du logement. Cette page se
            mettra à jour automatiquement.
          </p>
        </Card>
      )}

      {status === "done" && scan.staged_usdz_path && (
        <div className="h-full flex flex-col gap-3">
          {scan.staging_summary?.notes && (
            <Card>
              <CardContent className="p-4 text-sm text-gray-700 dark:text-gray-300">
                {scan.staging_summary.notes}
              </CardContent>
            </Card>
          )}
          <div className="flex-1 relative min-h-[400px]">
            <USDZViewer
              documentPath={scan.staged_usdz_path}
              documentName="Aménagement proposé"
              showZoomButtons
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleStart} disabled={starting} variant="outline" size="sm" className="gap-2">
              {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Relancer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
