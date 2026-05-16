import { apiFetch } from "@/lib/api/client";
import {
  SupportedBrandsResponse,
  ConnectInverterRequest,
  ConnectInverterResponse,
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
};
