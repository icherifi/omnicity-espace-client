"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { FloorMaterialInfo, RoomShellInfo } from "./stagingTypes";

/**
 * The direct Three.js-property equivalent of the old Blender Mapping-node tiling
 * math: a plane spanning the room's floor bounds, textured with repeat computed
 * from the material's real-world tile size.
 */
export const FloorMesh: React.FC<{ room: RoomShellInfo; material: FloorMaterialInfo }> = ({
  room,
  material,
}) => {
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

  return (
    <mesh position={[centerX, floorY, centerZ]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[spanX, spanZ]} />
      <meshStandardMaterial map={diffuseMap} normalMap={normalMap} roughnessMap={roughnessMap} />
    </mesh>
  );
};
