export interface ProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  businessName?: string;
  businessType?: string;
  state?: string;
  city?: string;
  aiLanguage?: string;
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

export interface AvatarUploadResponse {
  profilePhoto: string;
}
