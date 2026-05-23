"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, AlertTriangle, Sun, TrendingUp, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  icon: React.ElementType;
  iconClass: string;
  title: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    icon: AlertTriangle,
    iconClass: "text-danger",
    title: "Battery may run flat by 10am",
    time: "Just now",
    read: false,
  },
  {
    id: "2",
    icon: Sun,
    iconClass: "text-amber-500",
    title: "Solar output dipped at 11:45 am",
    time: "2hrs ago",
    read: false,
  },
  {
    id: "3",
    icon: TrendingUp,
    iconClass: "text-success-alt",
    title: "₦8,430 saved this month",
    time: "2hr ago",
    read: true,
  },
  {
    id: "4",
    icon: Cpu,
    iconClass: "text-muted-foreground",
    title: "New AI insight ready",
    time: "Yesterday",
    read: true,
  },
];

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="border-[#E5E5E5] bg-white w-full md:w-104.5 overflow-hidden rounded-2xl border shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <h3 className="text-foreground text-base font-semibold flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-danger inline-flex size-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className={cn(
            "flex items-center gap-1 text-xs transition-colors",
            unreadCount > 0
              ? "text-muted-foreground hover:text-foreground cursor-pointer"
              : "text-muted-foreground/40 cursor-default",
          )}
        >
          <Check className="h-3.5 w-3.5" />
          Mark as read
        </button>
      </div>

      {/* List */}
      <div className="divide-border divide-y">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={cn(
                "flex items-start gap-3 px-5 py-4 transition-colors",
                !n.read ? "bg-muted/40" : "bg-card",
              )}
            >
              <span className="border-border flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border bg-white">
                <Icon className={cn("h-4 w-4", n.iconClass)} />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm leading-snug",
                    n.read
                      ? "text-foreground/70"
                      : "text-foreground font-medium",
                  )}
                >
                  {n.title}
                </p>
                <p className="text-muted-foreground mt-0.5 text-xs">{n.time}</p>
              </div>
              {!n.read && (
                <span className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <Link
        href="/dashboard/settings/notifications"
        className="text-muted-foreground hover:text-foreground border-border block border-t py-4 text-center text-sm transition-colors"
      >
        View all notifications
      </Link>
    </div>
  );
}

