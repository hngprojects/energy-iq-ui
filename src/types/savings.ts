export type SavingsPeriod = "daily" | "weekly" | "monthly";

export interface SavingsQueryParams {
  period: SavingsPeriod;
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface SavingsBreakdownBucket {
  bucket: string;
  activeHours: number;
  energyKwh: number;
  generatorCostSavedNgn: number;
  fuelSavedLitres: number;
}

export interface SavingsResults {
  totalCostSavedNgn: number;
  generatorCostAvoidedNgn: number;
  fuelSavedLitres: number;
  co2AvoidedKg: number;
  /** Provided by BE only — do not compute on the client */
  savingsPercentagePercent?: number;
  breakdown: SavingsBreakdownBucket[];
}

export interface SavingsSummary {
  averageCostSavedNgn: number;
  totalEnergyConsumedKwh: number;
  totalActiveHours: number;
}

export interface SavingsChartPoint {
  label: string;
  savingsNgn: number;
  generatorCostNgn?: number;
}

export interface SavingsAssumptionsMeta {
  fuelType: string;
  fuelPricePerLitreNgn: number;
  fuelPriceLastUpdated: string;
  assumedGeneratorRatedPowerKw: number;
  assumedConsumptionRateLPerHr: number;
}

export interface SavingsMetricsResponse {
  period: SavingsPeriod;
  date: string;
  results: SavingsResults;
  summary: SavingsSummary;
  chart: SavingsChartPoint[];
  meta: SavingsAssumptionsMeta;
  /** Solar kWh generated for the period (BE field) */
  solarGenerationKwh?: number | null;
  /** Share of energy from solar vs total, 0–100 (BE field) */
  percentageGenerated?: number | null;
}
