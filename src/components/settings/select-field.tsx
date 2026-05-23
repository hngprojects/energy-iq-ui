"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Select...",
  disabled = false,
  className,
}: SelectFieldProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={cn(
          "flex h-14 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm text-left transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-default opacity-60",
          !value && "text-muted-foreground",
          className,
        )}
      >
        <span className="truncate">{value || placeholder}</span>
        {!disabled && (
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        )}
      </button>

      {open && !disabled && (
        <div role="listbox" aria-label="Options" className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-md">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option ? "true" : "false"}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={cn(
                "w-full cursor-default px-3 py-2 text-left text-sm hover:bg-muted",
                value === option && "bg-muted font-medium",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
