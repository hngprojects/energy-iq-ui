"use client";

import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthForgotPasswordForm } from "@/components/auth/auth-forgot-password-form";
import { AuthSuccessView } from "@/components/auth/auth-success-view";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AuthWrapper>
      <div className="mt-56.5 lg:mt-49.75">
        <AuthHeader
          title={isSubmitted ? "Check Your Email" : "Forgot Your Password"}
          subtitle={
            isSubmitted ? (
              <>
                <span className="hidden md:inline">
                  We just sent you an email with a link to continue. Check your
                  inbox.
                </span>
                <span className="md:hidden">
                  We just sent a message to your mail.
                </span>
              </>
            ) : (
              "Enter your email address and we will send you a reset link."
            )
          }
        />
        {isSubmitted ? (
          <AuthSuccessView />
        ) : (
          <AuthForgotPasswordForm onSuccess={() => setIsSubmitted(true)} />
        )}
      </div>
    </AuthWrapper>
  );
}
