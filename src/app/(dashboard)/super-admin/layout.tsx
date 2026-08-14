import { SuperAdminAuthGuard } from "@/components/super-admin/super-admin-auth-guard";
import { SuperAdminShell } from "@/components/super-admin/super-admin-shell";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminAuthGuard>
      <SuperAdminShell>{children}</SuperAdminShell>
    </SuperAdminAuthGuard>
  );
}
