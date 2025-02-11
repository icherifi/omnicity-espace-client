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
    plans = JSON.parse(scans[0].serialized);
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
  }
  return true;
}

///////////////////////////////////
// Dessiner le plan
//////////////////////////////////
function drawWalls(walls: Transform[]) {
  walls.forEach((wall) => {
    const transform = wall.transform;
    const width = wall.dimensions[0];
    //const height = wall.dimensions[1];

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

    // Dessinez le mur (une ligne)
    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);
    ctx.strokeStyle = "black"; // Couleur de la ligne
    ctx.lineWidth = 2; // Épaisseur de la ligne
    ctx.stroke();

    // Affichez la taille du mur en mètres avec une précision d'un chiffre après la virgule, seulement si la taille est positive
    if (width > 0.5 && AfficheLongueur) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`${width.toFixed(1)}m`, 0, 10);
    }

    // Restaurez le contexte pour le prochain mur
    ctx.restore();
  });
}
// Dessin Doors test
function drawDoors(doors: Transform[]) {
  doors.forEach((door) => {
    const transform = door.transform;
    const width = door.dimensions[0];
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

    // Dessinez la porte (une ligne)

    ctx.beginPath();
    ctx.moveTo((-width * scaleFactor) / 2, 0);
    ctx.lineTo((width * scaleFactor) / 2, 0);

    ctx.strokeStyle = "Black"; // Couleur de la ligne
    ctx.lineWidth = 4; // Épaisseur de la ligne
    ctx.stroke();

    //ctx.lineTo(width * scaleFactor / 2, width * scaleFactor)
    ctx.strokeStyle = "Grey"; // Couleur de la ligne
    ctx.lineWidth = 2; // Épaisseur de la lignes
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
