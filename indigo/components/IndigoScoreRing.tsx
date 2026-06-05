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
  sm: { svg: 80, r: 32, stroke: 5, fontSize: 20, gradeFontSize: 11 },
  md: { svg: 140, r: 58, stroke: 8, fontSize: 34, gradeFontSize: 16 },
  lg: { svg: 200, r: 85, stroke: 10, fontSize: 48, gradeFontSize: 22 },
};

export default function IndigoScoreRing({
  score,
  size = "md",
  animated = true,
  showLabel = true,
}: Props) {
  const circleRef = useRef<SVGCircleElement>(null);
  const { svg, r, stroke, fontSize, gradeFontSize } = SIZE_MAP[size];
  const { grade, label, color } = getGrade(score);

  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  useEffect(() => {
    if (!animated || !circleRef.current) return;
    const el = circleRef.current;
    el.style.strokeDashoffset = `${circumference}`;
    el.style.transition = "none";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)";
        el.style.strokeDashoffset = `${offset}`;
      });
    });
  }, [score, animated, circumference, offset]);

  const cx = svg / 2;
  const cy = svg / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={svg}
        height={svg}
        viewBox={`0 0 ${svg} ${svg}`}
        className="drop-shadow-lg"
        aria-label={`Indigo Score: ${score} out of 100, Grade: ${grade}`}
      >
        {/* Background track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(155,127,232,0.15)"
          strokeWidth={stroke}
        />
        {/* Score arc */}
        <circle
          ref={circleRef}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
        {/* Score number */}
        <text
          x={cx}
          y={cy - gradeFontSize * 0.4}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontFamily="'Space Mono', monospace"
          fontSize={fontSize}
          fontWeight="700"
        >
          {score}
        </text>
        {/* Grade */}
        <text
          x={cx}
          y={cy + fontSize * 0.55}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={color}
          fontFamily="'Playfair Display', serif"
          fontSize={gradeFontSize}
          fontWeight="600"
          opacity="0.9"
        >
          {grade}
        </text>
      </svg>
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-body text-[#9B7FE8] uppercase tracking-widest">
            Indigo Score
          </p>
          <p
            className="text-sm font-body font-medium mt-0.5"
            style={{ color }}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );
}
