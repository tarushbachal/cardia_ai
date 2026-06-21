import type { BiomarkerDefinition, BiomarkerGroup, BiomarkerKey } from "../types";
import { lipidDefinitions } from "./lipids";
import { inflammationDefinitions } from "./inflammation";
import { metabolicDefinitions } from "./metabolic";
import { bloodPressureDefinitions } from "./blood-pressure";
import { bodyDefinitions } from "./body";

/** Deliberate display/assessment order across groups. */
export const GROUP_ORDER: BiomarkerGroup[] = [
  "lipids",
  "metabolic",
  "blood-pressure",
  "inflammation",
  "body",
];

export const GROUP_LABELS: Record<BiomarkerGroup, string> = {
  lipids: "Cholesterol & lipids",
  metabolic: "Blood sugar",
  "blood-pressure": "Blood pressure",
  inflammation: "Inflammation",
  body: "Body measures",
};

export const GROUP_BLURBS: Record<BiomarkerGroup, string> = {
  lipids: "The fats and particles your cholesterol panel measures.",
  metabolic: "How your body is handling blood sugar.",
  "blood-pressure": "The pressure in your arteries, top and bottom numbers.",
  inflammation: "A marker of low grade inflammation, for context.",
  body: "A simple height and weight screen.",
};

const UNSORTED: BiomarkerDefinition[] = [
  ...lipidDefinitions,
  ...metabolicDefinitions,
  ...bloodPressureDefinitions,
  ...inflammationDefinitions,
  ...bodyDefinitions,
];

/** All definitions in canonical (group, then in-group) order. */
export const ALL_DEFINITIONS: BiomarkerDefinition[] = [...UNSORTED].sort(
  (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group),
);

export const BIOMARKERS = Object.fromEntries(ALL_DEFINITIONS.map((d) => [d.key, d])) as Record<
  BiomarkerKey,
  BiomarkerDefinition
>;

export const BIOMARKER_ORDER: BiomarkerKey[] = ALL_DEFINITIONS.map((d) => d.key);

/** Definitions grouped for sectioned UIs, preserving order. */
export const DEFINITIONS_BY_GROUP: { group: BiomarkerGroup; items: BiomarkerDefinition[] }[] =
  GROUP_ORDER.map((group) => ({
    group,
    items: ALL_DEFINITIONS.filter((d) => d.group === group),
  }));
