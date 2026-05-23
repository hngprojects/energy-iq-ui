import { apiFetch } from "@/lib/api/client";
import {
  SupportedBrandsResponse,
  ConnectInverterRequest,
  ConnectInverterResponse,
  OnboardingStatusResponse,
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
};
