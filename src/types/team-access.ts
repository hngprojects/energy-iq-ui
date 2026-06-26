export const TEAM_ACCESS_ROLES = ["admin", "technician", "viewer"] as const;
export type TeamAccessRole = (typeof TEAM_ACCESS_ROLES)[number];

export type TeamAccessStatus = "active" | "pending" | "disabled";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamAccessRole;
  status: TeamAccessStatus;
  permissions: string;
  dashboards: number;
  invitedAt: string;
}

export interface TeamAccessStats {
  totalUsers: number;
  admins: number;
  technicians: number;
  viewers: number;
}

