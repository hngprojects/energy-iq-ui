"use client";
import { useState, Suspense } from "react";
import { useActiveCostSavingsTab } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import { CostSavingsTabs } from "@/components/dashboard/cost-savings/cost-savings-tabs";
import { SummaryPanel } from "@/components/dashboard/cost-savings/summary-panel";
import { CalculatorPanel } from "@/components/dashboard/cost-savings/calculator/calculator-panel";
import { CalculatorProvider } from "@/components/dashboard/cost-savings/calculator/calculator-context";
import { ResultsPanel } from "@/components/dashboard/cost-savings/results-panel";
import { CumulativeTrackerPanel } from "@/components/dashboard/cost-savings/cumulative-tracker-panel";
import { TOTAL_STEPS } from "@/components/dashboard/cost-savings/calculator/calculator-context";

function TabPanels({
  onCalculatorStepChange,
}: {
  onCalculatorStepChange: (s: number) => void;
}) {
  const activeTab = useActiveCostSavingsTab();

  if (activeTab === "summary") return <SummaryPanel />;
  if (activeTab === "calculator")
    return <CalculatorPanel onStepChange={onCalculatorStepChange} />;
  if (activeTab === "results") return <ResultsPanel />;
  if (activeTab === "cumulative-tracker") return <CumulativeTrackerPanel />;
  return null;
}

export default function CostAndSavingsPage() {
  const [calculatorStep, setCalculatorStep] = useState(1);
  const activeTab = useActiveCostSavingsTab(); // ← move hook here

  return (
    <Suspense fallback={null}>
      <CostSavingsTabs
        useSearchParamNav
        calculatorStep={calculatorStep}
        totalCalculatorSteps={TOTAL_STEPS}
      />
      <Suspense fallback={null}>
        <CalculatorProvider>
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            <TabPanels onCalculatorStepChange={setCalculatorStep} />
          </div>
        </CalculatorProvider>
      </Suspense>
    </Suspense>
  );
}
