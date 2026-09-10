"use client";

import React, { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RoomShell } from "./RoomShell";
import { FloorMesh } from "./FloorMesh";
import { FurnitureModel } from "./FurnitureModel";
import { ScannedObjectFallback } from "./ScannedObjectFallback";
import { LoadErrorBoundary } from "./LoadErrorBoundary";
import { computeRoomShellInfo } from "./roomBounds";
import { Scan, Transform } from "./useTransform";
import { StagingAction } from "./stagingTypes";

/** Original scan objects a staging run never replaced (no IKEA equivalent - built-in
 * kitchen/bathroom fixtures) - anything NOT referenced by a replace action's
 * replaces_roomplan_identifier should still render, just not as a real IKEA model. */
function untouchedObjects(scanData: Scan, actions: StagingAction[]): Transform[] {
  const replacedIds = new Set(
    actions
      .filter((a): a is Extract<StagingAction, { type: "replace" }> => a.type === "replace")
      .map((a) => a.replaces_roomplan_identifier)
      .filter((id): id is string => !!id)
  );
  return (scanData.objects ?? []).filter((obj) => !obj.identifier || !replacedIds.has(obj.identifier));
}

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

/** Centers/frames the camera on the room's real bounds instead of a hardcoded
 * position that's wrong for any room not sitting near the world origin - mirrors
 * ThreeJSRenderer.tsx's own CameraController pattern. */
const CameraRig: React.FC<{ boundsMin: [number, number, number]; boundsMax: [number, number, number] }> = ({
  boundsMin,
  boundsMax,
}) => {
  const { camera } = useThree();
  useEffect(() => {
    const center = new THREE.Vector3(
      (boundsMin[0] + boundsMax[0]) / 2,
      (boundsMin[1] + boundsMax[1]) / 2,
      (boundsMin[2] + boundsMax[2]) / 2
    );
    const span = Math.max(boundsMax[0] - boundsMin[0], boundsMax[2] - boundsMin[2], 3);
    const offset = new THREE.Vector3(1, 0.9, 1).multiplyScalar(span * 0.6 + 2);
    camera.position.copy(center).add(offset);
    camera.up.set(0, 1, 0);
    camera.lookAt(center);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera, ...boundsMin, ...boundsMax]);
  return null;
};

/**
 * Composes the staged scene live from data instead of loading one exported 3D
 * file: room shell (same rendering as the "Plan" tab), a floor plane textured per
 * the last floor_material action, one real IKEA model per place/replace action,
 * and wall color applied directly as a material property. Used both for the real
 * viewer and (via the hidden /internal/staging-render route) for Claude's own
 * headless self-check screenshot - same component, same result either way.
 *
 * `onReady` fires once every async piece (floor texture, each furniture model)
 * has settled - loaded OR failed, a broken model must not hang it forever. The
 * headless render page uses this to know when it's safe to screenshot.
 */
export const StagedSceneRenderer: React.FC<{
  scanData: Scan;
  actions: StagingAction[];
  apiBaseUrl: string;
  onReady?: () => void;
}> = ({ scanData, actions, apiBaseUrl, onReady }) => {
  const room = computeRoomShellInfo(scanData);
  const floorMaterial = findFloorMaterial(actions);
  const furnitureActions = actions.filter(isFurnitureAction);
  const fallbackObjects = untouchedObjects(scanData, actions);

  const totalAsync = (floorMaterial ? 1 : 0) + furnitureActions.length;
  const settledCount = useRef(0);
  const firedReady = useRef(false);

  const markSettled = (error?: unknown) => {
    if (error) console.error("[StagedSceneRenderer] a scene resource failed to load:", error);
    settledCount.current += 1;
    if (settledCount.current >= totalAsync && !firedReady.current) {
      firedReady.current = true;
      onReady?.();
    }
  };

  useEffect(() => {
    if (totalAsync === 0 && !firedReady.current) {
      firedReady.current = true;
      onReady?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roomCenter: [number, number, number] = [
    (room.bounds_min[0] + room.bounds_max[0]) / 2,
    (room.bounds_min[1] + room.bounds_max[1]) / 2,
    (room.bounds_min[2] + room.bounds_max[2]) / 2,
  ];

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [10, 10, 10], fov: 50 }}>
        <CameraRig boundsMin={room.bounds_min} boundsMax={room.bounds_max} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <Environment preset="apartment" />

        <RoomShell
          scanData={scanData}
          is3D
          wallColor={(wall) => resolveWallColor(actions, wall)}
        />

        {floorMaterial && (
          <LoadErrorBoundary onError={markSettled}>
            <Suspense fallback={null}>
              <FloorMesh
                room={room}
                material={{
                  diffuse_path: floorMaterial.diffuse_path,
                  normal_path: floorMaterial.normal_path,
                  roughness_path: floorMaterial.roughness_path,
                  tile_size_cm: floorMaterial.tile_size_cm,
                }}
                onSettled={() => markSettled()}
              />
            </Suspense>
          </LoadErrorBoundary>
        )}

        {furnitureActions.map((action, i) => (
          <LoadErrorBoundary key={`${action.item_no}-${i}`} onError={markSettled}>
            <Suspense fallback={null}>
              <FurnitureModel
                itemNo={action.item_no}
                position={action.position ?? [0, 0, 0]}
                rotationYDegrees={action.rotation_y_degrees ?? 0}
                apiBaseUrl={apiBaseUrl}
                onSettled={() => markSettled()}
              />
            </Suspense>
          </LoadErrorBoundary>
        ))}

        {fallbackObjects.map((obj, i) => (
          <ScannedObjectFallback key={`fallback-${obj.identifier ?? i}`} transform={obj} is3D />
        ))}

        <OrbitControls enablePan enableZoom enableRotate target={roomCenter} />
      </Canvas>
    </div>
  );
};
