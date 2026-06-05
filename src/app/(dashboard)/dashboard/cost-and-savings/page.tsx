"use client";
import { useState, Suspense, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useActiveCostSavingsTab } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import { CostSavingsTabs } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import { SummaryPanel } from "@/components/dashboard/cost-savings/summary-panel";
import { CalculatorPanel } from "@/components/dashboard/cost-savings/calculator/calculator-panel";
import { CalculatorProvider } from "@/components/dashboard/cost-savings/calculator/calculator-context";
import { ResultsPanel } from "@/components/dashboard/cost-savings/result/results-panel";
import { CumulativeTrackerPanel } from "@/components/dashboard/cost-savings/cumulative/cumulative-tracker-panel";
import { SavingsSetupGate } from "@/components/dashboard/cost-savings/savings-setup-gate";
import { TOTAL_STEPS } from "@/components/dashboard/cost-savings/calculator/calculator-context";
import type { SummaryPeriod } from "@/components/dashboard/cost-savings/cost-savings-tabs";

function TabPanels({
  onCalculatorStepChange,
  summaryPeriod,
}: {
  onCalculatorStepChange: (s: number) => void;
  summaryPeriod: SummaryPeriod;
}) {
  const activeTab = useActiveCostSavingsTab();
  const router = useRouter();
  const pathname = usePathname();

  const handleCheckCalculator = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("tab", "calculator");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname]);

  if (activeTab === "summary")
    return (
      <SummaryPanel
        period={summaryPeriod}
        onCheckCalculator={handleCheckCalculator}
      />
    );
  if (activeTab === "calculator")
    return <CalculatorPanel onStepChange={onCalculatorStepChange} />;
  if (activeTab === "results") return <ResultsPanel />;
  if (activeTab === "cumulative-tracker") return <CumulativeTrackerPanel />;
  return null;
}

export default function CostAndSavingsPage() {
  const [calculatorStep, setCalculatorStep] = useState(1);
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>("daily");
  const activeTab = useActiveCostSavingsTab();

  return (
    <Suspense fallback={null}>
      <div className="space-y-6">
        <SavingsSetupGate />
        <CostSavingsTabs
          useSearchParamNav
          calculatorStep={calculatorStep}
          totalCalculatorSteps={TOTAL_STEPS}
          summaryPeriod={summaryPeriod}
          onSummaryPeriodChange={setSummaryPeriod}
        />
        <Suspense fallback={null}>
          <CalculatorProvider>
            <div
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
            >
              <TabPanels
                onCalculatorStepChange={setCalculatorStep}
                summaryPeriod={summaryPeriod}
              />
            </div>
          </CalculatorProvider>
        </Suspense>
      </div>
    </Suspense>
  );
}
