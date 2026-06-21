import { biomarkerValuesSchema, contextSchema } from "./assessment";

/**
 * Boundary schema for the AI explanation endpoint. Same shape as the
 * assessment input: the server re-runs the rules engine from these validated
 * raw inputs, it never trusts client-computed categories.
 */
export const explainRequestSchema = contextSchema
  .extend({ values: biomarkerValuesSchema })
  .refine((d) => Object.values(d.values).some((v) => v !== undefined), {
    message: "At least one value is required.",
    path: ["values"],
  });
