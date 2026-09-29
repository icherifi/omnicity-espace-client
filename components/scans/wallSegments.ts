import * as THREE from "three";
import { Transform } from "./useTransform";

/** Door/window/opening fallback sizes, matching RoomShell.tsx's own Door/Window
 * defaults - keeps the cut region exactly the size of the filler mesh, no seam. */
const DEFAULT_OPENING_HEIGHT_M = 2.1;
const MIN_SEGMENT_SIZE_M = 0.02;

export interface WallSegment {
  /** Center offset from the wall's own transform origin, in the wall's local
   * width/height axes (x = along width, y = along height). */
  center: [number, number];
  width: number;
  height: number;
}

interface Cutout {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Projects a door/window/opening's world position into its host wall's own local
 * frame (width axis = local x, height axis = local y), independent of the wall's
 * absolute rotation - a matrix inversion handles any wall angle uniformly. */
function projectCutout(wall: Transform, child: Transform, halfWallWidth: number, halfWallHeight: number): Cutout | null {
  const wallMatrix = new THREE.Matrix4().fromArray(wall.transform);
  const childMatrix = new THREE.Matrix4().fromArray(child.transform);
  const local = wallMatrix.clone().invert().multiply(childMatrix);
  const localPos = new THREE.Vector3().setFromMatrixPosition(local);

  const halfChildWidth = (child.dimensions[0] ?? 0) / 2;
  const halfChildHeight = (child.dimensions[1] || DEFAULT_OPENING_HEIGHT_M) / 2;

  const xMin = Math.max(localPos.x - halfChildWidth, -halfWallWidth);
  const xMax = Math.min(localPos.x + halfChildWidth, halfWallWidth);
  const yMin = Math.max(localPos.y - halfChildHeight, -halfWallHeight);
  const yMax = Math.min(localPos.y + halfChildHeight, halfWallHeight);

  if (xMax - xMin < MIN_SEGMENT_SIZE_M || yMax - yMin < MIN_SEGMENT_SIZE_M) return null;
  return { xMin, xMax, yMin, yMax };
}

/** Merges cutouts that overlap along the wall's width axis, unioning their height
 * range too - handles two doors/windows that overlap in X by cutting one combined
 * opening rather than leaving an incorrect solid sliver between them. */
function mergeCutouts(cutouts: Cutout[]): Cutout[] {
  const sorted = [...cutouts].sort((a, b) => a.xMin - b.xMin);
  const merged: Cutout[] = [];
  for (const c of sorted) {
    const last = merged[merged.length - 1];
    if (last && c.xMin <= last.xMax) {
      last.xMax = Math.max(last.xMax, c.xMax);
      last.yMin = Math.min(last.yMin, c.yMin);
      last.yMax = Math.max(last.yMax, c.yMax);
    } else {
      merged.push({ ...c });
    }
  }
  return merged;
}

/**
 * Splits one wall into solid box segments that leave a gap wherever a door/window/
 * opening sits in it, instead of one uncut slab that visually occludes them. All
 * math happens in the wall's own local frame, so it's correct for any wall angle.
 *
 * 2D ("Plan" tab): only the width gap matters once height is flattened - no
 * lintel/sill subdivision, that would just be redundant flat slabs.
 */
export function computeWallSegments(
  wall: Transform,
  children: Transform[],
  is3D: boolean
): WallSegment[] {
  const wallWidth = wall.dimensions[0];
  const wallHeight = is3D ? wall.dimensions[1] : 0.1;
  const halfWallWidth = wallWidth / 2;
  const halfWallHeight = wallHeight / 2;

  const cutouts = children
    .map((child) => projectCutout(wall, child, halfWallWidth, halfWallHeight))
    .filter((c): c is Cutout => c !== null);

  if (cutouts.length === 0) {
    return [{ center: [0, 0], width: wallWidth, height: wallHeight }];
  }

  const merged = mergeCutouts(cutouts);
  const segments: WallSegment[] = [];

  // Full-height column segments in the leftover width gaps (left / between / right).
  let cursor = -halfWallWidth;
  for (const cut of merged) {
    if (cut.xMin - cursor > MIN_SEGMENT_SIZE_M) {
      const w = cut.xMin - cursor;
      segments.push({ center: [cursor + w / 2, 0], width: w, height: wallHeight });
    }
    cursor = cut.xMax;
  }
  if (halfWallWidth - cursor > MIN_SEGMENT_SIZE_M) {
    const w = halfWallWidth - cursor;
    segments.push({ center: [cursor + w / 2, 0], width: w, height: wallHeight });
  }

  if (is3D) {
    // Lintel above / sill below each opening, only where real gap remains -
    // a floor-flush door's yMin sits at -halfWallHeight already, so it naturally
    // gets no sill segment without needing a door-vs-window special case.
    for (const cut of merged) {
      const cutWidth = cut.xMax - cut.xMin;
      const cutCenterX = (cut.xMin + cut.xMax) / 2;
      if (halfWallHeight - cut.yMax > MIN_SEGMENT_SIZE_M) {
        const h = halfWallHeight - cut.yMax;
        segments.push({ center: [cutCenterX, cut.yMax + h / 2], width: cutWidth, height: h });
      }
      if (cut.yMin - -halfWallHeight > MIN_SEGMENT_SIZE_M) {
        const h = cut.yMin + halfWallHeight;
        segments.push({ center: [cutCenterX, -halfWallHeight + h / 2], width: cutWidth, height: h });
      }
    }
  }

  return segments;
}
