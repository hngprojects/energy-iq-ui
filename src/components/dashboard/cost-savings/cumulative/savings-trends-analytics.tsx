import { TrendCard } from "./primitives";
import type { TrendCardData } from "./primitives";

const TREND_CARDS: TrendCardData[] = [
  {
    label: "TOTAL SAVINGS TO DATE",
    value: "₦4,240,000",
    change: "+14.2%",
    description: "vs. previous period",
  },
  {
    label: "AVG. MONTHLY SAVINGS",
    value: "₦380,500",
    change: "+2.4%",
    description: "Stable efficiency trend",
  },
];

export function SavingsTrendsAnalytics() {
  return (
    <div className="flex flex-col w-full lg:w-95.25 lg:shrink-0 min-w-0">
      <h3 className="leading-normal font-medium text-[18px] lg:text-[20px] truncate text-foreground">
        Savings Trends &amp; Analytics
      </h3>

      <p className="leading-normal font-medium text-[12px] mt-2 text-muted-foreground">
        Visualizing performance delta and fiscal efficiency
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2 mt-4">
        {TREND_CARDS.map((card) => (
          <TrendCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
