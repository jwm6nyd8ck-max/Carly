"use client";

import { useState } from "react";
import Link from "next/link";
import Scanner from "@/components/Scanner";
import BrandSearchBar from "@/components/BrandSearchBar";
import BottomNav from "@/components/BottomNav";
import { seedBrands } from "@/data/seedBrands";

const FEATURED_BRANDS = seedBrands
  .filter((b) => b.indigo_score >= 70)
  .sort((a, b) => b.indigo_score - a.indigo_score)
  .slice(0, 4);

const WORST_BRANDS = seedBrands
  .filter((b) => b.indigo_score < 30)
  .sort((a, b) => a.indigo_score - b.indigo_score)
  .slice(0, 3);

export default function HomePage() {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-24">
      {scannerOpen && (
        <Scanner onClose={() => setScannerOpen(false)} />
      )}

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B3FBF] to-[#2D1B69] flex items-center justify-center shadow-lg shadow-[rgba(91,63,191,0.3)]">
            <span className="text-lg">🧵</span>
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-[#F7F5FF] leading-none">
              Indigo
            </h1>
            <p className="text-[10px] font-body text-[#9B7FE8] uppercase tracking-widest leading-none mt-0.5">
              Wear What You Know
            </p>
          </div>
        </div>
        <Link
          href="/wardrobe"
          className="px-3 py-1.5 rounded-lg border border-[rgba(155,127,232,0.3)] text-xs font-body text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.1)] transition-colors"
        >
          My Wardrobe
        </Link>
      </header>

      {/* Hero Scanner */}
      <section className="px-5 pt-4 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold text-[#F7F5FF] mb-2">
            Know what&apos;s in your clothes
          </h2>
          <p className="text-sm font-body text-[#9B7FE8]">
            Scan any clothing tag for an instant sustainability score
          </p>
        </div>

        {/* Scanner button with pulsing ring */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#5B3FBF] opacity-20 animate-ping scale-150" />
            <div
              className="absolute inset-0 rounded-full bg-[#5B3FBF] opacity-10 animate-ping scale-[1.75]"
              style={{ animationDelay: "0.3s" }}
            />
            <button
              onClick={() => setScannerOpen(true)}
              className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#5B3FBF] to-[#2D1B69] flex flex-col items-center justify-center gap-1 shadow-xl shadow-[rgba(91,63,191,0.4)] hover:shadow-[rgba(91,63,191,0.6)] hover:scale-105 transition-all active:scale-95"
              aria-label="Open barcode scanner"
            >
              <span className="text-3xl" aria-hidden="true">📷</span>
              <span className="text-xs font-body font-medium text-[#C8B8FF]">
                Scan Tag
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-body text-[rgba(155,127,232,0.5)] mb-6">
          Point your camera at any clothing tag barcode
        </p>

        {/* Quick search */}
        <BrandSearchBar placeholder="Or search a brand name…" />
      </section>

      {/* Hall of Fame */}
      <section className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-[#F7F5FF]">
            Hall of Fame
          </h3>
          <Link
            href="/explore"
            className="text-xs font-body text-[#9B7FE8] hover:text-[#C8B8FF]"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEATURED_BRANDS.map((brand) => (
            <Link key={brand.slug} href={`/brand/${brand.slug}`}>
              <div className="rounded-xl p-4 bg-[rgba(45,27,105,0.3)] border border-[rgba(155,127,232,0.15)] hover:bg-[rgba(91,63,191,0.2)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-body font-semibold text-[#F7F5FF] leading-tight flex-1 mr-2">
                    {brand.name}
                  </p>
                  <span
                    className="text-xs font-mono font-bold tabular-nums flex-shrink-0"
                    style={{
                      color:
                        brand.indigo_score >= 85
                          ? "#2DB87A"
                          : brand.indigo_score >= 70
                          ? "#52C994"
                          : "#E8C733",
                    }}
                  >
                    {brand.indigo_score}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {brand.certifications.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="text-[9px] font-body px-1.5 py-0.5 rounded bg-[rgba(45,184,122,0.1)] text-[#2DB87A] border border-[rgba(45,184,122,0.2)]"
                    >
                      {c.split(" ")[0]}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hall of Shame */}
      <section className="px-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-[#F7F5FF]">
            Hall of Shame
          </h3>
          <Link
            href="/explore"
            className="text-xs font-body text-[#9B7FE8] hover:text-[#C8B8FF]"
          >
            See all →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {WORST_BRANDS.map((brand) => (
            <Link key={brand.slug} href={`/brand/${brand.slug}`}>
              <div className="rounded-xl p-3 bg-[rgba(232,68,51,0.06)] border border-[rgba(232,68,51,0.15)] hover:bg-[rgba(232,68,51,0.1)] transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-semibold text-[#F7F5FF]">
                      {brand.name}
                    </p>
                    <p className="text-xs font-body text-[rgba(232,68,51,0.8)] mt-0.5 truncate">
                      {brand.red_flags[0]}
                    </p>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#E84433] ml-3 flex-shrink-0">
                    {brand.indigo_score}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How scoring works */}
      <section className="px-5 mb-8">
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[rgba(45,27,105,0.4)] to-[rgba(91,63,191,0.2)] border border-[rgba(155,127,232,0.15)]">
          <h3 className="text-sm font-display font-semibold text-[#F7F5FF] mb-2">
            How the Indigo Score works
          </h3>
          <p className="text-xs font-body text-[#9B7FE8] mb-4 leading-relaxed">
            Our 0–100 score evaluates every item across 5 pillars — all backed
            by third-party data.
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[
              { icon: "🌿", label: "Materials" },
              { icon: "👷", label: "Labor" },
              { icon: "🧪", label: "Chemicals" },
              { icon: "🌍", label: "Environment" },
              { icon: "🏢", label: "Ethics" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-lg">{icon}</span>
                <span className="text-[9px] font-body text-[#9B7FE8] text-center leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
