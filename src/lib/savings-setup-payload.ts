import type { CalculatorData } from "@/components/dashboard/cost-savings/calculator/calculator-context";
import {
  DEFAULT_FUEL_PRICE,
  type SavingsSetupPreferences,
} from "@/types/savings-setup";

/** Shape for future BE savings calculation API */
export interface SavingsCalculationRequest {
  generatorType?: "petrol" | "diesel";
  generatorHoursPerDay?: number | null;
  fuelPricePerLitre: number;
  period?: CalculatorData["period"];
  customStartDate?: string;
  customEndDate?: string;
}

export function buildSavingsCalculationRequest(
  setup: SavingsSetupPreferences | null,
  calculator: CalculatorData,
): SavingsCalculationRequest {
  return {
    generatorType: setup?.generatorType,
    generatorHoursPerDay: setup?.generatorHoursPerDay ?? null,
    fuelPricePerLitre:
      calculator.pmsPricePerLitre ??
      setup?.fuelPricePerLitre ??
      DEFAULT_FUEL_PRICE,
    period: calculator.period,
    customStartDate: calculator.customStartDate,
    customEndDate: calculator.customEndDate,
  };
}
