"use client";

import { useSearchParams } from "next/navigation";
import { AcceptInviteFlow } from "@/components/auth/accept-invite-flow";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? "";
  return <AcceptInviteFlow inviteToken={inviteToken} />;
}
