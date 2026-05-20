"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertDetailsCardProps {
  severity: "critical" | "warning" | "info";
  title: string;
  triggeredAt: string;
  status: string;
  details: string;
  className?: string;
}

const severityConfig = {
  critical: {
    borderColor: "border-danger/50",
    iconColor: "text-danger",
    labelColor: "text-danger",
  },
  warning: {
    borderColor: "border-warning/50",
    iconColor: "text-warning",
    labelColor: "text-warning",
  },
  info: {
    borderColor: "border-chart-4/50",
    iconColor: "text-chart-4",
    labelColor: "text-chart-4",
  },
};

export function AlertDetailsCard({
  severity,
  title,
  triggeredAt,
  status,
  details,
  className,
}: AlertDetailsCardProps) {
  const config = severityConfig[severity];

  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-card p-4 text-foreground",
        config.borderColor,
        className,
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <AlertTriangle className={cn("h-4 w-4", config.iconColor)} />
        <span className={cn("text-sm font-semibold", config.labelColor)}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)} - {title}
        </span>
      </div>
      <p className="mb-1 text-xs text-muted-foreground">
        Triggered: {triggeredAt}&nbsp;&nbsp;|&nbsp;&nbsp;Status: {status}
      </p>
      <p className="text-xs text-slate-800 dark:text-slate-200">{details}</p>
    </div>
  );
}
