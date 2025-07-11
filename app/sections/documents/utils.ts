export const allowedExtensions: string[] = [
  "pdf", "doc", "docx", "txt",
  "jpg", "jpeg", "png", "webp",
  "glb", "obj", "usdz", "fbx",
  "zip"
] as const;

export type CategoryKey = "plans" | "devis" | "photos" | "autres";

export function getCategoryFromName(name: string): CategoryKey {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["png", "jpg", "jpeg", "tiff", "webp"].includes(ext)) return "photos";
  if (["usdz", "obj", "glb", "gltf", "fbx", "ply", "las", "laz"].includes(ext)) return "plans";
  return "autres";
}

export function isImageFile(name: string): boolean {
  return /\.(png|jpe?g|webp|gif)$/i.test(name);
}
