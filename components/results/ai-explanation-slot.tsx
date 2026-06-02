import { Sparkles } from "lucide-react";

/**
 * Reserved real estate for the Phase 2 AI explanation layer (§6.1). Present but
 * inactive, with the correct layout, so Phase 2 drops the feature in without a
 * redesign. Deliberately tasteful and clearly "coming soon".
 */
export function AiExplanationSlot() {
  return (
    <section
      aria-labelledby="ai-slot-title"
      className="border-border-strong bg-surface rounded-2xl border border-dashed p-5"
    >
      <div className="flex items-start gap-3.5">
        <span
          aria-hidden="true"
          className="bg-accent-soft text-accent-strong inline-flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <Sparkles className="size-4.5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="ai-slot-title" className="text-ink text-sm font-semibold">
              Plain-language explanation
            </h3>
            <span className="bg-secondary text-ink-subtle rounded-full px-2 py-0.5 text-[11px] font-medium">
              Coming soon
            </span>
          </div>
          <p className="text-ink-muted mt-1 text-sm leading-relaxed">
            A calm, plain-language walkthrough of your results — grounded in the same guidelines,
            never medical advice — is on the way.
          </p>
          <div aria-hidden="true" className="mt-3.5 space-y-1.5">
            <div className="bg-secondary/70 h-2.5 w-full rounded-full" />
            <div className="bg-secondary/70 h-2.5 w-4/5 rounded-full" />
            <div className="bg-secondary/50 h-2.5 w-2/3 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
