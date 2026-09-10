import { useMemo } from "react";
import * as THREE from "three";

export interface Transform {
  transform: number[];
  dimensions: number[];
  identifier?: string;
}

export interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
}

export interface DecomposedTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  dimensions: number[];
}

/**
 * Decomposes a RoomPlan Transform's raw 4x4 matrix into a position/rotation/
 * dimensions triple usable directly as R3F props. RoomPlan's data is already
 * Y-up, matching Three.js's own convention, so no axis remap happens here -
 * only the 2D top-down mode flattens Y to 0 (rotation is left untouched,
 * relying on the top-down camera to read as a plan).
 */
export function useTransform(transform: Transform, is3D: boolean): DecomposedTransform {
  return useMemo(() => {
    const matrix = new THREE.Matrix4().fromArray(transform.transform);

    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    matrix.decompose(position, quaternion, scale);

    const euler = new THREE.Euler().setFromQuaternion(quaternion);

    return {
      position: [position.x, is3D ? position.y : 0, position.z],
      rotation: [euler.x, euler.y, euler.z],
      dimensions: transform.dimensions,
    };
  }, [transform, is3D]);
}
