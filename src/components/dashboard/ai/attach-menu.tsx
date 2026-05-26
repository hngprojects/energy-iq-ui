"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachMenuProps {
  buttonClassName?: string;
  iconSize?: string;
}

export function AttachMenu({
  buttonClassName,
  iconSize = "h-4 w-4",
}: AttachMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Attach"
        aria-label="Attach"
        onClick={() => setOpen((v) => !v)}
        className={buttonClassName}
      >
        <Plus className={iconSize} />
      </Button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <label className="flex cursor-pointer items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted">
            <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>Add Photo or files</span>
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.txt"
              multiple
              className="sr-only"
              onChange={() => setOpen(false)}
            />
          </label>
          <button
            type="button"
            onClick={() => setOpen(false)}
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
