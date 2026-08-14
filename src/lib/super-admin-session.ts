import { cookies } from "next/headers";

export const SUPER_ADMIN_SESSION_COOKIE = "super_admin_session";

export async function hasSuperAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get(SUPER_ADMIN_SESSION_COOKIE)?.value);
}

export function canUseFallbackSuperAdminLogin() {
  return process.env.NODE_ENV !== "production";
}

export function isValidSuperAdminCredentials({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const configuredEmail = process.env.SUPER_ADMIN_EMAIL;
  const configuredPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (configuredEmail && configuredPassword) {
    return email === configuredEmail && password === configuredPassword;
  }

  return canUseFallbackSuperAdminLogin() && Boolean(email && password);
}
