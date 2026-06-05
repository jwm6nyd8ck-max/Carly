import Link from "next/link";
import { getGrade } from "@/lib/scoring/calculateScore";

interface Props {
  name: string;
  slug: string;
  score: number;
  grade: string;
  reason: string;
  locked?: boolean;
}

export default function AlternativeCard({ name, slug, score, grade, reason, locked = false }: Props) {
  const { color } = getGrade(score);

  if (locked) {
    return (
      <div className="relative rounded-xl p-4 bg-[rgba(45,27,105,0.2)] border border-[rgba(155,127,232,0.1)] overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-sm bg-[rgba(15,10,30,0.6)] flex flex-col items-center justify-center z-10 rounded-xl">
          <span className="text-2xl mb-1">🔒</span>
          <p className="text-xs font-body text-[#9B7FE8] text-center">
            Upgrade to Indigo+
          </p>
        </div>
        <div className="opacity-30">
          <div className="h-4 bg-[rgba(155,127,232,0.3)] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[rgba(155,127,232,0.2)] rounded w-full" />
        </div>
      </div>
    );
  }

  return (
    <Link href={`/brand/${slug}`}>
      <div className="rounded-xl p-4 bg-[rgba(45,27,105,0.2)] border border-[rgba(155,127,232,0.15)] hover:border-[rgba(155,127,232,0.3)] transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-[#F7F5FF]">{name}</p>
            <p className="text-xs font-body text-[#9B7FE8] mt-1 leading-relaxed">{reason}</p>
          </div>
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}40` }}
          >
            <span className="text-sm font-mono font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-[10px] font-display font-semibold" style={{ color }}>
              {grade}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
