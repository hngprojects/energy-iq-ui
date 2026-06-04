"use client";

import { PiggyBank, Leaf, Clock, Fuel } from "lucide-react";
import { TrackerCard } from "./primitives";
import type { TrackerCardData } from "./primitives";
import { CumulativeSavingsChart } from "./cumulative-savings-chart";
import { SavingsTrendsAnalytics } from "./savings-trends-analytics";

const TRACKER_CARDS: TrackerCardData[] = [
  {
    icon: PiggyBank,
    iconColor: "var(--color-primary)",
    iconBg: "var(--color-nav-active-bg)",
    badge: "+12%",
    badgeBg: "var(--color-chart-battery)",
    badgeColor: "var(--color-success-alt)",
    label: "LIFETIME SAVINGS",
    value: "₦1.2M",
  },
  {
    icon: Leaf,
    iconColor: "var(--color-battery-full)",
    iconBg: "var(--color-success-bg)",
    label: "CO2 AVOIDED",
    value: "2.5 Tons",
  },
  {
    icon: Clock,
    iconColor: "var(--color-chart-diesel)",
    iconBg: "var(--color-amber-bg-light)",
    label: "GEN HOURS AVOIDED",
    value: "850 hrs",
  },
  {
    icon: Fuel,
    iconColor: "var(--color-coral-50)",
    iconBg: "var(--color-coral-10)",
    label: "FUEL SAVED",
    value: "1,900 Litres",
  },
];

export function CumulativeTrackerPanel() {
  return (
    <section
      aria-label="Cumulative tracker"
      className="w-full min-w-0 overflow-hidden"
    >
      <div className="grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-[27px]">
        {TRACKER_CARDS.map((card) => (
          <TrackerCard key={card.label} {...card} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:items-start mt-8">
        <CumulativeSavingsChart />
        <SavingsTrendsAnalytics />
      </div>
    </section>
  );
}
