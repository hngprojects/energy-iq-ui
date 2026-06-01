"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { useAuthStore } from "@/stores/auth-store";

const getSafeRedirect = (redirect: string | null, fallback: string): string => {
  if (
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//") &&
    !redirect.includes("://")
  ) {
    return redirect;
  }

  return fallback;
};

export default function LoginPage() {
  const { setTempEmail, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect");
      router.replace(getSafeRedirect(redirect, "/dashboard"));
      return;
    }
    setTempEmail(null);
    localStorage.removeItem("temp_email");
  }, [isAuthenticated, router, setTempEmail, searchParams]);

  return (
    <AuthWrapper>
      <div className="mt-29 lg:mt-44">
        <AuthHeader
          title="Welcome Back"
          subtitle="Sign In to your EnergyIQ account. Take Control of your Energy."
        />
        <AuthLoginForm />
      </div>
    </AuthWrapper>
  );
}
