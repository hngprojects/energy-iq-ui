import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNaira(value: number): string {
  if (Math.abs(value) >= 1_000_000)
    return `₦ ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `₦ ${(value / 1_000).toFixed(0)}k`;
  return `₦ ${value}`;
}

export function formatNairaOrDash(value: number | null | undefined): string {
  if (value == null) return "—";
  return `₦${Math.round(value).toLocaleString()}`;
}

export function formatSingleDate(d: string): string {
  if (!d) return "";
  const dateOnly = d.includes("T") ? d.split("T")[0] : d;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) return "";
  const [y, m, day] = dateOnly.split("-").map(Number);
  const date = new Date(y, m - 1, day);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "";

  const startFmt = formatSingleDate(start);
  const endFmt = formatSingleDate(end);

  if (startFmt && endFmt) return `${startFmt} - ${endFmt}`;
  return startFmt || endFmt;
}
