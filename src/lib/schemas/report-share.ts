import { z } from "zod";

export const reportShareActionSchema = z.object({
  reportId: z.string().min(1),
  shareUrl: z.string().url(),
  expiresAt: z.string().datetime().optional(),
});

export type ReportShareActionValues = z.infer<typeof reportShareActionSchema>;

