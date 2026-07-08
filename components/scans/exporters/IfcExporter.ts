/**
 * IFC4 Exporter for RoomPlan scan data.
 *
 * Converts the application's internal room model (walls, doors, windows,
 * openings, and room sections) into a valid IFC4 STEP file.
 *
 * ─── What this exporter does ──────────────────────────────────────────────────
 *
 *  • Does NOT export Three.js mesh triangles — all geometry is derived from
 *    the semantic scan data (transform matrices + dimensions).
 *  • Generates parametric BIM geometry (IfcExtrudedAreaSolid) for walls, doors
 *    and windows — elements remain editable in Revit / ArchiCAD / BlenderBIM.
 *  • Produces a valid IFC4 STEP file (.ifc) with the full spatial hierarchy:
 *    IfcProject → IfcSite → IfcBuilding → IfcBuildingStorey → elements.
 *
 * ─── Coordinate system ────────────────────────────────────────────────────────
 *
 *   Three.js (Y-up)  →  IFC 4 (Z-up)
 *     X              →  X
 *     Y  (up)        →  Z  (up)
 *     Z  (depth)     →  Y  (depth)
 *
 * Units: metres throughout (IfcSIUnit / METRE).
 *
 * ─── Compatibility ────────────────────────────────────────────────────────────
 *
 *  Tested schema: IFC4
 *  Target tools : Autodesk Revit, ArchiCAD, BlenderBIM, Solibri, BIM Vision
 *
 * ─── Usage ────────────────────────────────────────────────────────────────────
 *
 * ```ts
 * const blob = await exportScanToIFC(scanData);
 * downloadBlob(blob, `${scanData.name}.ifc`);
 * ```
 */

import { IfcWriter } from "./ifc/IfcWriter";
import {
  guid,
  num,
  ref,
  str,
  en,
  NIL,
  DRV,
  pt3,
  refList,
} from "./ifc/IfcUtils";
import { decomposeTransform } from "./ifc/GeometryUtils";
import { addWall } from "./ifc/WallExporter";
import { addDoor } from "./ifc/DoorExporter";
import { addWindow } from "./ifc/WindowExporter";
import { addSpace, type RoomSection } from "./ifc/SpaceExporter";

// ─── Local type definitions ───────────────────────────────────────────────────
//
// Defined locally to keep this module self-contained and avoid importing
// threeJSUtils.ts which pulls in backend/Supabase dependencies.

/** A 4×4 column-major transform matrix + bounding-box dimensions from RoomPlan. */
export interface Transform {
  transform: number[]; // 16-element column-major matrix
  dimensions: number[]; // [length, height, depth]
  identifier?: string;
}

/** Top-level scan record returned by the RoomPlan parser. */
export interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
  sections?: RoomSection[];
}

// ─── Main export function ─────────────────────────────────────────────────────

/**
 * Convert a RoomPlan scan into a valid IFC4 Blob ready for download.
 *
 * The function is async to allow future integration with WASM-based IFC
 * validators without requiring a breaking API change.
 *
 * @param scan - Parsed scan data from the application's internal model.
 * @returns A Blob containing the IFC4 STEP file content.
 */
