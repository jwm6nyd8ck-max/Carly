"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import BrandSearchBar from "@/components/BrandSearchBar";
import { seedBrands } from "@/data/seedBrands";
import { getGrade } from "@/lib/scoring/calculateScore";

const TIERS = [
  { id: "all",  label: "All" },
  { id: "a+",   label: "A+" },
  { id: "a",    label: "A"  },
  { id: "b",    label: "B"  },
  { id: "c",    label: "C"  },
  { id: "d-f",  label: "D / F" },
];

const RANGES: Record<string, [number, number]> = {
  "a+": [85, 100], a: [70, 84], b: [55, 69], c: [40, 54], "d-f": [0, 39],
};

export default function ExplorePage() {
  const [tier, setTier] = useState("all");

  const filtered = useMemo(() => {
    const list = tier === "all"
      ? [...seedBrands]
      : seedBrands.filter(b => b.indigo_score >= RANGES[tier][0] && b.indigo_score <= RANGES[tier][1]);
    return list.sort((a, b) => b.indigo_score - a.indigo_score);
  }, [tier]);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4"
        style={{ background: "rgba(24,23,15,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <h1 className="font-display text-xl mb-3" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
          Explore Brands
        </h1>
        <BrandSearchBar placeholder="Search by name…" />
      </div>

      <div className="max-w-xl mx-auto px-6 pt-5">
        {/* Tier filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TIERS.map(t => (
            <button key={t.id} onClick={() => setTier(t.id)}
              className="flex-shrink-0 px-4 py-1.5 text-xs font-body transition-all"
              style={{
                background: tier === t.id ? "var(--bg-raised)" : "transparent",
                border: `1px solid ${tier === t.id ? "rgba(180,160,110,0.35)" : "var(--border)"}`,
                borderRadius: 2,
                color: tier === t.id ? "var(--text-cream)" : "var(--text-warm)",
                letterSpacing: "0.1em",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Brand list */}
        <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
          {filtered.map((brand, i) => {
            const { color } = getGrade(brand.indigo_score);
            return (
              <Link key={brand.slug} href={`/brand/${brand.slug}`}>
                <div className="flex items-center justify-between px-4 py-4 transition-colors"
                  style={{ background: "var(--bg-card)", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-card)")}>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-body w-5 text-right flex-shrink-0"
                      style={{ color: "var(--text-muted)" }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{brand.name}</p>
                      <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {brand.certifications.length > 0
                          ? brand.certifications.slice(0, 2).join("  ·  ")
                          : brand.country_of_hq}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="font-display text-lg italic" style={{ color }}>{brand.indigo_score}</p>
                    <p className="label" style={{ color }}>{brand.grade}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-sm font-body" style={{ color: "var(--text-warm)" }}>
            No brands in this tier
          </p>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
