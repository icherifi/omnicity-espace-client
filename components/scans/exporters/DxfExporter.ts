/**
 * DXF Exporter for RoomPlan 3D scan data.
 *
 * Converts the application's internal room model (walls, doors, windows,
 * floor, furniture) into a clean, AutoCAD-compatible DXF file.
 *
 * Does NOT rely on the original USD/USDZ file or raw mesh triangles.
 * All geometry is derived from the semantic scan data.
 *
 * Coordinate mapping (Three.js → DXF):
 *   Three.js X  →  DXF X
 *   Three.js Z  →  DXF Y  (top-down floor plan)
 *   Three.js Y  →  DXF Z  (height / elevation)
 */

import { DxfWriter, Units, Colors, LWPolylineFlags } from "@tarikjabiri/dxf";
import type { LWPolylineVertex } from "@tarikjabiri/dxf";

// ─── Types (mirror threeJSUtils.ts) ──────────────────────────────────────────

export interface Transform {
  transform: number[]; // 4×4 column-major matrix (16 values)
  dimensions: number[]; // [width, height, depth]
  identifier?: string;
}

export interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
}

// ─── Layer names ──────────────────────────────────────────────────────────────

const LAYER_WALLS = "WALLS";
const LAYER_FLOOR = "FLOOR";
const LAYER_DOORS = "DOORS";
const LAYER_WINDOWS = "WINDOWS";
const LAYER_FURNITURE = "FURNITURE";

// ─── Geometry helpers ─────────────────────────────────────────────────────────

/**
 * Decompose a column-major 4×4 Three.js transform matrix.
 * RoomPlan stores matrices in column-major order:
 *   [m00,m10,m20,m30, m01,m11,m21,m31, m02,m12,m22,m32, m03,m13,m23,m33]
 *
 * Position components: index 12 = Tx, 13 = Ty, 14 = Tz
 * Rotation around Y (yaw): atan2(m[8], m[0])
 */
function decomposeTransform(t: number[]): {
  cx: number; // world X center
  cy: number; // world Y center (vertical)
  cz: number; // world Z center
  rotY: number; // rotation around world Y axis (radians)
} {
  return {
    cx: t[12],
    cy: t[13],
    cz: t[14],
    rotY: Math.atan2(t[8], t[0]),
  };
}

/**
 * Compute the four floor-plan corners of a wall (or any box element).
 * Returns vertices in [x, y] (DXF XY = Three.js XZ plane).
 */
function getBoxCorners2D(element: Transform): [number, number][] {
  const { cx, cz, rotY } = decomposeTransform(element.transform);

  const halfW = element.dimensions[0] / 2; // half-length along the wall axis
  const halfD = (element.dimensions[2] || 0.2) / 2; // half-thickness

  const cos = Math.cos(rotY);
  const sin = Math.sin(rotY);

  // Four corners: (±halfW along axis) × (±halfD perpendicular)
  return [
    [cx - halfW * cos - halfD * sin, cz - halfW * sin + halfD * cos],
    [cx + halfW * cos - halfD * sin, cz + halfW * sin + halfD * cos],
    [cx + halfW * cos + halfD * sin, cz + halfW * sin - halfD * cos],
    [cx - halfW * cos + halfD * sin, cz - halfW * sin - halfD * cos],
  ];
}

/**
 * Convert [x, y] pairs to LWPolylineVertex array (z = 0 for a flat polyline).
 */
function toPolylineVertices(points: [number, number][]): LWPolylineVertex[] {
  return points.map(([x, y]) => ({ point: { x, y } }));
}

/**
 * Compute the convex hull of a set of 2D points using the Graham scan
 * algorithm. Returns the hull in counter-clockwise order.
 */
function convexHull(points: [number, number][]): [number, number][] {
  if (points.length < 3) return points;

  // Sort by x then by y
  const sorted = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  const cross = (
    O: [number, number],
    A: [number, number],
    B: [number, number],
  ) => (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);

  const lower: [number, number][] = [];
  for (const p of sorted) {
    while (
      lower.length >= 2 &&
      cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
    ) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: [number, number][] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (
      upper.length >= 2 &&
      cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
    ) {
      upper.pop();
    }
    upper.push(p);
  }

  // Remove the last point of each half (it's the start of the other)
  lower.pop();
  upper.pop();

  return [...lower, ...upper];
}

// ─── Main exporter ────────────────────────────────────────────────────────────

/**
 * Convert the application's room scan data to a DXF Blob.
 *
 * Usage:
 * ```ts
 * const blob = exportRoomToDxf(scanData);
 * download(blob, "RoomPlan.dxf");
 * ```
 *
 * @param roomData - The parsed scan data from the application.
 * @returns A Blob containing the DXF file content (text/plain encoding).
 */
