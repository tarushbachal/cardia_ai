import type { BiomarkerDefinition } from "../types";
import { SOURCES } from "./sources";

export const bmi: BiomarkerDefinition = {
  key: "bmi",
  group: "body",
  label: "Body mass index",
  shortLabel: "BMI",
  unit: "kg/m²",
  description: "A height-and-weight screening proxy — not a measure of body composition.",
  higherIsConcerning: true,
  inputRange: { min: 10, max: 80 },
  step: 0.1,
  primarySource: SOURCES.whoBmi,
  bands: [
    {
      max: 18.5,
      tier: "borderline",
      label: "Below the healthy-weight range",
      note: "A BMI under 18.5 is the 'underweight' category in the WHO classification. BMI is only a rough screen — your doctor can put it in context.",
    },
    {
      min: 18.5,
      max: 25,
      tier: "optimal",
      label: "Healthy-weight range",
      note: "A BMI between 18.5 and 24.9 is the 'healthy weight' range in the WHO classification.",
    },
    {
      min: 25,
      max: 30,
      tier: "borderline",
      label: "Overweight range",
      note: "A BMI between 25 and 29.9 is the 'overweight' category in the WHO classification. BMI doesn't capture muscle or where weight is carried, so it's best read in context with your doctor.",
    },
    {
      min: 30,
      tier: "attention",
      label: "Obesity range",
      note: "A BMI of 30 or above is the 'obesity' category in the WHO classification. BMI is a screening proxy rather than a diagnosis — a useful starting point for a conversation with your physician.",
    },
  ],
};

export const bodyDefinitions = [bmi];
