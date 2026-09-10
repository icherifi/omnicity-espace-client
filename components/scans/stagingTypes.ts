// Frontend copies of the backend's staging types (src/types/staging.types.ts in
// omnicity-express-server) - two separate deployable projects, kept in sync by hand,
// matching this codebase's existing convention (RoomPlan Transform/Scan shapes are
// already independently redeclared per-file rather than shared across the repos).

export interface RoomShellInfo {
  bounds_min: [number, number, number];
  bounds_max: [number, number, number];
  wall_object_names: string[];
  floor_object_names: string[];
  ceiling_object_names: string[];
}

export interface FloorMaterialInfo {
  diffuse_path: string;
  normal_path: string;
  roughness_path: string;
  tile_size_cm: [number, number];
}

export type StagingAction =
  | { type: "place"; item_no: string; position: [number, number, number]; rotation_y_degrees: number }
  | {
      type: "replace";
      object_name: string;
      replaces_roomplan_identifier?: string;
      item_no: string;
      position?: [number, number, number];
      rotation_y_degrees?: number;
    }
  | { type: "wall_color"; wall_object_names: string[] | "all"; material_id: string; hex_color: string }
  | ({ type: "floor_material"; material_id: string } & FloorMaterialInfo);
