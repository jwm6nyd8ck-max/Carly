"use client";

import { useEffect, useRef } from "react";
import { getGrade } from "@/lib/scoring/calculateScore";

interface Props {
  score: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
}

const SIZE_MAP = {
  sm: { svg: 80,  r: 32, stroke: 4, fontSize: 20, sub: 11 },
  md: { svg: 140, r: 58, stroke: 6, fontSize: 34, sub: 14 },
  lg: { svg: 200, r: 85, stroke: 8, fontSize: 48, sub: 18 },
};

export default function IndigoScoreRing({ score, size = "md", animated = true, showLabel = true }: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const { svg, r, stroke, fontSize, sub } = SIZE_MAP[size];
  const { grade, label, color } = getGrade(score);
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const cx = svg / 2;
  const cy = svg / 2;

  useEffect(() => {
    if (!animated || !circleRef.current) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = `${circumference}`;
    el.style.transition = "none";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)";
        el.style.strokeDashoffset = `${offset}`;
      });
    });
  }, [score, animated, circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={svg} height={svg} viewBox={`0 0 ${svg} ${svg}`} aria-label={`Indigo Score ${score}, Grade ${grade}`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(180,160,110,0.1)" strokeWidth={stroke} />
        {/* Arc */}
        <circle
          ref={circleRef}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Score */}
        <text x={cx} y={cy - sub * 0.5} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize={fontSize} fontWeight="400">
          {score}
        </text>
        {/* Grade */}
        <text x={cx} y={cy + fontSize * 0.55} textAnchor="middle" dominantBaseline="middle"
          fill="rgba(168,155,126,0.7)" fontFamily="'Jost', sans-serif"
          fontSize={sub} fontWeight="500" letterSpacing="0.15em" style={{ textTransform: "uppercase" }}>
          {grade}
        </text>
      </svg>
      {showLabel && (
        <div className="text-center">
          <p className="label">Indigo Score</p>
          <p className="mt-1 text-sm font-display italic" style={{ color }}>{label}</p>
        </div>
      )}
    </div>
  );
}
