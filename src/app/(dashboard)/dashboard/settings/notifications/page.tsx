import type { Metadata } from "next";
import { NotificationContent } from "@/components/dashboard/notifications/notifications-content";

export const metadata: Metadata = {
  title: "Notifications | EnergyIQ",
  description: "Manage your notification preferences.",
};

export default function NotificationPage() {
  return <NotificationContent />;
}
