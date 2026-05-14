import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-input/30 file:text-foreground placeholder:text-muted-foreground focus-visible:border-border-active dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/4
        className,
      )}
      {...props}
    />
  );
}

export { Input };
