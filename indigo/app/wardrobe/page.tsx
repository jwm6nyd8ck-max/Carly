"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import IndigoScoreRing from "@/components/IndigoScoreRing";

// Demo wardrobe items for non-authenticated view
const DEMO_ITEMS = [
  { id: "1", brand_name: "Patagonia", item_name: "Nano Puff Jacket", indigo_score: 88, grade: "A+" },
  { id: "2", brand_name: "Eileen Fisher", item_name: "Silk Top", indigo_score: 86, grade: "A+" },
  { id: "3", brand_name: "Levi's", item_name: "501 Jeans", indigo_score: 62, grade: "B" },
  { id: "4", brand_name: "Nike", item_name: "Air Max 90", indigo_score: 61, grade: "B" },
];

export default function WardrobePage() {
  const [items] = useState(DEMO_ITEMS);
  const avgScore =
    items.length > 0
      ? Math.round(items.reduce((s, i) => s + i.indigo_score, 0) / items.length)
      : 0;

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-28">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-display font-bold text-[#F7F5FF] mb-1">
          My Wardrobe
        </h1>
        <p className="text-sm font-body text-[#9B7FE8]">
          {items.length} items tracked
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Wardrobe health score */}
        {items.length > 0 && (
          <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-6">
            <IndigoScoreRing score={avgScore} size="md" animated />
            <div className="flex-1">
              <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-1">
                Wardrobe Health Score
              </h2>
              <p className="text-xs font-body text-[#9B7FE8] mb-3 leading-relaxed">
                The weighted average Indigo Score across all your saved items.
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-mono font-bold text-[#2DB87A]">
                    {items.filter((i) => i.indigo_score >= 70).length}
                  </p>
                  <p className="text-[9px] font-body text-[#9B7FE8] uppercase tracking-wider">
                    Excellent
                  </p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold text-[#E8A733]">
                    {items.filter((i) => i.indigo_score >= 40 && i.indigo_score < 70).length}
                  </p>
                  <p className="text-[9px] font-body text-[#9B7FE8] uppercase tracking-wider">
                    Fair
                  </p>
                </div>
                <div>
                  <p className="text-lg font-mono font-bold text-[#E84433]">
                    {items.filter((i) => i.indigo_score < 40).length}
                  </p>
                  <p className="text-[9px] font-body text-[#9B7FE8] uppercase tracking-wider">
                    Poor
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Impact estimate */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[rgba(45,184,122,0.1)] to-[rgba(45,27,105,0.2)] border border-[rgba(45,184,122,0.2)] mb-6">
          <h3 className="text-sm font-display font-semibold text-[#F7F5FF] mb-3">
            🌍 Estimated Impact
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-3 bg-[rgba(45,27,105,0.3)]">
              <p className="text-lg font-mono font-bold text-[#2DB87A]">
                ~{Math.round(avgScore * 23)}L
              </p>
              <p className="text-[10px] font-body text-[#9B7FE8] mt-0.5">
                less water used vs. avg wardrobe
              </p>
            </div>
            <div className="rounded-xl p-3 bg-[rgba(45,27,105,0.3)]">
              <p className="text-lg font-mono font-bold text-[#2DB87A]">
                ~{Math.round(items.length * (avgScore / 100) * 4.2)}kg
              </p>
              <p className="text-[10px] font-body text-[#9B7FE8] mt-0.5">
                CO₂ saved vs. fast fashion equivalent
              </p>
            </div>
          </div>
          <p className="text-[9px] font-body text-[rgba(155,127,232,0.4)] mt-2">
            Estimates based on industry lifecycle assessment averages.
          </p>
        </div>

        {/* Items list */}
        <div className="flex flex-col gap-3 mb-6">
          {items.map((item) => {
            const color =
              item.indigo_score >= 85
                ? "#2DB87A"
                : item.indigo_score >= 70
                ? "#52C994"
                : item.indigo_score >= 55
                ? "#E8C733"
                : item.indigo_score >= 40
                ? "#E8A733"
                : item.indigo_score >= 25
                ? "#E87033"
                : "#E84433";

            return (
              <div
                key={item.id}
                className="glass rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-semibold text-[#F7F5FF] truncate">
                    {item.item_name}
                  </p>
                  <p className="text-xs font-body text-[#9B7FE8] mt-0.5">
                    {item.brand_name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-base font-mono font-bold" style={{ color }}>
                      {item.indigo_score}
                    </p>
                    <p className="text-xs font-display" style={{ color }}>
                      {item.grade}
                    </p>
                  </div>
                  <button
                    className="w-6 h-6 rounded-full bg-[rgba(232,68,51,0.1)] text-[rgba(232,68,51,0.5)] text-xs flex items-center justify-center hover:bg-[rgba(232,68,51,0.2)] transition-colors"
                    aria-label="Remove from wardrobe"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add item CTA */}
        <Link href="/">
          <button className="w-full py-4 rounded-2xl border border-dashed border-[rgba(155,127,232,0.3)] text-sm font-body text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.05)] transition-colors flex items-center justify-center gap-2">
            <span className="text-lg">+</span>
            Scan a new item to add
          </button>
        </Link>

        {/* Upgrade prompt */}
        <div className="mt-6 rounded-2xl p-5 bg-gradient-to-br from-[rgba(45,27,105,0.5)] to-[rgba(91,63,191,0.3)] border border-[rgba(155,127,232,0.2)]">
          <p className="text-xs font-body text-[#9B7FE8] mb-1">Free plan</p>
          <p className="text-sm font-display font-semibold text-[#F7F5FF] mb-2">
            Wardrobe limit: {items.length}/20 items
          </p>
          <Link href="/upgrade">
            <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5B3FBF] to-[#2D1B69] text-sm font-body font-medium text-white shadow-lg shadow-[rgba(91,63,191,0.3)] hover:shadow-[rgba(91,63,191,0.5)] transition-all">
              Upgrade to Indigo+ — Unlimited Wardrobe
            </button>
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
