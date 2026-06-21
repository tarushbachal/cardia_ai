import { z } from "zod";
import { biomarkerValuesSchema, contextSchema } from "./assessment";

/**
 * Boundary schema for the anonymous capture endpoint. Reuses the same context +
 * value validation as the assessment so the server never trusts client-computed
 * results, it re-derives them from these validated inputs.
 */

const UUID = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    "Invalid UUID",
  );

export const captureRequestSchema = contextSchema
  .extend({
    submissionId: UUID,
    anonId: UUID.optional(),
    values: biomarkerValuesSchema,
  })
  .refine((d) => Object.values(d.values).some((v) => v !== undefined), {
    message: "At least one value is required.",
    path: ["values"],
  });

export type CaptureRequest = z.infer<typeof captureRequestSchema>;
