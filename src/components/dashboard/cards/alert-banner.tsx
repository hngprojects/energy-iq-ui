import { AlertTriangle, X } from "lucide-react";

export function AlertBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div className="border-danger bg-danger-bg flex items-center justify-center gap-3 rounded-xl border px-4 py-3">
      <AlertTriangle className="text-danger mt-0.5 h-5 w-5 shrink-0" />
      <p className="text-danger flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="text-danger hover:text-danger/80 cursor-pointer transition-colors"
        title="Dismiss alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

