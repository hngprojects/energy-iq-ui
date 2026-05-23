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
  victronAccessToken?: string;
  growattApiToken?: string;
  solarmanEmail?: string;
  solarmanPassword?: string;
  solarmanPlantId?: string;
  sandboxAccessToken?: string;
}

export interface Inverter {
  id: string;
  brand: string;
  userId: string;
  accessToken?: string;
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
