import * as THREE from "three";
import { RoomShellInfo } from "./stagingTypes";
import { Scan, Transform } from "./useTransform";

/** Mirrors roomShellService.ts's bounds computation on the backend (same RoomPlan
 * data, same convention: `dimensions` is the entity's full extent centered on its
 * own transform's origin). */
function entityWorldBox(entity: Transform): THREE.Box3 {
  const [w, h, d] = entity.dimensions;
  const halfW = w / 2;
  const halfH = h / 2;
  const halfD = d / 2;
  const matrix = new THREE.Matrix4().fromArray(entity.transform);
  const box = new THREE.Box3();
  const corners: [number, number, number][] = [
    [-halfW, -halfH, -halfD], [halfW, -halfH, -halfD], [-halfW, halfH, -halfD], [-halfW, -halfH, halfD],
    [halfW, halfH, -halfD], [halfW, -halfH, halfD], [-halfW, halfH, halfD], [halfW, halfH, halfD],
  ];
  for (const corner of corners) box.expandByPoint(new THREE.Vector3(...corner).applyMatrix4(matrix));
  return box;
}

export function computeRoomShellInfo(scanData: Scan): RoomShellInfo {
  const entities = [
    ...(scanData.walls ?? []),
    ...(scanData.doors ?? []),
    ...(scanData.windows ?? []),
    ...(scanData.openings ?? []),
    ...(scanData.objects ?? []),
  ];
  const box = new THREE.Box3();
  for (const entity of entities) box.union(entityWorldBox(entity));

  return {
    bounds_min: [box.min.x, box.min.y, box.min.z],
    bounds_max: [box.max.x, box.max.y, box.max.z],
    wall_object_names: (scanData.walls ?? []).map((w) => w.identifier ?? ""),
    floor_object_names: [],
    ceiling_object_names: [],
  };
}
