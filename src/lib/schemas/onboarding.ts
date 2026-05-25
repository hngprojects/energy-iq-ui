import { z } from "zod";

export const solarmanEmailField = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export function getSolarmanEmailError(value: string): string | undefined {
  const result = solarmanEmailField.safeParse(value);
  if (result.success) return undefined;
  return result.error.issues[0]?.message;
}
