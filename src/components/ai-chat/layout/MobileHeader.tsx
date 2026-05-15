"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Bell,
  Zap,
  LayoutDashboard,
  PiggyBank,
  AlertTriangle,
  FileText,
  Bot,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Cost and Savings", href: "/cost", icon: PiggyBank },
  { label: "Alert", href: "/alerts", icon: AlertTriangle },
  { label: "Reports", href: "/reports", icon: FileText },
  { label: "AI Assistant", href: "/assistant", icon: Bot },
];

export function MobileHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  //useEffect(() => {
  // setDrawerOpen(false);
  // }, [pathname]);


  const closeDrawer = () => setDrawerOpen(false);

  //<Link href={href} onClick={closeDrawer} ...></Link>

  // Prevent body scroll when drawer open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 sticky top-0 z-30 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 -ml-1 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">AA</span>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden animate-fade-in"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-xl transition-transform duration-300 lg:hidden",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border-2 border-amber-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <span className="font-bold text-base">
              <span className="text-gray-900">ENERGY</span>
              <span className="text-amber-500">IQ</span>
            </span>
          </Link>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-amber-600" : "text-gray-400")} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="px-3 pb-6 border-t border-gray-100 pt-3">
          <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Account
          </p>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
            Settings
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-auto" />
          </button>
        </div>
      </div>
    </>
  );
}
