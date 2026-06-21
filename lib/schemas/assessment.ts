import { z } from "zod";
import { ALL_DEFINITIONS, BIOMARKER_ORDER } from "@/lib/rules-engine";
import type {
  AssessmentContext,
  BiomarkerDefinition,
  BiomarkerInput,
  BiomarkerKey,
  Sex,
} from "@/lib/rules-engine";

/**
 * Zod schemas for the assessment boundary (§5.1, §6.1). Generated from the
 * rules engine's `inputRange`s so validation can never drift from the engine.
 * Schemas coerce raw form strings ("" → omitted, "abc" → error) so the same
 * schema validates client inputs now and server inputs in Phase 2.
 */

export type BiomarkerValues = Partial<Record<BiomarkerKey, number>>;

export interface ParsedAssessment {
  age?: number;
  sex?: Sex;
  smoker?: boolean;
  familyHistory?: boolean;
  values: BiomarkerValues;
}

/** Empty/blank → undefined; numeric string → number; anything else passes through
 *  unchanged so the downstream number check produces a clear "must be a number". */
function coerceOptionalNumber(val: unknown): unknown {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") return undefined;
    const n = Number(trimmed);
    return Number.isNaN(n) ? val : n;
  }
  return val;
}

function measurementSchema(def: BiomarkerDefinition) {
  const { min, max } = def.inputRange;
  return z.preprocess(
    coerceOptionalNumber,
    z
      .number({ message: `${def.shortLabel} must be a number.` })
      .min(min, { message: `${def.shortLabel} can't be below ${min} ${def.unit}.` })
      .max(max, { message: `${def.shortLabel} can't be above ${max} ${def.unit}.` })
      .optional(),
  );
}

const measurementByKey = Object.fromEntries(
  ALL_DEFINITIONS.map((d) => [d.key, measurementSchema(d)]),
) as Record<BiomarkerKey, ReturnType<typeof measurementSchema>>;

export const biomarkerValuesSchema = z.object(measurementByKey);

const ageSchema = z.preprocess(
  coerceOptionalNumber,
  z
    .number({ message: "Age must be a number." })
    .int({ message: "Age must be a whole number." })
    .min(18, { message: "Cardia is for adults (18+)." })
    .max(120, { message: "Please enter a valid age." })
    .optional(),
);

const sexSchema = z.preprocess(
  (v) => (v === "" || v === null ? undefined : v),
  z.enum(["male", "female"]).optional(),
);

export const contextSchema = z.object({
  age: ageSchema,
  sex: sexSchema,
  smoker: z.boolean().optional(),
  familyHistory: z.boolean().optional(),
});

export const assessmentInputSchema = contextSchema
  .extend({ values: biomarkerValuesSchema })
  .refine((data) => Object.values(data.values).some((v) => v !== undefined), {
    message: "Enter at least one value to see your results.",
    path: ["values"],
  });

/** Parse a raw form payload (strings allowed) into a typed assessment. */
export function parseAssessment(
  raw: unknown,
): { success: true; data: ParsedAssessment } | { success: false; error: z.ZodError } {
  const result = assessmentInputSchema.safeParse(raw);
  if (!result.success) return { success: false, error: result.error };
  return { success: true, data: result.data as ParsedAssessment };
}

/** Validate a single measurement field (for onBlur UX). Returns an error or null. */
export function validateMeasurement(key: BiomarkerKey, raw: unknown): string | null {
  const result = measurementByKey[key].safeParse(raw);
  return result.success ? null : (result.error.issues[0]?.message ?? "Invalid value");
}

/** Map validated values → ordered engine inputs. */
export function toBiomarkerInputs(values: BiomarkerValues): BiomarkerInput[] {
  return BIOMARKER_ORDER.filter((key) => values[key] !== undefined).map((key) => ({
    key,
    value: values[key]!,
  }));
}

/** Map a parsed assessment → engine context. */
export function toAssessmentContext(data: ParsedAssessment): AssessmentContext {
  return {
    age: data.age,
    sex: data.sex,
    smoker: data.smoker,
    familyHistory: data.familyHistory,
  };
}
