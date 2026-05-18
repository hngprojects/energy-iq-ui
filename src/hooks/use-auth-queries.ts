import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

type ErrorWithMessage = {
  message?: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    return (error as ErrorWithMessage).message ?? fallback;
  }

  return fallback;
};

export const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setAuth, logout: storeLogout, token: currentToken, setTempEmail } = useAuthStore();

  const useLogin = () =>
    useMutation({
      mutationFn: AuthService.login,
      onSuccess: (data) => {
        const token = data.accessToken;
        const user = data.user;
        const refreshToken = data.refreshToken;

        setAuth(user, token, refreshToken);
        localStorage.removeItem("temp_email");
        toast.success("Welcome back!", {
          duration: 5000,
        });
        router.push("/onboarding");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Invalid email or password"), {
          duration: 5000,
        });
      },
    });

  const useRegister = () =>
    useMutation({
      mutationFn: AuthService.register,
      onSuccess: (_, variables) => {
        setTempEmail(variables.email);
        localStorage.setItem("temp_email", variables.email);
        toast.success("Account created successfully!");
        router.push("/verify-email");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Registration failed"));
      },
    });

  const useVerifyEmail = () =>
    useMutation({
      mutationFn: AuthService.verifyEmail,
      onSuccess: (data) => {
        const token = data.accessToken;
        const user = data.user;
        const refreshToken = data.refreshToken;

        setAuth(user, token, refreshToken);
        localStorage.removeItem("temp_email");
        toast.success("Email verified successfully!");
        router.push("/onboarding");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Verification failed"), {
          duration: 5000,
        });
      },
    });

  const useResendEmailOtp = () =>
    useMutation({
      mutationFn: AuthService.resendEmailOtp,
      onSuccess: (data) => {
        toast.success(data.message || "OTP resent successfully!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to resend OTP"));
      },
    });

  const useLogout = () =>
    useMutation({
      mutationFn: AuthService.logout,
      onSuccess: () => {
        storeLogout();
        localStorage.removeItem("temp_email");
        queryClient.clear();
        toast.success("Logged out successfully");
        router.push("/login");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Logout failed"));
      },
    });

  const useMe = () =>
    useQuery({
      queryKey: ["auth-me"],
      queryFn: AuthService.me,
      enabled: !!currentToken,
    });

  const useForgotPassword = () =>
    useMutation({
      mutationFn: AuthService.forgotPassword,
      onSuccess: (data) => {
        toast.success(data.message || "Reset link sent to your email!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Failed to send reset link"));
      },
    });

  const useResetPassword = () =>
    useMutation({
      mutationFn: AuthService.resetPassword,
      onSuccess: () => {
        toast.success("Password reset successfully!");
      },
      onError: (error: unknown) => {
        toast.error(getErrorMessage(error, "Reset failed"));
      },
    });

  return {
    useLogin,
    useRegister,
    useVerifyEmail,
    useResendEmailOtp,
    useLogout,
    useMe,
    useForgotPassword,
    useResetPassword,
  };
};
