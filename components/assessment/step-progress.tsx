/** Calm linear step indicator (no suspense, no countdown). */
export function StepProgress({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label: string;
}) {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-ink-subtle font-medium">
          Step {current + 1} of {total}
        </span>
        <span className="text-accent-strong font-medium">{label}</span>
      </div>
      <div
        className="bg-secondary mt-2 h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Assessment progress: step ${current + 1} of ${total}`}
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
