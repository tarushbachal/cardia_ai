import { describe, it, expect } from "vitest";
import {
  ALL_DEFINITIONS,
  BIOMARKER_ORDER,
  categorizeBiomarker,
  isSexBands,
} from "@/lib/rules-engine";
import type { Band, BiomarkerDefinition } from "@/lib/rules-engine";

function bandLists(def: BiomarkerDefinition): Band[][] {
  return isSexBands(def.bands)
    ? [def.bands.male, def.bands.female, def.bands.unknown]
    : [def.bands];
}

/** Copy that would cross the regulatory line (§1.5) — must never appear in a note. */
const DIRECTIVE_PHRASES = [
  "start taking",
  "stop taking",
  "begin taking",
  "increase your dose",
  "decrease your dose",
  "lower your dose",
  "raise your dose",
  "you should take",
  "you must take",
  "change your medication",
  "adjust your medication",
];

describe("guideline config integrity", () => {
  it("has all 12 in-scope biomarkers, uniquely keyed", () => {
    expect(ALL_DEFINITIONS).toHaveLength(12);
    expect(new Set(BIOMARKER_ORDER).size).toBe(12);
  });

  for (const def of ALL_DEFINITIONS) {
    describe(def.key, () => {
      it("has a sane input range, step, and linked primary source", () => {
        expect(def.inputRange.min).toBeLessThan(def.inputRange.max);
        expect(def.step).toBeGreaterThan(0);
        expect(def.primarySource.url).toMatch(/^https?:\/\//);
        expect(def.primarySource.year).toBeGreaterThan(1990);
        for (const s of def.additionalSources ?? []) {
          expect(s.url).toMatch(/^https?:\/\//);
        }
      });

      it("every band set is contiguous and unbounded at both ends", () => {
        for (const bands of bandLists(def)) {
          expect(bands.length).toBeGreaterThan(0);
          expect(bands[0]!.min).toBeUndefined();
          expect(bands.at(-1)!.max).toBeUndefined();
          for (let i = 0; i < bands.length - 1; i++) {
            const upper = bands[i]!.max;
            expect(upper).toBeDefined();
            expect(bands[i + 1]!.min).toBe(upper); // no gaps, no overlaps
          }
        }
      });

      it("every band has a calm, non-directive, linkable note", () => {
        for (const bands of bandLists(def)) {
          for (const band of bands) {
            expect(band.label.trim().length).toBeGreaterThan(0);
            expect(band.note.trim().length).toBeGreaterThan(10);
            const lower = band.note.toLowerCase();
            for (const phrase of DIRECTIVE_PHRASES) {
              expect(lower).not.toContain(phrase);
            }
            const source = band.source ?? def.primarySource;
            expect(source.url).toMatch(/^https?:\/\//);
          }
        }
      });

      it("categorizes its range endpoints without throwing, with consistent withinRange", () => {
        for (const v of [def.inputRange.min, def.inputRange.max]) {
          const r = categorizeBiomarker({ key: def.key, value: v });
          expect(["optimal", "borderline", "attention"]).toContain(r.tier);
          expect(r.withinGuidelineRange).toBe(r.tier === "optimal");
          expect(r.unit).toBe(def.unit);
        }
      });
    });
  }
});
