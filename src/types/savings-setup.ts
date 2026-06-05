export type GeneratorType = "petrol" | "diesel";

export type GeneratorHoursPreset = 2 | 4 | 6 | 8 | "custom";

export interface SavingsSetupPreferences {
  generatorType?: GeneratorType;
  generatorHoursPerDay?: number;
  generatorHoursPreset?: GeneratorHoursPreset;
  fuelPricePerLitre?: number;
  /** User closed setup without saving full preferences */
  skipped?: boolean;
  updatedAt: string;
}

export const DEFAULT_FUEL_PRICE = 870;

export const GENERATOR_HOUR_PRESETS = [2, 4, 6, 8] as const;
