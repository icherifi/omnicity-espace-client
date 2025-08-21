import { getScans } from "@/utils/handleProjectDetails";

export interface Transform {
  transform: number[];
  dimensions: number[];
}

export interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
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
};
