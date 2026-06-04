"use client";

import { ArrowRight, RefreshCw, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { SUMMARY_CARDS, PETROL_RATE, HOURS_BEFORE, HOURS_AFTER } from "@/lib/mocks/cost-savings-results";
import { SavingsCard } from "./primitives";
import { DailyCostBreakdownCard } from "./daily-cost-breakdown-card";
import { DailyBarChartCard } from "./daily-bar-chart-card";

interface ResultsPanelProps {
  onViewCumulativeTracker?: () => void;
  onRecalculate?: () => void;
  onExportPdf?: () => void;
}

export function ResultsPanel({
  onViewCumulativeTracker,
  onRecalculate,
  onExportPdf,
}: ResultsPanelProps = {}) {
  return (
    <section aria-label="Savings results" className="w-full min-w-0 overflow-hidden pb-8">

      {/* ── Heading ── */}
      <h2 className="mt-6 text-[18px] lg:text-[20px] font-medium leading-none text-foreground">
        Your saving results
      </h2>
      <p className="mt-2 text-[13px] lg:text-sm font-normal leading-none text-grey">
        Petrol {PETROL_RATE} L/hr · {HOURS_BEFORE} hrs before / {HOURS_AFTER} hrs now · Band A · Lagos
      </p>

      {/* ── Summary ── */}
      <div className="mt-8 lg:mt-10 grid gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {SUMMARY_CARDS.map((card) => (
          <SavingsCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Bar chart + Daily cost breakdown ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 mt-8 lg:mt-10.25">
        <DailyBarChartCard />
        <DailyCostBreakdownCard />
      </div>

      {/* ── Action bar ── */}
      <div
        className={cn(
          "flex flex-col gap-3",
          "sm:flex-row sm:flex-wrap sm:gap-3",
          "lg:gap-0 lg:justify-between",
          "mt-6 lg:mt-9.25",
        )}
      >
        <Button
          variant="secondary"
          className="h-10 gap-1.5 text-surface-20 rounded-lg px-4 w-full sm:w-auto lg:w-69.5"
          onClick={onViewCumulativeTracker}
        >
          View cumulative saving tracker
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-1.5 rounded-lg border-slate-60 text-foreground px-4 w-full sm:w-auto lg:w-71"
          onClick={onRecalculate}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Recalculate
        </Button>

        <Button
          variant="outline"
          className="h-10 gap-2 rounded-lg border-slate-60 text-foreground px-4 w-full sm:w-auto lg:w-71"
          onClick={onExportPdf}
        >
          <Download className="size-4" aria-hidden="true" />
          Export PDF report
        </Button>
      </div>

    </section>
  );
}
