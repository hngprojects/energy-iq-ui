"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { useCalculator } from "./calculator/calculator-context";
import type { CostSavingsTab } from "./cost-savings-tabs";
import type { SummaryPeriod } from "./cost-savings-tabs";
import { useInverterQueries } from "@/hooks/use-inverter-queries";
import {
  paramsFromCalculatorData,
  paramsFromSummaryPeriod,
  defaultResultsQueryParams,
} from "@/lib/savings-query-params";
import { InverterService } from "@/services/inverter-service";
import type { SavingsMetricsResponse, SavingsQueryParams } from "@/types/savings";

interface SavingsMetricsContextValue {
  inverterId: string | undefined;
  queryParams: SavingsQueryParams;
  data: SavingsMetricsResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  hasInverter: boolean;
}

const SavingsMetricsContext =
  createContext<SavingsMetricsContextValue | null>(null);

function resolveQueryParams(
  activeTab: CostSavingsTab,
  summaryPeriod: SummaryPeriod,
  calculatorData: ReturnType<typeof useCalculator>["data"],
): SavingsQueryParams {
  if (activeTab === "results") {
    return paramsFromCalculatorData(calculatorData) ?? defaultResultsQueryParams();
  }

  if (activeTab === "calculator") {
    const fromCalculator = paramsFromCalculatorData(calculatorData);
    if (fromCalculator) return fromCalculator;
  }

  return paramsFromSummaryPeriod(summaryPeriod);
}

export function SavingsMetricsProvider({
  activeTab,
  summaryPeriod,
  children,
}: {
  activeTab: CostSavingsTab;
  summaryPeriod: SummaryPeriod;
  children: ReactNode;
}) {
  const { data: calculatorData } = useCalculator();
  const { useUserInverters } = useInverterQueries();
  const { data: inverters, isLoading: invertersLoading } = useUserInverters();

  // Use the first user inverter; multi-inverter selection is out of scope here.
  const inverterId = inverters?.[0]?.id;

  const queryParams = useMemo(
    () => resolveQueryParams(activeTab, summaryPeriod, calculatorData),
    [activeTab, summaryPeriod, calculatorData],
  );

  const savingsQuery = useQuery({
    queryKey: ["savings-metrics", inverterId, queryParams],
    queryFn: () => InverterService.getSavingsMetrics(inverterId!, queryParams!),
    enabled: Boolean(inverterId && queryParams),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const value = useMemo(
    () => ({
      inverterId,
      queryParams,
      data: savingsQuery.data,
      isLoading: invertersLoading || savingsQuery.isLoading,
      isError: savingsQuery.isError,
      hasInverter: Boolean(inverterId),
    }),
    [
      inverterId,
      queryParams,
      savingsQuery.data,
      invertersLoading,
      savingsQuery.isLoading,
      savingsQuery.isError,
    ],
  );

  return (
    <SavingsMetricsContext.Provider value={value}>
      {children}
    </SavingsMetricsContext.Provider>
  );
}

export function useSavingsMetrics() {
  const ctx = useContext(SavingsMetricsContext);
  if (!ctx) {
    throw new Error(
      "useSavingsMetrics must be used inside SavingsMetricsProvider",
    );
  }
  return ctx;
}
