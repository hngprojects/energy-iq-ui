import { AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  danger: {
    wrapper: "border-danger bg-danger-bg",
    text: "text-danger",
    icon: AlertTriangle,
  },
  warning: {
    wrapper: "border-amber bg-amber-bg-light",
    text: "text-amber-70",
    icon: Info,
  },
} as const;

export function AlertBanner({
  message,
  variant = "danger",
  onDismiss,
}: {
  message: string;
  variant?: "danger" | "warning";
  onDismiss?: () => void;
}) {
  const s = VARIANTS[variant];
  const Icon = s.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 rounded-xl border px-4 py-3",
        s.wrapper,
      )}
    >
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", s.text)} />
      <p className={cn("flex-1 text-sm font-medium", s.text)}>{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className={cn("cursor-pointer transition-colors hover:opacity-70", s.text)}
        title="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
