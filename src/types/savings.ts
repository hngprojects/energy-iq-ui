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
  /** Reserved for when BE adds solar generation to this payload */
  solarGenerationKwh?: number | null;
}
