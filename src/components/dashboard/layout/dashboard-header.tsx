"use client";

import { Menu, Bell, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUIStore } from "@/stores/ui-stores";
import Image from "next/image";

export function DashboardHeader() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="bg-card lg:border-border-disabled sticky top-0 z-30 flex h-16 w-full justify-between overflow-hidden lg:h-17.25 lg:items-center lg:border-b">
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
      <div className="flex items-center lg:hidden">
        <button
          type="button"
          aria-label="View notifications"
          title="View notifications"
          className="mt-5.75 mr-[9.51px] mb-[25.51px] flex items-center justify-center"
        >
          <Bell className="text-secondary h-5 w-5" strokeWidth={1.2} />
        </button>

        <div className="mt-4 mr-6 mb-4 h-8 w-8 shrink-0 overflow-hidden rounded-[16px]">
          <Image
            src="/images/avatar1.png"
            alt="User profile picture"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
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

        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-[16px]">
          <Image
            src="/images/avatar1.png"
            alt="User profile picture"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>

        <button
          type="button"
          aria-label="Open user menu"
          title="Open user menu"
          className="text-muted-foreground hover:text-secondary flex items-center justify-center transition-colors"
        >
          <ChevronDown className="text-secondary h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
