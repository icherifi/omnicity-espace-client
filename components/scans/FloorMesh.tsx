"use client";

import React, { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { FloorMaterialInfo, RoomShellInfo } from "./stagingTypes";

/**
 * The direct Three.js-property equivalent of the old Blender Mapping-node tiling
 * math: a mesh following the room's real floor contour (RoomPlan's own
 * `floors[].polygonCorners`, one loop per floor "island"), textured with repeat
 * computed from the material's real-world tile size. Falls back to a bounding-box
 * rectangle only if no polygon data is available (older/malformed scan) - that
 * rectangle is what used to overflow past the walls on any non-rectangular room.
 */
export const FloorMesh: React.FC<{
  room: RoomShellInfo;
  material: FloorMaterialInfo;
  onSettled?: () => void;
}> = ({ room, material, onSettled }) => {
  const [diffuseMap, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    material.diffuse_path,
    material.normal_path,
    material.roughness_path,
  ]);

  const spanX = room.bounds_max[0] - room.bounds_min[0];
  const spanZ = room.bounds_max[2] - room.bounds_min[2];
  const centerX = (room.bounds_max[0] + room.bounds_min[0]) / 2;
  const centerZ = (room.bounds_max[2] + room.bounds_min[2]) / 2;
  const floorY = room.bounds_min[1];

  const tileWidthM = material.tile_size_cm[0] / 100;
  const tileHeightM = material.tile_size_cm[1] / 100;
  const repeatX = Math.max(spanX / tileWidthM, 0.01);
  const repeatZ = Math.max(spanZ / tileHeightM, 0.01);

  useEffect(() => {
    for (const tex of [diffuseMap, normalMap, roughnessMap]) {
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatZ);
      tex.needsUpdate = true;
    }
  }, [diffuseMap, normalMap, roughnessMap, repeatX, repeatZ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onSettled?.(), []);

  const hasPolygon = room.floor_polygons.length > 0;

  // After this mesh's [-90deg around X] rotation, a local (x, y, 0) point lands at
  // world (x, floorY, -y) - so to make a local point land at a given world (worldX,
  // worldZ), the shape must be built from (worldX, -worldZ), with the mesh itself
  // positioned at X=0/Z=0 (the polygon's points are already absolute world
  // coordinates, unlike the old centered-rectangle approach).
  const geometry = useMemo(() => {
    if (!hasPolygon) return null;
    const shapes = room.floor_polygons.map(
      (polygon) => new THREE.Shape(polygon.map(([x, z]) => new THREE.Vector2(x, -z)))
    );
    return new THREE.ShapeGeometry(shapes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.floor_polygons]);

  if (hasPolygon && geometry) {
    return (
      <mesh position={[0, floorY, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={geometry} receiveShadow>
        <meshStandardMaterial map={diffuseMap} normalMap={normalMap} roughnessMap={roughnessMap} />
      </mesh>
    );
  }

  return (
    <mesh position={[centerX, floorY, centerZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[spanX, spanZ]} />
      <meshStandardMaterial map={diffuseMap} normalMap={normalMap} roughnessMap={roughnessMap} />
    </mesh>
  );
};
