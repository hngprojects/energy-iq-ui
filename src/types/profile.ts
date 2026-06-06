export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  city?: string;
  aiLanguage?: string;
  profileUrl?: string;
  generatorFuelType?: "PMS" | "DIESEL";
  generatorRatedPowerKw?: number;
  customFuelPriceNaira?: number;
  generatorAverageDailyRuntimeHours?: number;
}

export interface PersonalSettings {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileUrl?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  state?: string | null;
  city?: string | null;
  smsNotification?: boolean;
  whatsappAlerts?: boolean;
  emailAlerts?: boolean;
  criticalAlerts?: boolean;
  aiLanguage?: string;
  chatCardsEnabled?: boolean;
  quietHoursStart?: string | null;
  quietHoursEnd?: string | null;
  timezone?: string | null;
  alertCooldownMinutes?: number;
  depletionThreshold?: number;
  channelQuietHours?: unknown;
  generatorFuelType?: "PMS" | "DIESEL" | null;
  generatorRatedPowerKw?: number | string | null;
  customFuelPriceNaira?: number | string | null;
  generatorAverageDailyRuntimeHours?: number | null;
}

export type PersonalSettingsPatch = Pick<
  ProfileUpdateRequest,
  | "generatorFuelType"
  | "generatorRatedPowerKw"
  | "customFuelPriceNaira"
  | "generatorAverageDailyRuntimeHours"
  | "firstName"
  | "lastName"
  | "businessName"
  | "businessType"
  | "state"
  | "city"
  | "aiLanguage"
  | "profileUrl"
>;

export interface ProfileUpdateResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhoto?: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  city?: string;
  aiLanguage?: string;
}

export interface AvatarUploadResponse {
  profilePhoto: string;
}
