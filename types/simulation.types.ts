// Types pour l'API Kelvin Simulation

export interface EnergyLossPercentage {
  walls: number;
  openings: number;
  low_floor: number;
  high_floor: number;
}

export interface AnnualEnergyCostRange {
  min: number;
  max: number;
}

export interface InitialState {
  dpe_class: string;
  confidence_score: number;
  annual_energy_cost_range: AnnualEnergyCostRange;
  annual_energy_consumption: number;
  position_percentage_neighborhood: number;
  energy_loss_percentage: EnergyLossPercentage;
  close_to_historical_monument: boolean;
  living_area: number;
  exterior_walls_surface: number;
  house_number_of_levels: number;
  shared_walls: boolean;
  wall_material: string;
  construction_year: number;
  number_of_windows: number;
  generator_type: string;
  generator_energy: string;
  hot_water_type: string;
  hot_water_energy: string;
  u_walls: string;
  u_windows: string;
  u_high_floor: string;
  u_low_floor: string;
  vents_type: string;
  has_vents: boolean;
  garage: boolean;
  recently_renovated: string[];
  high_floor_type: string;
  low_floor_type: string;
}

export interface RenovationItem {
  id: string;
  simplified_id: string;
  label: string;
  quantity: number;
}

export interface RenovationPlan {
  high_floor?: RenovationItem;
  vents?: RenovationItem;
  walls?: RenovationItem;
  windows?: RenovationItem;
  low_floor?: RenovationItem;
}

export interface RenovationPlanItem {
  id: string;
  name: string;
  type: string;
  dpe_after_renovation: string;
  yearly_energy_savings: number;
  yearly_energy_cost: number;
  budget: number;
  subsidies: number;
  renovation_plan: RenovationPlan;
}

export interface ProjectedState {
  renovation_plans: RenovationPlanItem[];
}

export interface KelvinInitialStateResponse {
  status: string;
  initial_state: InitialState;
}

export interface KelvinProjectedStateResponse {
  status: string;
  projected_state: ProjectedState;
}

// Types pour le contexte
export interface SimulationContextData {
  initialState: KelvinInitialStateResponse | null;
  projectedState: KelvinProjectedStateResponse | null;
  simulationResults: any; // Pour maintenir la compatibilité avec l'existant
  selectedAddress: string;
  selectedData: {
    latitude?: number;
    longitude?: number;
    banId?: string;
    address?: any;
  };
}
