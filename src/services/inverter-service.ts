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
} from "@/types/inverter";

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
};
