"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Disclaimer } from "@/components/layout/disclaimer";
import { ChoiceField } from "./choice-field";
import { MeasurementField } from "./measurement-field";
import { StepProgress } from "./step-progress";
import {
  DEFINITIONS_BY_GROUP,
  GROUP_BLURBS,
  GROUP_LABELS,
  type BiomarkerKey,
} from "@/lib/rules-engine";
import { parseAssessment, validateMeasurement } from "@/lib/schemas";
import { saveAssessment } from "@/lib/persistence/assessment-store";
import { captureAssessment } from "@/lib/client/capture";
import { Switch } from "@/components/ui/switch";

type ValueMap = Record<BiomarkerKey, string>;
type YesNo = "" | "yes" | "no";

const ALL_KEYS = DEFINITIONS_BY_GROUP.flatMap((g) => g.items.map((d) => d.key));
const emptyValues = Object.fromEntries(ALL_KEYS.map((k) => [k, ""])) as ValueMap;
const TOTAL_STEPS = 1 + DEFINITIONS_BY_GROUP.length;

export function AssessmentFlow() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [ageStr, setAgeStr] = useState("");
  const [ageError, setAgeError] = useState<string | undefined>();
  const [sex, setSex] = useState<string | undefined>();
  const [smoker, setSmoker] = useState<YesNo>("");
  const [familyHistory, setFamilyHistory] = useState<YesNo>("");
  const [values, setValues] = useState<ValueMap>(emptyValues);
  const [errors, setErrors] = useState<Partial<Record<BiomarkerKey, string>>>({});
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [shareData, setShareData] = useState(false); // data-sharing is opt-in, off by default

  const enteredCount = useMemo(
    () => Object.values(values).filter((v) => v.trim() !== "").length,
    [values],
  );

  const isLastStep = step === TOTAL_STEPS - 1;
  const stepLabel = step === 0 ? "About you" : GROUP_LABELS[DEFINITIONS_BY_GROUP[step - 1]!.group];

  function setValue(key: BiomarkerKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (submitError) setSubmitError(undefined);
  }

  function blurValue(key: BiomarkerKey) {
    const message = validateMeasurement(key, values[key]);
    setErrors((prev) => ({ ...prev, [key]: message ?? undefined }));
  }

  function validateAge(): boolean {
    const raw = ageStr.trim();
    if (raw === "") {
      setAgeError(undefined);
      return true;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 18 || n > 120) {
      setAgeError("Enter a valid age (18 or older).");
      return false;
    }
    setAgeError(undefined);
    return true;
  }

  function validateCurrentGroup(): boolean {
    if (step === 0) return validateAge();
    const group = DEFINITIONS_BY_GROUP[step - 1]!;
    const nextErrors: Partial<Record<BiomarkerKey, string>> = {};
    let ok = true;
    for (const def of group.items) {
      const message = validateMeasurement(def.key, values[def.key]);
      if (message) {
        nextErrors[def.key] = message;
        ok = false;
      }
    }
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return ok;
  }

  function goNext() {
    if (!validateCurrentGroup()) return;
    if (isLastStep) {
      submit();
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function goBack() {
    setSubmitError(undefined);
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    const raw = {
      age: ageStr,
      sex: sex ?? "",
      smoker: smoker === "" ? undefined : smoker === "yes",
      familyHistory: familyHistory === "" ? undefined : familyHistory === "yes",
      values,
    };
    const result = parseAssessment(raw);
    if (!result.success) {
      const fieldErrors: Partial<Record<BiomarkerKey, string>> = {};
      let topMessage: string | undefined;
      for (const issue of result.error.issues) {
        const [scope, key] = issue.path;
        if (scope === "values" && typeof key === "string") {
          fieldErrors[key as BiomarkerKey] = issue.message;
        } else {
          topMessage = issue.message;
        }
      }
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
      setSubmitError(topMessage ?? "Please fix the highlighted values.");
      return;
    }
    saveAssessment(result.data);
    captureAssessment(result.data, shareData); // shares only if the user opted in
    router.push("/results");
  }

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:px-8 sm:py-14">
      <header className="max-w-xl">
        <h1 className="text-ink text-3xl sm:text-4xl">Your assessment</h1>
        <p className="text-ink-muted mt-3 text-base leading-relaxed">
          Enter the numbers you have — every field is optional. Your entries stay in your browser
          unless you choose to share them.
        </p>
      </header>

      <Disclaimer variant="inline" short className="mt-5" />

      <div className="mt-9">
        <StepProgress current={step} total={TOTAL_STEPS} label={stepLabel} />
      </div>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
      >
        <div className="border-border-hair bg-surface-raised rounded-2xl border p-6 sm:p-8">
          {/* Keyed remount per step: guaranteed swap + a calm entrance fade. */}
          <motion.div
            key={step}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            {step === 0 ? (
              <ContextStep
                ageStr={ageStr}
                ageError={ageError}
                onAgeChange={(v) => {
                  setAgeStr(v);
                  if (ageError) setAgeError(undefined);
                }}
                onAgeBlur={validateAge}
                sex={sex}
                onSexChange={setSex}
                smoker={smoker}
                onSmokerChange={setSmoker}
                familyHistory={familyHistory}
                onFamilyHistoryChange={setFamilyHistory}
              />
            ) : (
              <GroupStep
                groupIndex={step - 1}
                values={values}
                errors={errors}
                onChange={setValue}
                onBlur={blurValue}
              />
            )}
          </motion.div>
        </div>

        {isLastStep ? (
          <div className="border-border-hair bg-surface mt-4 flex items-start justify-between gap-4 rounded-xl border px-5 py-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="text-accent-strong mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <div>
                <label htmlFor="share-consent" className="text-ink text-sm font-medium">
                  Share my heart-health metrics to support Cardia&rsquo;s research
                </label>
                <p className="text-ink-muted mt-1 text-sm leading-relaxed">
                  Off by default. Turn this on and an anonymized, encrypted copy of your values is
                  shared with us — never linked to your name or identity. Leave it off and nothing is
                  sent.
                </p>
              </div>
            </div>
            <Switch
              id="share-consent"
              checked={shareData}
              onCheckedChange={setShareData}
              aria-label="Share my anonymized heart-health metrics"
            />
          </div>
        ) : null}

        {submitError ? (
          <p
            role="alert"
            className="border-elevated-strong/30 bg-elevated-soft text-elevated-strong mt-4 rounded-lg border px-4 py-3 text-sm font-medium"
          >
            {submitError}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 0}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>

          <Button type="submit">
            {isLastStep ? "See my results" : "Continue"}
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </form>

      <p className="text-ink-subtle mt-6 flex items-center justify-center gap-2 text-xs">
        <Lock className="size-3.5" aria-hidden="true" />
        {enteredCount === 0
          ? "Stored in your browser — enter at least one value to see your results."
          : `${enteredCount} ${enteredCount === 1 ? "value" : "values"} entered · stored in your browser unless you opt to share.`}
      </p>
    </div>
  );
}

function ContextStep({
  ageStr,
  ageError,
  onAgeChange,
  onAgeBlur,
  sex,
  onSexChange,
  smoker,
  onSmokerChange,
  familyHistory,
  onFamilyHistoryChange,
}: {
  ageStr: string;
  ageError?: string;
  onAgeChange: (v: string) => void;
  onAgeBlur: () => void;
  sex: string | undefined;
  onSexChange: (v: string) => void;
  smoker: YesNo;
  onSmokerChange: (v: YesNo) => void;
  familyHistory: YesNo;
  onFamilyHistoryChange: (v: YesNo) => void;
}) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-ink text-xl">About you</h2>
        <p className="text-ink-muted mt-2 text-sm leading-relaxed">
          A little context lets us use the right reference ranges — for example, the low-HDL
          threshold differs by sex. All optional.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="ctx-age">Age</Label>
          <span className="text-ink-subtle text-xs">optional</span>
        </div>
        <Input
          id="ctx-age"
          inputMode="numeric"
          autoComplete="off"
          placeholder="—"
          value={ageStr}
          onChange={(e) => onAgeChange(e.target.value)}
          onBlur={onAgeBlur}
          aria-invalid={ageError ? true : undefined}
          aria-describedby={ageError ? "ctx-age-error" : undefined}
          className="max-w-40"
        />
        {ageError ? (
          <p id="ctx-age-error" role="alert" className="text-elevated-strong text-xs font-medium">
            {ageError}
          </p>
        ) : null}
      </div>

      <ChoiceField
        legend="Biological sex"
        description="Used for sex-specific thresholds such as HDL-C."
        options={[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
        ]}
        value={sex}
        onValueChange={onSexChange}
      />

      <ChoiceField
        legend="Do you currently smoke?"
        options={[
          { value: "no", label: "No" },
          { value: "yes", label: "Yes" },
        ]}
        value={smoker}
        onValueChange={(v) => onSmokerChange(v as YesNo)}
      />

      <ChoiceField
        legend="Family history of early heart disease?"
        description="A parent or sibling with heart disease before 55 (men) or 65 (women)."
        options={[
          { value: "no", label: "No / not sure" },
          { value: "yes", label: "Yes" },
        ]}
        value={familyHistory}
        onValueChange={(v) => onFamilyHistoryChange(v as YesNo)}
      />
    </div>
  );
}

function GroupStep({
  groupIndex,
  values,
  errors,
  onChange,
  onBlur,
}: {
  groupIndex: number;
  values: Record<BiomarkerKey, string>;
  errors: Partial<Record<BiomarkerKey, string>>;
  onChange: (key: BiomarkerKey, value: string) => void;
  onBlur: (key: BiomarkerKey) => void;
}) {
  const group = DEFINITIONS_BY_GROUP[groupIndex]!;
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-ink text-xl">{GROUP_LABELS[group.group]}</h2>
        <p className="text-ink-muted mt-2 text-sm leading-relaxed">
          {GROUP_BLURBS[group.group]} Enter any you have.
        </p>
      </div>
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        {group.items.map((def) => (
          <MeasurementField
            key={def.key}
            def={def}
            value={values[def.key] ?? ""}
            error={errors[def.key]}
            onChange={(v) => onChange(def.key, v)}
            onBlur={() => onBlur(def.key)}
          />
        ))}
      </div>
    </div>
  );
}
