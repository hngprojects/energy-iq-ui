"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { AuthHeader } from "@/components/auth/auth-header";

export function AuthVerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { useVerifyEmail } = useAuthQueries();
  const verifyMutation = useVerifyEmail();

  const isComplete = otp.length === 6;

  const handleVerify = async () => {
    if (!isComplete) return;

    verifyMutation.mutate(
      { email, otp },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (error: unknown) => {
          const message =
            error instanceof Error
              ? error.message
              : (error as { message?: string })?.message ||
                "Oh no! The code you entered is incorrect.";
          toast.error(message);
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px] duration-300">
        <div
          className={cn(
            "animate-in zoom-in-95 mx-4 flex w-full flex-col items-center justify-center bg-white p-10 text-center shadow-2xl duration-300",
            "min-h-102.75 max-w-122.25 rounded-[8px]",
          )}
        >
          <div className="mb-6 flex h-24 w-24 items-center justify-center">
            <svg
              width="98"
              height="98"
              viewBox="0 0 98 98"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="98" height="98" rx="49" fill="#E1FAEA" />
              <rect
                x="12"
                y="12"
                width="74"
                height="74"
                rx="37"
                fill="#4ADE80"
              />
              <path
                d="M42.332 50.2663L45.3437 53.7082C46.1905 54.6759 47.7173 54.6046 48.4702 53.5621L55.6654 43.5996"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M44.4256 32.2805C45.5881 31.2898 46.1694 30.7944 46.7772 30.5039C48.1829 29.832 49.8171 29.832 51.2228 30.5039C51.8306 30.7944 52.4119 31.2898 53.5744 32.2805C54.7713 33.3005 55.987
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h2 className="text-dark-bg mb-2 text-3xl font-bold md:text-4xl">
            Email Verification Successful
          </h2>

          <p className="text-grey-dark mb-8 text-base md:text-lg">
            Your email has been successfully verified.
          </p>

          <Button
            className="h-14 w-full rounded-xl bg-[#1A1F2C] text-xl font-medium text-white hover:bg-[#1A1F2C]/90"
            asChild
          >
            <Link href="/login">Continue</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-center">
      <AuthHeader
        title="Email Verification"
        subtitle={`Hello, enter the 6-digit code sent to ${email} to verify and activate your EnergyIQ account.`}
      />

      <div className="mt-10">
        <p className="text-foreground text-sm font-medium">
          Please paste (or type) your 6-digit code
        </p>

        <div className="mt-8 flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(val) => setOtp(val)}
            containerClassName="justify-center gap-2"
          >
            <InputOTPGroup className="gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className={cn(
                    "h-10 w-10 rounded-lg border bg-transparent text-lg font-medium shadow-none transition-colors md:h-20 md:w-20",
                    "data-[active=true]:border-positive data-[active=true]:ring-positive/20 data-[active=true]:ring-[3px]",
                    "focus:ring-0 md:text-2xl",
                    "focus:border-primary border-[#00000037]",
                  )}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <p className="mt-8 text-sm">
          <span className="text-slate-60">Code is valid for </span>
          <span className="text-foreground font-medium">1:59s</span>
        </p>
      </div>

      <div className="mt-14 flex w-full flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
        <Button
          size="lg"
          onClick={handleVerify}
          disabled={!isComplete || verifyMutation.isPending}
          className={cn(
            "text-md h-14 w-full rounded-[12px] font-medium transition-all md:order-2 md:text-lg",
            isComplete && !verifyMutation.isPending
              ? "bg-[#1A1F2C] text-white shadow-none hover:bg-[#1A1F2C]/90"
              : "cursor-not-allowed bg-[#1A1F2C] text-white opacity-80",
          )}
        >
          {verifyMutation.isPending ? "Verifying..." : "Confirm Email"}
        </Button>

        <Button
          variant="outline"
          size="lg"
          asChild
          className="text-md h-14 rounded-xl border border-slate-200 bg-transparent font-medium text-slate-900 shadow-none transition-colors hover:bg-slate-50 md:order-1 md:text-lg"
        >
          <Link href="/signup">Back</Link>
        </Button>
      </div>
    </div>
  );
}
