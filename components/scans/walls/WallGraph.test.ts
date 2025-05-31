import { plan000, plan001 } from "../exemple";
import { convertSourceScanToScan } from "../helper";
import { ScanSource, Wall } from "../interface";
import {
  buildWallGraph,
  findInducedCycles,
  findLargestAreaInducedCycle,
} from "./wallGraph";

describe("WallGraph induced cycles and interior walls", () => {
  it("should find induced cycles (rooms) and interior walls in plan000", () => {
    const wallList = convertSourceScanToScan(plan001 as any as ScanSource)
      .walls as Wall[];
    const { nodes } = buildWallGraph(wallList);

    const cycles = findInducedCycles(nodes);

    expect(Array.isArray(cycles)).toBe(true);
    expect(cycles.length).toBeGreaterThan(0);
    const cycleIds = cycles.map((c) => c.nodes.map((n) => n.wall.id));
    console.log("id of cycles", cycleIds);
    const maxCycle = findLargestAreaInducedCycle(cycles);
    expect(maxCycle?.nodes.map((n) => n.wall.id)).toEqual([
      0, 2, 9, 8, 5, 1, 10,
    ]);
  });
});
