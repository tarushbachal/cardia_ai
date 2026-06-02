/**
 * Canonical regulatory + framing copy. Centralized so every surface that
 * touches a health result uses the same compliant language (§1.5, §9).
 *
 * Hard rules encoded here: nothing diagnoses, nothing directs a medication
 * change, everything routes decisions to a physician and attributes claims to
 * a cited guideline.
 */
export const REG = {
  productName: "Cardia AI",
  tagline: "Understand your heart-health numbers — calmly.",

  /** One line, for footers and compact spots. */
  disclaimerShort:
    "Educational information that references published clinical guidelines. Not medical advice.",

  /** Full disclaimer, for onboarding and the results screen. */
  disclaimerFull:
    "Cardia AI provides educational information that references published clinical guidelines. It does not diagnose, treat, or provide medical advice, and it is not a substitute for professional care. Always discuss your results — and any decisions about medication or treatment — with your physician.",

  /** General-wellness positioning (keeps us out of SaMD territory). */
  notADevice:
    "Cardia AI is a general wellness tool. It is not a medical device and does not predict, diagnose, or rule out any disease.",

  /** Used wherever a result might prompt action. */
  physicianRouting:
    "Bring these numbers to your doctor. Any decision about medication or treatment is between you and your physician.",

  /** The trust differentiator. */
  sourcesNote:
    "Every category is traceable to a specific, dated clinical guideline — linked, never guessed.",

  /** Privacy posture for Phase 1 (no server, optional local-only save). */
  privacyShort: "Your numbers stay in your browser. Nothing is sent to a server in this version.",
} as const;
