interface InitialsUser {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}

export function getUserInitials(user?: InitialsUser | null) {
  const firstInitial = user?.firstName?.trim().charAt(0) ?? "";
  const lastInitial = user?.lastName?.trim().charAt(0) ?? "";
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  if (initials) return initials;

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase();
  return emailInitial || "ME";
}
