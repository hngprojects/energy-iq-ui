"use client";

import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface InverterCardProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}

export function InverterCard({
  title,
  subtitle,
  selected,
  onSelect,
}: InverterCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border bg-white px-3 py-6 text-center transition-colors",
        selected
          ? "border-[#057A55] bg-[#F1FCF5]"
          : "border-[#E6E6E6] hover:border-[#D1D5DB]",
      )}
    >
      <Sun className="h-6 w-6 text-[#111827]" />
      <div className="space-y-1">
        <h4 className="text-dark-alt text-base font-semibold lg:text-lg">
          {title}
        </h4>
        <p className="text-sm text-[#5D5C5D] lg:text-base">{subtitle}</p>
      </div>
    </button>
  );
}
