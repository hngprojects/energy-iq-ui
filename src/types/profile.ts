export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  city?: string;
  aiLanguage?: string;
  profileUrl?: string;
}

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

export interface PersonalSettings {
  id: string;
  createdAt: string;
  updatedAt: string;
  profileUrl: string | null;
  businessName: string | null;
  businessType: string | null;
  state: string | null;
  city: string | null;
  smsNotification: boolean;
  whatsappAlerts: boolean;
  emailAlerts: boolean;
  criticalAlerts: boolean;
  AiLanguage: string;
  aiLanguage?: string;
  chatCardsEnabled: boolean;
}
