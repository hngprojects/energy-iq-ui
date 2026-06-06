import type { PersonalSettings, PersonalSettingsPatch } from "@/types/profile";
import type { GeneratorType, SavingsSetupPreferences } from "@/types/savings-setup";

export type GeneratorFuelType = "PMS" | "DIESEL";

export function parseApiNumber(
  value: number | string | null | undefined,
): number | undefined {
  if (value == null) return undefined;
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isFinite(n) ? n : undefined;
}

export function fuelTypeToGeneratorType(
  fuelType: string | null | undefined,
): GeneratorType | undefined {
  if (!fuelType) return undefined;
  const upper = fuelType.toUpperCase();
  if (upper === "PMS") return "petrol";
  if (upper === "DIESEL" || upper === "AGO") return "diesel";
  return undefined;
}

export function generatorTypeToFuelType(type: GeneratorType): GeneratorFuelType {
  return type === "diesel" ? "DIESEL" : "PMS";
}

export function formatFuelLabel(fuelType?: string | null): string {
  const upper = fuelType?.toUpperCase();
  if (upper === "DIESEL" || upper === "AGO") return "Diesel";
  return "Petrol";
}

export function personalSettingsToPreferences(
  settings: PersonalSettings,
): SavingsSetupPreferences | null {
  const generatorType = fuelTypeToGeneratorType(settings.generatorFuelType);
  const fuelPrice = parseApiNumber(settings.customFuelPriceNaira);
  const hours = settings.generatorAverageDailyRuntimeHours ?? undefined;
  const ratedPower = parseApiNumber(settings.generatorRatedPowerKw);

  if (!generatorType && fuelPrice == null && hours == null) {
    return null;
  }

  return {
    generatorType,
    fuelPricePerLitre: fuelPrice,
    generatorHoursPerDay: hours,
    generatorRatedPowerKw: ratedPower,
    skipped: false,
    updatedAt: settings.updatedAt,
  };
}

export function preferencesToPersonalSettingsPatch(
  prefs: SavingsSetupPreferences,
): PersonalSettingsPatch {
  const patch: PersonalSettingsPatch = {};

  if (prefs.generatorType) {
    patch.generatorFuelType = generatorTypeToFuelType(prefs.generatorType);
  }
  if (prefs.fuelPricePerLitre != null) {
    patch.customFuelPriceNaira = prefs.fuelPricePerLitre;
  }
  if (prefs.generatorHoursPerDay != null) {
    patch.generatorAverageDailyRuntimeHours = prefs.generatorHoursPerDay;
  }
  if (prefs.generatorRatedPowerKw != null) {
    patch.generatorRatedPowerKw = prefs.generatorRatedPowerKw;
  }

  return patch;
}

export function isSavingsSetupComplete(settings: PersonalSettings): boolean {
  return (
    settings.generatorFuelType != null &&
    parseApiNumber(settings.customFuelPriceNaira) != null &&
    settings.generatorAverageDailyRuntimeHours != null
  );
}
