/**
 * Door exporter — creates the IFC entities required to represent a single door
 * as an IfcDoor with a SweptSolid body geometry.
 *
 * ─── IFC entity hierarchy per door ────────────────────────────────────────────
 *
 *   IfcDoor (.DOOR. / .SINGLE_SWING_LEFT.)
 *     ├── IfcLocalPlacement  ← placement relative to the building storey
 *     │     └── IfcAxis2Placement3D
 *     │           ├── IfcCartesianPoint   (door center at floor level)
 *     │           ├── IfcDirection        (local Z = 0,0,1)
 *     │           └── IfcDirection        (local X = door width direction)
 *     └── IfcProductDefinitionShape
 *           └── IfcShapeRepresentation  ('Body', 'SweptSolid')
 *                 └── IfcExtrudedAreaSolid
 *                       ├── IfcRectangleProfileDef  (width × frame thickness)
 *                       ├── IfcAxis2Placement3D  (identity)
 *                       └── IfcDirection  (0,0,1)
 *
 * The door opening is modelled as a solid rectangle for BIM geometry.
 * Void cutting into the host wall (IfcOpeningElement + IfcRelVoidsElement)
 * is not implemented here — most BIM tools accept standalone doors.
 */

import { IfcWriter } from "./IfcWriter";
import { guid, num, ref, str, en, NIL, pt2, pt3, refList } from "./IfcUtils";
import type { ElementTransform } from "./GeometryUtils";

/**
 * Add all IFC entities for one door and return the IfcDoor entity ID.
 *
 * @param w                  - Shared IfcWriter
 * @param el                 - Decomposed door transform in IFC coordinate space
 * @param storeyPlacementId  - IfcLocalPlacement ID of the parent building storey
 * @param bodyContextId      - IfcGeometricRepresentationSubContext ('Body') ID
 * @param ownerHistoryId     - Shared IfcOwnerHistory ID
 * @param index              - 0-based door index (used in the entity Name)
 * @returns The ID of the created IfcDoor entity
 */
export function addDoor(
  w: IfcWriter,
  el: ElementTransform,
  storeyPlacementId: number,
  bodyContextId: number,
  ownerHistoryId: number,
  index: number,
): number {
  // ── Placement ────────────────────────────────────────────────────────────────

  // Door origin: center of the door opening at floor level
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
  //   XDim = door width      (el.length)
  //   YDim = frame thickness (el.depth, fallback 0.05 m)
  const profileId = w.nextId();
  w.entity(
    profileId,
    "IFCRECTANGLEPROFILEDEF",
    en("AREA"),
    str("DoorProfile"),
    ref(profPlacement2DId),
    num(el.length), // XDim — door width
    num(el.depth), // YDim — door frame thickness
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
    num(el.height), // Depth — door height
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

  // ── IfcDoor entity ────────────────────────────────────────────────────────────
  //
  // IfcDoor attribute order (IFC4 — 13 parameters):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation, Tag,
  //   OverallHeight, OverallWidth, PredefinedType, OperationType,
  //   UserDefinedOperationType
  //
  const doorId = w.nextId();
  w.entity(
    doorId,
    "IFCDOOR",
    str(guid()), // GlobalId
    ref(ownerHistoryId), // OwnerHistory
    str(`Door ${index + 1}`), // Name
    NIL, // Description
    NIL, // ObjectType
    ref(localPlacementId), // ObjectPlacement
    ref(productShapeId), // Representation
    NIL, // Tag
    num(el.height), // OverallHeight
    num(el.length), // OverallWidth
    en("DOOR"), // PredefinedType
    en("SINGLE_SWING_LEFT"), // OperationType
    NIL, // UserDefinedOperationType
  );

  return doorId;
}
