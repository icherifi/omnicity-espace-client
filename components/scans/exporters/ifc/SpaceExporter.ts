/**
 * Space exporter — creates an IfcSpace entity for a RoomPlan room section.
 *
 * IfcSpace is a spatial structure element, not a physical element.  It lives
 * in the building's spatial hierarchy via IfcRelAggregates (storey → spaces)
 * rather than IfcRelContainedInSpatialStructure which is used for walls/doors.
 *
 * A fully accurate room footprint would require spatial analysis (polygon
 * intersection of surrounding walls), which goes beyond the current data.
 * This exporter therefore creates an IfcSpace with correct metadata and
 * position but no 2D footprint geometry.  BIM tools will still display the
 * space in the spatial tree with the correct name and elevation.
 *
 * ─── IFC entity hierarchy per space ───────────────────────────────────────────
 *
 *   IfcSpace (.INTERNAL.)
 *     └── IfcLocalPlacement  ← placement relative to the building storey
 *           └── IfcAxis2Placement3D
 *                 └── IfcCartesianPoint  (section center, IFC Z-up coords)
 */

import { IfcWriter } from "./IfcWriter";
import { guid, num, ref, str, en, NIL, pt3 } from "./IfcUtils";

// ─── Public types ──────────────────────────────────────────────────────────────

/**
 * A room section from the RoomPlan API.
 * Mirrors the RoomSection interface in threeJSUtils.ts.
 */
export interface RoomSection {
  /** Room type label (e.g. 'bedroom', 'livingRoom', 'kitchen') */
  label: string;
  /** Center of the room in Three.js world coordinates: [X, Y(up), Z] */
  center: [number, number, number];
  /** Story index (0 = ground floor) */
  story: number;
}

// ─── Exporter ─────────────────────────────────────────────────────────────────

/**
 * Add all IFC entities for one room section and return the IfcSpace entity ID.
 *
 * @param w                  - Shared IfcWriter
 * @param section            - RoomPlan room section
 * @param storeyPlacementId  - IfcLocalPlacement ID of the parent building storey
 * @param ownerHistoryId     - Shared IfcOwnerHistory ID
 * @param index              - 0-based section index (for debugging / naming)
 * @returns The ID of the created IfcSpace entity
 */
export function addSpace(
  w: IfcWriter,
  section: RoomSection,
  storeyPlacementId: number,
  ownerHistoryId: number,
  index: number,
  /** Vertical offset (metres) applied to all elements to normalise the floor to IFC Z = 0. */
  zOffset = 0,
): number {
  // ── Coordinate conversion: Three.js (Y-up) → IFC (Z-up) ──────────────────────
  //   Three.js center: [sx (X), sy (Y=up), sz (Z)]
  //   IFC:             [sx (X), sz (Y),    sy (Z=up) + zOffset]
  const [sx, sy, sz] = section.center;
  const ifc_x = sx;
  const ifc_y = sz; // Three.js Z → IFC Y
  const ifc_z = sy + zOffset; // Three.js Y → IFC Z (up), floor-normalised

  // ── Placement ────────────────────────────────────────────────────────────────

  const originId = w.nextId();
  w.entity(originId, "IFCCARTESIANPOINT", pt3(ifc_x, ifc_y, ifc_z));

  // Default orientation: no rotation (local axes = world axes)
  const placement3DId = w.nextId();
  w.entity(placement3DId, "IFCAXIS2PLACEMENT3D", ref(originId), NIL, NIL);

  const localPlacementId = w.nextId();
  w.entity(
    localPlacementId,
    "IFCLOCALPLACEMENT",
    ref(storeyPlacementId),
    ref(placement3DId),
  );

  // ── IfcSpace entity ────────────────────────────────────────────────────────────
  //
  // IfcSpace attribute order (IFC4 — 11 parameters):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation,
  //   LongName, CompositionType, PredefinedType, ElevationWithFlooring
  //
  const spaceId = w.nextId();
  w.entity(
    spaceId,
    "IFCSPACE",
    str(guid()), // GlobalId
    ref(ownerHistoryId), // OwnerHistory
    str(section.label), // Name  (RoomPlan room label used as IFC name)
    NIL, // Description
    NIL, // ObjectType
    ref(localPlacementId), // ObjectPlacement
    NIL, // Representation  (no 2D footprint yet)
    str(section.label), // LongName
    en("ELEMENT"), // CompositionType
    en("INTERNAL"), // PredefinedType  (interior space)
    num(ifc_z), // ElevationWithFlooring  (approx from section center)
  );

  return spaceId;
}
