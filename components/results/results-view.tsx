"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, RotateCcw } from "lucide-react";
import { assess, type BiomarkerResult, type CompositeSummary } from "@/lib/rules-engine";
import { toAssessmentContext, toBiomarkerInputs, type ParsedAssessment } from "@/lib/schemas";
import { clearAssessment, loadAssessment } from "@/lib/persistence/assessment-store";
import { Button } from "@/components/ui/button";
import { CompositeSignal } from "./composite-signal";
import { ResultsSnapshot } from "./results-snapshot";
import { AiExplanationSlot } from "./ai-explanation-slot";
import { BiomarkerGrid } from "./biomarker-grid";
import { DoctorPanel } from "./doctor-panel";
import { PersistenceToggle } from "./persistence-toggle";
import { ResultsEmptyState } from "./empty-state";
import { PrintReport } from "./print-report";
import { PriorityFindings } from "./priority-findings";

type State =
  | { status: "loading" }
  | { status: "empty" }
  | {
      status: "ready";
      input: ParsedAssessment;
      results: BiomarkerResult[];
      composite: CompositeSummary;
    };

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
      if (results.length > 0) {
        next = { status: "ready", input: stored.data, results, composite };
      }
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
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      {/* Interactive dashboard, replaced by PrintReport in print. */}
      <div className="print:hidden">
        <div className="flex items-center justify-between gap-4">
          <p className="text-ink-subtle text-sm font-medium">Your results</p>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              <Printer aria-hidden="true" />
              Print summary
            </Button>
            <Button variant="ghost" size="sm" onClick={startOver}>
              <RotateCcw aria-hidden="true" />
              Start over
            </Button>
          </div>
        </div>

        {/* Priority findings, lead with values outside guideline range */}
        <div className="mt-6">
          <PriorityFindings results={state.results} />
        </div>

        {/* Summary band, composite signal + at-a-glance snapshot + AI walkthrough */}
        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <CompositeSignal composite={state.composite} />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5">
            <ResultsSnapshot composite={state.composite} />
            <AiExplanationSlot
              input={state.input}
              results={state.results}
              composite={state.composite}
            />
          </div>
        </div>

        {/* Detail, per-biomarker multi-column grid */}
        <div className="mt-10">
          <BiomarkerGrid results={state.results} sex={state.input.sex} />
        </div>

        {/* Context + action */}
        <div className="mt-10 space-y-5">
          <DoctorPanel results={state.results} />
          <PersistenceToggle />
        </div>
      </div>

      <PrintReport results={state.results} composite={state.composite} />
    </div>
  );
}
