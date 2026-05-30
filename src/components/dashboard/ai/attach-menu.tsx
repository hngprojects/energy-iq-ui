"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AttachMenuProps {
  buttonClassName?: string;
  iconSize?: string;
  onFilesSelected?: (files: FileList) => void;
  onTakeScreenshot?: () => void;
  comingSoon?: boolean;
  comingSoonLabel?: string;
}

export function AttachMenu({
  buttonClassName,
  iconSize = "h-4 w-4",
  onFilesSelected,
  onTakeScreenshot,
  comingSoon = false,
  comingSoonLabel = "Attach (coming soon)",
}: AttachMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonTitle = comingSoon ? comingSoonLabel : "Attach";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <Tooltip
        content={buttonTitle}
        wrapperClassName="inline-flex"
        align="start"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={buttonTitle}
          aria-disabled={comingSoon}
          onClick={(event) => {
            if (comingSoon) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            setOpen((v) => !v);
          }}
          onKeyDown={(event) => {
            if (!comingSoon) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
            }
          }}
          className={cn(
            buttonClassName,
            comingSoon && "cursor-not-allowed opacity-50",
          )}
        >
          <Plus className={iconSize} />
        </Button>
      </Tooltip>

      {open && !comingSoon && (
        <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted">
            <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>Add Photo or files</span>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.length) onFilesSelected?.(e.target.files);
                setOpen(false);
              }}
            />
          </label>
          <button
            type="button"
            onClick={() => {
              onTakeScreenshot?.();
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <Camera className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>Take a screenshot</span>
          </button>
        </div>
      )}
    </div>
  );
}

