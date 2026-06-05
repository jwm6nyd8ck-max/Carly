"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import BrandSearchBar from "@/components/BrandSearchBar";
import { seedBrands } from "@/data/seedBrands";
import { getGrade } from "@/lib/scoring/calculateScore";

const TIERS = [
  { id: "all", label: "All" },
  { id: "a-plus", label: "A+" },
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
  { id: "d-f", label: "D/F" },
];

const TIER_RANGES: Record<string, [number, number]> = {
  "a-plus": [85, 100],
  a: [70, 84],
  b: [55, 69],
  c: [40, 54],
  "d-f": [0, 39],
};

export default function ExplorePage() {
  const [activeTier, setActiveTier] = useState("all");

  const filtered = useMemo(() => {
    if (activeTier === "all") return [...seedBrands].sort((a, b) => b.indigo_score - a.indigo_score);
    const range = TIER_RANGES[activeTier];
    return seedBrands
      .filter((b) => b.indigo_score >= range[0] && b.indigo_score <= range[1])
      .sort((a, b) => b.indigo_score - a.indigo_score);
  }, [activeTier]);

  const hallOfFame = [...seedBrands]
    .sort((a, b) => b.indigo_score - a.indigo_score)
    .slice(0, 5);

  const hallOfShame = [...seedBrands]
    .sort((a, b) => a.indigo_score - b.indigo_score)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[rgba(15,10,30,0.9)] backdrop-blur-md border-b border-[rgba(155,127,232,0.1)]">
        <div className="px-4 py-4 max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-xl text-[#F7F5FF] mb-3">
            Explore Brands
          </h1>
          <BrandSearchBar placeholder="Search 50+ brands…" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5">
        {/* Tier filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TIERS.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                activeTier === tier.id
                  ? "bg-[#5B3FBF] text-white shadow-lg shadow-[rgba(91,63,191,0.3)]"
                  : "bg-[rgba(45,27,105,0.3)] text-[#9B7FE8] border border-[rgba(155,127,232,0.2)]"
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>

        {activeTier === "all" && (
          <>
            {/* Hall of Fame */}
            <section className="mb-6">
              <h2 className="text-base font-display font-semibold text-[#F7F5FF] mb-3 flex items-center gap-2">
                <span>🏆</span> Hall of Fame
              </h2>
              <div className="flex flex-col gap-2">
                {hallOfFame.map((brand, i) => (
                  <BrandListItem key={brand.slug} brand={brand} rank={i + 1} />
                ))}
              </div>
            </section>

            {/* Hall of Shame */}
            <section className="mb-6">
              <h2 className="text-base font-display font-semibold text-[#F7F5FF] mb-3 flex items-center gap-2">
                <span>⚠️</span> Hall of Shame
              </h2>
              <div className="flex flex-col gap-2">
                {hallOfShame.map((brand, i) => (
                  <BrandListItem key={brand.slug} brand={brand} rank={i + 1} shame />
                ))}
              </div>
            </section>

            <div className="border-t border-[rgba(155,127,232,0.1)] pt-6 mb-4">
              <h2 className="text-base font-display font-semibold text-[#F7F5FF] mb-3">
                All Brands ({seedBrands.length})
              </h2>
            </div>
          </>
        )}

        {/* Brand list */}
        <div className="flex flex-col gap-2">
          {filtered.map((brand) => (
            <BrandListItem key={brand.slug} brand={brand} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#9B7FE8] font-body text-sm">
            No brands in this tier yet
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}

function BrandListItem({
  brand,
  rank,
  shame = false,
}: {
  brand: (typeof seedBrands)[0];
  rank?: number;
  shame?: boolean;
}) {
  const { color } = getGrade(brand.indigo_score);

  return (
    <Link href={`/brand/${brand.slug}`}>
      <div
        className={`rounded-xl p-4 flex items-center gap-3 hover:bg-[rgba(155,127,232,0.05)] transition-colors border ${
          shame
            ? "bg-[rgba(232,68,51,0.05)] border-[rgba(232,68,51,0.1)]"
            : "bg-[rgba(45,27,105,0.2)] border-[rgba(155,127,232,0.1)]"
        }`}
      >
        {rank && (
          <span className="text-xs font-mono text-[rgba(155,127,232,0.4)] w-5 text-right flex-shrink-0">
            #{rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-body font-semibold text-[#F7F5FF] truncate">
            {brand.name}
          </p>
          <p className="text-xs font-body text-[#9B7FE8] mt-0.5 truncate">
            {brand.certifications.length > 0
              ? brand.certifications.slice(0, 2).join(" · ")
              : brand.red_flags[0] ?? brand.country_of_hq}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm font-mono font-bold" style={{ color }}>
            {brand.indigo_score}
          </span>
          <span
            className="text-xs font-display font-semibold px-2 py-0.5 rounded-lg"
            style={{
              color,
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`,
            }}
          >
            {brand.grade}
          </span>
        </div>
      </div>
    </Link>
  );
}
