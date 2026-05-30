import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "center" | "start" | "end";
  wrapperClassName?: string;
  contentClassName?: string;
}

const SIDE_CLASSES: Record<NonNullable<TooltipProps["side"]>, string> = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
  left: "right-full mr-2",
  right: "left-full ml-2",
};

const ALIGN_CLASSES: Record<NonNullable<TooltipProps["align"]>, string> = {
  center: "left-1/2 -translate-x-1/2",
  start: "left-0",
  end: "right-0",
};

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  wrapperClassName,
  contentClassName,
}: TooltipProps) {
  return (
    <span className={cn("relative inline-flex group", wrapperClassName)}>
      <span className="inline-flex w-full">{children}</span>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-[70] whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background opacity-0 shadow-sm",
          "transition duration-150 ease-out",
          "group-hover:opacity-100 group-focus-within:opacity-100",
          "group-hover:translate-y-0 group-focus-within:translate-y-0",
          side === "top" && "translate-y-1",
          side === "bottom" && "-translate-y-1",
          SIDE_CLASSES[side],
          ALIGN_CLASSES[align],
          contentClassName,
        )}
      >
        {content}
      </span>
    </span>
  );
}

