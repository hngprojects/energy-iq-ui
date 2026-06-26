import { z } from "zod";

export const teamAccessRoleSchema = z.enum(["admin", "technician", "viewer"]);

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
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  role: teamAccessRoleSchema,
});

export type InviteTeamMemberFormValues = z.infer<typeof inviteTeamMemberSchema>;

