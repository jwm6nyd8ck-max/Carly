"use client";

import { useState } from "react";
import { FIBER_LABELS, FIBER_SCORES, SYNTHETIC_FIBERS } from "@/lib/scoring/fiberScores";

interface Fiber { fiber: string; percentage: number; }
interface Props { fibers: Fiber[]; }

function fiberColor(fiber: string): string {
  if (SYNTHETIC_FIBERS.has(fiber)) {
    const s = FIBER_SCORES[fiber] ?? 5;
    return s <= 4 ? "#7A3020" : s <= 8 ? "#A0513A" : "#C4974A";
  }
  const s = FIBER_SCORES[fiber] ?? 10;
  return s >= 22 ? "#6B8C5F" : s >= 18 ? "#7FA870" : s >= 14 ? "#C4974A" : "#B8863A";
}

export default function MaterialBreakdown({ fibers }: Props) {
  const [active, setActive] = useState<string | null>(null);
  if (!fibers || fibers.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="flex h-1.5 rounded-full overflow-hidden">
        {fibers.map((f, i) => (
          <div key={i}
            className="transition-opacity cursor-pointer"
            style={{ width: `${f.percentage}%`, backgroundColor: fiberColor(f.fiber), opacity: active && active !== f.fiber ? 0.3 : 1 }}
            onMouseEnter={() => setActive(f.fiber)}
            onMouseLeave={() => setActive(null)} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {fibers.map((f, i) => {
          const color = fiberColor(f.fiber);
          const label = FIBER_LABELS[f.fiber] ?? f.fiber;
          return (
            <button key={i}
              className="flex items-center gap-1.5 text-xs font-body px-3 py-1.5 transition-all"
              style={{
                background: active === f.fiber ? "rgba(180,160,110,0.1)" : "var(--bg-card)",
                border: `1px solid ${active === f.fiber ? color : "var(--border)"}`,
                borderRadius: 2,
                color: active === f.fiber ? color : "var(--text-warm)",
              }}
              onMouseEnter={() => setActive(f.fiber)}
              onMouseLeave={() => setActive(null)}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
              {f.percentage}% {label}
            </button>
          );
        })}
      </div>

      {active && (
        <div className="px-4 py-3 text-xs font-body leading-relaxed"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-warm)" }}>
          <span style={{ color: "var(--text-cream)" }}>{FIBER_LABELS[active] ?? active}</span>
          {" — "}fiber score {FIBER_SCORES[active] ?? "?"}/25.{" "}
          {SYNTHETIC_FIBERS.has(active)
            ? "Petroleum-derived synthetic. Sheds microplastics when washed."
            : "Natural fibre with lower environmental footprint."}
        </div>
      )}
    </div>
  );
}
