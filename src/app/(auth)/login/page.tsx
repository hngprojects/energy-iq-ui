import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthLoginForm } from "@/components/auth/auth-login-form";

export default function LoginPage() {
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
