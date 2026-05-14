import { AuthVerifyEmailForm } from "@/components/auth/auth-verify-email-form";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <AuthWrapper>
      <div className="mt-29 lg:mt-44">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthVerifyEmailForm />
        </Suspense>
      </div>
    </AuthWrapper>
  );
}
