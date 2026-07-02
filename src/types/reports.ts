export interface CreateReportPeriodPayload {
  mode: "period";
  inverterId: string;
  type: "GENERAL" | "SOLAR" | "ALERT" | "COSTS_AND_SAVINGS";
  name: string;
  referenceDate: string;
  period: "weekly" | "monthly";
  recurring?: boolean;
}

export interface CreateReportCustomRangePayload {
  mode: "custom-range";
  inverterId: string;
  type: "GENERAL" | "SOLAR" | "ALERT" | "COSTS_AND_SAVINGS";
  name: string;
  recurring: false;
  startDate: string;
  endDate: string;
}

export type CreateReportPayload =
  | CreateReportPeriodPayload
  | CreateReportCustomRangePayload;

export interface ApiReport {
  id: string;
  userId: string;
  inverterId: string;
  type: string;
  name: string;
  period: string;
  referenceDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string | null;
  endDate?: string | null;
  keyMetrics?: Record<string, unknown> | null;
  recurring?: boolean;
  occurrence?: number | null;
  seriesId?: string | null;
}

export interface CreateReportResponse {
  success: boolean;
  message: string;
  data: ApiReport;
  meta: {
    timestamp: string;
  };
}
