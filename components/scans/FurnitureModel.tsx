"use client";

import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * One placed/replaced IKEA item. Fetches (and lets drei cache, keyed by URL) the
 * GLB from the backend's proxy route. `scene.clone(true)` is required, not
 * optional: useGLTF returns the SAME cached Object3D for a repeated URL (e.g. the
 * same chair used four times), and an Object3D can only live in one place in the
 * scene graph at once - reusing it directly would silently move the single
 * instance around instead of rendering multiple copies.
 *
 * `position[1]` is meant as the floor-contact height (see staging.types.ts on the
 * backend), not the model's own pivot - IKEA GLBs don't share one pivot
 * convention (some base-anchored, some center-anchored). Same fix as the backend
 * Blender import script used to need: measure the model's own bounding box (a Y-
 * axis rotation never changes Y-extent, so this is safe to do before rotating)
 * and offset so its actual lowest point lands at position[1].
 */
export const FurnitureModel: React.FC<{
  itemNo: string;
  position: [number, number, number];
  rotationYDegrees: number;
  apiBaseUrl: string;
  /** Fires once after this model has actually mounted (i.e. its GLTF fetch/decode
   * already resolved via Suspense) - used by the headless render page to know
   * when every async piece of the scene is done, not just this one. */
  onSettled?: () => void;
}> = ({ itemNo, position, rotationYDegrees, apiBaseUrl, onSettled }) => {
  const url = `${apiBaseUrl}/api/ikea/model/${itemNo}`;
  const { scene } = useGLTF(url, "/draco/");

  const { instance, adjustedPosition } = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(clone);
    const yOffset = box.isEmpty() ? 0 : -box.min.y;
    return {
      instance: clone,
      adjustedPosition: [position[0], position[1] + yOffset, position[2]] as [number, number, number],
    };
  }, [scene, position]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onSettled?.(), []);

  return (
    <primitive
      object={instance}
      position={adjustedPosition}
      rotation={[0, THREE.MathUtils.degToRad(rotationYDegrees), 0]}
    />
  );
};
