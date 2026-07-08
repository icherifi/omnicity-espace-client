/**
 * Geometry utilities for converting RoomPlan transform matrices
 * into IFC-compatible position and orientation values.
 *
 * ─── Coordinate system mapping ────────────────────────────────────────────────
 *
 *   Three.js (Y-up, right-handed)   →   IFC 4 (Z-up, right-handed)
 *   ─────────────────────────────       ──────────────────────────────
 *   X  (East / West)                →   X  (East / West)
 *   Y  (vertical / up)              →   Z  (vertical / up)
 *   Z  (North / South / depth)      →   Y  (North / South / depth)
 *
 * This is the standard Y-up → Z-up transformation used by IFC, Revit,
 * ArchiCAD and other BIM tools.
 *
 * ─── RoomPlan transform matrix layout ─────────────────────────────────────────
 *
 * RoomPlan stores 4×4 matrices in column-major order (same as Three.js):
 *
 *   index:  [0 ] [4 ] [8 ] [12]    →  column 0 = local X axis  +  Tx
 *           [1 ] [5 ] [9 ] [13]    →  column 1 = local Y axis  +  Ty
 *           [2 ] [6 ] [10] [14]    →  column 2 = local Z axis  +  Tz
 *           [3 ] [7 ] [11] [15]    →  homogeneous row (0 0 0 1)
 *
 * Translation:  t[12] = Tx (X),  t[13] = Ty (Y = up),  t[14] = Tz (Z)
 * Local X axis: (t[0], t[1], t[2])
 */

// ─── Types ─────────────────────────────────────────────────────────────────────

/**
 * Decomposed element transform expressed in IFC coordinate space (Z-up).
 */
export interface ElementTransform {
  /** IFC X coordinate of the element's center */
  x: number;
  /** IFC Y coordinate of the element's center (= Three.js Z) */
  y: number;
  /** IFC Z coordinate of the element's vertical center (= Three.js Y) */
  z: number;
  /** IFC Z coordinate of the element's bottom face (floor / sill level) */
  zFloor: number;

  /**
   * X component of the element's primary horizontal direction (local X axis)
   * in the IFC XY floor plane.
   */
  dirX: number;
  /**
   * Y component of the element's primary horizontal direction (local X axis)
   * in the IFC XY floor plane.
   */
  dirY: number;

  /** Element length along its local X axis  (Three.js dimensions[0]) */
  length: number;
  /** Element height along the vertical axis (Three.js dimensions[1]) */
  height: number;
  /** Element depth / thickness              (Three.js dimensions[2] or 0.20 m) */
  depth: number;
}

// ─── Decomposition ─────────────────────────────────────────────────────────────

/**
 * Decompose a column-major 4×4 RoomPlan transform matrix into an
 * IFC-space ElementTransform.
 *
 * @param t                - 16-element column-major transform matrix
 * @param dims             - [length, height, depth] dimensions array
 * @param defaultThickness - Fallback depth value when dims[2] is 0 or absent
 */
export function decomposeTransform(
  t: number[],
  dims: number[],
  defaultThickness = 0.2,
): ElementTransform {
  // ── Extract Three.js world position ─────────────────────────────────────────
  const three_x = t[12]; // East/West
  const three_y = t[13]; // Up (vertical in Three.js)
  const three_z = t[14]; // North/South (depth in Three.js)

  // ── Convert to IFC Z-up coordinate space ────────────────────────────────────
  const x = three_x; // IFC X = Three.js X
  const y = three_z; // IFC Y = Three.js Z
  const z = three_y; // IFC Z = Three.js Y  (vertical)

  const length = dims[0] > 0 ? dims[0] : 1.0;
  const height = dims[1] > 0 ? dims[1] : 2.5;
  const depth = dims[2] > 0 ? dims[2] : defaultThickness;

  // Bottom face elevation in IFC Z (element center minus half its height)
  const zFloor = z - height / 2;

  // ── Rotation around the vertical axis ───────────────────────────────────────
  // Column 0 of the 4×4 matrix holds the local X axis in Three.js world space:
  //   local X = (t[0], t[1], t[2]) ≈ (cos θ, 0, −sin θ)
  //
  // Column 2 holds the local Z axis:
  //   local Z = (t[8], t[9], t[10]) ≈ (sin θ, 0, cos θ)
  //
  // Because of the Y-up rotation convention:
  //   t[0] = cos θ  (X-component of local X)
  //   t[2] = −sin θ (Z-component of local X)   ← this is what we need for IFC Y
  //   t[8] = +sin θ (X-component of local Z)   ← do NOT use this for the direction
  //
  // ─── Why NOT atan2 → sin/cos ──────────────────────────────────────────────
  // Using Math.sin(atan2(t[8], t[0])) yields +sin θ = t[8], which is the WRONG
  // sign.  We need the Z-component of the local X axis, i.e. t[2] = −sin θ.

  // Read the local X axis directly from the matrix (column 0, rows 0 and 2).
  // Normalise to guard against any accidental scale factor in the matrix.
  const wx = t[0]; // Three.js X-component of local X axis
  const wz = t[2]; // Three.js Z-component of local X axis
  const axisLen = Math.sqrt(wx * wx + wz * wz) || 1;

  // Map to IFC floor-plan axes (IFC Y = Three.js Z):
  const dirX = wx / axisLen; // IFC X-component of the element direction
  const dirY = wz / axisLen; // IFC Y-component (= Three.js Z-component, = −sin θ)

  return { x, y, z, zFloor, dirX, dirY, length, height, depth };
}

// ─── Spatial helpers ──────────────────────────────────────────────────────────

/**
 * Euclidean distance between two elements in the IFC XY floor plane.
 * Ignores height (Z) — useful for matching doors / windows to the nearest wall.
 */
export function dist2D(a: ElementTransform, b: ElementTransform): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * Find the index of the closest wall (by 2D floor-plan distance) to the given element.
 *
 * @returns Wall index, or -1 if the walls array is empty.
 */
export function findClosestWall(
  element: ElementTransform,
  walls: ElementTransform[],
): number {
  if (walls.length === 0) return -1;
  let minDist = Infinity;
  let minIdx = 0;
  for (let i = 0; i < walls.length; i++) {
    const d = dist2D(element, walls[i]);
    if (d < minDist) {
      minDist = d;
      minIdx = i;
    }
  }
  return minIdx;
}
