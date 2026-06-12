"use client";

import * as React from "react";
import { X, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: DeleteAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-[calc(100%-2rem)] sm:max-w-md p-6 rounded-2xl"
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-semibold text-dark-text">
                Delete Account
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <button
                aria-label="Close"
                type="button"
                className="rounded-full p-1 text-[#6B7280] hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>

          {/* Description */}
          <DialogDescription className="text-sm text-[#5D5C5D] leading-relaxed">
            Are you sure you want to delete your account? This action is permanent and cannot be undone. All of your data, devices, and history will be permanently deleted.
          </DialogDescription>

          {/* Footer / Actions */}
          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto h-11 px-5 text-sm font-medium text-dark-text border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              disabled={isPending}
              onClick={onConfirm}
              className="w-full sm:w-auto h-11 px-5 text-sm font-medium text-white bg-destructive hover:bg-destructive/90 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer hover:text-white"
            >
              {isPending ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
