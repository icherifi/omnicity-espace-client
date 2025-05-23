import { getScans } from "@/utils/handleProjectDetails";
import { plan001 } from "./exemple";
import { sectionLabelMap } from "./labelsMap";

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;
let AfficheLongueur = false;
const DEFAULT_WALL_WIDTH = 0.2;

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
  sections?: { center: number[]; label: string; story: number }[];
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

export async function draw(projectId: string): Promise<boolean> {
  let plans: Scan | undefined;
  const scans: any = await getScans(projectId); // Fetch scans from the database

  if (scans && scans[0] !== undefined) {
    console.log("first scan", scans[0]);
    //plans = JSON.parse(scans[0].serialized);
    plans = plan001 as any as Scan; // Use the example plan for testing

    console.log("plan", plans);
  } else {
    return false;
  }

  initializeCanvas();

  // Effacez le canevas avant de dessiner
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Appeler la fonction pour dessiner les murs
  if (plans) {
    drawWalls(plans.walls || []);
    drawDoors(plans.doors || []);
    drawOpenings(plans.openings || []);
    drawWindows(plans.windows || []);
    drawObject(plans.objects || []);
    writeRoomLabels(plans.sections || []);
  }
  return true;
}

///////////////////////////////////
// Dessiner le plan
//////////////////////////////////
function drawWalls(walls: Transform[]) {
  walls.forEach((wall) => {
    const transform = wall.transform;
    const length = wall.dimensions[0] + DEFAULT_WALL_WIDTH * 2;
    const width = DEFAULT_WALL_WIDTH; // Use the provided width or default

    // Décomposez la matrice de transformation
    const scaleFactor = 50; // Facteur d'échelle
    const x = transform[14] * scaleFactor + canvas.width / 2; // Position en x (avec un facteur d'échelle et un décalage pour centrer)
    const y = transform[12] * scaleFactor + canvas.height / 2; // Position en y
    const angle = Math.atan2(transform[0], -transform[8]); // Calculer l'angle de rotation et ajouter 90 degrés

    // Appliquez la transformation avec setTransform
    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    // Dessinez le mur (un rectangle)
    ctx.beginPath();
    ctx.rect(
      (-length * scaleFactor) / 2, // Start x
      0, // added to the outside of the wall
      length * scaleFactor, // Rectangle length
      width * scaleFactor // Rectangle width
    );
    ctx.fillStyle = "black"; // Mur noir
    ctx.fill();
    ctx.strokeStyle = "black"; // Bordure grise
    ctx.lineWidth = 0; // Épaisseur de la bordure
    ctx.stroke();

    // Affichez la taille du mur en mètres avec une précision d'un chiffre après la virgule, seulement si la taille est positive
    if (length > 0.5 && AfficheLongueur) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`${length.toFixed(1)}m`, 0, 10);
    }

    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}
