import { Stethoscope } from "lucide-react";
import { Disclaimer } from "@/components/layout/disclaimer";
import { REG } from "@/lib/content/regulatory";
import type { BiomarkerResult } from "@/lib/rules-engine";

/**
 * Layer 3 (§3.5): context and action. Framed entirely as "here is a conversation
 * to have with your doctor," never as a directive. Carries the full disclaimer.
 */
export function DoctorPanel({ results }: { results: BiomarkerResult[] }) {
  const outside = results.filter((r) => r.tier !== "optimal");

  return (
    <section
      aria-labelledby="doctor-title"
      className="bg-hero rounded-3xl px-6 py-8 sm:px-9 sm:py-10"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="bg-paper/10 text-accent-on-dark inline-flex size-10 shrink-0 items-center justify-center rounded-xl"
        >
          <Stethoscope className="size-5" />
        </span>
        <h2 id="doctor-title" className="text-paper text-2xl sm:text-3xl">
          Bring this to your doctor
        </h2>
      </div>

      <p className="text-paper-muted mt-4 max-w-2xl text-base leading-relaxed">
        {REG.physicianRouting}
      </p>

      {outside.length > 0 ? (
        <div className="bg-paper/[0.06] mt-6 rounded-2xl p-5">
          <p className="text-paper text-sm font-medium">A few you might mention</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {outside.map((r) => (
              <li key={r.key} className="bg-paper/10 text-paper rounded-full px-3 py-1.5 text-sm">
                {r.shortLabel} <span className="text-paper-muted">· {r.categoryLabel}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="bg-paper/[0.06] mt-7 rounded-2xl p-5">
        <Disclaimer variant="inline" className="text-paper-muted">
          {REG.disclaimerFull}
        </Disclaimer>
      </div>
    </section>
  );
}
