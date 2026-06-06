import { z } from "zod";

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

export const SavingsSetupPreferencesSchema = z.object({
  generatorType: z.enum(["petrol", "diesel"]).optional(),
  generatorHoursPerDay: z.number().positive().optional(),
  generatorHoursPreset: z
    .union([
      z.literal(2),
      z.literal(4),
      z.literal(6),
      z.literal(8),
      z.literal("custom"),
    ])
    .optional(),
  fuelPricePerLitre: z.number().positive().optional(),
  skipped: z.boolean().optional(),
  updatedAt: z.string(),
});
