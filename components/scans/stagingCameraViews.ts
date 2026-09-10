import { Scan } from "./useTransform";
import { computeRoomShellInfo } from "./roomBounds";

export interface CameraSpec {
  position: [number, number, number];
  target?: [number, number, number];
  fov?: number;
  up?: [number, number, number];
}

export interface CameraView {
  key: string;
  camera: CameraSpec;
}

const EYE_HEIGHT_M = 1.6;

function polygonArea(points: [number, number][]): number {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[(i + 1) % points.length];
    area += x1 * z2 - x2 * z1;
  }
  return Math.abs(area) / 2;
}

function polygonCentroid(points: [number, number][]): [number, number] {
  let cx = 0;
  let cz = 0;
  let signedArea = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, z1] = points[i];
    const [x2, z2] = points[(i + 1) % points.length];
    const cross = x1 * z2 - x2 * z1;
    signedArea += cross;
    cx += (x1 + x2) * cross;
    cz += (z1 + z2) * cross;
  }
  if (signedArea === 0) {
    // Degenerate polygon - fall back to a plain vertex average.
    const n = points.length || 1;
    return [points.reduce((s, p) => s + p[0], 0) / n, points.reduce((s, p) => s + p[1], 0) / n];
  }
  signedArea *= 0.5;
  return [cx / (6 * signedArea), cz / (6 * signedArea)];
}

/** Ray-casting point-in-polygon test - needed because a room's bounding-box
 * corner/center is not guaranteed to sit on real floor area for an L-shaped,
 * multi-room, or otherwise non-convex/non-rectangular polygon (e.g. it can fall
 * in a notch, or - for a multi-wing apartment scan where RoomPlan reports one
 * combined floor polygon - in a gap between wings). */
function pointInPolygon(point: [number, number], polygon: [number, number][]): boolean {
  const [x, z] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, zi] = polygon[i];
    const [xj, zj] = polygon[j];
    const intersects = zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/**
 * A camera position guaranteed to sit on real floor area (verified via
 * point-in-polygon, not just "inside the bounding box"): tries a point inset 35%
 * of the way from each polygon vertex toward the polygon's own centroid, in turn,
 * until one actually lands inside the polygon. Falls back to the centroid itself
 * (usually valid for the common case: a simple, mostly-convex room) if no vertex
 * candidate works, and finally to the plain bounds/center midpoint if there's no
 * polygon at all (older/malformed scan).
 */
function findCameraFloorSpot(
  polygon: [number, number][] | null,
  boundsMin: [number, number, number],
  center: [number, number, number]
): [number, number] {
  if (!polygon || polygon.length < 3) {
    return [boundsMin[0] + (center[0] - boundsMin[0]) * 0.35, boundsMin[2] + (center[2] - boundsMin[2]) * 0.35];
  }
  const centroid = polygonCentroid(polygon);
  for (const vertex of polygon) {
    const candidate: [number, number] = [
      vertex[0] + (centroid[0] - vertex[0]) * 0.35,
      vertex[1] + (centroid[1] - vertex[1]) * 0.35,
    ];
    if (pointInPolygon(candidate, polygon)) return candidate;
  }
  if (pointInPolygon(centroid, polygon)) return centroid;
  return [boundsMin[0] + (center[0] - boundsMin[0]) * 0.35, boundsMin[2] + (center[2] - boundsMin[2]) * 0.35];
}

/**
 * Two automatic views computed from the room's real geometry - a top-down plan
 * view (good for spotting overlaps/clearances/traffic flow) and an eye-level
 * perspective view (good for judging style/materials/realism), the same two
 * things a human stager would actually check. No Claude-chosen camera params:
 * letting an LLM pick raw camera coordinates opens a class of failures (a
 * position outside the room, wasted tool rounds experimenting) for little value
 * over this geometry-driven heuristic.
 */
export function computeViews(scanData: Scan): CameraView[] {
  const room = computeRoomShellInfo(scanData);
  const center: [number, number, number] = [
    (room.bounds_min[0] + room.bounds_max[0]) / 2,
    (room.bounds_min[1] + room.bounds_max[1]) / 2,
    (room.bounds_min[2] + room.bounds_max[2]) / 2,
  ];
  const spanX = room.bounds_max[0] - room.bounds_min[0];
  const spanZ = room.bounds_max[2] - room.bounds_min[2];
  const roomSpan = Math.max(spanX, spanZ, 3);

  const topDown: CameraSpec = {
    position: [center[0], room.bounds_max[1] + roomSpan * 1.2 + 2, center[2]],
    target: center,
    // A camera looking straight down needs a non-default up vector - the default
    // (0,1,0) is degenerate/undefined for a lookAt aimed along the Y axis itself.
    up: [0, 0, 1],
    fov: 50,
  };

  const mainPolygon =
    room.floor_polygons.length > 0
      ? room.floor_polygons.reduce((a, b) => (polygonArea(b) > polygonArea(a) ? b : a))
      : null;
  const [spotX, spotZ] = findCameraFloorSpot(mainPolygon, room.bounds_min, center);

  // Look toward the polygon's own centroid rather than the whole scan's bounding-
  // box center - for a multi-wing/non-convex floor plan, the bounding-box center
  // can sit in a gap between wings, which would aim the camera at/through a
  // separating wall instead of into the room it's actually standing in.
  const [lookX, lookZ] = mainPolygon ? polygonCentroid(mainPolygon) : [center[0], center[2]];

  const perspective: CameraSpec = {
    position: [spotX, room.bounds_min[1] + EYE_HEIGHT_M, spotZ],
    target: [lookX, center[1], lookZ],
    fov: 80,
  };

  return [
    { key: "top-down", camera: topDown },
    { key: "perspective", camera: perspective },
  ];
}
