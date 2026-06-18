import { ReportStatCards } from "@/components/dashboard/reports/reports-stat-cards";
import { ReportsTable } from "@/components/dashboard/reports/reports-table";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <ReportStatCards />
      <ReportsTable />
    </div>
  );
}
