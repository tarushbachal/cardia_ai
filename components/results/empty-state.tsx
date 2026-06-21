import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResultsEmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
      <span
        aria-hidden="true"
        className="bg-accent-soft text-accent-strong inline-flex size-14 items-center justify-center rounded-2xl"
      >
        <ClipboardList className="size-6" />
      </span>
      <h1 className="text-ink mt-6 text-3xl">No results yet</h1>
      <p className="text-ink-muted mt-3 text-base leading-relaxed">
        No assessment was found in this browser. Start an assessment to see your complete,
        fully-sourced results.
      </p>
      <Button asChild size="lg" className="mt-7">
        <Link href="/assessment">Start your assessment</Link>
      </Button>
    </div>
  );
}
