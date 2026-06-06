import { apiFetch } from "@/lib/api/client";
import {
  SupportedBrandsResponse,
  ConnectInverterRequest,
  ConnectInverterResponse,
  OnboardingStatusResponse,
  UserInvertersResponse,
  DashboardMetrics,
  EnergyUsageResponse,
  PowerConsumptionResponse,
  CumulativeSavingsData,
} from "@/types/inverter";
import type {
  SavingsMetricsResponse,
  SavingsQueryParams,
} from "@/types/savings";

export const InverterService = {
  getSupportedBrands: async () => {
    return apiFetch<SupportedBrandsResponse>(
      "/inverters/supported-brands",
      {
        method: "GET",
      },
      true,
    );
  },

  connectInverter: async (data: ConnectInverterRequest) => {
    return apiFetch<ConnectInverterResponse>(
      "/users/onboard",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  getOnboardingStatus: async () => {
    return apiFetch<OnboardingStatusResponse>(
      "/users/onboard/status",
      {
        method: "GET",
      },
      true,
    );
  },

  getUserInverters: async (userId: string) => {
    return apiFetch<UserInvertersResponse>(
      `/inverters/user/${userId}`,
      { method: "GET" },
      true,
    );
  },

  getDashboardMetrics: async (inverterId: string) => {
    return apiFetch<DashboardMetrics>(
      `/inverter-metrics/${inverterId}/dashboard`,
      { method: "GET" },
      true,
    );
  },

  getEnergyUsage: async (inverterId: string, period: string) => {
    return apiFetch<EnergyUsageResponse>(
      `/inverter-metrics/${encodeURIComponent(inverterId)}/energy-usage?period=${encodeURIComponent(period)}`,
      { method: "GET" },
      true,
    );
  },

  getPowerConsumption: async (inverterId: string) => {
    return apiFetch<PowerConsumptionResponse>(
      `/inverter-metrics/${inverterId}/power-consumption`,
      { method: "GET" },
      true,
    );
  },

  getCumulativeSavings: async (inverterId: string) => {
    return apiFetch<CumulativeSavingsData>(
      `/inverter-metrics/${inverterId}/savings/cumulative`,
      { method: "GET" },
      true,
    );
  },

  getSavingsMetrics: async (
    inverterId: string,
    params: SavingsQueryParams,
  ) => {
    const search = new URLSearchParams();
    search.set("period", params.period);
    if (params.date) search.set("date", params.date);
    if (params.startDate) search.set("startDate", params.startDate);
    if (params.endDate) search.set("endDate", params.endDate);

    return apiFetch<SavingsMetricsResponse>(
      `/inverter-metrics/${encodeURIComponent(inverterId)}/savings?${search.toString()}`,
      { method: "GET" },
      true,
    );
  },
};
