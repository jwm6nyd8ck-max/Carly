"use client";

import { useEffect, useRef } from "react";

interface Props {
  label: string;
  score: number;
  maxScore: number;
  icon: string;
  delay?: number;
}

function getBarColor(pct: number) {
  if (pct >= 0.7) return "#2DB87A";
  if (pct >= 0.4) return "#E8C733";
  return "#E87033";
}

export default function PillarBar({ label, score, maxScore, icon, delay = 0 }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = Math.min(1, score / maxScore);
  const color = getBarColor(pct);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.width = "0%";
    const timer = setTimeout(() => {
      el.style.transition = "width 0.8s cubic-bezier(0.4,0,0.2,1)";
      el.style.width = `${pct * 100}%`;
    }, delay);
    return () => clearTimeout(timer);
  }, [pct, delay]);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{icon}</span>
          <span className="text-sm font-body font-medium text-[#C8B8FF]">{label}</span>
        </div>
        <span
          className="text-sm font-mono font-bold tabular-nums"
          style={{ color }}
        >
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[rgba(155,127,232,0.15)] overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}60`,
            width: "0%",
          }}
        />
      </div>
    </div>
  );
}
