export interface SupportedBrandsResponse {
  success: boolean;
  message: string;
  data: string[];
  meta: {
    timestamp: string;
  };
}

export interface ConnectInverterRequest {
  brand: string;
  // Do not send yet:
  // systemCapacityKw?: number;
  // hardwareSerialNumber?: string;
  // accessApiToken?: string;
  victronAccessToken?: string;
  growattApiToken?: string;
  solarmanEmail?: string;
  solarmanPassword?: string;
  solarmanPlantId?: string;
  sandboxAccessToken?: string;
}

export interface Inverter {
  brand: string;
  userId: string;
  accessToken?: string;
  serialNumber?: string;
  capacityKw?: number;
  status?: "ACTIVE" | "INACTIVE" | "OFFLINE";
  lastSyncAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectInverterResponse {
  success: boolean;
  message: string;
  data: Inverter;
  meta: {
    timestamp: string;
  };
}

export interface OnboardingStatusResponse {
  currentStep: number;
  onboardingComplete: boolean;
  steps: {
    accountCreated: boolean;
    emailVerified: boolean;
    inverterConnected: boolean;
  };
}

export type UserInvertersResponse = Inverter[];

// GET /inverter-metrics/{inverterId}/dashboard
export interface DashboardMetrics {
  currentReadings: {
    solarKw: number;
    batterySocPercent: number;
    loadKw: number;
    gridVoltageV: number;
    batteryVoltageV: number;
    recordedAt: string;
  };
  dataAgeSeconds: number;
  systemOffline: boolean;
  emptyData: boolean;
  nairaSavedToday: number;
  nairaSavedThisMonth: number;
  health: {
    status: "GREEN" | "AMBER" | "RED";
    reason: string;
  };
  sevenDayHistory: {
    date: string;
    solarKwh: number;
    avgBatterySocPercent: number;
    avgLoadKw: number;
  }[];
}

// GET /inverter-metrics/{inverterId}/energy-usage?period=daily
export interface EnergyUsagePoint {
  date: string;
  solarKwh: number;
  avgBatterySoc: number;
  avgLoadKw: number;
}

export type EnergyPeriod = "hourly" | "daily" | "weekly" | "monthly";

export interface EnergyUsageResponse {
  period: EnergyPeriod;
  data: EnergyUsagePoint[];
}

// GET /inverter-metrics/{inverterId}/power-consumption (no zone data yet)
export interface PowerZone {
  name: string;
  watts: number;
  percentage: number;
}

export interface PowerConsumptionResponse {
  zones?: PowerZone[];
  totalWatts?: number;
}
