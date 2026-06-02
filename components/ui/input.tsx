import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "border-border-strong bg-surface-raised text-ink placeholder:text-ink-subtle/60 focus-visible:border-accent aria-[invalid=true]:border-elevated-strong flex h-11 w-full rounded-lg border px-3.5 py-2 text-base tabular-nums shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
