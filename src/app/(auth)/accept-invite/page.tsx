"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthWrapper } from "@/components/layout/auth-wrapper";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthService } from "@/services/auth-service";
import { useAuthStore } from "@/stores/auth-store";

export default function AcceptInvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken") ?? "";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setInverterAccess = useAuthStore((state) => state.setInverterAccess);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!inviteToken) {
      toast.error("Invite token is missing.");
      router.replace("/login");
      return;
    }

    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/accept-invite?inviteToken=${inviteToken}`)}`,
      );
      return;
    }

    let cancelled = false;

    AuthService.acceptInvite(inviteToken)
      .then(async () => {
        const profile = await AuthService.me();
        if (cancelled) return;
        setInverterAccess(profile.inverterAccess ?? []);
        toast.success("Invite accepted successfully");
        router.replace("/dashboard");
      })
      .catch((error) => {
        if (cancelled) return;
        if (error instanceof Error && error.message.toLowerCase().includes("unauth")) {
          logout();
          router.replace(
            `/login?redirect=${encodeURIComponent(`/accept-invite?inviteToken=${inviteToken}`)}`,
          );
          return;
        }
        toast.error(error instanceof Error ? error.message : "Unable to accept invite");
        router.replace("/dashboard");
      });

    return () => {
      cancelled = true;
    };
  }, [inviteToken, isAuthenticated, logout, router, setInverterAccess]);

  return (
    <AuthWrapper>
      <div className="mt-28 lg:mt-44">
        <AuthHeader
          title="Accepting invitation"
          subtitle="Please wait while we add this inverter to your account."
        />
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    </AuthWrapper>
  );
}
