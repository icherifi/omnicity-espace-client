/**
 * Window exporter — creates the IFC entities required to represent a single
 * window as an IfcWindow with a SweptSolid body geometry.
 *
 * ─── IFC entity hierarchy per window ──────────────────────────────────────────
 *
 *   IfcWindow (.WINDOW. / .SINGLE_PANEL.)
 *     ├── IfcLocalPlacement  ← placement relative to the building storey
 *     │     └── IfcAxis2Placement3D
 *     │           ├── IfcCartesianPoint   (window center at sill level)
 *     │           ├── IfcDirection        (local Z = 0,0,1)
 *     │           └── IfcDirection        (local X = window width direction)
 *     └── IfcProductDefinitionShape
 *           └── IfcShapeRepresentation  ('Body', 'SweptSolid')
 *                 └── IfcExtrudedAreaSolid
 *                       ├── IfcRectangleProfileDef  (width × frame depth)
 *                       ├── IfcAxis2Placement3D  (identity)
 *                       └── IfcDirection  (0,0,1)
 *
 * The sill level (zFloor in ElementTransform) is derived from the RoomPlan
 * vertical center minus half the window height.  For a typical window at
 * 1.3 m center height with 0.8 m height: sill = 0.9 m — which is realistic.
 */

import { IfcWriter } from "./IfcWriter";
import { guid, num, ref, str, en, NIL, pt2, pt3, refList } from "./IfcUtils";
import type { ElementTransform } from "./GeometryUtils";

/**
 * Add all IFC entities for one window and return the IfcWindow entity ID.
 *
 * @param w                  - Shared IfcWriter
 * @param el                 - Decomposed window transform in IFC coordinate space
 * @param storeyPlacementId  - IfcLocalPlacement ID of the parent building storey
 * @param bodyContextId      - IfcGeometricRepresentationSubContext ('Body') ID
 * @param ownerHistoryId     - Shared IfcOwnerHistory ID
 * @param index              - 0-based window index (used in the entity Name)
 * @returns The ID of the created IfcWindow entity
 */
export function addWindow(
  w: IfcWriter,
  el: ElementTransform,
  storeyPlacementId: number,
  bodyContextId: number,
  ownerHistoryId: number,
  index: number,
): number {
  // ── Placement ────────────────────────────────────────────────────────────────

  // Window origin: center of the window opening at sill level (bottom of frame)
  const originId = w.nextId();
  w.entity(originId, "IFCCARTESIANPOINT", pt3(el.x, el.y, el.zFloor));

  const axisZId = w.nextId();
  w.entity(axisZId, "IFCDIRECTION", pt3(0, 0, 1));

  const axisXId = w.nextId();
  w.entity(axisXId, "IFCDIRECTION", pt3(el.dirX, el.dirY, 0));

  const placement3DId = w.nextId();
  w.entity(
    placement3DId,
    "IFCAXIS2PLACEMENT3D",
    ref(originId),
    ref(axisZId),
    ref(axisXId),
  );

  const localPlacementId = w.nextId();
  w.entity(
    localPlacementId,
    "IFCLOCALPLACEMENT",
    ref(storeyPlacementId),
    ref(placement3DId),
  );

  // ── Geometry ──────────────────────────────────────────────────────────────────

  const profOriginId = w.nextId();
  w.entity(profOriginId, "IFCCARTESIANPOINT", pt2(0, 0));

  const profPlacement2DId = w.nextId();
  w.entity(profPlacement2DId, "IFCAXIS2PLACEMENT2D", ref(profOriginId), NIL);

  // Rectangle profile
  //   XDim = window width    (el.length)
  //   YDim = frame depth     (el.depth, fallback 0.05 m)
  const profileId = w.nextId();
  w.entity(
    profileId,
    "IFCRECTANGLEPROFILEDEF",
    en("AREA"),
    str("WindowProfile"),
    ref(profPlacement2DId),
    num(el.length), // XDim — window width
    num(el.depth), // YDim — frame depth
  );

  const solidOriginId = w.nextId();
  w.entity(solidOriginId, "IFCCARTESIANPOINT", pt3(0, 0, 0));

  const solidPlacementId = w.nextId();
  w.entity(
    solidPlacementId,
    "IFCAXIS2PLACEMENT3D",
    ref(solidOriginId),
    NIL,
    NIL,
  );

  const extrudeDirId = w.nextId();
  w.entity(extrudeDirId, "IFCDIRECTION", pt3(0, 0, 1));

  const solidId = w.nextId();
  w.entity(
    solidId,
    "IFCEXTRUDEDAREASOLID",
    ref(profileId),
    ref(solidPlacementId),
    ref(extrudeDirId),
    num(el.height), // Depth — window height
  );

  const shapeRepId = w.nextId();
  w.entity(
    shapeRepId,
    "IFCSHAPEREPRESENTATION",
    ref(bodyContextId),
    str("Body"),
    str("SweptSolid"),
    refList([solidId]),
  );

  const productShapeId = w.nextId();
  w.entity(
    productShapeId,
    "IFCPRODUCTDEFINITIONSHAPE",
    NIL,
    NIL,
    refList([shapeRepId]),
  );

  // ── IfcWindow entity ──────────────────────────────────────────────────────────
  //
  // IfcWindow attribute order (IFC4 — 13 parameters):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation, Tag,
  //   OverallHeight, OverallWidth, PredefinedType, PartitioningType,
  //   UserDefinedPartitioningType
  //
  const windowId = w.nextId();
  w.entity(
    windowId,
    "IFCWINDOW",
    str(guid()), // GlobalId
    ref(ownerHistoryId), // OwnerHistory
    str(`Window ${index + 1}`), // Name
    NIL, // Description
    NIL, // ObjectType
    ref(localPlacementId), // ObjectPlacement
    ref(productShapeId), // Representation
    NIL, // Tag
    num(el.height), // OverallHeight
    num(el.length), // OverallWidth
    en("WINDOW"), // PredefinedType
    en("SINGLE_PANEL"), // PartitioningType
    NIL, // UserDefinedPartitioningType
  );

  return windowId;
}
