"use client";

import { getStatusColors } from "@/constants/reports";

export function ReportStatusBadge({ status }: { status: string }) {
  const normalized = status?.toUpperCase() || "PENDING";
  const colors = getStatusColors(normalized);
  const label = normalized.charAt(0) + normalized.slice(1).toLowerCase();

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold animate-fade-in"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0 animate-pulse"
        style={{ backgroundColor: colors.text }}
      />
      {label}
    </span>
  );
}
