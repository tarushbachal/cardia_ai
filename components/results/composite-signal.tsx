"use client";

import { motion, useReducedMotion } from "motion/react";
import { CalmRing } from "./calm-ring";
import type { CompositeSummary } from "@/lib/rules-engine";

/**
 * Layer 1 of the progressive-disclosure results (§3.5): one calm composite signal
 * and a sentence of plain-language framing. One gentle, staggered reveal — never
 * a countdown or a slot-machine spin (§3.4). Reduced-motion renders instantly.
 */
export function CompositeSignal({ composite }: { composite: CompositeSummary }) {
  const reduce = useReducedMotion();

  const reveal = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 10 } as const),
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.55,
      delay: reduce ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      aria-label="Your summary"
      className="border-border-hair bg-surface-raised flex h-full flex-col rounded-3xl border p-7 sm:p-9"
    >
      <motion.p
        {...reveal(0)}
        className="text-ink-subtle text-xs font-medium tracking-wider uppercase"
      >
        Summary
      </motion.p>

      <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-7 sm:flex-row sm:gap-9">
        <motion.div {...reveal(0.1)}>
          <CalmRing
            proportion={composite.proportionInRange}
            primary={`${composite.withinRangeCount}/${composite.enteredCount}`}
            secondary="in range"
          />
        </motion.div>

        <div className="flex-1 text-center sm:text-left">
          <motion.h1 {...reveal(0.22)} className="text-ink text-3xl text-pretty sm:text-4xl">
            {composite.signalLabel}
          </motion.h1>
          <motion.p {...reveal(0.34)} className="text-ink-muted mt-3 text-base leading-relaxed">
            {composite.headline}
          </motion.p>
        </div>
      </div>

      <motion.p
        {...reveal(0.46)}
        className="border-border-hair text-ink-subtle mt-7 border-t pt-5 text-xs leading-relaxed"
      >
        An educational summary of how many of your values fall within guideline ranges — not a risk
        score or a diagnosis.
      </motion.p>
    </section>
  );
}