// Dessin Doors test
function drawDoors(doors: Transform[]) {
  doors.forEach((door) => {
    const transform = door.transform;
    const length = door.dimensions[0];
    const width = DEFAULT_WALL_WIDTH;

    // Décomposez la matrice de transformation
    const scaleFactor = 50; // Facteur d'échelle
    const x = transform[14] * scaleFactor + canvas.width / 2; // Position en x (avec un facteur d'échelle et un décalage pour centrer)
    const y = transform[12] * scaleFactor + canvas.height / 2; // Position en y
    const angle = Math.atan2(transform[0], -transform[8]); // Calculer l'angle de rotation et ajouter 90 degrés

    // Appliquez la transformation avec setTransform
    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    // Dessinez la porte (un rectangle avec des lignes de différentes couleurs)
    ctx.beginPath();
    ctx.moveTo((-length * scaleFactor) / 2, 0);
    ctx.lineTo((length * scaleFactor) / 2, 0);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((-length * scaleFactor) / 2, width * scaleFactor);
    ctx.lineTo((length * scaleFactor) / 2, width * scaleFactor);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((-length * scaleFactor) / 2, 0);
    ctx.lineTo((-length * scaleFactor) / 2, width * scaleFactor);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((length * scaleFactor) / 2, 0);
    ctx.lineTo((length * scaleFactor) / 2, width * scaleFactor);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}

// Dessin Doors test
function drawOpenings(openings: Transform[]) {
  openings.forEach((opening) => {
    const transform = opening.transform;
    const width = opening.dimensions[0];
    //const height = Door.dimensions[1];

    // Décomposez la matrice de transformation
    const scaleFactor = 50; // Facteur d'échelle
    const x = transform[14] * scaleFactor + canvas.width / 2; // Position en x (avec un facteur d'échelle et un décalage pour centrer)
    const y = transform[12] * scaleFactor + canvas.height / 2; // Position en y
    const angle = Math.atan2(transform[0], -transform[8]); // Calculer l'angle de rotation et ajouter 90 degrés

    // Appliquez la transformation avec setTransform
    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    // Dessinez l'ouverture (une ligne)

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "White"; // Couleur de la ligne
    ctx.lineWidth = 4; // Épaisseur de la ligne
    ctx.stroke();
    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}
function drawWindows(windows: Transform[]) {
  windows.forEach((window) => {
    const transform = window.transform;
    const width = window.dimensions[0];
    //const height = Door.dimensions[1];

    // Décomposez la matrice de transformation
    const scaleFactor = 50; // Facteur d'échelle
    const x = transform[14] * scaleFactor + canvas.width / 2; // Position en x (avec un facteur d'échelle et un décalage pour centrer)
    const y = transform[12] * scaleFactor + canvas.height / 2; // Position en y
    const angle = Math.atan2(transform[0], -transform[8]); // Calculer l'angle de rotation et ajouter 90 degrés

    // Appliquez la transformation avec setTransform
    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    // Dessinez l'la fenetre (une ligne)
    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "black"; // Couleur de la ligne
    ctx.lineWidth = 4; // Épaisseur de la ligne
    ctx.stroke();

    ctx.strokeStyle = "white"; // Couleur de la ligne
    ctx.lineWidth = 2; // Épaisseur de la lignes
    ctx.stroke();
    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}
function drawObject(objects: Transform[]) {
  objects.forEach((object) => {
    const transform = object.transform;
    const width = object.dimensions[0];
    const length = object.dimensions[2];
    //const height = object.dimensions[1];

    // Décomposez la matrice de transformation
    const scaleFactor = 50; // Facteur d'échelle
    const x = transform[14] * scaleFactor + canvas.width / 2; // Position en x (avec un facteur d'échelle et un décalage pour centrer)
    const y = transform[12] * scaleFactor + canvas.height / 2; // Position en y
    const angle = Math.atan2(transform[0], -transform[8]); // Calculer l'angle de rotation et ajouter 90 degrés

    // Appliquez la transformation avec setTransform
    ctx.save();
    ctx.setTransform(
      Math.cos(angle),
      Math.sin(angle),
      -Math.sin(angle),
      Math.cos(angle),
      x,
      y
    );

    // Dessinez l'la fenetre (une ligne)
    ctx.beginPath();
    ctx.moveTo((width * scaleFactor) / 2, (-length * scaleFactor) / 2);
    ctx.lineTo((-width * scaleFactor) / 2, (-length * scaleFactor) / 2);
    ctx.lineTo((-width * scaleFactor) / 2, (length * scaleFactor) / 2);
    ctx.lineTo((width * scaleFactor) / 2, (length * scaleFactor) / 2);
    ctx.lineTo((width * scaleFactor) / 2, (-length * scaleFactor) / 2);

    ctx.strokeStyle = "blue"; // Couleur de la ligne
    ctx.lineWidth = 1; // Épaisseur de la ligne
    ctx.stroke();

    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}

// // Fonction pour mettre à jour l'état de la porte
// function ShowLongueur() {
//   const longueur = document.getElementById("longueur") as HTMLInputElement;
//   AfficheLongueur = longueur.checked; // Met à jour isOpen en fonction de l'état du switch
//   updatePlan();
// }

function writeRoomLabels(
  sections: { center: number[]; label: string; story: number }[]
) {
  const scaleFactor = 50;
  sections.forEach((section) => {
    const [x3d, , z3d] = section.center;
    const x = z3d * scaleFactor + canvas.width / 2;
    const y = x3d * scaleFactor + canvas.height / 2;
    const label = sectionLabelMap[section.label] || section.label;
    ctx.save();
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y);
    ctx.restore();
  });
}
