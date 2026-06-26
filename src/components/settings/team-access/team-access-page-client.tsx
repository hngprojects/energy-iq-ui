"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardBreadcrumb } from "@/components/dashboard/dashboard-breadcrumb";
import { TeamAccessInviteDialog } from "./team-access-invite-dialog";
import { TeamAccessStatsCards } from "./team-access-stats";
import { TeamAccessEmptyState } from "./team-access-empty-state";
import { TeamAccessTable } from "./team-access-table";
import { useTeamAccessStore } from "@/stores/team-access-store";
import type { TeamAccessRole } from "@/types/team-access";

function formatRole(role: TeamAccessRole) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export function TeamAccessPageClient() {
  const members = useTeamAccessStore((state) => state.members);
  const inviteModalOpen = useTeamAccessStore((state) => state.inviteModalOpen);
  const openInviteModal = useTeamAccessStore((state) => state.openInviteModal);
  const closeInviteModal = useTeamAccessStore((state) => state.closeInviteModal);
  const inviteMember = useTeamAccessStore((state) => state.inviteMember);
  const removeMember = useTeamAccessStore((state) => state.removeMember);
  const updateRole = useTeamAccessStore((state) => state.updateRole);

  const stats = useMemo(
    () => ({
      totalUsers: members.length,
      admins: members.filter((member) => member.role === "admin").length,
      technicians: members.filter((member) => member.role === "technician").length,
      viewers: members.filter((member) => member.role === "viewer").length,
    }),
    [members],
  );

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb
        items={[
          { label: "Settings", href: "/dashboard/settings" },
          { label: "Team & Access" },
        ]}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Team Management & Access Control
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage users, assign specific system roles, and control administrative access levels.
          </p>
        </div>
        <Button onClick={openInviteModal} className="w-full lg:w-auto">
          <Plus className="size-4" />
          Add New User
        </Button>
      </div>

      <TeamAccessStatsCards stats={stats} />

      {members.length === 0 ? (
        <TeamAccessEmptyState onInvite={openInviteModal} />
      ) : (
        <TeamAccessTable
          members={members}
          onEditRole={(id, role) => {
            updateRole(id, role);
            toast.success(`${formatRole(role)} access updated`);
          }}
          onRemove={(id) => {
            removeMember(id);
            toast.success("Team member removed");
          }}
        />
      )}

      <TeamAccessInviteDialog
        open={inviteModalOpen}
        onOpenChange={(open) => (open ? openInviteModal() : closeInviteModal())}
        onInvite={(values) => {
          inviteMember({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            role: values.role,
            status: "active",
            permissions:
              values.role === "admin"
                ? "Full access"
                : values.role === "technician"
                  ? "System alerts and metrics only"
                  : "Read-only access",
            dashboards: values.role === "technician" ? 2 : 1,
          });
          toast.success(`Invitation sent to ${values.firstName}`);
        }}
      />
    </div>
  );
}

