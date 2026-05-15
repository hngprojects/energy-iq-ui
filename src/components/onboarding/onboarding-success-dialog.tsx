"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OnboardingSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingSuccessDialog({
  open,
  onOpenChange,
}: OnboardingSuccessDialogProps) {
  const router = useRouter();
  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      router.push("/dashboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full sm:h-95 sm:max-w-122.25!">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-6 rounded-full">
            <Image
              src="/images/success_and_error_badge.svg"
              alt="success icon"
              width={98}
              height={98}
            />
          </div>

          <div className="mx-auto w-full text-center sm:max-w-102.25">
            <DialogTitle className="text-2xl font-bold text-[#111827] sm:text-3xl lg:text-4xl">
              You&apos;re all set!
            </DialogTitle>

            <DialogDescription className="mt-2 text-base text-[#5D5C5D]">
              Your EnergyIQ account has been successfully created and your
              Energy System is ready to be monitored
            </DialogDescription>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="mt-8 h-14 rounded-lg bg-[#E5E7EB] px-4 text-base font-medium text-[#111827] hover:bg-[#D1D5DB] sm:w-fit sm:px-16 lg:text-lg"
          >
            Continue to dashboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
