import { ArrowUpRight } from "lucide-react";
import type { GuidelineSource } from "@/lib/rules-engine";

/** Renders a guideline citation as a link, the core trust differentiator (§1.3). */
export function SourceLink({ source }: { source: GuidelineSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group text-accent-strong hover:text-accent inline-flex items-start gap-1.5 rounded-sm text-sm leading-relaxed transition-colors"
    >
      <span>
        <span className="font-medium underline-offset-2 group-hover:underline">{source.name}</span>
        <span className="text-ink-subtle"> · {source.reference}</span>
      </span>
      <ArrowUpRight className="text-ink-subtle mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}
