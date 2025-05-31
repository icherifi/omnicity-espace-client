import { WallGraphNode, WallGraphEdge, Cycle } from "./interface";
import { Scan, Wall } from "../interface";

// --- Helper functions ---

function getWallCenter2D(wall: Wall): [number, number] {
  return [wall.transform[14], wall.transform[12]];
}

function getWallEndpoints2D(wall: Wall): [[number, number], [number, number]] {
  const [cx, cy] = getWallCenter2D(wall);
  const length = wall.dimensions[0];
  const transform = wall.transform;
  const angle = Math.atan2(transform[0], -transform[8]);
  const halfLen = length / 2;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  return [
    [cx - dx * halfLen, cy - dy * halfLen],
    [cx + dx * halfLen, cy + dy * halfLen],
  ];
}

function wallsOverlap2D(wallA: Wall, wallB: Wall, tolerance = 0.1): boolean {
  const [a1, a2] = getWallEndpoints2D(wallA);
  const [b1, b2] = getWallEndpoints2D(wallB);

  function segmentsTouchOrOverlap(
    p1: [number, number],
    p2: [number, number],
    q1: [number, number],
    q2: [number, number]
  ): boolean {
    const dist = (u: [number, number], v: [number, number]) =>
      Math.hypot(u[0] - v[0], u[1] - v[1]);
    if (
      dist(p1, q1) < tolerance ||
      dist(p1, q2) < tolerance ||
      dist(p2, q1) < tolerance ||
      dist(p2, q2) < tolerance
    ) {
      return true;
    }
    function ccw(
      A: [number, number],
      B: [number, number],
      C: [number, number]
    ) {
      return (C[1] - A[1]) * (B[0] - A[0]) > (B[1] - A[1]) * (C[0] - A[0]);
    }
    return (
      ccw(p1, q1, q2) !== ccw(p2, q1, q2) && ccw(p1, p2, q1) !== ccw(p1, p2, q2)
    );
  }

  return segmentsTouchOrOverlap(a1, a2, b1, b2);
}

// --- Graph construction ---

export function buildWallGraph(walls: Wall[]): {
  nodes: WallGraphNode[];
} {
  // Create a node for each wall (center)
  const nodes: WallGraphNode[] = walls.map((wall) => ({
    wall,
    x: getWallCenter2D(wall)[0],
    y: getWallCenter2D(wall)[1],
    edges: [],
  }));

  // Create edges between nodes whose walls touch/overlap
  for (let i = 0; i < walls.length; ++i) {
    for (let j = i + 1; j < walls.length; ++j) {
      if (wallsOverlap2D(walls[i], walls[j])) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];
        const edge: WallGraphEdge = {
          node1: nodeA,
          node2: nodeB,
        };
        nodeA.edges.push(edge);
        nodeB.edges.push(edge);
      }
    }
  }
  return { nodes };
}

// --- Cycle and Room detection ---

export function findInducedCycles(nodes: WallGraphNode[]): Cycle[] {
  // Johnson's algorithm for simple cycles, then filter for induced cycles
  const cycles: Cycle[] = [];
  const blocked = new Set<WallGraphNode>();
  const B = new Map<WallGraphNode, Set<WallGraphNode>>();
  const stack: WallGraphNode[] = [];

  function unblock(u: WallGraphNode) {
    blocked.delete(u);
    if (B.has(u)) {
      for (const w of Array.from(B.get(u)!)) {
        if (blocked.has(w)) unblock(w);
      }
      B.set(u, new Set());
    }
  }

  function circuit(
    v: WallGraphNode,
    s: WallGraphNode,
    visited: Set<WallGraphNode>
  ): boolean {
    let closed = false;
    stack.push(v);
    blocked.add(v);
    visited.add(v);

    for (const edge of v.edges) {
      const w = edge.node1 === v ? edge.node2 : edge.node1;
      if (w === s && stack.length > 2) {
        const cycleNodes = [...stack];
        cycles.push({ nodes: cycleNodes.slice() });
        closed = true;
      } else if (!blocked.has(w) && !visited.has(w)) {
        if (circuit(w, s, visited)) closed = true;
      }
    }

    if (closed) {
      unblock(v);
    } else {
      for (const edge of v.edges) {
        const w = edge.node1 === v ? edge.node2 : edge.node1;
        if (!B.has(w)) B.set(w, new Set());
        B.get(w)!.add(v);
      }
    }
    stack.pop();
    visited.delete(v);
    return closed;
  }

  const allNodes = nodes.slice();
  for (let i = 0; i < allNodes.length; ++i) {
    const s = allNodes[i];
    blocked.clear();
    B.clear();
    const visited = new Set<WallGraphNode>();
    circuit(s, s, visited);
  }

  // Remove duplicate cycles (cycles with same set of nodes)
  const unique: Cycle[] = [];
  const seen = new Set<string>();
  for (const c of cycles) {
    const key = c.nodes
      .map((n) => `${n.x.toFixed(5)},${n.y.toFixed(5)}`)
      .sort()
      .join("|");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(c);
    }
  }
  return unique;
}
/**
 * Compute the area of a cycle (polygon) using the wall centers as vertices.
 */
function computeCycleArea(cycle: Cycle): number {
  const pts = cycle.nodes.map((n) => [n.x, n.y]);
  let area = 0;
  const n = pts.length;
  for (let i = 0; i < n; ++i) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % n];
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area) / 2;
}

/**
 * Returns the induced cycle with the largest area.
 */
export function findLargestAreaInducedCycle(
  cycles: Cycle[]
): Cycle | undefined {
  if (!cycles.length) return undefined;
  let maxArea = -Infinity;
  let maxCycle: Cycle | undefined = undefined;
  for (const cycle of cycles) {
    const area = computeCycleArea(cycle);
    if (area > maxArea) {
      maxArea = area;
      maxCycle = cycle;
    }
  }
  return maxCycle;
}

export function findExteriorWalls(walls: Wall[]): Wall[] {
  const wallGraph = buildWallGraph(walls);
  const cycles = findInducedCycles(wallGraph.nodes);

  // Find the largest cycle (assumed to be the exterior)
  const exteriorCycle = findLargestAreaInducedCycle(cycles);
  if (!exteriorCycle) return [];

  // Collect all walls in the exterior cycle
  const exteriorWalls = new Set<Wall>();
  for (const node of exteriorCycle.nodes) {
    exteriorWalls.add(node.wall);
  }

  return Array.from(exteriorWalls);
}
