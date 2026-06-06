export interface SavingsQueryParams {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface SavingsBreakdownBucket {
  bucket: string;
  activeHours: number;
  energyKwh: number;
  solarKwh?: number;
  generatorCostSavedNgn: number;
  fuelSavedLitres: number;
}

export interface SavingsResults {
  totalCostSavedNgn: number;
  generatorCostAvoidedNgn: number;
  fuelSavedLitres: number;
  co2AvoidedKg: number;
  savingsPercentagePercent?: number;
  breakdown: SavingsBreakdownBucket[];
}

export interface SavingsSummary {
  totalCostSavedNgn: number;
  averageCostSavedPerBucketNgn: number;
  totalEnergyConsumedKwh: number;
  totalEnergyGeneratedKwh: number;
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
  assumedGeneratorRatedPowerKw: number;
  assumedConsumptionRateLPerHr: number;
  fuelPriceLastUpdated?: string;
}

export interface SavingsMetricsResponse {
  startDate: string;
  endDate: string;
  spanDays: number;
  granularity: string;
  results: SavingsResults;
  summary: SavingsSummary;
  chart: SavingsChartPoint[];
  meta: SavingsAssumptionsMeta;
}
