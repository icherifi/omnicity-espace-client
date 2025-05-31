import { Scan, ScanSource, Transform } from "./interface";
export const WALL_LENGTH_THRESHOLD = 0.8; // Minimum length for a wall to be considered valid
/**
 * Converts a ScanSource to a Scan, assigning unique ids to walls.
 */
export function convertSourceScanToScan(source: ScanSource): Scan {
  return {
    name: source.name,
    walls: (source.walls || [])
      .filter((wall: Transform) => wall.dimensions[0] >= WALL_LENGTH_THRESHOLD)
      .map((wall: Transform, idx: any) => ({
        ...wall,
        id: (wall as any).id !== undefined ? (wall as any).id : idx,
      })),
    doors: source.doors,
    openings: source.openings,
    windows: source.windows,
    objects: source.objects,
    sections: source.sections,
  };
}
