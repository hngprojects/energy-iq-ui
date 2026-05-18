"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/ui-stores";
import { useAuthStore } from "@/stores/auth-store";
import { useAuthActions } from "@/hooks/use-auth-actions";
import { useMounted } from "@/hooks/use-mounted";
import { UserAvatar } from "@/components/external/nav-user-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function DashboardHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuthActions();
  const mounted = useMounted();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target as Node)
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(() => {
      setDropdownOpen(false);
      setMobileDropdownOpen(false);
    });
  };

  return (
    <header className="bg-card lg:border-border-disabled sticky top-0 z-30 flex h-16 w-full justify-between lg:h-17.25 lg:items-center lg:border-b">
      {/* Mobile Menu Button */}
      <div className="flex lg:hidden">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          title="Open navigation menu"
          className="mt-4.5 mb-4.5 ml-6"
        >
          <Menu className="text-secondary h-7 w-7" />
        </button>
      </div>

      <div className="flex-1 lg:hidden" />

      {/* Mobile Profile & Notification */}
      <div className="flex items-center lg:hidden" ref={mobileDropdownRef}>
        <button
          type="button"
          aria-label="View notifications"
          title="View notifications"
          className="mt-5.75 mr-[9.51px] mb-[25.51px] flex items-center justify-center"
        >
          <Bell className="text-secondary h-5 w-5" strokeWidth={1.2} />
        </button>

        <div className="relative mt-4 mr-6 mb-4">
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="h-8 w-8 shrink-0 overflow-hidden rounded-[16px] focus:outline-none"
          >
            {mounted && isAuthenticated && user && (
              <UserAvatar user={user} className="h-full w-full" />
            )}
          </button>

          {mobileDropdownOpen && (
            <div className="border-border bg-background absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border py-2 shadow-lg">
              <Link
                href="/dashboard"
                onClick={() => setMobileDropdownOpen(false)}
                className="text-foreground/70 hover:text-foreground hover:bg-muted/50 flex items-center gap-2 px-4 py-2 text-sm transition-colors"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Search */}
      <div className="hidden flex-1 items-center lg:flex">
        <div className="relative mt-3 mb-3 ml-6 flex h-11.25 w-100.5 items-center">
          <Search
            className="text-secondary absolute left-3.75 z-10 h-4 w-4"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <Input
            type="text"
            placeholder="Search"
            aria-label="Search"
            className="bg-background border-border-active placeholder:text-muted-foreground h-full w-full rounded-lg pl-10.5 placeholder:select-none"
          />
        </div>
      </div>

      {/* Desktop Profile, Notification & Dropdown */}
      <div className="hidden items-center gap-3 pr-6 lg:flex">
        <button
          type="button"
          aria-label="View notifications"
          title="View notifications"
          className="flex items-center justify-center"
        >
          <Bell className="text-secondary h-5 w-5" strokeWidth={1.2} />
        </button>

        <div className="relative flex items-center gap-3" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 focus:outline-none cursor-pointer"
          >
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-[16px]">
              {mounted && isAuthenticated && user && (
                <UserAvatar user={user} className="h-full w-full text-xs" />
              )}
            </div>

            <ChevronDown 
              className={cn(
                "text-secondary h-4 w-4 transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )} 
            />
          </button>

          {dropdownOpen && (
            <div className="border-border bg-background absolute right-0 top-full mt-2 w-48 rounded-lg border py-2 shadow-lg">
              <button
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
