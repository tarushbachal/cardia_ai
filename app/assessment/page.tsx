import type { Metadata } from "next";
import { AssessmentFlow } from "@/components/assessment/assessment-flow";

export const metadata: Metadata = {
  title: "Your assessment",
  description:
    "Enter your cardiovascular biomarker values to see a calm, guideline-sourced summary. Every field is optional and nothing leaves your browser.",
};

export default function AssessmentPage() {
  return <AssessmentFlow />;
}