export function exportRoomToDxf(roomData: Scan): Blob {
  const dxf = new DxfWriter();

  // Set document units to metres
  dxf.setVariable("$INSUNITS", { 70: Units.Meters });
  dxf.setVariable("$LUNITS", { 70: 2 }); // decimal

  // ── Create layers ──────────────────────────────────────────────────────────
  dxf.tables.addLayer(LAYER_WALLS, Colors.White, "Continuous");
  dxf.tables.addLayer(LAYER_FLOOR, Colors.Cyan, "Continuous");
  dxf.tables.addLayer(LAYER_DOORS, Colors.Yellow, "Continuous");
  dxf.tables.addLayer(LAYER_WINDOWS, Colors.Green, "Continuous");
  dxf.tables.addLayer(LAYER_FURNITURE, Colors.Magenta, "Continuous");

  const ms = dxf.modelSpace; // model space block

  // ── Export walls ──────────────────────────────────────────────────────────
  if (roomData.walls && roomData.walls.length > 0) {
    exportWalls(ms, roomData.walls);
  }

  // ── Export floor outline (convex hull of all wall corners) ────────────────
  if (roomData.walls && roomData.walls.length > 0) {
    exportFloor(ms, roomData.walls);
  }

  // ── Export doors ──────────────────────────────────────────────────────────
  if (roomData.doors && roomData.doors.length > 0) {
    exportOpeningElements(ms, roomData.doors, LAYER_DOORS);
  }

  // ── Export openings (treated as door-like openings) ───────────────────────
  if (roomData.openings && roomData.openings.length > 0) {
    exportOpeningElements(ms, roomData.openings, LAYER_DOORS);
  }

  // ── Export windows ────────────────────────────────────────────────────────
  if (roomData.windows && roomData.windows.length > 0) {
    exportOpeningElements(ms, roomData.windows, LAYER_WINDOWS);
  }

  // ── Export furniture / objects (optional) ─────────────────────────────────
  if (roomData.objects && roomData.objects.length > 0) {
    exportOpeningElements(ms, roomData.objects, LAYER_FURNITURE);
  }

  // Serialise the document to a DXF string and wrap in a Blob
  const dxfString = dxf.document.stringify();
  return new Blob([dxfString], { type: "application/dxf" });
}

// ─── Section-level exporters ──────────────────────────────────────────────────

/**
 * Export each wall as a closed LWPolyline representing its floor footprint.
 * Each wall is a rectangle with the correct length, thickness, and rotation.
 */
function exportWalls(
  ms: ReturnType<DxfWriter["addBlock"]>,
  walls: Transform[],
): void {
  walls.forEach((wall, index) => {
    const corners = getBoxCorners2D(wall);
    const vertices = toPolylineVertices(corners);

    ms.addLWPolyline(vertices, {
      flags: LWPolylineFlags.Closed,
      layerName: LAYER_WALLS,
    });

    // Also draw a centre-line (the structural axis of the wall) as a LINE
    // for easier reading in AutoCAD.
    const { cx, cz, rotY } = decomposeTransform(wall.transform);
    const halfLen = wall.dimensions[0] / 2;
    const cos = Math.cos(rotY);
    const sin = Math.sin(rotY);

    ms.addLine(
      { x: cx - halfLen * cos, y: cz - halfLen * sin, z: 0 },
      { x: cx + halfLen * cos, y: cz + halfLen * sin, z: 0 },
      { layerName: LAYER_WALLS },
    );
  });
}

/**
 * Export the floor outline as a single closed LWPolyline.
 * The outline is computed as the convex hull of all wall corners.
 */
function exportFloor(
  ms: ReturnType<DxfWriter["addBlock"]>,
  walls: Transform[],
): void {
  // Collect every corner from every wall
  const allCorners: [number, number][] = walls.flatMap((w) =>
    getBoxCorners2D(w),
  );

  const hull = convexHull(allCorners);
  if (hull.length < 3) return;

  const vertices = toPolylineVertices(hull);

  ms.addLWPolyline(vertices, {
    flags: LWPolylineFlags.Closed,
    layerName: LAYER_FLOOR,
  });
}

/**
 * Export a list of opening elements (doors, windows, furniture) each as a
 * closed LWPolyline footprint on the specified layer.
 */
function exportOpeningElements(
  ms: ReturnType<DxfWriter["addBlock"]>,
  elements: Transform[],
  layer: string,
): void {
  elements.forEach((el) => {
    const corners = getBoxCorners2D(el);
    const vertices = toPolylineVertices(corners);

    ms.addLWPolyline(vertices, {
      flags: LWPolylineFlags.Closed,
      layerName: layer,
    });
  });
}

// ─── Download helper ──────────────────────────────────────────────────────────

/**
 * Trigger a browser file download for a Blob.
 *
 * @param blob - The file content.
 * @param filename - The suggested filename (e.g. "RoomPlan.dxf").
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Release the object URL after the download has been triggered
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
