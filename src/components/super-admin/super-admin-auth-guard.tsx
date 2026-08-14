"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSuperAdminAuthStore } from "@/stores/super-admin-auth-store";

export function SuperAdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useSuperAdminAuthStore();

  useEffect(() => {
    if (!_hasHydrated || isAuthenticated) return;
    router.replace(`/super-admin?redirect=${encodeURIComponent(pathname)}`);
  }, [_hasHydrated, isAuthenticated, pathname, router]);

  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-border border-t-secondary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
