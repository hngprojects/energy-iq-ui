import { BatteryMedium } from "lucide-react";
import { MetricCard } from "./metric-card";
import { ProgressBar } from "../shared/progress-bar";

export function BatteryCard({
  percent,
  hoursLeft,
}: {
  percent: number;
  hoursLeft: number;
}) {
  return (
    <MetricCard
      icon={BatteryMedium}
      iconClass="text-foreground"
      label="Battery"
      value={`${percent}%`}
      pill={`${hoursLeft}hrs of usage left`}
    >
      <ProgressBar value={Math.round(percent / 10) * 10} />
    </MetricCard>
  );
}
