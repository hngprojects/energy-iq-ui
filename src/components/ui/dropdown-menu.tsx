"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DropdownContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  align?: "start" | "end" | "center";
} | null>(null);

export function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const context = React.useContext(DropdownContext);
  if (!context)
    throw new Error("DropdownMenuTrigger must be used within DropdownMenu");

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    context.setOpen(!context.open);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<{
        onClick: (e: React.MouseEvent) => void;
      }>,
      {
        onClick: toggle,
      },
    );
  }

  return <div onClick={toggle}>{children}</div>;
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
}

export function DropdownMenuContent({
  children,
  className,
  align = "end",
  ...props
}: DropdownMenuContentProps) {
  const context = React.useContext(DropdownContext);
  if (!context)
    throw new Error("DropdownMenuContent must be used within DropdownMenu");

  if (!context.open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 min-w-40 overflow-hidden rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
        align === "end" && "right-0 origin-top-right",
        align === "start" && "left-0 origin-top-left",
        align === "center" && "left-1/2 -translate-x-1/2 origin-top",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const context = React.useContext(DropdownContext);

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    context?.setOpen(false);
    if (onClick) onClick(e);
  };

  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-muted hover:text-foreground focus:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      onClick={handleItemClick}
      {...props}
    >
      {children}
    </div>
  );
}
