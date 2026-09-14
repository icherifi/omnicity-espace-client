"use client";

import { useEffect, useRef, useState } from "react";
import { StagedSceneRenderer } from "@/components/scans/StagedSceneRenderer";
import { Scan } from "@/components/scans/useTransform";
import { StagingAction } from "@/components/scans/stagingTypes";
import { computeViews } from "@/components/scans/stagingCameraViews";

interface RenderPayload {
  scanData: Scan;
  actions: StagingAction[];
  /** Which named views (see stagingCameraViews.ts) to actually mount and
   * screenshot - all of them when omitted. */
  views?: string[];
  /** RoomPlan identifiers of objects programmatically stripped before Claude
   * ever saw the scan - see StagedSceneRenderer's strippedRoomplanIdentifiers. */
  strippedRoomplanIdentifiers?: string[];
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

  return <StagingRenderGrid payload={payload} />;
}

/** One StagedSceneRenderer mount per requested view (of the named views
 * computeViews defines - top-down, perspective), laid out in a grid Playwright
 * screenshots per-element - simpler and more reliable than re-navigating or
 * re-screenshotting the same Canvas N times. Generalizes the single-flag
 * readiness gate to "every requested view's onReady fired". */
function StagingRenderGrid({ payload }: { payload: RenderPayload }) {
  const allViews = computeViews(payload.scanData);
  const views = payload.views ? allViews.filter((v) => payload.views!.includes(v.key)) : allViews;
  const readyCount = useRef(0);
  const [allReady, setAllReady] = useState(false);

  const markViewReady = () => {
    readyCount.current += 1;
    if (readyCount.current >= views.length) setAllReady(true);
  };

  useEffect(() => {
    if (allReady) document.documentElement.dataset.renderReady = "true";
  }, [allReady]);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "grid", gridTemplateColumns: `repeat(${views.length}, 1fr)` }}>
      {views.map((view) => (
        <div key={view.key} data-view={view.key} style={{ width: "100%", height: "100%" }}>
          <StagedSceneRenderer
            scanData={payload.scanData}
            actions={payload.actions}
            apiBaseUrl={API_BASE_URL}
            camera={view.camera}
            onReady={markViewReady}
            strippedRoomplanIdentifiers={payload.strippedRoomplanIdentifiers}
          />
        </div>
      ))}
    </div>
  );
}
