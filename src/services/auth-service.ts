import { apiFetch } from "@/lib/api/client";
// import { env } from "@/env/client";
import {
  LoginResponse,
  RegisterResponse,
  VerifyEmailResponse,
  RefreshTokenResponse,
  MeResponse,
} from "@/types/auth";
import {
  LoginFormValues,
  RegisterFormValues,
  VerifyEmailFormValues,
  RefreshTokenFormValues,
} from "@/lib/schemas/auth";

export const AuthService = {
  googleLogin: () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const callbackUrl = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!clientId || !callbackUrl) {
      console.error("Google Auth environment variables are not defined");
      return;
    }
    window.location.href = `${appUrl}/api/v1/auth/google`;
  },

  login: async (data: LoginFormValues) => {
    return apiFetch<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  register: async (data: RegisterFormValues) => {
    return apiFetch<RegisterResponse>(
      "/auth/register",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  verifyEmail: async (data: VerifyEmailFormValues) => {
    return apiFetch<VerifyEmailResponse>(
      "/auth/verify-email",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  resendEmailOtp: async (data: { email: string }) => {
    return apiFetch<{ message: string }>(
      "/auth/resend-email-otp",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  refresh: async (data: RefreshTokenFormValues) => {
    return apiFetch<RefreshTokenResponse>(
      "/auth/refresh",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  logout: async () => {
    return apiFetch<void>(
      "/auth/logout",
      {
        method: "POST",
      },
      true,
    );
  },

  me: async () => {
    return apiFetch<MeResponse>(
      "/auth/me",
      {
        method: "GET",
      },
      true,
    );
  },

  forgotPassword: async (data: { email: string }) => {
    return apiFetch<{ message: string }>(
      "auth/forgot-password",
      {
        method: "POST",
        data,
      },
      true,
    );
  },

  resetPassword: async (data: { token: string; password: string; email?: string }) => {
    return apiFetch<{ message: string }>(
      "auth/reset-password",
      {
        method: "POST",
        data,
      },
      true,
    );
  },
};
