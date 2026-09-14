import { getToken } from "./supabase/client";
import { StagingAction } from "@/components/scans/stagingTypes";

export type StagingStatus = "none" | "pending" | "processing" | "done" | "error";
export type { StagingAction };

export interface StagingSummary {
  actions: StagingAction[];
  notes: string;
  preview_render_path: string | null;
  errors: string[];
  /** RoomPlan identifiers of original scanned objects programmatically
   * stripped before Claude ever saw the scan - StagedSceneRenderer must
   * suppress these exactly like a replaced object, or every stripped item
   * reappears as a generic gray box. */
  stripped_roomplan_identifiers: string[];
}

export interface ScanStagingState {
  id: number;
  staging_status: StagingStatus;
  staging_summary: StagingSummary | null;
  staged_at: string | null;
  /** Raw RoomPlan JSON - jsonb column, comes back either already-parsed or as a
   * string depending on the query path, same as elsewhere in this codebase
   * (see threeJSUtils.fetchScanData). Parse defensively either way. */
  serialized: string | Record<string, unknown> | null;
}

/** POST /api/scans/:id/stage — kicks off automated staging, returns immediately (status becomes "processing"). */
export const startStaging = async (scanId: number): Promise<boolean> => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return false;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scans/${scanId}/stage`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok && response.status !== 409) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error("Error starting staging:", error);
    return false;
  }
};

/** GET /api/scans/:id/stage — poll staging progress/result. */
export const getStagingState = async (scanId: number): Promise<ScanStagingState | null> => {
  const token = await getToken();
  if (!token) {
    console.error("You are not authenticated");
    return null;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scans/${scanId}/stage`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching staging state:", error);
    return null;
  }
};
