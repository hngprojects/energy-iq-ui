"use client";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CircleX, CircleCheck } from "lucide-react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isSuccess?: boolean;
  statusColor?: "yellow" | "red" | "green";
  helperText?: string;
  hideErrorMessage?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      id,
      type,
      error,
      isSuccess,
      statusColor,
      helperText,
      hideErrorMessage,
      className,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const togglePassword = () => setShowPassword(!showPassword);

    return (
      <div className="flex flex-col space-y-2">
        <Label
          htmlFor={id}
          className="text-dark-text text-md font-medium md:text-lg"
        >
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              "border-border placeholder:text-muted-foreground focus-visible:border-border-active md:text-md h-13 px-7 py-3.25 text-sm transition-colors",
              statusColor === "green" &&
                "border-positive focus-visible:border-positive focus:border-positive",
              statusColor === "yellow" &&
                "border-amber-50 focus-visible:border-amber-50 focus:border-amber-50",
              statusColor === "red" &&
                "border-destructive focus-visible:border-destructive focus:border-destructive",
              !statusColor &&
                isSuccess &&
                "border-positive focus-visible:border-positive focus:border-positive",
              !statusColor &&
                error &&
                "border-destructive focus-visible:border-destructive focus:border-destructive",
              (statusColor === "red" || statusColor === "green") &&
                (isPassword ? "pr-20" : "pr-12"),
              className,
            )}
            {...props}
          />
          {statusColor === "red" && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
              <CircleX className="fill-destructive text-white w-5 h-5" />
            </div>
          )}
          {statusColor === "green" && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none">
              <CircleCheck className="fill-positive text-white w-5 h-5" />
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onClick={togglePassword}
              className={cn(
                "text-slate-60 hover:text-grey-light absolute top-1/2 -translate-y-1/2 cursor-pointer transition-all",
                statusColor === "red" || statusColor === "green"
                  ? "right-12"
                  : "right-4",
              )}
            >
              {showPassword ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {!hideErrorMessage && helperText ? (
          <p
            className={cn(
              "mt-2 text-[12px] leading-tight font-semibold",
              statusColor === "green" && "text-positive",
              statusColor === "yellow" && "text-amber-50",
              statusColor === "red" && "text-destructive",
            )}
          >
            {helperText}
          </p>
        ) : !hideErrorMessage && error ? (
          <p className="text-destructive mt-2 text-[12px] leading-tight font-semibold">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";
