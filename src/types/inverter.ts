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
  userId: string;
  accessToken: string;
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
