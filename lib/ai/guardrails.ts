/**
 * Output safety guard for the AI explanation layer (§7.3): model output is
 * treated as untrusted and scanned BEFORE display. Any violation discards the
 * text and the UI falls back to the deterministic walkthrough. Patterns are
 * deliberately conservative: they target directives and diagnosis claims while
 * allowing guideline-descriptive language ("the range associated with diabetes").
 */

const VIOLATION_PATTERNS: { name: string; pattern: RegExp }[] = [
  {
    // Medication directives: "start taking a statin", "stop your medication",
    // "increase the dose", "you should take aspirin", "talk to ... about starting X".
    name: "medication-directive",
    pattern:
      /\b(start|stopp?|begin|beginn|discontinu|increas|decreas|adjust|lower|rais|doubl|halv|tak|prescrib)\w*\b[^.!?]{0,60}\b(medication|medicine|statin|drug|dose|dosage|insulin|aspirin|metformin|supplement|pill)\b/i,
  },
  {
    // Reverse order: "a statin should be started", "your dose needs adjusting".
    name: "medication-directive-passive",
    pattern:
      /\b(medication|medicine|statin|drug|dose|dosage|insulin|aspirin|metformin|supplement)\b[^.!?]{0,60}\b(should be|needs? to be|must be)\b[^.!?]{0,30}\b(start|stopp|chang|adjust|increas|decreas|prescrib)\w*/i,
  },
  {
    // Diagnosis claims: "you have diabetes", "you are diabetic", "you suffer from
    // heart disease", "this means you have ...". Guideline-descriptive phrasing
    // ("the diabetes range", "associated with diabetes") does not match.
    name: "diagnosis-claim",
    pattern:
      /\byou\s+(have|are suffering from|suffer from|are diagnosed with|likely have|probably have|may well have|are (pre)?diabetic)\b/i,
  },
  {
    // Risk prediction the product never makes: "your risk of a heart attack is X%".
    name: "risk-prediction",
    pattern: /\byour risk of\b[^.!?]{0,60}\b(is|will be)\b[^.!?]{0,20}\d+\s*%/i,
  },
  {
    // Alarmist vocabulary that violates the calm register.
    name: "alarmist-language",
    pattern: /\b(dangerous|alarming|life-threatening|critical condition|emergency|terrifying)\b/i,
  },
];

export interface GuardrailResult {
  ok: boolean;
  violations: string[];
}

/** Scan model output. Empty/whitespace text is also a violation (nothing to show). */
export function scanExplanation(text: string): GuardrailResult {
  if (!text || text.trim().length < 40) {
    return { ok: false, violations: ["empty-or-too-short"] };
  }
  const violations = VIOLATION_PATTERNS.filter((p) => p.pattern.test(text)).map((p) => p.name);
  return { ok: violations.length === 0, violations };
}
