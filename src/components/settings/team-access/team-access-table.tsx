"use client";

import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TEAM_ACCESS_ROLES, type TeamAccessRole, type TeamMember } from "@/types/team-access";

const ROLE_LABELS: Record<TeamAccessRole, string> = {
  admin: "Admin",
  technician: "Technician",
  viewer: "Viewer",
};

function RoleBadge({ role }: { role: TeamAccessRole }) {
  const styles = {
    admin: "bg-[#B7F2CC]/66 text-[#17CC4E]",
    technician: "bg-[#FDE8B4] text-[#C37B07]",
    viewer: "bg-emerald-50 text-emerald-700",
  }[role];

  return (
    <span className={cn("inline-flex items-center rounded-full border-none px-2.5 py-1 text-xs font-medium", styles)}>
      {ROLE_LABELS[role]}
    </span>
  );
}

function StatusDot({ status }: { status: TeamMember["status"] }) {
  const colors = {
    active: "bg-emerald-500",
    pending: "bg-amber-500",
    disabled: "bg-gray-400",
  }[status];

  return (
    <span className={cn("inline-block size-2.5 rounded-full", colors)} role="img" aria-label={status}>
      <span className="sr-only">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </span>
  );
}

function StatusLegend() {
  return (
    <div className="flex items-center justify-end gap-4 px-5 py-2 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-full bg-emerald-500" />
        Active
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-full bg-amber-500" />
        Pending
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block size-2 rounded-full bg-gray-400" />
        Disabled
      </span>
    </div>
  );
}

function MemberMobileCard({
  member,
  onEditRole,
  onRemove,
}: {
  member: TeamMember;
  onEditRole: (role: TeamAccessRole) => void;
  onRemove: () => void;
}) {
  return (
    <div className="border-border bg-card rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusDot status={member.status} />
          <div>
            <p className="text-foreground text-sm font-semibold">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-muted-foreground text-sm">{member.email}</p>
          </div>
        </div>
      </div>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Role</dt>
          <dd><RoleBadge role={member.role} /></dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Permissions</dt>
          <dd className="text-foreground text-right">{member.permissions}</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.firstName} ${member.lastName}`} aria-haspopup="menu">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {TEAM_ACCESS_ROLES.filter((r) => r !== member.role).map((role) => (
              <DropdownMenuItem key={role} onClick={() => onEditRole(role)}>
                Set {ROLE_LABELS[role]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={onRemove} className="text-destructive">
              Remove user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export function TeamAccessTable({
  members,
  onEditRole,
  onRemove,
}: {
  members: TeamMember[];
  onEditRole: (id: string, role: TeamAccessRole) => void;
  onRemove: (id: string) => void;
}) {
  if (members.length === 0) return null;

  return (
    <div className="border-border bg-card overflow-hidden rounded-2xl border">
      <div className="hidden overflow-x-auto lg:block">
        <StatusLegend />
        <table className="w-full min-w-[900px]">
          <thead className="bg-muted/30">
            <tr className="border-border border-b text-left text-sm">
              <th className="w-10 px-2 py-3" />
              <th className="px-5 py-3 font-medium">First Name</th>
              <th className="px-5 py-3 font-medium">Last Name</th>
              <th className="px-5 py-3 font-medium">Email Address</th>
              <th className="px-5 py-3 font-medium">Access role</th>
              <th className="px-5 py-3 font-medium">Permissions Overview</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-border border-b last:border-0">
                <td className="w-10 px-2 py-4">
                  <StatusDot status={member.status} />
                </td>
                <td className="px-5 py-4">{member.firstName}</td>
                <td className="px-5 py-4">{member.lastName}</td>
                <td className="px-5 py-4">{member.email}</td>
                <td className="px-5 py-4"><RoleBadge role={member.role} /></td>
                <td className="px-5 py-4">{member.permissions}</td>
                <td className="px-5 py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.firstName} ${member.lastName}`} aria-haspopup="menu">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {TEAM_ACCESS_ROLES.filter((r) => r !== member.role).map((role) => (
                        <DropdownMenuItem key={role} onClick={() => onEditRole(member.id, role)}>
                          Set {ROLE_LABELS[role]}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onClick={() => onRemove(member.id)} className="text-destructive">
                        Remove user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        <StatusLegend />
        {members.map((member) => (
          <MemberMobileCard
            key={member.id}
            member={member}
            onEditRole={(role) => onEditRole(member.id, role)}
            onRemove={() => onRemove(member.id)}
          />
        ))}
      </div>
    </div>
  );
}
