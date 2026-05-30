import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { OnboardingGuard } from "@/components/dashboard/onboarding-guard";
import { UserSync } from "@/components/dashboard/user-sync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen max-w-full">
      <UserSync />
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="bg-background mx-auto flex-1 overflow-auto px-6 py-6 lg:px-6 lg:py-6 max-w-7xl w-full">
          <OnboardingGuard>{children}</OnboardingGuard>
        </main>
      </div>
    </div>
  );
}
