import type { Metadata } from "next";
import { ResultsView } from "@/components/results/results-view";

export const metadata: Metadata = {
  title: "Your results",
  description:
    "A calm, guideline-sourced summary of your cardiovascular biomarkers, with opt-in per-biomarker detail. Educational information, not medical advice.",
};

export default function ResultsPage() {
  return <ResultsView />;
}
