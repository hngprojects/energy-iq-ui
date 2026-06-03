import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CostSavingsTabs,
  // useActiveCostSavingsTab,
} from "@/components/dashboard/cost-savings/cost-savings-tabs";
// import { SummaryPanel } from "@/components/dashboard/cost-savings/summary-panel";
// import { CalculatorPanel } from "@/components/dashboard/cost-savings/calculator-panel";
// import { ResultsPanel } from "@/components/dashboard/cost-savings/results-panel";
// import { CumulativeTrackerPanel } from "@/components/dashboard/cost-savings/cumulative-tracker-panel";

export const metadata: Metadata = {
  title: "Cost & Savings | EnergyIQ",
  description: "Track your energy cost savings and financial impact over time.",
};
/* 
function TabPanels() {
  const activeTab = useActiveCostSavingsTab();

  switch (activeTab) {
    case "summary":
      return <SummaryPanel />;
    case "calculator":
      return <CalculatorPanel />;
    case "results":
      return <ResultsPanel />;
    case "cumulative-tracker":
      return <CumulativeTrackerPanel />;
    default:
      return null;
  }
}
 */
export default function CostAndSavingsPage() {
  return (
    <Suspense fallback={null}>
      <CostSavingsTabs useSearchParamNav />
      <Suspense fallback={null}>{/* <TabPanels /> */}</Suspense>
    </Suspense>
  );
}
