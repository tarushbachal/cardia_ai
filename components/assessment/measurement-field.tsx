"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BiomarkerDefinition } from "@/lib/rules-engine";

/** A single optional biomarker input with unit suffix, hint, and inline error. */
export function MeasurementField({
  def,
  value,
  onChange,
  onBlur,
  error,
}: {
  def: BiomarkerDefinition;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
}) {
  const id = `bm-${def.key}`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>
          {def.label} <span className="text-ink-subtle font-normal">({def.shortLabel})</span>
        </Label>
        <span className="text-ink-subtle text-xs">optional</span>
      </div>
      <p id={hintId} className="text-ink-subtle text-xs leading-relaxed">
        {def.description}
      </p>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="—"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-describedby={error ? `${hintId} ${errorId}` : hintId}
          aria-invalid={error ? true : undefined}
          className="pr-16"
        />
        <span
          aria-hidden="true"
          className="text-ink-subtle pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium"
        >
          {def.unit}
        </span>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-elevated-strong text-xs font-medium">
          {error}
        </p>
      ) : null}
    </div>
  );
}
