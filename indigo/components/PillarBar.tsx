"use client";

import { useEffect, useRef } from "react";

interface Props {
  label: string;
  score: number;
  maxScore: number;
  icon: string;
  delay?: number;
}

function barColor(pct: number) {
  if (pct >= 0.7) return "#6B8C5F";
  if (pct >= 0.4) return "#C4974A";
  return "#A0513A";
}

export default function PillarBar({ label, score, maxScore, icon, delay = 0 }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.min(1, score / maxScore);
  const color = barColor(pct);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const t = setTimeout(() => {
      el.style.transition = "width 1s cubic-bezier(0.4,0,0.2,1)";
      el.style.width = `${pct * 100}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="label" style={{ color: "var(--text-warm)" }}>{icon}</span>
          <span className="text-sm font-body" style={{ color: "var(--text-cream)", fontWeight: 400 }}>{label}</span>
        </div>
        <span className="text-sm font-display" style={{ color, fontStyle: "italic" }}>
          {score}<span style={{ color: "var(--text-muted)", fontStyle: "normal", fontSize: "0.7rem" }}>/{maxScore}</span>
        </span>
      </div>
      <div className="h-px rounded-full overflow-hidden" style={{ background: "rgba(180,160,110,0.12)" }}>
        <div ref={barRef} className="h-full rounded-full" style={{ backgroundColor: color, width: "0%" }} />
      </div>
    </div>
  );
}
