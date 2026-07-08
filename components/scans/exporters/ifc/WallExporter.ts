/**
 * Wall exporter — creates the IFC entities required to represent a single wall
 * as an IfcWall with a proper SweptSolid body geometry.
 *
 * ─── IFC entity hierarchy per wall ────────────────────────────────────────────
 *
 *   IfcWall (.STANDARD.)
 *     ├── IfcLocalPlacement  ← placement relative to the building storey
 *     │     └── IfcAxis2Placement3D
 *     │           ├── IfcCartesianPoint   (wall center at floor level, world coords)
 *     │           ├── IfcDirection        (local Z = vertical up = 0,0,1)
 *     │           └── IfcDirection        (local X = wall direction in floor plan)
 *     └── IfcProductDefinitionShape
 *           └── IfcShapeRepresentation  ('Body', 'SweptSolid')
 *                 └── IfcExtrudedAreaSolid
 *                       ├── IfcRectangleProfileDef  (length × thickness)
 *                       │     └── IfcAxis2Placement2D  (profile centred at 0,0)
 *                       │           └── IfcCartesianPoint (0,0)
 *                       ├── IfcAxis2Placement3D  (identity in wall local space)
 *                       │     └── IfcCartesianPoint (0,0,0)
 *                       └── IfcDirection  (extrusion along local Z = 0,0,1)
 *
 * The wall rectangle profile is centred on the placement origin, so it extends:
 *   ±length/2  along local X (wall direction)
 *   ±depth/2   along local Y (wall normal)
 *     0..height along local Z (vertical extrusion)
 */

import { IfcWriter } from "./IfcWriter";
import { guid, num, ref, str, en, NIL, pt2, pt3, refList } from "./IfcUtils";
import type { ElementTransform } from "./GeometryUtils";

/**
 * Add all IFC entities for one wall and return the IfcWall entity ID.
 *
 * @param w                  - Shared IfcWriter accumulating all entities
 * @param el                 - Decomposed wall transform in IFC coordinate space
 * @param storeyPlacementId  - IfcLocalPlacement ID of the parent building storey
 * @param bodyContextId      - IfcGeometricRepresentationSubContext ('Body') ID
 * @param ownerHistoryId     - Shared IfcOwnerHistory ID
 * @param index              - 0-based wall index (used in the entity Name)
 * @returns The ID of the created IfcWall entity
 */
export function addWall(
  w: IfcWriter,
  el: ElementTransform,
  storeyPlacementId: number,
  bodyContextId: number,
  ownerHistoryId: number,
  index: number,
): number {
  // ── Placement ────────────────────────────────────────────────────────────────

  // Wall origin: center of the wall base at floor level  (IFC world coordinates)
  const originId = w.nextId();
  w.entity(originId, "IFCCARTESIANPOINT", pt3(el.x, el.y, el.zFloor));

  // Local Z axis = vertical up  (0, 0, 1)
  const axisZId = w.nextId();
  w.entity(axisZId, "IFCDIRECTION", pt3(0, 0, 1));

  // Local X axis = wall direction in the IFC XY floor plane  (dirX, dirY, 0)
  const axisXId = w.nextId();
  w.entity(axisXId, "IFCDIRECTION", pt3(el.dirX, el.dirY, 0));

  // IfcAxis2Placement3D: positions and orients the wall in world space
  //   Axis     = local Z = up (0,0,1)
  //   RefDir   = local X = wall direction
  //   → local Y (wall normal) is derived as cross(Axis, RefDir)
  const placement3DId = w.nextId();
  w.entity(
    placement3DId,
    "IFCAXIS2PLACEMENT3D",
    ref(originId),
    ref(axisZId),
    ref(axisXId),
  );

  // IfcLocalPlacement: wall placement relative to its parent storey
  const localPlacementId = w.nextId();
  w.entity(
    localPlacementId,
    "IFCLOCALPLACEMENT",
    ref(storeyPlacementId),
    ref(placement3DId),
  );

  // ── Geometry: extruded rectangle profile ─────────────────────────────────────

  // 2D origin for the rectangle profile (centred at the placement origin)
  const profOriginId = w.nextId();
  w.entity(profOriginId, "IFCCARTESIANPOINT", pt2(0, 0));

  // 2D placement: no rotation — profile axes align with the wall local axes
  const profPlacement2DId = w.nextId();
  w.entity(profPlacement2DId, "IFCAXIS2PLACEMENT2D", ref(profOriginId), NIL);

  // Rectangle profile
  //   XDim = wall length       (extends ±length/2 along local X)
  //   YDim = wall thickness    (extends ±depth/2  along local Y)
  const profileId = w.nextId();
  w.entity(
    profileId,
    "IFCRECTANGLEPROFILEDEF",
    en("AREA"), // ProfileType
    str("WallProfile"), // ProfileName
    ref(profPlacement2DId), // Position
    num(el.length), // XDim — wall length
    num(el.depth), // YDim — wall thickness
  );

  // Extrusion solid placement at the local origin (no additional offset needed)
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

  // Extrusion direction = local Z axis (vertical up)
  const extrudeDirId = w.nextId();
  w.entity(extrudeDirId, "IFCDIRECTION", pt3(0, 0, 1));

  // IfcExtrudedAreaSolid: extrude the rectangle profile upward by wall height
  const solidId = w.nextId();
  w.entity(
    solidId,
    "IFCEXTRUDEDAREASOLID",
    ref(profileId), // SweptArea
    ref(solidPlacementId), // Position
    ref(extrudeDirId), // ExtrudedDirection
    num(el.height), // Depth (= wall height)
  );

  // IfcShapeRepresentation: 'Body' / 'SweptSolid'
  const shapeRepId = w.nextId();
  w.entity(
    shapeRepId,
    "IFCSHAPEREPRESENTATION",
    ref(bodyContextId), // ContextOfItems
    str("Body"), // RepresentationIdentifier
    str("SweptSolid"), // RepresentationType
    refList([solidId]), // Items
  );

  // IfcProductDefinitionShape: wraps the list of shape representations
  const productShapeId = w.nextId();
  w.entity(
    productShapeId,
    "IFCPRODUCTDEFINITIONSHAPE",
    NIL, // Name
    NIL, // Description
    refList([shapeRepId]), // Representations
  );

  // ── IfcWall entity ────────────────────────────────────────────────────────────

  const wallId = w.nextId();
  w.entity(
    wallId,
    "IFCWALL",
    str(guid()), // GlobalId
    ref(ownerHistoryId), // OwnerHistory
    str(`Wall ${index + 1}`), // Name
    NIL, // Description
    NIL, // ObjectType
    ref(localPlacementId), // ObjectPlacement
    ref(productShapeId), // Representation
    NIL, // Tag
    en("STANDARD"), // PredefinedType (IFC4)
  );

  return wallId;
}
