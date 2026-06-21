import type { BiomarkerDefinition } from "../types";
import { SOURCES } from "./sources";

/**
 * Lipid panel. Population cut points (LDL/TC/HDL) originate in NCEP ATP III;
 * notes surface what the current 2026 ACC/AHA dyslipidemia guideline says, which
 * is risk-goal-based rather than fixed population categories. No note ever
 * directs a medication change (§1.5).
 */

export const ldl: BiomarkerDefinition = {
  key: "ldl",
  group: "lipids",
  label: "LDL cholesterol",
  shortLabel: "LDL",
  unit: "mg/dL",
  description: "The main cholesterol carrying particle that guidelines focus on.",
  higherIsConcerning: true,
  inputRange: { min: 10, max: 500 },
  step: 1,
  primarySource: SOURCES.atpIII,
  additionalSources: [SOURCES.accAhaDyslipidemia2026],
  bands: [
    {
      max: 100,
      tier: "optimal",
      label: "Optimal",
      note: "Under 100 mg/dL is the optimal reference range, and matches the LDL goal the 2026 ACC/AHA dyslipidemia guideline describes for people at borderline to intermediate risk.",
    },
    {
      min: 100,
      max: 130,
      tier: "borderline",
      label: "Near optimal",
      note: "Just above the optimal range. Whether this matters depends on your overall risk, a good thing to review with your doctor rather than to act on alone.",
    },
    {
      min: 130,
      max: 160,
      tier: "borderline",
      label: "Borderline high",
      note: "In the reference categories this is 'borderline high.' The 2026 ACC/AHA guideline frames LDL targets by your overall risk, so the useful next step is a conversation with your physician.",
    },
    {
      min: 160,
      max: 190,
      tier: "attention",
      label: "High",
      note: "In the reference categories this is 'high.' Worth bringing to your doctor, who can weigh it against your full risk picture.",
    },
    {
      min: 190,
      tier: "attention",
      label: "Very high",
      note: "An LDL of 190 mg/dL or above is the level at which the 2026 ACC/AHA guideline recommends discussing lipid lowering (including statin) therapy with a clinician. This is information to bring to your physician, any treatment decision is theirs to make with you.",
      source: SOURCES.accAhaDyslipidemia2026,
    },
  ],
};

export const hdl: BiomarkerDefinition = {
  key: "hdl",
  group: "lipids",
  label: "HDL cholesterol",
  shortLabel: "HDL",
  unit: "mg/dL",
  description: "Often called 'good' cholesterol; here lower values get the attention.",
  higherIsConcerning: false,
  inputRange: { min: 10, max: 150 },
  step: 1,
  primarySource: SOURCES.atpIII,
  // Sex specific low HDL thresholds (men <40, women <50).
  bands: {
    male: [
      {
        max: 40,
        tier: "attention",
        label: "Below guideline range",
        note: "Below 40 mg/dL is the low HDL threshold for men in the reference categories. A good item to review with your doctor in the context of your overall risk.",
      },
      {
        min: 40,
        max: 60,
        tier: "optimal",
        label: "Acceptable",
        note: "Within the acceptable reference range for men. Higher HDL is generally viewed as protective.",
      },
      {
        min: 60,
        tier: "optimal",
        label: "Protective",
        note: "HDL at or above 60 mg/dL is considered protective in the reference categories.",
      },
    ],
    female: [
      {
        max: 50,
        tier: "attention",
        label: "Below guideline range",
        note: "Below 50 mg/dL is the low HDL threshold for women in the reference categories. A good item to review with your doctor in the context of your overall risk.",
      },
      {
        min: 50,
        max: 60,
        tier: "optimal",
        label: "Acceptable",
        note: "Within the acceptable reference range for women. Higher HDL is generally viewed as protective.",
      },
      {
        min: 60,
        tier: "optimal",
        label: "Protective",
        note: "HDL at or above 60 mg/dL is considered protective in the reference categories.",
      },
    ],
    unknown: [
      {
        max: 40,
        tier: "attention",
        label: "Below guideline range",
        note: "Below 40 mg/dL is low in the reference categories. The low HDL threshold is sex specific (under 40 for men, under 50 for women), add your sex for a precise category, and review with your doctor.",
      },
      {
        min: 40,
        max: 60,
        tier: "optimal",
        label: "Acceptable",
        note: "Within the acceptable reference range. The low HDL threshold differs by sex (under 50 for women); add your sex for a precise category.",
      },
      {
        min: 60,
        tier: "optimal",
        label: "Protective",
        note: "HDL at or above 60 mg/dL is considered protective in the reference categories.",
      },
    ],
  },
};

