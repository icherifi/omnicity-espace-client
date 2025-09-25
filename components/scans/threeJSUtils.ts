import { getScans } from "@/utils/handleProjectDetails";

export interface Transform {
  transform: number[];
  dimensions: number[];
  identifier?: string;
}

export interface RoomSection {
  center: [number, number, number];
  label: string;
  story: number;
}

export interface WallAssignment {
  wallIndex: number;
  roomLabel: string;
}

export interface RoomAreaData {
  roomLabel: string;
  area: number;
  wallIndices: number[];
  center: [number, number, number];
}

export interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
  sections?: RoomSection[];
}

/**
 * Fetch and parse scan data from the database
 * @param projectId - The project ID to fetch scans for
 * @returns Promise<Scan | null> - The parsed scan data or null if no scans available
 */
export async function fetchScanData(projectId: string): Promise<Scan | null> {
  try {
    const scans: any = await getScans(projectId);

    if (scans && scans[0] !== undefined) {
      console.log("First scan:", scans[0]);
      const plans: Scan = JSON.parse(scans[0].serialized);
      console.log("Parsed plan:", plans);
      return plans;
    } else {
      console.log("No scans available for project:", projectId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching scan data:", error);
    return null;
  }
}

/**
 * Calculate the bounding box of all elements in the scan
 * @param scanData - The scan data
 * @returns Bounding box with min/max coordinates
 */
export function calculateBoundingBox(scanData: Scan) {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  const allElements = [
    ...(scanData.walls || []),
    ...(scanData.doors || []),
    ...(scanData.windows || []),
    ...(scanData.openings || []),
    ...(scanData.objects || []),
  ];

  allElements.forEach((element) => {
    const matrix = element.transform;
    const x = matrix[14];
    const y = matrix[13];
    const z = matrix[12];

    const width = element.dimensions[0] || 0;
    const height = element.dimensions[1] || 0;
    const depth = element.dimensions[2] || 0;

    minX = Math.min(minX, x - width / 2);
    maxX = Math.max(maxX, x + width / 2);
    minY = Math.min(minY, y - height / 2);
    maxY = Math.max(maxY, y + height / 2);
    minZ = Math.min(minZ, z - depth / 2);
    maxZ = Math.max(maxZ, z + depth / 2);
  });

  return {
    min: { x: minX, y: minY, z: minZ },
    max: { x: maxX, y: maxY, z: maxZ },
    center: {
      x: (minX + maxX) / 2,
      y: (minY + maxY) / 2,
      z: (minZ + maxZ) / 2,
    },
    size: {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ,
    },
  };
}

/**
 * Extract wall corner points from transform matrix and dimensions
 * @param wall - Wall transform data
 * @returns Array of corner points [x, z] (we use X-Z plane for 2D calculations)
 */
export function getWallCorners(wall: Transform): [number, number][] {
  const matrix = wall.transform;
  const centerX = matrix[12];
  const centerZ = matrix[14];
  const width = wall.dimensions[0];
  const depth = wall.dimensions[2] || 0.2; // Default wall thickness

  // Calculate rotation from transform matrix
  const rotationY = Math.atan2(matrix[8], matrix[0]);

  // Calculate corner offsets
  const halfWidth = width / 2;
  const halfDepth = depth / 2;

  const cos = Math.cos(rotationY);
  const sin = Math.sin(rotationY);

  // Calculate the 4 corners of the wall
  const corners: [number, number][] = [
    [
      centerX + (-halfWidth * cos - halfDepth * sin),
      centerZ + (-halfWidth * sin + halfDepth * cos),
    ],
    [
      centerX + (halfWidth * cos - halfDepth * sin),
      centerZ + (halfWidth * sin + halfDepth * cos),
    ],
    [
      centerX + (halfWidth * cos + halfDepth * sin),
      centerZ + (halfWidth * sin - halfDepth * cos),
    ],
    [
      centerX + (-halfWidth * cos + halfDepth * sin),
      centerZ + (-halfWidth * sin - halfDepth * cos),
    ],
  ];

  return corners;
}

/**
 * Calculate room area using the Shoelace formula
 * @param wallIndices - Indices of walls belonging to the room
 * @param walls - Array of all walls
 * @returns Calculated area in square meters
 */
export function calculateRoomArea(
  wallIndices: number[],
  walls: Transform[]
): number {
  if (wallIndices.length < 3) {
    return 0; // Need at least 3 walls to form a room
  }

  // Get all corner points from selected walls
  const allCorners: [number, number][] = [];

  wallIndices.forEach((index) => {
    if (walls[index]) {
      const corners = getWallCorners(walls[index]);
      allCorners.push(...corners);
    }
  });

  if (allCorners.length < 3) {
    return 0;
  }

  // Find the convex hull or arrange points to form a polygon
  const orderedPoints = orderPointsForPolygon(allCorners);

  // Apply Shoelace formula
  let area = 0;
  const n = orderedPoints.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += orderedPoints[i][0] * orderedPoints[j][1];
    area -= orderedPoints[j][0] * orderedPoints[i][1];
  }

  return Math.abs(area) / 2;
}

/**
 * Order points to form a polygon (simple approach using center point)
 * @param points - Array of 2D points
 * @returns Ordered array of points forming a polygon
 */
function orderPointsForPolygon(points: [number, number][]): [number, number][] {
  if (points.length <= 3) {
    return points;
  }

  // Remove duplicate points
  const uniquePoints = points.filter(
    (point, index, arr) =>
      index ===
      arr.findIndex(
        (p) =>
          Math.abs(p[0] - point[0]) < 0.01 && Math.abs(p[1] - point[1]) < 0.01
      )
  );

  // Calculate center point
  const centerX =
    uniquePoints.reduce((sum, p) => sum + p[0], 0) / uniquePoints.length;
  const centerZ =
    uniquePoints.reduce((sum, p) => sum + p[1], 0) / uniquePoints.length;

  // Sort points by angle from center
  return uniquePoints.sort((a, b) => {
    const angleA = Math.atan2(a[1] - centerZ, a[0] - centerX);
    const angleB = Math.atan2(b[1] - centerZ, b[0] - centerX);
    return angleA - angleB;
  });
}

/**
 * Get room center from sections data
 * @param roomLabel - Label of the room
 * @param sections - Array of room sections
 * @returns Center coordinates [x, y, z] or null if not found
 */
export function getRoomCenter(
  roomLabel: string,
  sections?: RoomSection[]
): [number, number, number] | null {
  if (!sections) return null;

  const section = sections.find((s) => s.label === roomLabel);
  return section ? section.center : null;
}

/**
 * Get statistics about the scan data
 * @param scanData - The scan data
 * @returns Object with counts of different elements
 */
export function getScanStatistics(scanData: Scan) {
  return {
    walls: scanData.walls?.length || 0,
    doors: scanData.doors?.length || 0,
    windows: scanData.windows?.length || 0,
    openings: scanData.openings?.length || 0,
    objects: scanData.objects?.length || 0,
    total:
      (scanData.walls?.length || 0) +
      (scanData.doors?.length || 0) +
      (scanData.windows?.length || 0) +
      (scanData.openings?.length || 0) +
      (scanData.objects?.length || 0),
  };
}

/**
 * Example scan data for testing (from exemple.js)
 */
export const exampleScanData: Scan = {
  name: "Example Room",
  walls: [
    {
      transform: [
        -0.44632378, 0, -0.89487153, 0, 0, 1, 0, 0, 0.89487153, 0, -0.44632378,
        0, -2.0350027, -0.23865056, 1.1356161, 1,
      ],
      dimensions: [3.350705, 2.835, 0],
    },
    {
      transform: [
        0.44632378, 0, 0.8948716, 0, 0, 1, 0, 0, -0.8948716, 0, 0.44632378, 0,
        0.8478517, -0.23865056, -0.3022291, 1,
      ],
      dimensions: [3.3507054, 2.835, 0],
    },
    {
      transform: [
        0.8948715, 0, -0.44632384, 0, 0, 1, 0, 0, 0.4463238, 0, 0.8948715, 0,
        -1.3413252, -0.23865056, -1.0825319, 1,
      ],
      dimensions: [3.2215288, 2.835, 0],
    },
    {
      transform: [
        -0.8948715, 0, 0.44632375, 0, 0, 1, 0, 0, -0.44632372, 0, -0.8948715, 0,
        0.15417418, -0.23865056, 1.9159187, 1,
      ],
      dimensions: [3.2215288, 2.835, 0],
    },
  ],
  sections: [
    {
      center: [1.4446131, 0.031975597, -0.99556136],
      label: "bedroom",
      story: 0,
    },
    {
      label: "livingRoom",
      story: 0,
      center: [-1.2363299, 0.031975597, -2.4537501],
    },
    {
      label: "diningRoom",
      center: [-1.972178, 0.031975597, -0.7258907],
      story: 0,
    },
    {
      center: [-0.9855001, 0.031975597, 1.2543747],
      story: 0,
      label: "unidentified",
    },
  ],
};
