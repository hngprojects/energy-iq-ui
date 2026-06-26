import { z } from "zod";
import { TEAM_ACCESS_ROLES } from "@/types/team-access";

export const teamAccessRoleSchema = z.enum(TEAM_ACCESS_ROLES);

export const inviteTeamMemberSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(40, "First name must be at most 40 characters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(40, "Last name must be at most 40 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  role: teamAccessRoleSchema,
});

export type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberSchema>;

