"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthQueries } from "@/hooks/use-auth-queries";
import { toast } from "sonner";

export function AuthSuccessView() {
  const { useForgotPassword } = useAuthQueries();
  const { mutate: resend, isPending } = useForgotPassword();

  const [email] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("reset_email");
  });

  const handleResend = () => {
    if (!email) {
      toast.error("Email address not found. Please try again.");
      return;
    }

    resend({ email });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 lg:flex-row-reverse">
        <Button
          type="button"
          disabled={isPending || !email}
          onClick={handleResend}
          className="bg-secondary hover:bg-secondary/90 h-12 flex-1 rounded-lg px-8 py-3 text-lg font-semibold text-white disabled:opacity-50 lg:h-14 lg:py-5"
        >
          {isPending ? "Sending..." : "Resend Link"}
        </Button>

        <Button
          type="button"
          variant="outline"
          asChild
          className="border-border-disabled bg-surface-white text-dark-text hover:bg-surface-white/90 h-12 flex-1 rounded-lg border px-7 py-3 text-lg font-medium lg:h-14 lg:px-8 lg:py-5"
        >
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
