"use client";
import { useEffect } from "react";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthSignupForm } from "@/components/auth/auth-signup-form";
import { useAuthStore } from "@/stores/auth-store";

export default function SignupPage() {
  const { setTempEmail } = useAuthStore();

  useEffect(() => {
    // Only clear if explicitly needed, but not on every mount to allow "Back" from verify-email
    // setTempEmail(null);
    // localStorage.removeItem("temp_email");
  }, [setTempEmail]);

  return (
    <AuthWrapper>
      <div className="mt-28 lg:mt-44">
        <AuthHeader
          title="Create An Account"
          subtitle="Take control of your energy, starting today."
        />
        <AuthSignupForm />
      </div>
    </AuthWrapper>
  );
}
