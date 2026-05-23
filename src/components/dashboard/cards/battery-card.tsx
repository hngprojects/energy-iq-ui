import { BatteryMedium } from "lucide-react";
import { MetricCard } from "./metric-card";
import { ProgressBar } from "../shared/progress-bar";

export function BatteryCard({
  percent,
  hoursLeft,
}: {
  percent: number;
  hoursLeft?: number;
}) {
  const isLow = percent < 20;

  return (
    <MetricCard
      icon={BatteryMedium}
      iconClass={isLow ? "text-danger" : "text-foreground"}
      label="Battery"
      value={`${percent}%`}
      valueClass={isLow ? "text-danger" : undefined}
      pill={hoursLeft != null ? `${hoursLeft}hrs of usage left` : undefined}
    >
      <ProgressBar
        value={Math.round(percent / 10) * 10}
        colorClass={isLow ? "bg-danger" : "bg-success-alt"}
      />
    </MetricCard>
  );
}
