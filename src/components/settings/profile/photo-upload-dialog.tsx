"use client";

import * as React from "react";
import { X, Upload } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProfileQueries } from "@/hooks/use-profile-queries";
import Image from "next/image";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
}

export function PhotoUploadDialog({
  open,
  onOpenChange,
  onUploadSuccess,
}: PhotoUploadDialogProps) {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { useUploadAvatar } = useProfileQueries();
  const { mutate: uploadAvatar, isPending } = useUploadAvatar(() => {
    onOpenChange(false);
    onUploadSuccess();
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFileError("Only image files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setFileError("File must be under 2MB.");
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setPreview(null);
      setSelectedFile(null);
      setFileError(null);
    }
    onOpenChange(isOpen);
  };

  const handleConfirm = () => {
    if (selectedFile) {
      uploadAvatar(selectedFile);
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="w-full p-0 overflow-hidden sm:max-w-179 sm:h-156.75 flex flex-col rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle className="text-base font-semibold text-dark-text">
            Upload Profile Picture
          </DialogTitle>
          <DialogClose asChild>
            <button
              aria-label="Close"
              type="button"
              className="rounded-full p-1 text-[#6B7280] hover:bg-muted transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>

        {/* Upload area */}
        <div
          className="relative flex flex-1 cursor-pointer items-center justify-center overflow-hidden bg-white"
          onClick={() => !preview && fileInputRef.current?.click()}
        >
          {preview ? (
            <>
              {/* Full image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Profile preview"
                className="h-full w-full object-cover"
                style={{ maxHeight: "340px" }}
              />
              {/* Circular crop overlay */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div
                  className="rounded-full border-4 border-white/80 shadow-lg"
                  style={{
                    width: "min(220px, 60%)",
                    height: "min(220px, 60%)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                  }}
                />
              </div>
              {/* Click to change */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="absolute bottom-4 right-4 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-dark-text shadow hover:bg-white"
              >
                Change
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <Image
                src="/images/BoxArrowUp.svg"
                alt="upload icon"
                width={40}
                height={40}
              />

              <span className="text-xs text-[#B3B3B3] bg-[#F5F5F5] rounded-[12px] py-1 px-2">
                Upload Image
              </span>
            </div>
          )}

          <input
            aria-label="Profile Image"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          {fileError && (
            <p className="mr-auto text-xs text-red-500">{fileError}</p>
          )}
          <button
            type="button"
            onClick={() => handleClose(false)}
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-dark-text hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedFile || isPending}
            onClick={handleConfirm}
            className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-medium text-white hover:bg-secondary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Uploading..." : "Confirm Image"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

