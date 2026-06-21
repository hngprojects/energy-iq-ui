"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_PER_PAGE_OPTIONS = [10, 20, 50];

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages: (number | "ellipsis")[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  pages.push(1);
  if (currentPage > 3) pages.push("ellipsis");

  for (
    let i = Math.max(2, currentPage - 1);
    i <= Math.min(totalPages - 1, currentPage + 1);
    i += 1
  ) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);

  return pages;
}

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
  itemLabel?: string;
  className?: string;
}

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = DEFAULT_PER_PAGE_OPTIONS,
  itemLabel = "items",
  className,
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  const safeTotalPages = Math.max(1, totalPages);
  const safeCurrentPage = Math.min(Math.max(1, currentPage), safeTotalPages);
  const start = (safeCurrentPage - 1) * itemsPerPage + 1;
  const end = Math.min(safeCurrentPage * itemsPerPage, totalItems);
  const pages = getVisiblePages(safeCurrentPage, safeTotalPages);

  return (
    <div
      className={cn(
        "border-border flex flex-col items-start justify-between gap-3 border-t px-4 py-3 sm:flex-row sm:items-center",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span>
          Showing {start}-{end} of {totalItems} {itemLabel}
        </span>

        {onPerPageChange ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="border-border bg-card hover:bg-muted flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              >
                <span className="text-muted-foreground">Per page:</span>
                <span className="text-foreground">{itemsPerPage}</span>
                <ChevronDown className="text-muted-foreground h-4 w-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                sideOffset={4}
                align="start"
                className="bg-card border-border z-50 min-w-28 overflow-hidden rounded-xl border py-1 shadow-lg"
              >
                {perPageOptions.map((n) => (
                  <DropdownMenu.Item
                    key={n}
                    onSelect={() => onPerPageChange(n)}
                    className={cn(
                      "cursor-pointer px-4 py-2.5 text-sm outline-none transition-colors",
                      itemsPerPage === n
                        ? "bg-muted text-foreground font-semibold"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {n}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        ) : null}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="size-8 rounded-lg"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="text-muted-foreground px-1 text-sm"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "size-8 rounded-lg text-sm",
                page === safeCurrentPage
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className="size-8 rounded-lg"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
