// DEPRECATED: This file contains legacy canvas-based rendering code.
// Use ThreeJSRenderer.tsx and threeJSUtils.ts for the new Three.js implementation.
//
// This file is kept for reference only and will be removed in a future update.
//
// Migration guide:
// - Replace `draw()` function calls with `<ThreeJSRenderer />` component
// - Use `fetchScanData()` from threeJSUtils.ts instead of manual scan processing
// - Use the new ModelViewer3D.tsx component for complete functionality
//
// See README.md in this directory for full migration documentation.

console.warn(
  "DEPRECATED: utils.ts is using legacy canvas rendering. Please migrate to ThreeJSRenderer.tsx"
);

import { getScans } from "@/utils/handleProjectDetails";

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
let AfficheLongueur = false;

interface Transform {
  transform: number[];
  dimensions: number[];
}

interface Scan {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
}

// DEPRECATED: Use fetchScanData from threeJSUtils.ts instead
export async function draw(projectId: string): Promise<boolean> {
  console.warn(
    "DEPRECATED: draw() function is deprecated. Use ThreeJSRenderer component instead."
  );

  let plans: Scan | undefined;
  const scans: any = await getScans(projectId);

  if (scans && scans[0] !== undefined) {
    console.log("first scan", scans[0]);
    plans = JSON.parse(scans[0].serialized);
    console.log("plan", plans);
  } else {
    return false;
  }

  // For compatibility, we'll still provide basic canvas rendering
  // but users should migrate to the new Three.js implementation
  initializeCanvas();
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (plans) {
    drawWalls(plans.walls || []);
    drawDoors(plans.doors || []);
    drawOpenings(plans.openings || []);
    drawWindows(plans.windows || []);
    drawObject(plans.objects || []);
  }
  return true;
}

function initializeCanvas() {
  if (canvas) {
    canvas.remove();
  }
  canvas = document.createElement("canvas");
  canvas.id = "floorPlanCanvas";
  canvas.width = 800;
  canvas.height = 600;
  document.getElementById("canvasContainer")?.appendChild(canvas);
  ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
}

function drawWalls(walls: Transform[]) {
  walls.forEach((wall) => {
    const transform = wall.transform;
    const width = wall.dimensions[0];

    const scaleFactor = 50;
    const x = transform[14] * scaleFactor + canvas.width / 2;
    const y = transform[12] * scaleFactor + canvas.height / 2;
    const angle = Math.atan2(transform[0], -transform[8]);

    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    if (width > 0.5 && AfficheLongueur) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${width.toFixed(1)}m`, 0, 10);
    }

    ctx.restore();
  });
}

function drawDoors(doors: Transform[]) {
  doors.forEach((door) => {
    const transform = door.transform;
    const width = door.dimensions[0];

    const scaleFactor = 50;
    const x = transform[14] * scaleFactor + canvas.width / 2;
    const y = transform[12] * scaleFactor + canvas.height / 2;
    const angle = Math.atan2(transform[0], -transform[8]);

    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "Black";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = "Grey";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  });
}

function drawOpenings(openings: Transform[]) {
  openings.forEach((opening) => {
    const transform = opening.transform;
    const width = opening.dimensions[0];

    const scaleFactor = 50;
    const x = transform[14] * scaleFactor + canvas.width / 2;
    const y = transform[12] * scaleFactor + canvas.height / 2;
    const angle = Math.atan2(transform[0], -transform[8]);

    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "White";
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  });
}

function drawWindows(windows: Transform[]) {
  windows.forEach((window) => {
    const transform = window.transform;
    const width = window.dimensions[0];

    const scaleFactor = 50;
    const x = transform[14] * scaleFactor + canvas.width / 2;
    const y = transform[12] * scaleFactor + canvas.height / 2;
    const angle = Math.atan2(transform[0], -transform[8]);

    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  });
}

function drawObject(objects: Transform[]) {
  objects.forEach((object) => {
    const transform = object.transform;
    const width = object.dimensions[0];
    const length = object.dimensions[2];

    const scaleFactor = 50;
    const x = transform[14] * scaleFactor + canvas.width / 2;
    const y = transform[12] * scaleFactor + canvas.height / 2;
    const angle = Math.atan2(transform[0], -transform[8]);

    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    ctx.beginPath();
    ctx.moveTo((width * scaleFactor) / 2, (-length * scaleFactor) / 2);
    ctx.lineTo((-width * scaleFactor) / 2, (-length * scaleFactor) / 2);
    ctx.lineTo((-width * scaleFactor) / 2, (length * scaleFactor) / 2);
    ctx.lineTo((width * scaleFactor) / 2, (length * scaleFactor) / 2);
    ctx.lineTo((width * scaleFactor) / 2, (-length * scaleFactor) / 2);

    ctx.strokeStyle = "blue";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  });
}
