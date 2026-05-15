"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AuthResetSuccessView() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-12 flex flex-col space-y-2">
        <h1 className="text-dark-text text-3xl font-bold tracking-tight">
          You’re All Set
        </h1>
        <p className="text-grey-dark text-base">
          Your password has been updated successfully.
        </p>
      </div>

      <div className="flex w-full justify-end">
        <Button
          asChild
          className="bg-secondary hover:bg-secondary/90 h-12 flex-1 rounded-lg px-8 py-3 text-lg font-semibold text-white disabled:opacity-50 lg:h-14 lg:py-5"
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
