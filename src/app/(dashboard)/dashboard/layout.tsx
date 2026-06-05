"use client";

import { usePathname } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/layout/dashboard-header";
import { OnboardingGuard } from "@/components/dashboard/onboarding-guard";
import { cn } from "@/lib/utils";
import { UserSync } from "@/components/dashboard/user-sync";
import { SavingsSetupProvider } from "@/components/dashboard/cost-savings/savings-setup-context";
import { useAuthStore } from "@/stores/auth-store";

function SavingsSetupScope({ children }: { children: React.ReactNode }) {
  const userId = useAuthStore((s) => s.user?.id);
  return (
    <SavingsSetupProvider key={userId ?? "guest"}>{children}</SavingsSetupProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isChatDetailsPage = /^\/dashboard\/ai-assistant\/[^/]+$/.test(pathname);

  return (
    <div className="bg-background flex min-h-screen max-w-full">
      <UserSync />
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main
          className={cn(
            "bg-background mx-auto flex-1 overflow-auto w-full",
            !isChatDetailsPage && "max-w-7xl px-6 py-6 lg:px-6 lg:py-6",
          )}
        >
          <SavingsSetupScope>
            <OnboardingGuard>{children}</OnboardingGuard>
          </SavingsSetupScope>
        </main>
      </div>
    </div>
  );
}

