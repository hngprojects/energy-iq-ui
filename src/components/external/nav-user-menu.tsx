"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "@/types/auth";
import { cn } from "@/lib/utils";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`.toUpperCase() ||
    user.email?.charAt(0).toUpperCase() ||
    "U";

  if (user.profilePhoto) {
    return (
      <div
        className={cn(
          "relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/10",
          className,
        )}
      >
        <Image
          src={user.profilePhoto}
          alt={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Profile photo"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-primary flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/10",
        className,
      )}
    >
      <span className="text-primary-foreground text-sm font-bold">{initials}</span>
    </div>
  );
}

interface UserDropdownProps {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export function UserDropdown({
  user,
  isOpen,
  onToggle,
  onLogout,
  dropdownRef,
}: UserDropdownProps) {
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="flex items-center gap-3 focus:outline-none cursor-pointer"
      >
        <span className="text-foreground text-sm font-medium">
          {user.firstName} {user.lastName}
        </span>
        <UserAvatar user={user} />
        <ChevronDown
          className={cn(
            "text-foreground/50 h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="border-border bg-background absolute right-0 mt-2 w-48 rounded-lg border py-2 shadow-lg">
          <Link
            href="/dashboard"
            onClick={onToggle}
            className="text-foreground/70 hover:text-foreground hover:bg-muted/50 flex items-center gap-2 px-4 py-2 text-sm transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <button
            onClick={onLogout}
            className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
