import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Lock, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/layout/disclaimer";
import { REG } from "@/lib/content/regulatory";
import { FLAGS } from "@/lib/config/flags";

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
              Cardiovascular biomarkers, made calm
            </p>
            <h1 className="text-ink mt-6 text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
              Understand your heart-health numbers, without the fear.
            </h1>
            <p className="text-ink-muted mt-6 text-lg leading-relaxed text-pretty">
              Enter your lab values and Cardia AI shows you one calm, plain-language summary first —
              then lets you open only the detail you want, each category traced to the exact
              published guideline behind it.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="pill">
                <Link href="/assessment">
                  Start your assessment
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="pill" variant="outline">
                <Link href="#how-it-works">See how it works</Link>
              </Button>
            </div>
            <dl className="text-ink-subtle mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <div className="inline-flex items-center gap-2">
                <BookOpen className="text-accent-strong size-4" aria-hidden="true" />
                Sourced to published guidelines
              </div>
              <div className="inline-flex items-center gap-2">
                <Lock className="text-accent-strong size-4" aria-hidden="true" />
                {FLAGS.captureEnabled ? "Anonymous & encrypted" : "Nothing leaves your browser"}
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
            <h2 className="text-ink text-3xl sm:text-4xl">Calm by design.</h2>
            <p className="text-ink-muted mt-4 text-lg leading-relaxed">
              Most people avoid their cardiovascular numbers because they&rsquo;re shown like a
              verdict. Cardia AI is built the opposite way — you stay in control of how much you
              see.
            </p>
          </div>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            <HowStep
              n={1}
              icon={<PenLine aria-hidden="true" />}
              title="Enter your numbers"
              body="Your latest labs and a little context. Enter only what you have — every marker is optional."
            />
            <HowStep
              n={2}
              icon={<Layers aria-hidden="true" />}
              title="See one calm signal"
              body="A single, gentle summary of how many values fall within guideline ranges. No wall of red. No score that pretends to predict your future."
            />
            <HowStep
              n={3}
              icon={<BookOpen aria-hidden="true" />}
              title="Open only what you want"
              body="Expand any biomarker to see its category in plain language and the exact, dated guideline it comes from."
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
                Built on published medicine — not a model&rsquo;s guess.
              </h2>
              <p className="text-paper-muted mt-4 text-lg leading-relaxed">
                There&rsquo;s no algorithm predicting your risk here. Cardia AI categorizes each
                value against current clinical guidelines and shows you the source.
              </p>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-3">
              <DiffPoint
                title="Every category, traceable"
                body="Not “guidelines say this is high,” but the named, dated guideline and a link to it."
              />
              <DiffPoint
                title="Nothing alarmist"
                body="Muted, mature language and progressive disclosure — even an elevated value reads as calm information."
              />
              <DiffPoint
                title="Private by default"
                body={
                  FLAGS.captureEnabled
                    ? "No account, no login. What we store is anonymous and encrypted — never tied to your name or identity."
                    : "In this version your numbers never leave your device. You choose whether to keep them in your browser."
                }
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

/** Illustrative, clearly-labeled preview of the calm result — never a real score. */
function HeroSignalPreview() {
  const rows = [
    { label: "LDL-C", value: "96 mg/dL", tone: "optimal", cat: "Within optimal range" },
    { label: "Blood pressure", value: "124 / 79", tone: "borderline", cat: "Elevated range" },
    { label: "HbA1c", value: "5.4 %", tone: "optimal", cat: "Within range" },
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
      <div className="border-border-hair bg-surface-raised rounded-3xl border p-7 shadow-[0_1px_0_rgba(20,36,47,0.04),0_20px_50px_-30px_rgba(20,36,47,0.35)]">
        <div className="flex items-center justify-between">
          <span className="text-ink-subtle text-xs font-medium tracking-wider uppercase">
            Illustrative example
          </span>
          <span className="bg-optimal-soft text-optimal-strong rounded-full px-2.5 py-1 text-xs font-medium">
            Mostly in range
          </span>
        </div>

        <div className="mt-6 flex items-center gap-5">
          <CalmArc />
          <div>
            <p className="font-display text-ink text-2xl">A calm summary</p>
            <p className="text-ink-muted mt-1 text-sm leading-relaxed">
              7 of 8 entered values fall within guideline ranges.
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

function CalmArc() {
  // 280° soft sage arc — a gentle settling, never a danger gauge.
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
        stroke="var(--optimal)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - 0.82)}
        transform="rotate(-90 46 46)"
      />
    </svg>
  );
}
