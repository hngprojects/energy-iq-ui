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

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "";
  const fmt = (d: string) => {
    if (!d) return "";
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  if (start && end) return `${fmt(start)} - ${fmt(end)}`;
  if (start) return fmt(start);
  return fmt(end);
}
