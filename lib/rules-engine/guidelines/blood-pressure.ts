import type { BiomarkerDefinition } from "../types";
import { SOURCES } from "./sources";

/**
 * Blood-pressure categories per the 2025 AHA/ACC guideline (unchanged from 2017).
 * A single reading is never a diagnosis — that nuance lives in every note.
 */

export const systolicBP: BiomarkerDefinition = {
  key: "systolicBP",
  group: "blood-pressure",
  label: "Systolic blood pressure",
  shortLabel: "Systolic",
  unit: "mmHg",
  description: "The top number — pressure when your heart beats.",
  higherIsConcerning: true,
  inputRange: { min: 70, max: 260 },
  step: 1,
  primarySource: SOURCES.accAhaBloodPressure2025,
  bands: [
    {
      max: 120,
      tier: "optimal",
      label: "Normal",
      note: "A systolic reading under 120 mmHg is in the normal category. A single reading isn't a diagnosis — blood pressure varies through the day.",
    },
    {
      min: 120,
      max: 130,
      tier: "borderline",
      label: "Elevated",
      note: "120–129 mmHg systolic is the 'elevated' category in the 2025 AHA/ACC guideline. The categories come from the average of several proper readings, so this is a good one to confirm with your doctor.",
    },
    {
      min: 130,
      max: 140,
      tier: "borderline",
      label: "Stage 1",
      note: "130–139 mmHg systolic falls in 'stage 1' in the 2025 AHA/ACC guideline. Because readings vary, a clinician confirms the category from repeated, properly taken measurements.",
    },
    {
      min: 140,
      tier: "attention",
      label: "Stage 2",
      note: "140 mmHg or above systolic falls in 'stage 2' in the 2025 AHA/ACC guideline. Worth bringing to your doctor, who can confirm with repeat readings and advise — any treatment decision is theirs to make with you.",
    },
  ],
};

export const diastolicBP: BiomarkerDefinition = {
  key: "diastolicBP",
  group: "blood-pressure",
  label: "Diastolic blood pressure",
  shortLabel: "Diastolic",
  unit: "mmHg",
  description: "The bottom number — pressure when your heart rests between beats.",
  higherIsConcerning: true,
  inputRange: { min: 40, max: 160 },
  step: 1,
  primarySource: SOURCES.accAhaBloodPressure2025,
  bands: [
    {
      max: 80,
      tier: "optimal",
      label: "Normal",
      note: "A diastolic reading under 80 mmHg is in the normal category. A single reading isn't a diagnosis — blood pressure varies through the day.",
    },
    {
      min: 80,
      max: 90,
      tier: "borderline",
      label: "Stage 1",
      note: "80–89 mmHg diastolic falls in 'stage 1' in the 2025 AHA/ACC guideline. Readings vary, so a clinician confirms the category from repeated, properly taken measurements.",
    },
    {
      min: 90,
      tier: "attention",
      label: "Stage 2",
      note: "90 mmHg or above diastolic falls in 'stage 2' in the 2025 AHA/ACC guideline. Worth bringing to your doctor, who can confirm with repeat readings and advise.",
    },
  ],
};

export const bloodPressureDefinitions = [systolicBP, diastolicBP];
