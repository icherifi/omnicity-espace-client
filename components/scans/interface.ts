export interface Transform {
  transform: number[];
  dimensions: number[];
}

export interface Wall extends Transform {
  id: number;
}

export interface Scan {
  name: string;
  walls: Wall[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
  sections?: { center: number[]; label: string; story: number }[];
}

export interface ScanSource {
  name: string;
  walls?: Transform[];
  doors?: Transform[];
  openings?: Transform[];
  windows?: Transform[];
  objects?: Transform[];
  sections?: { center: number[]; label: string; story: number }[];
}
