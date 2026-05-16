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
      d="M4.19922 6.99998C4.19922 6.62867 4.34672 6.27258 4.60927 6.01003C4.87182 5.74748 5.22792 5.59998 5.59922 5.59998H22.3992C22.7705 5.59998 23.1266 5.74748 23.3892 6.01003C23.6517 6.27258 23.7992 6.62867 23.7992 6.99998C23.7992 7.37128 23.6517 7.72737 23.3892 7.98992C23.1266 8.25248 22.7705 8.39998 22.3992 8.39998H5.59922C5.22792 8.39998 4.87182 8.25248 4.60927 7.98992C4.34672 7.72737 4.19922 7.37128 4.19922 6.99998ZM4.19922 14C4.19922 13.6287 4.34672 13.2726 4.60927 13.01C4.87182 12.7475 5.22792 12.6 5.59922 12.6H13.9992C14.3705 12.6 14.7266 12.7475 14.9892 13.01C15.2517 13.2726 15.3992 13.6287 15.3992 14C15.3992 14.3713 15.2517 14.7274 14.9892 14.9899C14.7266 15.2525 14.3705 15.4 13.9992 15.4H5.59922C5.22792 15.4 4.87182 15.2525 4.60927 14.9899C4.34672 14.7274 4.19922 14.3713 4.19922 14ZM4.19922 21C4.19922 20.6287 4.34672 20.2726 4.60927 20.01C4.87182 19.7475 5.22792 19.6 5.59922 19.6H22.3992C22.7705 19.6 23.1266 19.7475 23.3892 20.01C23.6517 20.2726 23.7992 20.6287 23.7992 21C23.7992 21.3713 23.6517 21.7274 23.3892 21.9899C23.1266 22.2525 22.7705 22.4 22.3992 22.4H5.59922C5.22792 22.4 4.87182 22.2525 4.60927 21.9899C4.34672 21.7274 4.19922 21.3713 4.19922 21Z"
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
  { label: "Pricing", href: "/pricing" },
  { label: "Faq", href: "/#faq" },
  { label: "About Us", href: "/about" },
];

const validPaths = new Set(["/", "/how-it-works", "/pricing", "/about"]);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("Features");
  const pathname = usePathname();

  const activeLabel = useMemo(() => {
    if (!validPaths.has(pathname)) {
      return null;
    }

    if (pathname === "/about") {
      return "About Us";
    }

    if (pathname === "/") {
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
          open ? "max-h-125" : "max-h-0",
        )}
      >
        <div className="flex flex-col gap-6 px-4 py-6">
          <ul className="flex flex-col items-center gap-2 text-center">
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

          <Button
            variant="outline"
            className="border-foreground/20 text-foreground hover:bg-muted/30 h-11 w-full rounded-md font-medium justify-center"
            asChild
            onClick={() => setOpen(false)}
          >
            <Link href="/login">Sign In</Link>
          </Button>

          <Button
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 w-full rounded-md font-medium justify-center"
            asChild
            onClick={() => setOpen(false)}
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
