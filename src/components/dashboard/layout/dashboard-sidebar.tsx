"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Landmark,
  AlertCircle,
  FileText,
  Headphones,
  Settings,
  ChevronDown,
  X,
  LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useUIStore } from "@/stores/ui-stores";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}

const SidebarItem = ({ label, icon: Icon, isActive }: SidebarItemProps) => {
  return (
    <Link
      href="#"
      className={cn(
        "flex h-10 w-52 items-center rounded px-3 py-2 font-sans text-[16px] leading-none font-medium transition-colors",
        isActive
          ? "bg-nav-active-bg text-nav-active-text"
          : "bg-sidebar text-secondary hover:bg-muted/50",
      )}
    >
      <Icon className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
};

export function DashboardSidebar() {
  const { isSidebarOpen, closeSidebar } = useUIStore();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={cn(
          "bg-sidebar border-border-disabled fixed top-0 left-0 z-50 flex h-screen flex-col gap-12 border-r px-4 py-5 transition-transform duration-300 ease-in-out lg:sticky lg:z-40 lg:w-60 lg:translate-x-0",
          isSidebarOpen ? "w-64 translate-x-0 shadow-xl" : "-translate-x-full",
        )}
      >
        {/* Header/Logo Section */}
        <div className="mt-5 mr-0 ml-4 flex h-10 items-center justify-between">
          <div className="w-47">
            <Logo size="md" href="" />
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
            className="text-secondary hover:bg-muted flex translate-x-2 items-center justify-center rounded-full p-2 lg:hidden"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-2">
          <SidebarItem
            label="Dashboard"
            icon={LayoutDashboard}
            isActive={true}
          />
          <SidebarItem
            label="Cost and Savings"
            icon={Landmark}
            isActive={false}
          />
          <SidebarItem label="Alerts" icon={AlertCircle} isActive={false} />
          <SidebarItem label="Reports" icon={FileText} isActive={false} />
          <SidebarItem
            label="AI Assistant"
            icon={Headphones}
            isActive={false}
          />
        </nav>

        {/* Account / Settings Section */}
        <div className="mt-6 flex w-52 flex-col">
          <span className="text-muted-foreground mb-2 h-5.25 w-15.75 text-xs font-semibold tracking-wider uppercase">
            Account
          </span>

          <button
            type="button"
            aria-label="Open settings menu"
            className="bg-sidebar text-secondary hover:bg-muted flex h-10 w-52 items-center rounded px-3 py-2 font-sans text-[16px] leading-none font-medium transition-colors"
          >
            <Settings className="mr-3 h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left">Settings</span>
            <ChevronDown
              className="text-secondary h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </aside>
    </>
  );
}
