"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const { setTempEmail, isAuthenticated, token } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAuthenticated && token) {
      const redirect = searchParams.get("redirect");
      router.replace(redirect ?? "/dashboard");
      return;
    }
    setTempEmail(null);
    localStorage.removeItem("temp_email");
  }, [isAuthenticated, token, router, setTempEmail, searchParams]);

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
