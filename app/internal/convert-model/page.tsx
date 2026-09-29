"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

interface ConvertPayload {
  objText?: string;
  mtlText?: string;
  /** Base64 of an already-GLB source model (e.g. downloaded pre-made, not
   * authored as OBJ/MTL) - takes this path instead of OBJLoader/MTLLoader when
   * present. Still goes through the same recentering/preview/re-export below,
   * defensively - not every third-party GLB is guaranteed to already be
   * authored origin-at-base/XZ-centered the way this app's placement math
   * requires, even when one happens to be. */
  glbBase64?: string;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/** Headless one-time asset onboarding: converts an OBJ(+MTL) model to GLB so it
 * can join the rest of this app's furniture pipeline, which is GLB-only
 * throughout (glbGeometryService's bounding-box measurement, the live
 * FurnitureModel renderer). Driven by localModelConversionService.ts via
 * Playwright, the same house pattern stagingRenderService.ts already uses for
 * /internal/staging-render - not part of any live request path. */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + chunkSize)));
  }
  return btoa(binary);
}

function fail(message: string) {
  document.documentElement.dataset.conversionError = message;
  document.documentElement.dataset.conversionReady = "true";
}

export default function ConvertModelPage() {
  const [status, setStatus] = useState("loading payload...");

  useEffect(() => {
    fetch("/internal/convert-model/payload")
      .then((res) => {
        if (!res.ok) throw new Error(`payload fetch failed: ${res.status}`);
        return res.json();
      })
      .then((payload: ConvertPayload) => convert(payload, setStatus))
      .catch((err) => {
        setStatus(`ERROR: ${String(err)}`);
        fail(String(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div data-conversion-status>{status}</div>;
}

async function convert(payload: ConvertPayload, setStatus: (s: string) => void) {
  try {
    let group: THREE.Object3D;
    if (payload.glbBase64) {
      setStatus("parsing GLB...");
      const gltfLoader = new GLTFLoader();
      const gltf = await new Promise<{ scene: THREE.Group }>((resolve, reject) =>
        gltfLoader.parse(base64ToArrayBuffer(payload.glbBase64!), "", resolve, reject)
      );
      group = gltf.scene;
    } else {
      let materials: ReturnType<InstanceType<typeof MTLLoader>["parse"]> | undefined;
      if (payload.mtlText) {
        const mtlLoader = new MTLLoader();
        const parsedMaterials = mtlLoader.parse(payload.mtlText, "");
        parsedMaterials.preload();
        materials = parsedMaterials;
      }

      const objLoader = new OBJLoader();
      if (materials) objLoader.setMaterials(materials);
      group = objLoader.parse(payload.objText!);
    }

    // Recenter so the model's own origin sits at its base, centered on X/Z -
    // this app's established convention (position.y IS an object's
    // floor-contact height everywhere in placementSolverService.ts) assumes
    // every model is authored this way; IKEA's GLBs already are, so this makes
    // a converted local model behave identically rather than needing special
    // casing throughout the placement pipeline.
    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    group.position.set(-center.x, -box.min.y, -center.z);
    group.updateMatrixWorld(true);

    setStatus("rendering preview...");
    renderPreview(group);

    setStatus("exporting GLB...");
    const exporter = new GLTFExporter();
    exporter.parse(
      group,
      (result) => {
        const buffer = result as ArrayBuffer;
        (window as unknown as { __CONVERTED_GLB_BASE64__?: string }).__CONVERTED_GLB_BASE64__ = arrayBufferToBase64(buffer);
        setStatus(`done, ${buffer.byteLength} bytes`);
        document.documentElement.dataset.conversionReady = "true";
      },
      (error) => fail(String(error)),
      { binary: true }
    );
  } catch (err) {
    fail(String(err));
  }
}

/** A quick 3/4-angle screenshot of the recentered model, framed to its own
 * bounding box - lets onboard-local-model.ts save a real look at an asset
 * before it's used anywhere, since a raw OBJ/FBX's authored scale is
 * unlabeled and easy to get wrong (confirmed worth having: caught exactly
 * that on the first real asset onboarded this way). Plain WebGLRenderer, not
 * react-three-fiber - this page has no other React-driven 3D content to share
 * a canvas with. */
function renderPreview(group: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(group);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);
  const radius = Math.max(size.x, size.y, size.z, 0.1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe5e5e5);
  scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(radius, radius * 1.5, radius);
  scene.add(dirLight);
  scene.add(new THREE.GridHelper(radius * 4, 8));

  const camera = new THREE.PerspectiveCamera(50, 4 / 3, 0.01, radius * 20);
  camera.position.set(center.x + radius * 1.4, center.y + radius * 1.0, center.z + radius * 1.4);
  camera.lookAt(center);

  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(800, 600);
  renderer.render(scene, camera);

  const dataUrl = renderer.domElement.toDataURL("image/png");
  (window as unknown as { __PREVIEW_PNG_BASE64__?: string }).__PREVIEW_PNG_BASE64__ = dataUrl.split(",")[1];
  renderer.dispose();
}
