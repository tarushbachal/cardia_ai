"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { assess, type BiomarkerResult, type CompositeSummary } from "@/lib/rules-engine";
import { toAssessmentContext, toBiomarkerInputs } from "@/lib/schemas";
import { clearAssessment, loadAssessment } from "@/lib/persistence/assessment-store";
import { Button } from "@/components/ui/button";
import { CompositeSignal } from "./composite-signal";
import { AiExplanationSlot } from "./ai-explanation-slot";
import { BiomarkerBreakdown } from "./biomarker-breakdown";
import { DoctorPanel } from "./doctor-panel";
import { PersistenceToggle } from "./persistence-toggle";
import { ResultsEmptyState } from "./empty-state";

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "ready"; results: BiomarkerResult[]; composite: CompositeSummary };

/**
 * Results orchestrator. Loads the browser-held assessment, runs the rules engine
 * client-side, and renders the progressive-disclosure layers. Storage is read in
 * an effect so server and first client render match (no hydration mismatch).
 */
export function ResultsView() {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const stored = loadAssessment();
    let next: State = { status: "empty" };
    if (stored) {
      const { results, composite } = assess(
        toBiomarkerInputs(stored.data.values),
        toAssessmentContext(stored.data),
      );
      if (results.length > 0) next = { status: "ready", results, composite };
    }
    // Hydration-safe: the assessment lives only in the browser, so it is read
    // after mount (server + first client render show the loading state).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
  }, []);

  if (state.status === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <div className="bg-secondary/40 h-72 animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (state.status === "empty") {
    return <ResultsEmptyState />;
  }

  function startOver() {
    clearAssessment();
    router.push("/assessment");
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-center justify-between gap-4">
        <p className="text-ink-subtle text-sm font-medium">Your results</p>
        <Button variant="ghost" size="sm" onClick={startOver}>
          <RotateCcw aria-hidden="true" />
          Start over
        </Button>
      </div>

      <div className="mt-5 space-y-5">
        <CompositeSignal composite={state.composite} />
        <AiExplanationSlot />
        <BiomarkerBreakdown results={state.results} />
        <DoctorPanel results={state.results} />
        <PersistenceToggle />
      </div>
    </div>
  );
}
