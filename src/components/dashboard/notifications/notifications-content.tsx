"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationsService } from "@/services/notifications-service";
import type { NotificationItem } from "@/types/notifications";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationItem;
  onRead: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRead}
      className={cn(
        "flex w-full flex-col gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted/40",
        !notification.isRead && "bg-muted/30",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">{notification.title}</p>
          <p className="text-sm text-muted-foreground">{notification.subtitle}</p>
        </div>
        {!notification.isRead && (
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{formatTimestamp(notification.createdAt)}</span>
        <span>{notification.inAppDeliveryStatus}</span>
      </div>
    </button>
  );
}

export function NotificationContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications-page", filter],
    queryFn: () =>
      filter === "unread"
        ? notificationsService.getUnreadNotifications(1, 20)
        : notificationsService.getNotifications(1, 20),
    retry: false,
  });

  const notifications = query.data?.payload ?? [];
  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) => notificationsService.markAsRead(notificationId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications-page"] });
      void queryClient.invalidateQueries({ queryKey: ["notifications-dropdown"] });
    },
  });

  const markVisibleRead = async () => {
    const unread = notifications.filter((item) => !item.isRead);
    await Promise.all(unread.map((item) => markReadMutation.mutateAsync(item.id)));
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-(--color-dark-text)">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Review recent alerts and system updates across your account.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void markVisibleRead()}
          disabled={unreadCount === 0 || markReadMutation.isPending}
        >
          <CheckCheck className="size-4" />
          Mark visible as read
        </Button>
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === "all" ? "outline" : "ghost"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "unread" ? "outline" : "ghost"}
          onClick={() => setFilter("unread")}
        >
          Unread
        </Button>
      </div>

      <div className="space-y-4">
        {query.isLoading ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : query.isError ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
            Notifications are unavailable right now.
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-6 py-10 text-sm text-muted-foreground">
            No notifications found.
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onRead={() => {
                if (!notification.isRead) {
                  markReadMutation.mutate(notification.id);
                }
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
