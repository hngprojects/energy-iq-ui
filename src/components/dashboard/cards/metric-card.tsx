import type { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  iconClass = "text-primary",
  label,
  value,
  unit,
  sub,
  pill,
  pillTone = "success",
  children,
}: {
  icon: LucideIcon;
  iconClass?: string;
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  pill?: string;
  pillTone?: "success" | "muted";
  children?: React.ReactNode;
}) {
  return (
    <div className="border-border bg-card flex flex-col gap-3 rounded-2xl border p-5">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <Icon className={`h-4 w-4 ${iconClass}`} />
        <span>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        {unit && (
          <span className="text-foreground/80 text-2xl font-bold">{unit}</span>
        )}
      </div>
      {children}
      {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      {pill && (
        <span
          className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
            pillTone === "success"
              ? "bg-chart-battery/10 text-chart-battery"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {pill}
        </span>
      )}
    </div>
  );
}
