import type { BiomarkerDefinition } from "../types";
import { SOURCES } from "./sources";

export const hsCRP: BiomarkerDefinition = {
  key: "hsCRP",
  group: "inflammation",
  label: "High sensitivity CRP",
  shortLabel: "hsCRP",
  unit: "mg/L",
  description: "A marker of low grade inflammation, used as cardiovascular context.",
  higherIsConcerning: true,
  inputRange: { min: 0, max: 50 },
  step: 0.1,
  primarySource: SOURCES.ahaCdcInflammation2003,
  bands: [
    {
      max: 1,
      tier: "optimal",
      label: "Lower relative risk",
      note: "Under 1 mg/L is the 'lower relative risk' category in the AHA/CDC statement.",
    },
    {
      min: 1,
      max: 3,
      tier: "borderline",
      label: "Average relative risk",
      note: "Between 1 and 3 mg/L is the 'average relative risk' category. hsCRP reflects general inflammation, so it's best read alongside your other results by your doctor.",
    },
    {
      min: 3,
      max: 10,
      tier: "attention",
      label: "Higher relative risk",
      note: "Above 3 mg/L is the 'higher relative risk' category in the AHA/CDC statement. Because hsCRP can rise temporarily with everyday infections, a doctor may suggest rechecking it when you're well.",
    },
    {
      min: 10,
      tier: "attention",
      label: "Likely acute inflammation",
      note: "Values above 10 mg/L usually reflect an acute infection or inflammation rather than cardiovascular risk, and are typically rechecked once you've recovered. Worth mentioning to your doctor.",
    },
  ],
};

export const inflammationDefinitions = [hsCRP];
