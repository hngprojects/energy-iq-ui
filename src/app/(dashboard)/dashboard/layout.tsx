import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex h-screen w-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col h-full overflow-hidden">
        <DashboardHeader />
        <main className="bg-background flex-1 overflow-hidden flex flex-col w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
