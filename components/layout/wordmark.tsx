import { cn } from "@/lib/utils";

/** Pulse mark + "Cardia" wordmark. `tone` adapts for light vs. navy. */
export function Wordmark({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "paper";
}) {
  const onDark = tone === "paper";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-[0.6rem] border",
          onDark
            ? "border-paper-muted/30 bg-paper/5 text-accent-on-dark"
            : "border-border-strong bg-surface-raised text-accent",
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M2 13h4l2-6 3 11 3-8 2 3h6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-lg font-semibold tracking-tight",
          onDark ? "text-paper" : "text-ink",
        )}
      >
        Cardia
      </span>
    </span>
  );
}
