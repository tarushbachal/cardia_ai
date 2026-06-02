"use client";

import * as RadioGroup from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";

export interface ChoiceOption {
  value: string;
  label: string;
  hint?: string;
}

/** Accessible segmented radio group rendered as calm option cards. */
export function ChoiceField({
  legend,
  description,
  options,
  value,
  onValueChange,
  columns = 2,
}: {
  legend: string;
  description?: string;
  options: ChoiceOption[];
  value: string | undefined;
  onValueChange: (value: string) => void;
  columns?: 2 | 3;
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-ink text-sm font-medium">{legend}</legend>
      {description ? (
        <p className="text-ink-subtle -mt-1 text-xs leading-relaxed">{description}</p>
      ) : null}
      <RadioGroup.Root
        value={value ?? ""}
        onValueChange={onValueChange}
        className={cn("grid gap-2.5", columns === 3 ? "grid-cols-3" : "grid-cols-2")}
      >
        {options.map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              "group border-border-strong bg-surface-raised flex flex-col items-start gap-0.5 rounded-xl border px-4 py-3 text-left transition-colors",
              "hover:border-accent/60 hover:bg-accent-soft/40",
              "data-[state=checked]:border-accent data-[state=checked]:bg-accent-soft",
            )}
          >
            <span className="text-ink text-sm font-medium">{option.label}</span>
            {option.hint ? <span className="text-ink-subtle text-xs">{option.hint}</span> : null}
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </fieldset>
  );
}
