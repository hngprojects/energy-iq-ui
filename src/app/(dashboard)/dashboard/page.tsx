import { Sun, Zap, RefreshCw } from "lucide-react";
import { AlertBanner } from "@/components/dashboard/cards/alert-banner";
import { MetricCard } from "@/components/dashboard/cards/metric-card";
import { BatteryCard } from "@/components/dashboard/cards/battery-card";
import {
  SavedTodayCard,
  SavedMonthCard,
} from "@/components/dashboard/cards/savings-card";
import { PowerUsageCard } from "@/components/dashboard/cards/power-usage-card";
import { EnergyUsageChart } from "@/components/dashboard/charts/energy-usage-chart";
import { AIAssistantBanner } from "@/components/dashboard/ai/ai-assistant-banner";
import { dashboardMock as d } from "@/lib/mocks/dashboard-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight lg:text-3xl">
            Good afternoon, {d.user.name}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Your system has been running on solar for 6 hrs today
          </p>
        </div>
        <div className="flex items-center gap-1.5 self-start text-xs">
          <span className="text-muted-foreground">{d.status.updated}</span>
          <RefreshCw className="text-muted-foreground h-3 w-3 cursor-pointer transition-transform duration-500 hover:rotate-180" />
        </div>
      </div>

      <AlertBanner message={d.alert} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Sun}
          label="Solar Input"
          value={d.solar.value}
          unit={d.solar.unit}
          sub={`Peak today: ${d.solar.peak}`}
          pill={d.solar.note}
        />
        <BatteryCard
          percent={d.battery.percent}
          hoursLeft={d.battery.hoursLeft}
        />
        <MetricCard
          icon={Zap}
          iconClass="text-chart-battery"
          label="Running now"
          value={d.running.value}
          unit={d.running.unit}
          sub={`${d.running.capacityPct}% of your total capacity`}
          pill={d.running.note}
          pillTone="muted"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SavedTodayCard {...d.savedToday} />
        <SavedMonthCard {...d.savedMonth} />
        <PowerUsageCard zones={d.zones} />
      </div>

      <EnergyUsageChart data={d.weekly} />
      <AIAssistantBanner />
    </div>
  );
}

