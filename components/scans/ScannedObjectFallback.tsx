"use client";

import React from "react";
import { Transform, useTransform } from "./useTransform";

/** Flat per-category colors for scanned objects nothing ever replaces (built-in
 * kitchen/bathroom fixtures: cabinets, sink, stove, oven, fridge, toilet, tub...) -
 * presentable to a client, unlike the "Plan" tab's uniform debug-blue wireframe box. */
const CATEGORY_COLORS: Record<string, string> = {
  storage: "#A9825C", // cabinet - light wood
  stove: "#8A8F94",
  oven: "#8A8F94",
  refrigerator: "#C8CCCF",
  washerDryer: "#C8CCCF",
  dishwasher: "#C8CCCF",
  sink: "#EDEDE8",
  toilet: "#EDEDE8",
  bathtub: "#EDEDE8",
  fireplace: "#5C4A42",
};
const DEFAULT_COLOR = "#9AA0A6";

function categoryName(entity: Transform): string {
  return Object.keys(entity.category ?? {})[0] ?? "unknown";
}

/**
 * Renders one original RoomPlan-scanned object as-is - used for objects a staging
 * run never placed/replaced (no IKEA equivalent, e.g. built-in kitchen cabinetry),
 * so they stay visible instead of silently vanishing from the staged render.
 */
export const ScannedObjectFallback: React.FC<{ transform: Transform; is3D: boolean }> = ({ transform, is3D }) => {
  const { position, rotation, dimensions } = useTransform(transform, is3D);
  const width = dimensions[0] || 0.3;
  const height = is3D ? dimensions[1] || 0.8 : 0.1;
  const depth = dimensions[2] || width;
  const color = CATEGORY_COLORS[categoryName(transform)] ?? DEFAULT_COLOR;

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
    </mesh>
  );
};
