import { apiFetch } from "@/lib/api/client";
import { CreateReportPayload, ApiReport } from "@/types/reports";

export const reportsService = {
  createReport: async (payload: CreateReportPayload): Promise<ApiReport> => {
    return apiFetch<ApiReport>(
      "/reports",
      {
        method: "POST",
        data: payload,
      },
      true,
    );
  },

  downloadReport: async (id: string): Promise<Blob> => {
    return apiFetch<Blob>(
      `/reports/download/${id}`,
      {
        method: "GET",
        responseType: "blob",
      },
      true,
    );
  },

  emailReport: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiFetch<{ success: boolean; message: string }>(
      `/reports/email-report/${id}`,
      {
        method: "POST",
      },
      true,
    );
  },

  getReports: async (): Promise<ApiReport[]> => {
    return apiFetch<ApiReport[]>(
      "/reports",
      {
        method: "GET",
      },
      true,
    );
  },

  deleteReport: async (id: string): Promise<any> => {
    return apiFetch<any>(
      `/reports/${id}`,
      {
        method: "DELETE",
      },
      true,
    );
  },

  cancelReport: async (id: string): Promise<ApiReport> => {
    return apiFetch<ApiReport>(
      `/reports/cancel/${id}`,
      {
        method: "PATCH",
      },
      true,
    );
  },
};
