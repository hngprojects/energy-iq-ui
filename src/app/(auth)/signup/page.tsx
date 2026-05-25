"use client";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthSignupForm } from "@/components/auth/auth-signup-form";

export default function SignupPage() {
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
