import { Wall } from "../interface";

export interface WallGraphNode {
  wall: Wall;
  x: number;
  y: number;
  edges: WallGraphEdge[];
}

export interface WallGraphEdge {
  node1: WallGraphNode;
  node2: WallGraphNode;
}

export type Cycle = {
  nodes: WallGraphNode[];
};