export const totalCholesterol: BiomarkerDefinition = {
  key: "totalCholesterol",
  group: "lipids",
  label: "Total cholesterol",
  shortLabel: "TC",
  unit: "mg/dL",
  description: "The sum of cholesterol carried by all particles in your blood.",
  higherIsConcerning: true,
  inputRange: { min: 50, max: 600 },
  step: 1,
  primarySource: SOURCES.atpIII,
  bands: [
    {
      max: 200,
      tier: "optimal",
      label: "Desirable",
      note: "Under 200 mg/dL is the desirable reference range for total cholesterol.",
    },
    {
      min: 200,
      max: 240,
      tier: "borderline",
      label: "Borderline high",
      note: "In the reference categories this is 'borderline high.' Total cholesterol is most meaningful alongside your LDL and HDL, a good set to review together with your doctor.",
    },
    {
      min: 240,
      tier: "attention",
      label: "High",
      note: "In the reference categories this is 'high.' Worth bringing to your physician, who can look at the full lipid panel and your overall risk.",
    },
  ],
};

export const triglycerides: BiomarkerDefinition = {
  key: "triglycerides",
  group: "lipids",
  label: "Triglycerides",
  shortLabel: "TG",
  unit: "mg/dL",
  description: "A blood fat that rises with diet, alcohol, and metabolic factors.",
  higherIsConcerning: true,
  inputRange: { min: 20, max: 2000 },
  step: 1,
  primarySource: SOURCES.ahaTriglycerides2011,
  bands: [
    {
      max: 150,
      tier: "optimal",
      label: "Normal",
      note: "Under 150 mg/dL (fasting) is the normal category in the AHA triglycerides statement.",
    },
    {
      min: 150,
      max: 200,
      tier: "borderline",
      label: "Borderline high",
      note: "Triglycerides respond strongly to recent meals, alcohol, and carbohydrates, so a fasting measurement matters. This is a good one to review with your doctor.",
    },
    {
      min: 200,
      max: 500,
      tier: "attention",
      label: "High",
      note: "In the 'high' category of the AHA statement. Often linked to diet and metabolic factors and best interpreted by your physician alongside the rest of your results.",
    },
    {
      min: 500,
      tier: "attention",
      label: "Very high",
      note: "At or above 500 mg/dL is the 'very high' category in the AHA statement. Worth discussing with your doctor promptly, who can confirm with a fasting measurement and advise.",
    },
  ],
};

export const apoB: BiomarkerDefinition = {
  key: "apoB",
  group: "lipids",
  label: "Apolipoprotein B",
  shortLabel: "ApoB",
  unit: "mg/dL",
  description: "Counts the atherogenic particles directly; a risk enhancing marker.",
  higherIsConcerning: true,
  inputRange: { min: 20, max: 250 },
  step: 1,
  primarySource: SOURCES.accAhaPrevention2019,
  bands: [
    {
      max: 90,
      tier: "optimal",
      label: "Within desirable range",
      note: "Under about 90 mg/dL is a commonly referenced desirable level for ApoB.",
    },
    {
      min: 90,
      max: 130,
      tier: "borderline",
      label: "Borderline",
      note: "Between the desirable level and the risk enhancing threshold. ApoB is most useful read alongside your LDL and triglycerides, a good set to review with your doctor.",
    },
    {
      min: 130,
      tier: "attention",
      label: "At or above the risk enhancing threshold",
      note: "An ApoB of 130 mg/dL or above is listed as a 'risk enhancing factor' in the 2019 ACC/AHA prevention guideline, a factor a clinician may weigh alongside your other results. Worth discussing with your physician.",
    },
  ],
};

export const lpa: BiomarkerDefinition = {
  key: "lpa",
  group: "lipids",
  label: "Lipoprotein(a)",
  shortLabel: "Lp(a)",
  unit: "mg/dL",
  description: "A largely inherited particle, usually measured once in a lifetime.",
  higherIsConcerning: true,
  inputRange: { min: 1, max: 400 },
  step: 1,
  primarySource: SOURCES.escEasDyslipidaemia2019,
  bands: [
    {
      max: 30,
      tier: "optimal",
      label: "Lower risk range",
      note: "Under 30 mg/dL (about 75 nmol/L) is treated as a lower risk level in the ESC/EAS guidance.",
    },
    {
      min: 30,
      max: 50,
      tier: "borderline",
      label: "Grey zone",
      note: "Between 30 and 50 mg/dL is a 'grey zone' the ESC/EAS guidance reads in the context of your other risk factors. A useful one to discuss with your doctor.",
    },
    {
      min: 50,
      tier: "attention",
      label: "Risk modifying range",
      note: "Lp(a) at or above 50 mg/dL (about 125 nmol/L) is the level the 2019 ESC/EAS guideline treats as a cardiovascular risk modifier. Lp(a) is largely genetic and measured once, useful context to share with your physician.",
    },
  ],
};

export const lipidDefinitions = [ldl, hdl, totalCholesterol, triglycerides, apoB, lpa];
