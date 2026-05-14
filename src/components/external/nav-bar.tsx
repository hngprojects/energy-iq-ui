"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { cn } from "@/lib/utils";

const IconMenu = ({ className }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.19922 6.99998C4.19922 6.62867 4.34672 6.27258 4.60927 6.01003C4.87182 5.74748 5.22792 5.59998 5.59922 5.59998H22.3992C22.7705 5.59998 23.1266 5.74748 23.3892 6.01003C23.6517 6.27258 23.799
      fill="#111827"
    />
  </svg>
);

const IconX = ({ className }: { className?: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const links = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Faq", href: "/#faq" },
  { label: "About Us", href: "/about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Features");
  const pathname = usePathname();

  // Compute the active label from pathname, preserving click-based updates
  const activeLabel = useMemo(() => {
    if (pathname === "/about") {
      return "About Us";
    }

    if (pathname === "/") {
      // On home page, keep the user's clicked section highlight
      return selectedLabel;
    }

    return selectedLabel;
  }, [pathname, selectedLabel]);

  return (
    <header className="bg-background sticky top-0 z-50 w-full">
      <nav className="mx-auto flex h-16 max-w-350 items-center justify-between px-4 md:h-20 md:px-8">
        <Logo size="md" />

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const isActive = activeLabel === l.label;

            return (
              <li key={l.label}>
                <Link
                  href={l.href}
                  onClick={() => setSelectedLabel(l.label)}
                  className={cn(
                    "text-sm transition-colors duration-200",
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-foreground/50 hover:text-foreground font-medium",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="outline"
            className="border-foreground/20 text-foreground hover:bg-background/90 h-10 rounded-md px-6 font-medium"
            asChild
          >
            <Link href="/login">Sign In</Link>
          </Button>

          <Button
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 rounded-md px-5 font-medium"
            asChild
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground grid h-10 w-10 place-items-center md:hidden"
        >
          {open ? (
            <IconX className="h-6 w-6" />
          ) : (
            <IconMenu className="h-6 w-6" />
          )}
        </Button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "border-border bg-background overflow-hidden border-t transition-all duration-300 md:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <ul className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          {links.map((l) => (
            <li key={l.label} className="w-full">
              <Link
                href={l.href}
                onClick={() => {
                  setSelectedLabel(l.label);
                  setOpen(false);
                }}
                className={cn(
                  "block w-full rounded-lg px-3 py-3 text-sm transition-colors",
                  activeLabel === l.label
                    ? "text-foreground bg-muted/50 font-semibold"
                    : "text-foreground/60 hover:text-foreground font-medium",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
