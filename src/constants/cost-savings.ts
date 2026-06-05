import type { SummaryPeriod } from "@/components/dashboard/cost-savings/cost-savings-tabs";

export interface TrendDataPoint {
  label: string;
  value: number;
}

export const TREND_DATA: Record<SummaryPeriod, TrendDataPoint[]> = {
  daily: [
    { label: "Mon 12", value: 15000 },
    { label: "Tue 13", value: 15000 },
    { label: "Wed 14", value: 10000 },
    { label: "Thu 15", value: 20000 },
    { label: "Fri 16", value: 22000 },
    { label: "Sat 17", value: 15000 },
    { label: "Sun 18", value: 27000 },
  ],
  weekly: [
    { label: "Wk 1", value: 62000 },
    { label: "Wk 2", value: 75000 },
    { label: "Wk 3", value: 58000 },
    { label: "Wk 4", value: 91000 },
  ],
  monthly: [
    { label: "Jan", value: 210000 },
    { label: "Feb", value: 195000 },
    { label: "Mar", value: 240000 },
    { label: "Apr", value: 220000 },
    { label: "May", value: 275000 },
    { label: "Jun", value: 260000 },
  ],
};

export interface SummaryStats {
  totalSaved: number;
  totalSavedDelta: number;
  energyConsumed: number;
  energyDelta: number;
  solarGeneration: number;
  solarGenerationDelta: number;
}

export const STATS: Record<SummaryPeriod, SummaryStats> = {
  daily: {
    totalSaved: 28400,
    totalSavedDelta: 4200,
    energyConsumed: 38.7,
    energyDelta: 8,
    solarGeneration: 24.2,
    solarGenerationDelta: 3.5,
  },
  weekly: {
    totalSaved: 142000,
    totalSavedDelta: 18500,
    energyConsumed: 214.3,
    energyDelta: 12,
    solarGeneration: 158.7,
    solarGenerationDelta: 21.4,
  },
  monthly: {
    totalSaved: 560000,
    totalSavedDelta: -32000,
    energyConsumed: 891.2,
    energyDelta: -3,
    solarGeneration: 682.1,
    solarGenerationDelta: -45.8,
  },
};

export const LIFETIME_SAVINGS_DATA = [
  { month: "JAN",  actual: 45000,  projected: 40000  },
  { month: "FEB",  actual: 98000,  projected: 82000  },
  { month: "MAR",  actual: 162000, projected: 125000 },
  { month: "APR",  actual: 240000, projected: 170000 },
  { month: "MAY",  actual: 335000, projected: 218000 },
  { month: "JUN",  actual: 448000, projected: 268000 },
  { month: "JUL",  actual: 572000, projected: 320000 },
  { month: "AUG",  actual: 710000, projected: 374000 },
  { month: "SEP",  actual: 865000, projected: 430000 },
  { month: "OCT",  actual: 1020000,projected: 488000 },
  { month: "NOV",  actual: 1150000,projected: 548000 },
  { month: "DEC",  actual: 1200000,projected: 610000 },
];
