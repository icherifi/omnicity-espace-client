"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RoomShell } from "./RoomShell";
import { FloorMesh } from "./FloorMesh";
import { FurnitureModel } from "./FurnitureModel";
import { computeRoomShellInfo } from "./roomBounds";
import { Scan, Transform } from "./useTransform";
import { StagingAction } from "./stagingTypes";

function resolveWallColor(actions: StagingAction[], wall: Transform): string | undefined {
  let color: string | undefined;
  for (const action of actions) {
    if (action.type !== "wall_color") continue;
    const matchesAll = action.wall_object_names === "all";
    const matchesSpecific =
      !!wall.identifier &&
      Array.isArray(action.wall_object_names) &&
      action.wall_object_names.includes(wall.identifier);
    if (matchesAll || matchesSpecific) color = action.hex_color;
  }
  return color;
}

function findFloorMaterial(actions: StagingAction[]) {
  for (let i = actions.length - 1; i >= 0; i--) {
    const action = actions[i];
    if (action.type === "floor_material") return action;
  }
  return null;
}

function isFurnitureAction(
  action: StagingAction
): action is Extract<StagingAction, { type: "place" | "replace" }> {
  return action.type === "place" || action.type === "replace";
}

/**
 * Composes the staged scene live from data instead of loading one exported 3D
 * file: room shell (same rendering as the "Plan" tab), a floor plane textured per
 * the last floor_material action, one real IKEA model per place/replace action,
 * and wall color applied directly as a material property. Used both for the real
 * viewer and (via the hidden /internal/staging-render route) for Claude's own
 * headless self-check screenshot - same component, same result either way.
 */
export const StagedSceneRenderer: React.FC<{
  scanData: Scan;
  actions: StagingAction[];
  apiBaseUrl: string;
}> = ({ scanData, actions, apiBaseUrl }) => {
  const room = computeRoomShellInfo(scanData);
  const floorMaterial = findFloorMaterial(actions);
  const furnitureActions = actions.filter(isFurnitureAction);

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        <RoomShell
          scanData={scanData}
          is3D
          wallColor={(wall) => resolveWallColor(actions, wall)}
        />

        {floorMaterial && (
          <FloorMesh
            room={room}
            material={{
              diffuse_path: floorMaterial.diffuse_path,
              normal_path: floorMaterial.normal_path,
              roughness_path: floorMaterial.roughness_path,
              tile_size_cm: floorMaterial.tile_size_cm,
            }}
          />
        )}

        {furnitureActions.map((action, i) => (
          <FurnitureModel
            key={`${action.item_no}-${i}`}
            itemNo={action.item_no}
            position={action.position ?? [0, 0, 0]}
            rotationYDegrees={action.rotation_y_degrees ?? 0}
            apiBaseUrl={apiBaseUrl}
          />
        ))}

        <OrbitControls enablePan enableZoom enableRotate target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
};
