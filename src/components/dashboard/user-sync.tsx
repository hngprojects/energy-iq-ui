"use client";

import { useCurrentUserSync } from "@/hooks/use-current-user-sync";

export function UserSync() {
  useCurrentUserSync();
  return null;
}
