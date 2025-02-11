declare module "react-dpe-generator" {
  import { ComponentType } from "react";

  interface DpeGeneratorProps {
    consoEner: number;
    emissionGes: number;
    classConsoEner: string;
    classEmissionGes: string;
  }

  export const DpeGenerator: ComponentType<DpeGeneratorProps>;
  export const DPE: ComponentType<{ value: string }>;
  export const GES: ComponentType<{ value: string }>;
}
