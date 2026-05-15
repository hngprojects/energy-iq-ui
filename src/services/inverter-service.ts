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
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `${data.brand} Inverter connected successfully (MOCK MODE)`,
          data: {
            id: crypto.randomUUID(),
            brand: data.brand,
            userId: "mock-user-id",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        });
      }, 1000);
    });

    /*
    return apiFetch<ConnectInverterResponse>(
      "/users/onboard",
      {
        method: "POST",
        data,
      },
      true,
    );
    */
  },
};
