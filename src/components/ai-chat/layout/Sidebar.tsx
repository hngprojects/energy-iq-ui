"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PiggyBank,
  Bell,
  FileText,
  Bot,
  Settings,
  ChevronDown,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cost and Savings", href: "/cost", icon: PiggyBank },
  { label: "Alert", href: "/alerts", icon: Bell },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[220px] bg-white border-r border-gray-100 flex-col z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            <span className="text-gray-900">ENERGY</span>
            <span className="text-amber-500">IQ</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
              isActive(href)
                ? "bg-amber-50 text-amber-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 flex-shrink-0",
                isActive(href) ? "text-amber-600" : "text-gray-400"
              )}
            />
            {label}
          </Link>
        ))}
      </nav>

      {/* Account Section */}
      <div className="px-3 pb-4">
        <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Account
        </p>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <Settings className="w-4 h-4 text-gray-400 flex-shrink-0" />
          Settings
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
        </button>
      </div>
    </aside>
  );
}
