import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen max-w-full">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="bg-background flex-1 overflow-auto px-4 py-4 lg:px-6 lg:py-6 mx-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

