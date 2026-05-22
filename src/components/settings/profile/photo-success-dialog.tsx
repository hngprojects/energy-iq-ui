"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface PhotoSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhotoSuccessDialog({ open, onOpenChange }: PhotoSuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-sm">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-4">
            <Image
              src="/images/success_and_error_badge.svg"
              alt="success icon"
              width={72}
              height={72}
            />
          </div>

          <DialogTitle className="text-xl font-semibold text-dark-text">Successful</DialogTitle>

          <DialogDescription className="mt-1 text-sm text-[#5D5C5D]">
            Profile Image updated !
          </DialogDescription>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="mt-6 h-14 w-full rounded-lg bg-secondary text-base font-medium text-white hover:bg-secondary/90 transition-colors"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
