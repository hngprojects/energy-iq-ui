export interface User {
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
  AiLanguage?: string;
  aiLanguage?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = AuthResponse;

export type RegisterResponse = AuthResponse;

export type VerifyEmailResponse = AuthResponse;

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type MeResponse = User;
