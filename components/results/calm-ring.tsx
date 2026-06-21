"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * The composite "signal", a gentle settling-in, never a slot-machine spin or a
 * danger gauge (§3.4). Fill shows the share of entered values within range; the
 * stroke stays a calm sage regardless, so the result never reads as an alarm.
 */
export function CalmRing({
  proportion,
  primary,
  secondary,
  size = 148,
  color = "var(--optimal)",
}: {
  proportion: number;
  primary: string;
  secondary?: string;
  size?: number;
  color?: string;
}) {
  const reduce = useReducedMotion();
  const stroke = 11;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, proportion));
  const targetOffset = circumference * (1 - clamped);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-hair)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduce ? targetOffset : circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: reduce ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-ink text-4xl leading-none tabular-nums">{primary}</span>
        {secondary ? (
          <span className="text-ink-subtle mt-1 text-xs font-medium">{secondary}</span>
        ) : null}
      </div>
    </div>
  );
}