export async function exportScanToIFC(scan: Scan): Promise<Blob> {
  const w = new IfcWriter();
  const projectName = scan.name || "RoomPlan Export";

  // ── 1. Owner / application metadata ──────────────────────────────────────────

  // IfcOrganization: the company that produced the file
  const orgId = w.nextId();
  w.entity(
    orgId,
    "IFCORGANIZATION",
    NIL, // Identification (optional)
    str("Omicity"), // Name (required)
    NIL, // Description
    NIL, // Roles
    NIL, // Addresses
  );

  // IfcPerson: author (all optional for automated export)
  const personId = w.nextId();
  w.entity(
    personId,
    "IFCPERSON",
    NIL,
    NIL,
    NIL, // Identification, FamilyName, GivenName
    NIL,
    NIL,
    NIL, // MiddleNames, PrefixTitles, SuffixTitles
    NIL, // Roles
    NIL, // Addresses
  );

  // IfcPersonAndOrganization: links person to org
  const personOrgId = w.nextId();
  w.entity(
    personOrgId,
    "IFCPERSONANDORGANIZATION",
    ref(personId),
    ref(orgId),
    NIL,
  );

  // IfcApplication: identifies the software that created the file
  const appId = w.nextId();
  w.entity(
    appId,
    "IFCAPPLICATION",
    ref(orgId), // ApplicationDeveloper
    str("1.0"), // Version
    str("Omicity IFC Exporter"), // ApplicationFullName
    str("OmicityIFCExporter"), // ApplicationIdentifier
  );

  // IfcOwnerHistory: records who created the file and when
  // CreationDate is an INTEGER (Unix timestamp) — no decimal point, no quotes
  const creationTime = Math.floor(Date.now() / 1000);
  const ownerHistoryId = w.nextId();
  w.entity(
    ownerHistoryId,
    "IFCOWNERHISTORY",
    ref(personOrgId), // OwningUser
    ref(appId), // OwningApplication
    NIL, // State
    en("ADDED"), // ChangeAction
    NIL, // LastModifiedDate
    NIL, // LastOwningUser
    NIL, // LastOwningApplication
    creationTime.toString(), // CreationDate  (integer — no decimal suffix)
  );

  // ── 2. Units ──────────────────────────────────────────────────────────────────
  //
  // All quantities are in SI base units (metres, square metres, radians).
  // The first parameter of IfcSIUnit is a derived attribute (*) in IFC4.

  const unitLengthId = w.nextId();
  w.entity(unitLengthId, "IFCSIUNIT", DRV, en("LENGTHUNIT"), NIL, en("METRE"));

  const unitAreaId = w.nextId();
  w.entity(
    unitAreaId,
    "IFCSIUNIT",
    DRV,
    en("AREAUNIT"),
    NIL,
    en("SQUARE_METRE"),
  );

  const unitVolumeId = w.nextId();
  w.entity(
    unitVolumeId,
    "IFCSIUNIT",
    DRV,
    en("VOLUMEUNIT"),
    NIL,
    en("CUBIC_METRE"),
  );

  const unitAngleId = w.nextId();
  w.entity(
    unitAngleId,
    "IFCSIUNIT",
    DRV,
    en("PLANEANGLEUNIT"),
    NIL,
    en("RADIAN"),
  );

  // IfcUnitAssignment: attaches the unit set to the project
  const unitAssignmentId = w.nextId();
  w.entity(
    unitAssignmentId,
    "IFCUNITASSIGNMENT",
    refList([unitLengthId, unitAreaId, unitVolumeId, unitAngleId]),
  );

  // ── 3. Geometric representation context ──────────────────────────────────────
  //
  // IfcGeometricRepresentationContext defines the 3D coordinate space.
  // The world coordinate system is Z-up, X-East, Y-North.

  const worldOriginId = w.nextId();
  w.entity(worldOriginId, "IFCCARTESIANPOINT", pt3(0, 0, 0));

  // Explicit Z-up axis and X-East RefDirection for the world coordinate system
  const worldAxisZId = w.nextId();
  w.entity(worldAxisZId, "IFCDIRECTION", pt3(0, 0, 1));

  const worldAxisXId = w.nextId();
  w.entity(worldAxisXId, "IFCDIRECTION", pt3(1, 0, 0));

  const worldPlacementId = w.nextId();
  w.entity(
    worldPlacementId,
    "IFCAXIS2PLACEMENT3D",
    ref(worldOriginId),
    ref(worldAxisZId),
    ref(worldAxisXId),
  );

  // 3D model context (parent of all sub-contexts)
  const geoContextId = w.nextId();
  w.entity(
    geoContextId,
    "IFCGEOMETRICREPRESENTATIONCONTEXT",
    str("Model"), // ContextIdentifier
    str("Model"), // ContextType
    "3", // CoordinateSpaceDimension
    "1.0E-5", // Precision
    ref(worldPlacementId), // WorldCoordinateSystem
    NIL, // TrueNorth
  );

  // 'Body' sub-context used for SweptSolid geometry representations
  // CoordinateSpaceDimension and Precision are DERIVED in IfcGeometricRepresentationSubContext
  const bodyContextId = w.nextId();
  w.entity(
    bodyContextId,
    "IFCGEOMETRICREPRESENTATIONSUBCONTEXT",
    str("Body"), // ContextIdentifier
    str("Model"), // ContextType
    DRV, // CoordinateSpaceDimension (derived from parent)
    DRV, // Precision (derived from parent)
    ref(geoContextId), // ParentContext
    NIL, // TargetScale
    en("MODEL_VIEW"), // TargetView
    NIL, // UserDefinedTargetView
  );

  // ── 4. IfcProject ─────────────────────────────────────────────────────────────
  //
  // IfcProject is the root of the spatial hierarchy.
  // Attributes: GlobalId, OwnerHistory, Name, Description, ObjectType,
  //             LongName, Phase, RepresentationContexts, UnitsInContext

  const projectId = w.nextId();
  w.entity(
    projectId,
    "IFCPROJECT",
    str(guid()), // GlobalId
    ref(ownerHistoryId), // OwnerHistory
    str(projectName), // Name
    NIL, // Description
    NIL, // ObjectType
    NIL, // LongName
    NIL, // Phase
    refList([geoContextId]), // RepresentationContexts
    ref(unitAssignmentId), // UnitsInContext
  );

  // ── 5. IfcSite ────────────────────────────────────────────────────────────────
  //
  // IfcSite attributes (14 total):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation, LongName, CompositionType,
  //   RefLatitude, RefLongitude, RefElevation, LandTitleNumber, SiteAddress

  const siteOriginId = w.nextId();
  w.entity(siteOriginId, "IFCCARTESIANPOINT", pt3(0, 0, 0));

  const sitePlacement3DId = w.nextId();
  w.entity(
    sitePlacement3DId,
    "IFCAXIS2PLACEMENT3D",
    ref(siteOriginId),
    NIL,
    NIL,
  );

  // Site has no parent placement (top of hierarchy) → PlacementRelTo = $
  const sitePlacementId = w.nextId();
  w.entity(sitePlacementId, "IFCLOCALPLACEMENT", NIL, ref(sitePlacement3DId));

  const siteId = w.nextId();
  w.entity(
    siteId,
    "IFCSITE",
    str(guid()),
    ref(ownerHistoryId),
    str("Site"),
    NIL,
    NIL,
    ref(sitePlacementId),
    NIL,
    NIL,
    en("ELEMENT"),
    NIL,
    NIL,
    NIL,
    NIL,
    NIL, // RefLatitude…SiteAddress (all optional)
  );

  // IfcRelAggregates: Project → Site
  const relProjectSiteId = w.nextId();
  w.entity(
    relProjectSiteId,
    "IFCRELAGGREGATES",
    str(guid()),
    ref(ownerHistoryId),
    str("ProjectContainsSite"),
    NIL,
    ref(projectId), // RelatingObject
    refList([siteId]), // RelatedObjects
  );

  // ── 6. IfcBuilding ────────────────────────────────────────────────────────────
  //
  // IfcBuilding attributes (12 total):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation, LongName, CompositionType,
  //   ElevationOfRefHeight, ElevationOfTerrain, BuildingAddress

  const buildingOriginId = w.nextId();
  w.entity(buildingOriginId, "IFCCARTESIANPOINT", pt3(0, 0, 0));

  const buildingPlacement3DId = w.nextId();
  w.entity(
    buildingPlacement3DId,
    "IFCAXIS2PLACEMENT3D",
    ref(buildingOriginId),
    NIL,
    NIL,
  );

  const buildingPlacementId = w.nextId();
  w.entity(
    buildingPlacementId,
    "IFCLOCALPLACEMENT",
    ref(sitePlacementId),
    ref(buildingPlacement3DId),
  );

  const buildingId = w.nextId();
  w.entity(
    buildingId,
    "IFCBUILDING",
    str(guid()),
    ref(ownerHistoryId),
    str(projectName),
    NIL,
    NIL,
    ref(buildingPlacementId),
    NIL,
    NIL,
    en("ELEMENT"),
    NIL,
    NIL,
    NIL, // ElevationOfRefHeight, ElevationOfTerrain, BuildingAddress
  );

  // IfcRelAggregates: Site → Building
  const relSiteBuildingId = w.nextId();
  w.entity(
    relSiteBuildingId,
    "IFCRELAGGREGATES",
    str(guid()),
    ref(ownerHistoryId),
    str("SiteContainsBuilding"),
    NIL,
    ref(siteId),
    refList([buildingId]),
  );

  // ── 7. IfcBuildingStorey (Ground Floor) ───────────────────────────────────────
  //
  // IfcBuildingStorey attributes (10 total):
  //   GlobalId, OwnerHistory, Name, Description, ObjectType,
  //   ObjectPlacement, Representation, LongName, CompositionType, Elevation

  const storeyOriginId = w.nextId();
  w.entity(storeyOriginId, "IFCCARTESIANPOINT", pt3(0, 0, 0));

  const storeyPlacement3DId = w.nextId();
  w.entity(
    storeyPlacement3DId,
    "IFCAXIS2PLACEMENT3D",
    ref(storeyOriginId),
    NIL,
    NIL,
  );

  const storeyPlacementId = w.nextId();
  w.entity(
    storeyPlacementId,
    "IFCLOCALPLACEMENT",
    ref(buildingPlacementId),
    ref(storeyPlacement3DId),
  );

  const storeyId = w.nextId();
  w.entity(
    storeyId,
    "IFCBUILDINGSTOREY",
    str(guid()),
    ref(ownerHistoryId),
    str("Ground Floor"),
    NIL,
    NIL,
    ref(storeyPlacementId),
    NIL,
    str("00"), // LongName
    en("ELEMENT"), // CompositionType
    num(0), // Elevation = 0.0 m
  );

  // IfcRelAggregates: Building → Storey
  const relBuildingStoreyId = w.nextId();
  w.entity(
    relBuildingStoreyId,
    "IFCRELAGGREGATES",
    str(guid()),
    ref(ownerHistoryId),
    str("BuildingContainsStorey"),
    NIL,
    ref(buildingId),
    refList([storeyId]),
  );

  // ── 8. Floor-level normalisation ─────────────────────────────────────────────
  //
  // RoomPlan stores wall centres at approximately Y = −0.24 m (vertical) with
  // a height of ~2.84 m, which places the floor at Y ≈ −1.66 m in the scan's
  // coordinate system.  If we pass these coordinates straight to IFC the walls
  // appear ~1.66 m underground relative to the IfcBuildingStorey (elevation 0).
  //
  // Fix: find the lowest floor face across every physical element and shift all
  // element Z positions upward so that the floor sits exactly at IFC Z = 0.
  // The same offset is applied to IfcSpace entities so everything stays aligned.

  const allScanElements: Transform[] = [
    ...(scan.walls || []),
    ...(scan.doors || []),
    ...(scan.openings || []),
    ...(scan.windows || []),
  ];

  let zOffset = 0;
  if (allScanElements.length > 0) {
    const floorLevels = allScanElements.map((el) => {
      const h = el.dimensions[1] > 0 ? el.dimensions[1] : 2.5;
      // Three.js Y centre (= IFC Z centre) minus half the height = floor face
      return el.transform[13] - h / 2;
    });
    const minFloor = Math.min(...floorLevels);
    // Shift every element up so the lowest floor is at IFC Z = 0
    zOffset = -minFloor;
  }

  // ── 9. Physical elements ──────────────────────────────────────────────────────
  //
  // Physical elements (walls, doors, windows) are contained in the storey via
  // IfcRelContainedInSpatialStructure.

  const containedIds: number[] = [];

  // Walls → IfcWall (.STANDARD.)
  w.comment("Walls");
  (scan.walls || []).forEach((wall, i) => {
    const el = decomposeTransform(wall.transform, wall.dimensions, 0.2);
    // Apply floor-level normalisation to vertical position
    el.z += zOffset;
    el.zFloor += zOffset;
    const id = addWall(
      w,
      el,
      storeyPlacementId,
      bodyContextId,
      ownerHistoryId,
      i,
    );
    containedIds.push(id);
  });

  // Doors → IfcDoor (.DOOR.)
  w.comment("Doors");
  (scan.doors || []).forEach((door, i) => {
    const el = decomposeTransform(door.transform, door.dimensions, 0.05);
    el.z += zOffset;
    el.zFloor += zOffset;
    const id = addDoor(
      w,
      el,
      storeyPlacementId,
      bodyContextId,
      ownerHistoryId,
      i,
    );
    containedIds.push(id);
  });

  // Openings → exported as IfcDoor (open archways / passthrough openings)
  w.comment("Openings (as IfcDoor)");
  const doorOffset = scan.doors?.length ?? 0;
  (scan.openings || []).forEach((opening, i) => {
    const el = decomposeTransform(opening.transform, opening.dimensions, 0.05);
    el.z += zOffset;
    el.zFloor += zOffset;
    const id = addDoor(
      w,
      el,
      storeyPlacementId,
      bodyContextId,
      ownerHistoryId,
      doorOffset + i,
    );
    containedIds.push(id);
  });

  // Windows → IfcWindow (.WINDOW.)
  w.comment("Windows");
  (scan.windows || []).forEach((win, i) => {
    const el = decomposeTransform(win.transform, win.dimensions, 0.05);
    el.z += zOffset;
    el.zFloor += zOffset;
    const id = addWindow(
      w,
      el,
      storeyPlacementId,
      bodyContextId,
      ownerHistoryId,
      i,
    );
    containedIds.push(id);
  });

  // ── 10. Spaces ────────────────────────────────────────────────────────────────
  //
  // Spaces (IfcSpace) are spatial structure elements — they belong to the storey
  // via IfcRelAggregates, NOT via IfcRelContainedInSpatialStructure.
  // Pass zOffset so their vertical position matches the normalised elements.

  w.comment("Spaces");
  const spaceIds: number[] = [];
  (scan.sections || []).forEach((section, i) => {
    const id = addSpace(
      w,
      section,
      storeyPlacementId,
      ownerHistoryId,
      i,
      zOffset,
    );
    spaceIds.push(id);
  });

  // ── 11. Containment relationships ────────────────────────────────────────────

  // IfcRelContainedInSpatialStructure: storey contains all physical elements
  if (containedIds.length > 0) {
    const relContainsId = w.nextId();
    w.entity(
      relContainsId,
      "IFCRELCONTAINEDINSPATIALSTRUCTURE",
      str(guid()),
      ref(ownerHistoryId),
      str("StoreyContainsElements"),
      NIL,
      refList(containedIds), // RelatedElements
      ref(storeyId), // RelatingStructure
    );
  }

  // IfcRelAggregates: storey aggregates spaces
  if (spaceIds.length > 0) {
    const relSpacesId = w.nextId();
    w.entity(
      relSpacesId,
      "IFCRELAGGREGATES",
      str(guid()),
      ref(ownerHistoryId),
      str("StoreyContainsSpaces"),
      NIL,
      ref(storeyId), // RelatingObject
      refList(spaceIds), // RelatedObjects
    );
  }

  // ── 12. Serialise ─────────────────────────────────────────────────────────────

  const step = w.serialize(projectName);
  return new Blob([step], { type: "application/x-step" });
}

// ─── Download helper ──────────────────────────────────────────────────────────

/**
 * Trigger a browser file download for a Blob.
 *
 * @param blob     - The file content.
 * @param filename - Suggested file name (e.g. "RoomPlan.ifc").
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
