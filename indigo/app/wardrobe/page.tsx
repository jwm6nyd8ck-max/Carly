"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import IndigoScoreRing from "@/components/IndigoScoreRing";
import { getGrade } from "@/lib/scoring/calculateScore";

const DEMO = [
  { id: "1", brand_name: "Patagonia",    item_name: "Nano Puff Jacket", indigo_score: 88 },
  { id: "2", brand_name: "Eileen Fisher",item_name: "Silk Blouse",      indigo_score: 86 },
  { id: "3", brand_name: "Levi's",       item_name: "501 Jeans",        indigo_score: 62 },
  { id: "4", brand_name: "Nike",         item_name: "Running Top",      indigo_score: 61 },
];

export default function WardrobePage() {
  const avg = Math.round(DEMO.reduce((s, i) => s + i.indigo_score, 0) / DEMO.length);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      <div className="px-6 pt-12 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="label mb-1">My Wardrobe</p>
        <h1 className="font-display text-2xl" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
          {DEMO.length} items tracked
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-6">
        {/* Health score */}
        <div className="flex items-center gap-8 py-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <IndigoScoreRing score={avg} size="md" animated />
          <div>
            <p className="label mb-1">Wardrobe Average</p>
            <p className="text-sm font-body leading-relaxed" style={{ color: "var(--text-warm)" }}>
              Weighted across all saved items based on their Indigo Score.
            </p>
            <div className="flex gap-6 mt-4">
              {[
                { n: DEMO.filter(i => i.indigo_score >= 70).length,  l: "Good"  },
                { n: DEMO.filter(i => i.indigo_score >= 40 && i.indigo_score < 70).length, l: "Fair" },
                { n: DEMO.filter(i => i.indigo_score < 40).length,   l: "Poor"  },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="font-display text-xl italic" style={{ color: "var(--text-cream)" }}>{n}</p>
                  <p className="label mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Impact */}
        <div className="py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="label mb-4">Estimated Impact</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: `~${Math.round(avg * 23)}L`, label: "less water vs. average wardrobe" },
              { value: `~${Math.round(DEMO.length * (avg / 100) * 4.2)}kg`, label: "CO₂ saved vs. fast fashion" },
            ].map(({ value, label }) => (
              <div key={label} className="px-4 py-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4 }}>
                <p className="font-display text-2xl italic" style={{ color: "#6B8C5F" }}>{value}</p>
                <p className="text-xs font-body mt-1 leading-snug" style={{ color: "var(--text-warm)" }}>{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-body mt-3" style={{ color: "var(--text-muted)" }}>
            Estimates based on lifecycle assessment averages.
          </p>
        </div>

        {/* Items */}
        <div className="py-6">
          <p className="label mb-4">Items</p>
          <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
            {DEMO.map((item, i) => {
              const { color, grade } = getGrade(item.indigo_score);
              return (
                <div key={item.id} className="flex items-center justify-between px-4 py-4"
                  style={{ background: "var(--bg-card)", borderBottom: i < DEMO.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{item.item_name}</p>
                    <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-muted)" }}>{item.brand_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-display text-lg italic" style={{ color }}>{item.indigo_score}</p>
                      <p className="label" style={{ color }}>{grade}</p>
                    </div>
                    <button className="text-xs" style={{ color: "var(--text-muted)" }} aria-label="Remove">✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Link href="/">
          <button className="w-full py-3.5 text-xs font-body mb-6 transition-colors"
            style={{ border: "1px dashed rgba(180,160,110,0.25)", borderRadius: 4, color: "var(--text-warm)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Scan a new item
          </button>
        </Link>

        <div className="py-5 px-5 mb-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4 }}>
          <p className="label mb-1">Free plan — {DEMO.length} / 20 items</p>
          <p className="text-xs font-body mb-4" style={{ color: "var(--text-warm)" }}>
            Upgrade to Indigo+ for unlimited wardrobe tracking and full score breakdowns.
          </p>
          <Link href="/upgrade">
            <button className="w-full py-3 text-xs font-body transition-all"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(180,160,110,0.3)", borderRadius: 2, color: "var(--text-cream)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Upgrade to Indigo+
            </button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
