"use client";

import { useState } from "react";
import { FIBER_LABELS, FIBER_SCORES, SYNTHETIC_FIBERS } from "@/lib/scoring/fiberScores";

interface Fiber {
  fiber: string;
  percentage: number;
}

interface Props {
  fibers: Fiber[];
}

function getFiberColor(fiber: string): string {
  if (SYNTHETIC_FIBERS.has(fiber)) {
    const score = FIBER_SCORES[fiber] ?? 5;
    if (score <= 4) return "#E84433";
    if (score <= 8) return "#E87033";
    return "#E8A733";
  }
  const score = FIBER_SCORES[fiber] ?? 10;
  if (score >= 22) return "#2DB87A";
  if (score >= 18) return "#52C994";
  if (score >= 14) return "#E8C733";
  return "#E8A733";
}

export default function MaterialBreakdown({ fibers }: Props) {
  const [active, setActive] = useState<string | null>(null);
  if (!fibers || fibers.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Bar chart visualization */}
      <div className="flex rounded-lg overflow-hidden h-6" role="img" aria-label="Material composition">
        {fibers.map((f, i) => (
          <div
            key={i}
            className="relative cursor-pointer transition-opacity"
            style={{
              width: `${f.percentage}%`,
              backgroundColor: getFiberColor(f.fiber),
              opacity: active && active !== f.fiber ? 0.4 : 1,
            }}
            onMouseEnter={() => setActive(f.fiber)}
            onMouseLeave={() => setActive(null)}
            onTouchStart={() => setActive(active === f.fiber ? null : f.fiber)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {fibers.map((f, i) => {
          const score = FIBER_SCORES[f.fiber] ?? 10;
          const color = getFiberColor(f.fiber);
          const label = FIBER_LABELS[f.fiber] ?? f.fiber;
          return (
            <button
              key={i}
              className="flex items-center gap-1.5 text-xs font-body rounded-full px-3 py-1 transition-all"
              style={{
                backgroundColor:
                  active === f.fiber ? `${color}30` : "rgba(45,27,105,0.3)",
                border: `1px solid ${active === f.fiber ? color : "rgba(155,127,232,0.2)"}`,
                color: active === f.fiber ? color : "#C8B8FF",
              }}
              onMouseEnter={() => setActive(f.fiber)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === f.fiber ? null : f.fiber)}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>{f.percentage}% {label}</span>
              <span
                className="font-mono opacity-70"
                style={{ color }}
              >
                {score}/25
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail tooltip */}
      {active && (
        <div className="rounded-xl p-3 bg-[rgba(45,27,105,0.3)] border border-[rgba(155,127,232,0.15)] text-xs font-body text-[#C8B8FF]">
          <span className="font-semibold text-[#F7F5FF]">{FIBER_LABELS[active] ?? active}</span>{" "}
          — Fiber score: {FIBER_SCORES[active] ?? "?"}/25.{" "}
          {SYNTHETIC_FIBERS.has(active)
            ? "Synthetic fiber derived from petroleum. Sheds microplastics when washed."
            : "Natural fiber with lower environmental impact."}
        </div>
      )}
    </div>
  );
}
