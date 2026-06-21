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
  inputRange: { min: 10, max: 50 },
  step: 0.1,
  primarySource: SOURCES.whoBmi,
  bands: [
    {
      max: 18.5,
      tier: "borderline",
      label: "Underweight",
      note: "A BMI under 18.5 is the WHO 'underweight' category. BMI is a screening proxy; interpret it in clinical context with your physician.",
    },
    {
      min: 18.5,
      max: 25,
      tier: "optimal",
      label: "Healthy weight",
      note: "A BMI of 18.5–24.9 is the WHO 'healthy weight' range.",
    },
    {
      min: 25,
      max: 30,
      tier: "borderline",
      label: "Overweight",
      note: "A BMI of 25–29.9 is the WHO 'overweight' category. BMI does not capture muscle mass or fat distribution, so interpret it alongside other measures.",
    },
    {
      min: 30,
      max: 35,
      tier: "attention",
      label: "Obesity, class I",
      note: "A BMI of 30–34.9 is WHO obesity class I. BMI is a screen, not a diagnosis — discuss management with your physician.",
    },
    {
      min: 35,
      max: 40,
      tier: "attention",
      label: "Obesity, class II",
      note: "A BMI of 35–39.9 is WHO obesity class II. This range is associated with higher cardiovascular and metabolic risk and warrants medical review.",
    },
    {
      min: 40,
      tier: "attention",
      label: "Obesity, class III",
      note: "A BMI of 40 or above is WHO obesity class III (severe obesity). This carries the highest weight-associated cardiovascular and metabolic risk and should be reviewed with your physician.",
    },
  ],
};

export const bodyDefinitions = [bmi];
