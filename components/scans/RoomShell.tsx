"use client";

import React, { useMemo, useRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Scan, Transform, useTransform } from "./useTransform";
import { computeWallSegments } from "./wallSegments";

const Wall: React.FC<{
  transform: Transform;
  is3D: boolean;
  showDimensions: boolean;
  wallIndex: number;
  isSelected: boolean;
  onWallClick?: (wallIndex: number) => void;
  colorOverride?: string;
  /** Doors/windows/openings hosted by this wall (parentIdentifier match) - cut out
   * as gaps instead of being rendered behind one solid slab. */
  cutoutChildren: Transform[];
}> = ({ transform, is3D, showDimensions, wallIndex, isSelected, onWallClick, colorOverride, cutoutChildren }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { position, rotation, dimensions } = useTransform(transform, is3D);

  const width = dimensions[0];
  const depth = 0.2; // Wall thickness
  // Warm white (matches the curated wall-paint palette's "warm_white" option) instead
  // of a flat mid-gray, for any wall Claude didn't explicitly paint.
  const baseColor = colorOverride ?? "#F2EDE4";

  const segments = useMemo(
    () => computeWallSegments(transform, cutoutChildren, is3D),
    [transform, cutoutChildren, is3D]
  );

  const handleClick = (event: any) => {
    event.stopPropagation();
    onWallClick?.(wallIndex);
  };

  return (
    <group>
      <group ref={groupRef} position={position} rotation={rotation}>
        {segments.map((seg, i) => (
          <mesh key={i} position={[seg.center[0], seg.center[1], 0]} onClick={handleClick}>
            <boxGeometry args={[seg.width, seg.height, depth]} />
            <meshStandardMaterial
              color={isSelected ? "#ff6b35" : baseColor}
              emissive={isSelected ? "#ff6b35" : "#000000"}
              emissiveIntensity={isSelected ? 0.2 : 0}
              // Matte paint, not plastic - Three.js's default roughness/metalness (0.5/0.5)
              // reads as glossy/synthetic under a point light.
              roughness={0.9}
              metalness={0}
            />
          </mesh>
        ))}
      </group>
      {showDimensions && width > 0.5 && (
        <Text
          position={[position[0], position[1] + 0.5, position[2]]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${width.toFixed(1)}m`}
        </Text>
      )}
    </group>
  );
};

const Door: React.FC<{ transform: Transform; is3D: boolean }> = ({ transform, is3D }) => {
  const { position, rotation, dimensions } = useTransform(transform, is3D);
  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 2.1 : 0.15;
  const depth = 0.05;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};

const Window: React.FC<{ transform: Transform; is3D: boolean }> = ({ transform, is3D }) => {
  const { position, rotation, dimensions } = useTransform(transform, is3D);
  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 1.2 : 0.1;
  const depth = 0.03;

  return (
    <group>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#4A90E2" transparent opacity={0.6} />
      </mesh>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[width + 0.05, height + 0.05, depth]} />
        <meshStandardMaterial color="#333333" wireframe />
      </mesh>
    </group>
  );
};

const Opening: React.FC<{ transform: Transform; is3D: boolean }> = ({ transform, is3D }) => {
  const { position, rotation, dimensions } = useTransform(transform, is3D);
  const width = dimensions[0];
  const height = is3D ? dimensions[1] || 2.1 : 0.1;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, 0.01]} />
      <meshStandardMaterial color="#FF0000" wireframe />
    </mesh>
  );
};

/**
 * Walls/doors/windows/openings only - shared by the "Plan" tab's ThreeJSRenderer
 * (which still draws `objects` itself as plain boxes) and the staged-scene
 * renderer (which replaces `objects` with real IKEA models instead).
 */
export const RoomShell: React.FC<{
  scanData: Scan;
  is3D: boolean;
  showDimensions?: boolean;
  selectedWalls?: Set<number>;
  onWallClick?: (wallIndex: number) => void;
  /** Per-wall color override (e.g. from a staging run's wall_color actions). */
  wallColor?: (wall: Transform, index: number) => string | undefined;
}> = ({ scanData, is3D, showDimensions = false, selectedWalls, onWallClick, wallColor }) => {
  const cutoutsByWall = useMemo(() => {
    const byWall = new Map<string, Transform[]>();
    const allCutouts = [...(scanData.doors ?? []), ...(scanData.windows ?? []), ...(scanData.openings ?? [])];
    for (const cutout of allCutouts) {
      if (!cutout.parentIdentifier) continue;
      const existing = byWall.get(cutout.parentIdentifier);
      if (existing) existing.push(cutout);
      else byWall.set(cutout.parentIdentifier, [cutout]);
    }
    return byWall;
  }, [scanData.doors, scanData.windows, scanData.openings]);

  return (
    <group>
      {scanData.walls?.map((wall, index) => (
        <Wall
          key={`wall-${index}`}
          wallIndex={index}
          transform={wall}
          is3D={is3D}
          showDimensions={showDimensions}
          isSelected={selectedWalls?.has(index) || false}
          onWallClick={onWallClick}
          colorOverride={wallColor?.(wall, index)}
          cutoutChildren={(wall.identifier && cutoutsByWall.get(wall.identifier)) || []}
        />
      ))}
      {scanData.doors?.map((door, index) => (
        <Door key={`door-${index}`} transform={door} is3D={is3D} />
      ))}
      {scanData.windows?.map((window, index) => (
        <Window key={`window-${index}`} transform={window} is3D={is3D} />
      ))}
      {scanData.openings?.map((opening, index) => (
        <Opening key={`opening-${index}`} transform={opening} is3D={is3D} />
      ))}
    </group>
  );
};
