import { TrendCard } from "./primitives";

interface SavingsTrendsAnalyticsProps {
  totalSavingsToDateNgn: number;
  averageMonthlySavingsNgn: number;
  chart: {
    month: string;
    savingsNgn: number;
  }[];
}

function formatFullCurrency(val: number) {
  return `₦${Math.round(val).toLocaleString()}`;
}

export function SavingsTrendsAnalytics({
  totalSavingsToDateNgn,
  averageMonthlySavingsNgn,
  chart,
}: SavingsTrendsAnalyticsProps) {
  let totalSavingsChange = "+0%";
  let avgMonthlyChange = "+0%";
  let totalChangeDesc = "vs. previous period";
  let avgChangeDesc = "Stable efficiency trend";

  if (chart && chart.length >= 2) {
    const latestSavings = chart[chart.length - 1].savingsNgn;
    const prevSavings = chart[chart.length - 2].savingsNgn;

    if (prevSavings > 0) {
      const momPct = ((latestSavings - prevSavings) / prevSavings) * 100;
      avgMonthlyChange = `${momPct >= 0 ? "+" : ""}${momPct.toFixed(1)}%`;
      avgChangeDesc = momPct >= 0 ? "Increased efficiency" : "Decreased efficiency";
    }

    const prevTotal = totalSavingsToDateNgn - latestSavings;
    if (prevTotal > 0) {
      const growthPct = (latestSavings / prevTotal) * 100;
      totalSavingsChange = `+${growthPct.toFixed(1)}%`;
      totalChangeDesc = "Growth this month";
    }
  } else if (chart && chart.length === 1) {
    totalSavingsChange = "+100%";
    totalChangeDesc = "Initial month savings";
    avgMonthlyChange = "+0%";
    avgChangeDesc = "First month baseline";
  }

  const trendCards = [
    {
      label: "TOTAL SAVINGS TO DATE",
      value: formatFullCurrency(totalSavingsToDateNgn),
      change: totalSavingsChange,
      description: totalChangeDesc,
    },
    {
      label: "AVG. MONTHLY SAVINGS",
      value: formatFullCurrency(averageMonthlySavingsNgn),
      change: avgMonthlyChange,
      description: avgChangeDesc,
    },
  ];

  return (
    <div className="flex flex-col w-full lg:w-95.25 lg:shrink-0 min-w-0">
      <h3 className="leading-normal font-medium text-[18px] lg:text-[20px] truncate text-foreground">
        Savings Trends &amp; Analytics
      </h3>

      <p className="leading-normal font-medium text-[12px] mt-2 text-muted-foreground">
        Visualizing performance delta and fiscal efficiency
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-2 mt-4">
        {trendCards.map((card) => (
          <TrendCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
