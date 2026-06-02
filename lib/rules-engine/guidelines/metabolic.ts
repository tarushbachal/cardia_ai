import type { BiomarkerDefinition } from "../types";
import { SOURCES } from "./sources";

export const hba1c: BiomarkerDefinition = {
  key: "hba1c",
  group: "metabolic",
  label: "Hemoglobin A1c",
  shortLabel: "HbA1c",
  unit: "%",
  description: "Your average blood sugar over roughly the last three months.",
  higherIsConcerning: true,
  inputRange: { min: 3, max: 18 },
  step: 0.1,
  primarySource: SOURCES.adaStandards2026,
  bands: [
    {
      max: 5.7,
      tier: "optimal",
      label: "Normal",
      note: "Under 5.7% is the normal range in the ADA Standards of Care — 2026.",
    },
    {
      min: 5.7,
      max: 6.5,
      tier: "borderline",
      label: "Prediabetes range",
      note: "Between 5.7% and 6.4% is the range the ADA describes as prediabetes — often very responsive to everyday changes. A good one to talk through with your doctor.",
    },
    {
      min: 6.5,
      tier: "attention",
      label: "Diabetes range",
      note: "An A1C of 6.5% or above is the level at which the ADA Standards of Care — 2026 describes diabetes, confirmed on repeat testing. This is a conversation to have with your doctor, who can confirm and guide next steps.",
    },
  ],
};

export const fastingGlucose: BiomarkerDefinition = {
  key: "fastingGlucose",
  group: "metabolic",
  label: "Fasting glucose",
  shortLabel: "Glucose",
  unit: "mg/dL",
  description: "Your blood sugar after an overnight fast.",
  higherIsConcerning: true,
  inputRange: { min: 40, max: 600 },
  step: 1,
  primarySource: SOURCES.adaStandards2026,
  bands: [
    {
      max: 100,
      tier: "optimal",
      label: "Normal",
      note: "Under 100 mg/dL (fasting) is the normal range in the ADA Standards of Care — 2026.",
    },
    {
      min: 100,
      max: 126,
      tier: "borderline",
      label: "Prediabetes range",
      note: "Between 100 and 125 mg/dL (fasting) is the range the ADA describes as prediabetes. A measurement is most reliable after an overnight fast — worth confirming with your doctor.",
    },
    {
      min: 126,
      tier: "attention",
      label: "Diabetes range",
      note: "A fasting glucose of 126 mg/dL or above is the level the ADA Standards of Care — 2026 describes as diabetes, confirmed on repeat testing. A conversation to have with your doctor, who can confirm and advise.",
    },
  ],
};

export const metabolicDefinitions = [hba1c, fastingGlucose];
