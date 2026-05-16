"use client";

import { useState, useCallback } from "react";
import {
  AlertTriangle,
  Clock,
  BatteryFull,
  CheckCircle,
  Sun,
  ChevronDown,
  RefreshCw,
  Unplug,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertSeverity,
  AlertFilterType,
  alertsMock,
  FILTER_OPTIONS,
} from "@/lib/mocks/alerts-data";
import { Button } from "@/components/ui/button";

const ICON_MAP = {
  battery_low: AlertTriangle,
  power_high: Unplug,
  clock: Clock,
  battery_full: BatteryFull,
  check: CheckCircle,
  solar: Sun,
} as const;

// Severity badge
const SEVERITY_STYLES: Record<
  AlertSeverity,
  { bg: string; dot: string; text: string; label: string }
> = {
  critical: {
    bg: "bg-red-50",
    dot: "bg-destructive",
    text: "text-destructive",
    label: "Critical",
  },
  warning: {
    bg: "bg-amber-bg-light",
    dot: "bg-amber",
    text: "text-amber-70",
    label: "Warning",
  },
  success: {
    bg: "bg-success-bg",
    dot: "bg-chart-battery",
    text: "text-chart-battery",
    label: "Success",
  },
};

function SeverityBadge({ severity }: { severity: AlertSeverity }) {
  const s = SEVERITY_STYLES[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
        s.bg,
        s.text,
      )}
    >
      <span className={cn("size-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function StatusText({ status }: { status: Alert["status"] }) {
  const label =
    status === "unresolved"
      ? "Unresolved"
      : status === "resolved"
        ? "Resolved"
        : "No action needed";
  return <span className="text-foreground text-sm">{label}</span>;
}

// Row skeleton
function SkeletonRow() {
  return (
    <tr className="border-border border-b last:border-0">
      <td className="py-4 pr-4 pl-1">
        <div className="flex items-center gap-3">
          <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
          <div className="space-y-1.5">
            <div className="bg-muted h-3.5 w-40 animate-pulse rounded" />
            <div className="bg-muted h-3 w-28 animate-pulse rounded" />
          </div>
        </div>
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-6 w-20 animate-pulse rounded-full" />
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-3.5 w-20 animate-pulse rounded" />
      </td>
      <td className="py-4 pr-4">
        <div className="bg-muted h-3.5 w-24 animate-pulse rounded" />
      </td>
      <td className="py-4">
        <div className="bg-muted ml-auto h-8 w-20 animate-pulse rounded-lg" />
      </td>
    </tr>
  );
}

// Inspect modal
function InspectModal({
  alert,
  onClose,
  onResolve,
}: {
  alert: Alert | null;
  onClose: () => void;
  onResolve: (id: string) => void;
}) {
  const Icon = alert ? ICON_MAP[alert.iconType] : null;
  const sev = alert ? SEVERITY_STYLES[alert.severity] : null;

  return (
    <Dialog open={!!alert} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md gap-5">
        {alert && Icon && sev && (
          <>
            <DialogHeader className="gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                    sev.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", sev.text)} />
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold">
                    {alert.title}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {alert.subtitle}. {alert.time}
                  </p>
                </div>
              </div>
            </DialogHeader>

            {alert.modalDetail && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {alert.modalDetail.metrics.map((m) => (
                    <div key={m.label} className="bg-muted rounded-xl p-3">
                      <p className="text-muted-foreground text-xs">{m.label}</p>
                      <p className="text-foreground mt-1 text-base font-bold">
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-muted rounded-xl p-4">
                  <p className="text-foreground mb-1.5 text-sm font-semibold">
                    Why this alert?
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {alert.modalDetail.reason}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => {
                  onResolve(alert.id);
                  onClose();
                }}
                className="bg-secondary text-primary-foreground hover:bg-secondary/80 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
              >
                Resolve Now
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Filter dropdown
function FilterDropdown({
  value,
  onChange,
}: {
  value: AlertFilterType;
  onChange: (v: AlertFilterType) => void;
}) {
  const currentLabel =
    FILTER_OPTIONS.find((o) => o.value === value)?.label ?? "All";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors">
          <span className="text-muted-foreground">Alert Type:</span>
          <span className="text-foreground">{currentLabel}</span>
          <ChevronDown className="text-muted-foreground h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={4}
          align="start"
          className="bg-card border-border z-50 min-w-36 overflow-hidden rounded-xl border py-1 shadow-lg"
        >
          {FILTER_OPTIONS.map((opt) => (
            <DropdownMenu.Item
              key={opt.value}
              onSelect={() => onChange(opt.value)}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                value === opt.value
                  ? "bg-muted text-foreground font-semibold"
                  : "text-foreground hover:bg-muted",
              )}
            >
              {opt.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

// Main component
function filterAlerts(alerts: Alert[], filter: AlertFilterType): Alert[] {
  if (filter === "all") return alerts;
  if (filter === "resolved")
    return alerts.filter((a) => a.status === "resolved");
  if (filter === "unresolved")
    return alerts.filter((a) => a.status === "unresolved");
  return alerts.filter((a) => a.severity === filter);
}

export function AlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>(alertsMock);
  const [filter, setFilter] = useState<AlertFilterType>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [secondsAgo, setSecondsAgo] = useState(30);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSecondsAgo(0);
    }, 1500);
  }, [isRefreshing]);

  const handleResolve = useCallback((id: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "resolved" as const } : a,
      ),
    );
  }, []);

  const displayed = filterAlerts(alerts, filter);
  const unreadCount = alerts.filter((a) => a.status === "unresolved").length;

  return (
    <>
      <div className="bg-card border-border overflow-hidden rounded-xl border">
        {/* Toolbar */}
        <div className="border-border flex flex-col gap-2 border-b px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <FilterDropdown value={filter} onChange={setFilter} />

          <div className="flex items-center gap-2 border border-[#EDEDED] py-1 px-1.5">
            <span className="flex items-center gap-1.5 text-sm">
              <span className="bg-secondary inline-block h-1.5 w-1.5 rounded-full" />
              <span className="text-foreground font-medium">
                You have {unreadCount} unread alert
                {unreadCount !== 1 ? "s" : ""}
              </span>
            </span>
            <span className="text-muted-foreground hidden text-sm sm:inline">
              last updated {secondsAgo} secs ago
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh alerts"
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors disabled:pointer-events-none"
            >
              <RefreshCw
                className={cn(
                  "size-4 transition-transform duration-500",
                  isRefreshing && "animate-spin",
                )}
              />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-160">
            <thead>
              <tr className="border-border border-b">
                <th className="text-muted-foreground py-3 pr-4 pl-4 text-left text-sm font-medium">
                  Name
                </th>
                <th className="text-muted-foreground py-3 pr-4 text-left text-sm font-medium">
                  Severity
                </th>
                <th className="text-muted-foreground py-3 pr-4 text-left text-sm font-medium">
                  Status
                </th>
                <th className="text-muted-foreground py-3 pr-4 text-left text-sm font-medium">
                  Time
                </th>
                <th className="text-muted-foreground py-3 pr-4 text-right text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isRefreshing
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))
                : displayed.map((alert) => {
                    const Icon = ICON_MAP[alert.iconType];
                    const isActionable = alert.status === "unresolved";
                    return (
                      <tr
                        key={alert.id}
                        className="border-border border-b last:border-0"
                      >
                        <td className="py-4 pr-4 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#E8E8E8] flex size-10 shrink-0 items-center justify-center rounded-full">
                              <Icon className="text-[#121212] size-4" />
                            </div>
                            <div>
                              <p className="text-foreground text-base font-semibold">
                                {alert.title}
                              </p>
                              <p className="text-muted-foreground mt-0.5 text-sm">
                                {alert.subtitle}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          <SeverityBadge severity={alert.severity} />
                        </td>
                        <td className="py-4 pr-4">
                          <StatusText status={alert.status} />
                        </td>
                        <td className="text-muted-foreground py-4 pr-4 text-sm">
                          {alert.time}
                        </td>
                        <td className="py-4 pr-4 text-right">
                          {isActionable ? (
                            <Button
                              onClick={() => setActiveAlert(alert)}
                              className="bg-secondary text-primary-foreground hover:bg-secondary/80 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                            >
                              Inspect
                            </Button>
                          ) : (
                            <Button
                              disabled
                              className="bg-muted text-muted-foreground cursor-default rounded-lg px-4 py-2 text-sm font-medium"
                            >
                              {alert.status === "resolved"
                                ? "Resolved"
                                : "No action needed"}
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}

              {!isRefreshing && displayed.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground py-10 text-center text-sm"
                  >
                    No alerts match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InspectModal
        alert={activeAlert}
        onClose={() => setActiveAlert(null)}
        onResolve={handleResolve}
      />
    </>
  );
}

