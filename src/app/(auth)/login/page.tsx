"use client";
import { useEffect } from "react";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLoginForm } from "@/components/auth/auth-login-form";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const { setTempEmail } = useAuthStore();

  useEffect(() => {
    setTempEmail(null);
    localStorage.removeItem("temp_email");
  }, [setTempEmail]);

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
