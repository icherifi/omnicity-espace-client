"use client";

import { useEffect, useState } from "react";
import { StagedSceneRenderer } from "@/components/scans/StagedSceneRenderer";
import { Scan } from "@/components/scans/useTransform";
import { StagingAction } from "@/components/scans/stagingTypes";

interface RenderPayload {
  scanData: Scan;
  actions: StagingAction[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6300";

export default function StagingRenderPage() {
  const [payload, setPayload] = useState<RenderPayload | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/internal/staging-render/payload")
      .then((res) => {
        if (!res.ok) throw new Error(`payload fetch failed: ${res.status}`);
        return res.json();
      })
      .then((data) => setPayload(data))
      .catch((err) => setFetchError(String(err)));
  }, []);

  if (fetchError) {
    return <div data-render-ready="true">payload error: {fetchError}</div>;
  }
  if (!payload) {
    return <div>loading payload...</div>;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <StagedSceneRenderer
        scanData={payload.scanData}
        actions={payload.actions}
        apiBaseUrl={API_BASE_URL}
        onReady={() => {
          document.documentElement.dataset.renderReady = "true";
        }}
      />
    </div>
  );
}
