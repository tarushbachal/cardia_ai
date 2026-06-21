import Link from "next/link";
import { ArrowRight, BookOpen, FileSearch, ListChecks, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/disclaimer";
import { REG } from "@/lib/content/regulatory";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_70%_-10%,var(--accent-soft),transparent_60%)] opacity-70"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div className="max-w-xl">
            <p className="border-border-hair bg-surface text-ink-muted inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide">
              <span className="bg-accent size-1.5 rounded-full" aria-hidden="true" />
              Clinical grade cardiovascular reference
            </p>
            <h1 className="text-ink mt-6 text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
              Master your heart health with clinical precision.
            </h1>
            <p className="text-ink-muted mt-6 text-lg leading-relaxed text-pretty">
              Enter your lab values and Cardia measures every one against current clinical
              guidelines, categorized, flagged, and traced to the exact published source. The
              standard a cardiology clinic works to, made legible.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="pill">
                <Link href="/assessment">
                  Start your assessment
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="pill" variant="outline">
                <Link href="/biomarkers">Explore the library</Link>
              </Button>
            </div>
            <dl className="text-ink-subtle mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="text-accent-strong size-4" aria-hidden="true" />
                Sourced to published guidelines
              </div>
              <div className="inline-flex items-center gap-2">
                <FileSearch className="text-accent-strong size-4" aria-hidden="true" />
                Private by default, you choose what to share
              </div>
            </dl>
          </div>

          <HeroSignalPreview />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-20">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <h2 className="text-ink text-3xl sm:text-4xl">How Cardia works.</h2>
            <p className="text-ink-muted mt-4 text-lg leading-relaxed">
              A rigorous, transparent assessment, every value measured against a named clinical
              guideline, with the source one tap away.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            <HowStep
              n={1}
              icon={<PenLine aria-hidden="true" />}
              title="Enter your values"
              body="Your latest labs and a little context. Enter only what you have, every marker is optional."
            />
            <HowStep
              n={2}
              icon={<ListChecks aria-hidden="true" />}
              title="See what's flagged"
              body="Cardia leads with the values outside guideline ranges, assessed against current standards, then shows the full picture."
            />
            <HowStep
              n={3}
              icon={<BookOpen aria-hidden="true" />}
              title="Trace every source"
              body="Open any biomarker for its guideline category in plain language and the exact, dated source it comes from."
            />
          </ol>
        </div>
      </section>

      {/* ── Differentiators (navy band) ──────────────────────────────────── */}
      <section className="mt-24">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="bg-hero overflow-hidden rounded-3xl px-6 py-14 sm:px-12">
            <div className="max-w-2xl">
              <h2 className="text-paper text-3xl sm:text-4xl">
                Built on published medicine, not a model&rsquo;s guess.
              </h2>
              <p className="text-paper-muted mt-4 text-lg leading-relaxed">
                There is no black-box risk score here. Cardia categorizes each value against current
                clinical guidelines and shows you the source behind every assessment.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
              <DiffPoint
                title="Every category, traceable"
                body="Not “guidelines say this is high,” but the named, dated guideline and a direct link to it."
              />
              <DiffPoint
                title="Flagged values first"
                body="Cardia leads with the values that need attention, clearly flagged and clinically framed, never buried."
              />
              <DiffPoint
                title="Private by default"
                body="Your numbers stay in your browser. Sharing an anonymized copy for research is an explicit opt in, never the default."
              />
            </div>
            <div className="border-paper-muted/20 mt-12 flex flex-col items-start gap-5 border-t pt-9 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-paper-muted max-w-md text-sm leading-relaxed">
                {REG.physicianRouting}
              </p>
              <Button asChild size="lg" variant="accent">
                <Link href="/assessment">
                  Begin
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-3xl">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

function HowStep({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="border-border-hair bg-surface-raised rounded-2xl border p-6">
      <div className="flex items-center gap-3">
        <span className="bg-accent-soft text-accent-strong inline-flex size-9 items-center justify-center rounded-xl [&_svg]:size-4.5">
          {icon}
        </span>
        <span className="font-display text-ink-subtle text-sm font-medium">Step {n}</span>
      </div>
      <h3 className="text-ink mt-4 text-xl">{title}</h3>
      <p className="text-ink-muted mt-2 text-sm leading-relaxed">{body}</p>
    </li>
  );
}

function DiffPoint({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-paper text-lg">{title}</h3>
      <p className="text-paper-muted mt-2 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

/** Illustrative, clearly-labeled preview of a result, never a real score. */
function HeroSignalPreview() {
  const rows = [
    { label: "LDL", value: "96 mg/dL", tone: "optimal", cat: "Within range" },
    { label: "Blood pressure", value: "142 / 90", tone: "elevated", cat: "Stage 2" },
    { label: "HbA1c", value: "6.1 %", tone: "borderline", cat: "Prediabetes range" },
  ] as const;
  const toneText = {
    optimal: "text-optimal-strong",
    borderline: "text-borderline-strong",
    elevated: "text-elevated-strong",
  } as const;
  const toneDot = {
    optimal: "bg-optimal",
    borderline: "bg-borderline",
    elevated: "bg-elevated",
  } as const;

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="border-border-hair bg-surface-raised rounded-2xl border p-7 shadow-[0_1px_0_rgba(17,36,48,0.04),0_20px_50px_-30px_rgba(17,36,48,0.35)]">
        <div className="flex items-center justify-between">
          <span className="text-ink-subtle text-xs font-medium tracking-wider uppercase">
            Illustrative example
          </span>
          <span className="bg-elevated-soft text-elevated-strong rounded-full px-2.5 py-1 text-xs font-medium">
            2 flagged
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <PreviewRing />
          <div>
            <p className="font-display text-ink text-2xl">Assessment summary</p>
            <p className="text-ink-muted mt-1 text-sm leading-relaxed">
              6 of 8 values within guideline ranges.
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2.5">
          {rows.map((r) => (
            <li
              key={r.label}
              className="border-border-hair/70 bg-surface flex items-center justify-between rounded-xl border px-3.5 py-2.5"
            >
              <span className="text-ink flex items-center gap-2.5 text-sm">
                <span className={`size-2 rounded-full ${toneDot[r.tone]}`} aria-hidden="true" />
                {r.label}
              </span>
              <span className="flex items-center gap-3 tabular-nums">
                <span className="text-ink-muted text-sm">{r.value}</span>
                <span className={`text-xs font-medium ${toneText[r.tone]}`}>{r.cat}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PreviewRing() {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true" className="shrink-0">
      <circle cx="46" cy="46" r={r} fill="none" stroke="var(--border-hair)" strokeWidth="8" />
      <circle
        cx="46"
        cy="46"
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - 0.75)}
        transform="rotate(-90 46 46)"
      />
    </svg>
  );
}
