"use client";

import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function DashboardBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const backHref =
    items.length >= 2 && items[items.length - 2].href
      ? items[items.length - 2].href
      : undefined;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {backHref ? (
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-7 w-7 text-muted-foreground hover:bg-muted"
        >
          <Link href={backHref} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      ) : null}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
