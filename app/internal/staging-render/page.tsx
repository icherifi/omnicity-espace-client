"use client";

import { StagedSceneRenderer } from "@/components/scans/StagedSceneRenderer";
import { Scan } from "@/components/scans/useTransform";
import { StagingAction } from "@/components/scans/stagingTypes";
import sampleScan from "./sample-scan.json";

// Phase 2: hardcoded fixture, not yet fetched from a payload route (that's Phase 3).
// Real room (same fixture as the backend's Phase 1 verify script), floor Y ~= -1.18.
// item_no 70294339 (LISABO dining table) was already confirmed in Phase 1 to
// download and measure correctly (140.0 x 74.0 x 78.0cm). X/Z positions reused
// from real objects in this room (Sink0, Chair0 - see Phase 1's script output) so
// they're guaranteed to be in actual open floor space, not inside a partition wall
// in this heavily-subdivided (37-wall) apartment layout.
const actions: StagingAction[] = [
  { type: "place", item_no: "70294339", position: [1.35, -1.18, -0.98], rotation_y_degrees: 0 },
  { type: "place", item_no: "70294339", position: [-3.66, -1.18, 6.01], rotation_y_degrees: 90 },
  {
    type: "wall_color",
    wall_object_names: "all",
    material_id: "soft_greige",
    hex_color: "#E3DCCF",
  },
  {
    type: "floor_material",
    material_id: "oak_light",
    diffuse_path: "/materials/oak_light/diffuse.jpg",
    normal_path: "/materials/oak_light/normal.jpg",
    roughness_path: "/materials/oak_light/roughness.jpg",
    tile_size_cm: [200, 200],
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_STAGING_RENDER_API_BASE_URL || "http://localhost:6301";

export default function StagingRenderPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <StagedSceneRenderer scanData={sampleScan as unknown as Scan} actions={actions} apiBaseUrl={API_BASE_URL} />
    </div>
  );
}
