import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { REG } from "@/lib/content/regulatory";

type DisclaimerVariant = "banner" | "footnote" | "inline";

/**
 * Compliant disclaimer, placed at onboarding, on results, and in the footer
 * (§1.5). Defaults to the full text; pass `short` for the one-liner.
 */
export function Disclaimer({
  variant = "banner",
  short = false,
  className,
  children,
}: {
  variant?: DisclaimerVariant;
  short?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const text = children ?? (short ? REG.disclaimerShort : REG.disclaimerFull);

  if (variant === "footnote") {
    return <p className={cn("text-ink-subtle text-xs leading-relaxed", className)}>{text}</p>;
  }

  if (variant === "inline") {
    return <p className={cn("text-ink-muted text-sm leading-relaxed", className)}>{text}</p>;
  }

  return (
    <aside
      role="note"
      aria-label="Important information"
      className={cn(
        "border-border-hair bg-surface flex gap-3 rounded-xl border px-4 py-3.5",
        className,
      )}
    >
      <Info className="text-accent-strong mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p className="text-ink-muted text-sm leading-relaxed">{text}</p>
    </aside>
  );
}
