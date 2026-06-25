export interface CreateReportPayload {
  mode: "period";
  inverterId: string;
  type: string;
  name: string;
  period: string;
  referenceDate: string;
  startDate: string;
  endDate: string;
  recurring?: boolean;
}

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
  keyMetrics?: any | null;
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
