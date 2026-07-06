import type { Metadata } from "next";
import { NotificationContent } from "@/components/dashboard/notifications/notifications-content";

export const metadata: Metadata = {
  title: "Notifications | EnergyIQ",
  description: "Review recent alerts and system updates across your account.",
};

export default function NotificationsPage() {
  return <NotificationContent />;
}
