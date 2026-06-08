"use client";

import { useState } from "react";
import Link from "next/link";
import Scanner from "@/components/Scanner";
import BrandSearchBar from "@/components/BrandSearchBar";
import BottomNav from "@/components/BottomNav";
import { seedBrands } from "@/data/seedBrands";

const BEST = seedBrands.filter(b => b.indigo_score >= 70).sort((a,b) => b.indigo_score - a.indigo_score).slice(0, 4);
const WORST = seedBrands.filter(b => b.indigo_score < 25).sort((a,b) => a.indigo_score - b.indigo_score).slice(0, 3);

function gradeColor(s: number) {
  if (s >= 85) return "#6B8C5F";
  if (s >= 70) return "#7FA870";
  if (s >= 55) return "#C4974A";
  if (s >= 40) return "#B8863A";
  if (s >= 25) return "#A0513A";
  return "#7A3020";
}

export default function HomePage() {
  const [scannerOpen, setScannerOpen] = useState(false);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      {scannerOpen && <Scanner onClose={() => setScannerOpen(false)} />}

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <h1 className="font-display text-2xl" style={{ color: "var(--text-cream)", fontWeight: 300, letterSpacing: "0.05em" }}>
            Indigo
          </h1>
          <p className="label mt-0.5">Wear What You Know</p>
        </div>
        <Link href="/wardrobe">
          <span className="label" style={{ color: "var(--text-warm)" }}>Wardrobe</span>
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 py-12 text-center" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="label mb-4">Sustainability Scanner</p>
        <h2 className="font-display text-4xl mb-3" style={{ color: "var(--text-cream)", fontWeight: 300, lineHeight: 1.15 }}>
          Know what&apos;s in<br />your clothes
        </h2>
        <p className="text-sm font-body mb-10 mx-auto max-w-xs leading-relaxed" style={{ color: "var(--text-warm)" }}>
          Scan any clothing tag for an instant ethical and sustainability score.
        </p>

        <button onClick={() => setScannerOpen(true)}
          className="inline-flex items-center gap-3 px-8 py-4 text-sm font-body transition-all"
          style={{
            background: "var(--bg-raised)",
            border: "1px solid rgba(180,160,110,0.3)",
            borderRadius: 2,
            color: "var(--text-cream)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "0.7rem",
          }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6B8C5F", display: "inline-block" }} />
          Scan a Tag
        </button>

        <p className="text-xs font-body mt-4" style={{ color: "var(--text-muted)" }}>
          Or search any item or brand below
        </p>

        <div className="mt-6 max-w-sm mx-auto">
          <BrandSearchBar placeholder="Search any item or brand — Nike shoes, Zara dress…" />
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="px-6 py-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <p className="label">Responsibly Made</p>
          <Link href="/explore">
            <span className="text-xs font-body" style={{ color: "var(--text-warm)", letterSpacing: "0.08em" }}>View all</span>
          </Link>
        </div>
        <div className="flex flex-col gap-px" style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
          {BEST.map((brand) => (
            <Link key={brand.slug} href={`/brand/${brand.slug}`}>
              <div className="flex items-center justify-between px-4 py-4 transition-colors"
                style={{ background: "var(--bg-card)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-raised)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-card)")}>
                <div>
                  <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{brand.name}</p>
                  <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {brand.certifications.slice(0, 2).join("  ·  ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg italic" style={{ color: gradeColor(brand.indigo_score) }}>
                    {brand.indigo_score}
                  </p>
                  <p className="label" style={{ color: gradeColor(brand.indigo_score) }}>{brand.grade}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hall of Shame */}
      <section className="px-6 py-8" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <p className="label">Brands of Concern</p>
          <Link href="/explore">
            <span className="text-xs font-body" style={{ color: "var(--text-warm)", letterSpacing: "0.08em" }}>View all</span>
          </Link>
        </div>
        <div className="flex flex-col gap-px" style={{ border: "1px solid rgba(160,81,58,0.2)", borderRadius: 4, overflow: "hidden" }}>
          {WORST.map((brand) => (
            <Link key={brand.slug} href={`/brand/${brand.slug}`}>
              <div className="flex items-center justify-between px-4 py-4 transition-colors"
                style={{ background: "rgba(160,81,58,0.05)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(160,81,58,0.09)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(160,81,58,0.05)")}>
                <div>
                  <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{brand.name}</p>
                  <p className="text-xs font-body mt-0.5 max-w-[220px] truncate" style={{ color: "rgba(160,81,58,0.7)" }}>
                    {brand.red_flags[0]}
                  </p>
                </div>
                <p className="font-display text-lg italic" style={{ color: "#7A3020" }}>{brand.indigo_score}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 py-8">
        <p className="label mb-6">How We Score</p>
        <div className="flex flex-col gap-3">
          {[
            { letter: "I", name: "Material Integrity",       note: "What the fabric is actually made of" },
            { letter: "II", name: "Origin & Labor",          note: "Where and under what conditions" },
            { letter: "III", name: "Chemical Safety",        note: "What harmful substances may be present" },
            { letter: "IV", name: "Environmental Impact",    note: "Water, carbon, waste, dyeing process" },
            { letter: "V", name: "Brand Ethics",             note: "Who made it and do they walk the talk" },
          ].map(({ letter, name, note }) => (
            <div key={name} className="flex items-start gap-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-display text-sm italic w-8 flex-shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
                {letter}
              </span>
              <div>
                <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{name}</p>
                <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-warm)" }}>{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
