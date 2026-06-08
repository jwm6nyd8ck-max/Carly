"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import IndigoScoreRing from "@/components/IndigoScoreRing";
import PillarBar from "@/components/PillarBar";
import FlagCard from "@/components/FlagCard";
import MaterialBreakdown from "@/components/MaterialBreakdown";
import BottomNav from "@/components/BottomNav";

interface FiberComp { fiber: string; percentage: number; }
interface Flag { id: string; title: string; explanation: string; severity?: string; }

interface SearchResult {
  query: string;
  item: {
    name: string;
    type: string;
    brand: string | null;
    materials: FiberComp[];
    manufacturing_country: string;
    performance_claims: string[];
    confidence: "high" | "medium" | "low";
    analysis_notes: string;
  } | null;
  brand: {
    name: string;
    slug: string;
    indigo_score: number;
    grade: string;
    certifications: string[];
    red_flags: string[];
    green_flags: string[];
    country_of_hq: string;
  } | null;
  score: {
    total: number;
    grade: string;
    gradeLabel: string;
    gradeColor: string;
    pillars: {
      material: number;
      labor: number;
      chemical: number;
      environmental: number;
      ethics: number;
    } | null;
    redFlags: Flag[];
    greenFlags: Flag[];
  } | null;
  ai_powered: boolean;
}

const CONFIDENCE_COLORS = {
  high: "#6B8C5F",
  medium: "#C4974A",
  low: "#A0513A",
};

function LoadingDots() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: "var(--bg-deep)" }}>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--text-warm)",
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }} />
        ))}
      </div>
      <p className="text-xs font-body" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
        ANALYSING
      </p>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get("q") ?? params.get("barcode") ?? "";
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState(q);

  useEffect(() => {
    if (!q.trim()) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    const param = params.get("barcode") ? `barcode=${encodeURIComponent(q)}` : `q=${encodeURIComponent(q)}`;
    fetch(`/api/item-search?${param}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError("No results found. Try a different search.");
        else setResult(data);
      })
      .catch(() => setError("Search failed. Check your connection and try again."))
      .finally(() => setLoading(false));
  }, [q, params]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) router.push(`/search?q=${encodeURIComponent(inputVal.trim())}`);
  };

  if (loading) return <LoadingDots />;

  const pillars = result?.score?.pillars
    ? [
        { label: "Material Integrity",   score: result.score.pillars.material,     max: 25, icon: "I" },
        { label: "Origin & Labor",        score: result.score.pillars.labor,        max: 25, icon: "II" },
        { label: "Chemical Safety",       score: result.score.pillars.chemical,     max: 20, icon: "III" },
        { label: "Environmental Impact",  score: result.score.pillars.environmental, max: 20, icon: "IV" },
        { label: "Brand Ethics",          score: result.score.pillars.ethics,       max: 10, icon: "V" },
      ]
    : [];

  const confidenceColor = result?.item
    ? CONFIDENCE_COLORS[result.item.confidence]
    : "#6B6150";

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      {/* Nav */}
      <div className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4"
        style={{ background: "rgba(24,23,15,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" className="text-xs font-body flex-shrink-0" style={{ color: "var(--text-warm)", letterSpacing: "0.08em" }}>
          Back
        </Link>
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Search any item or brand…"
            className="flex-1 px-3 py-2 text-sm font-body"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 4,
              color: "var(--text-cream)",
              outline: "none",
              minWidth: 0,
            }}
          />
          <button type="submit"
            className="px-4 py-2 text-xs font-body flex-shrink-0"
            style={{
              background: "var(--bg-raised)",
              border: "1px solid rgba(180,160,110,0.3)",
              borderRadius: 4,
              color: "var(--text-cream)",
              letterSpacing: "0.08em",
            }}>
            Go
          </button>
        </form>
      </div>

      {/* No query */}
      {!q && (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <p className="font-display text-2xl mb-3" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
            Search any item
          </p>
          <p className="text-sm font-body" style={{ color: "var(--text-warm)" }}>
            Try &ldquo;Nike Air Force 1&rdquo;, &ldquo;Zara floral dress&rdquo;, or &ldquo;H&amp;M cotton t-shirt&rdquo;
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
          <p className="text-sm font-body mb-2" style={{ color: "#A0513A" }}>{error}</p>
          <p className="text-xs font-body" style={{ color: "var(--text-muted)" }}>
            Try searching for a brand name or specific item
          </p>
        </div>
      )}

      {/* Results */}
      {result && !error && (
        <div className="max-w-xl mx-auto px-6">
          {/* Score hero */}
          <div className="flex flex-col items-center py-10 gap-2">
            {result.score ? (
              <>
                <IndigoScoreRing score={result.score.total} size="lg" animated />
                <p className="font-display text-xl mt-2" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
                  {result.item?.name ?? result.brand?.name ?? q}
                </p>
                {result.item?.type && (
                  <span className="text-xs font-body px-3 py-1"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)", letterSpacing: "0.08em" }}>
                    {result.item.type.toUpperCase()}
                  </span>
                )}
              </>
            ) : (
              <p className="text-sm font-body" style={{ color: "var(--text-warm)" }}>Could not calculate score</p>
            )}
          </div>

          {/* Confidence + AI badge */}
          {result.item && (
            <div className="flex justify-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2 }}>
                <span style={{ color: "var(--text-warm)" }}>Confidence:</span>
                <span style={{ color: confidenceColor }}>{result.item.confidence.charAt(0).toUpperCase() + result.item.confidence.slice(1)}</span>
              </div>
              {result.ai_powered && (
                <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2 }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6B8C5F" }} />
                  <span style={{ color: "var(--text-warm)" }}>AI Analysis</span>
                </div>
              )}
            </div>
          )}

          {/* Material breakdown */}
          {result.item?.materials && result.item.materials.length > 0 && (
            <section className="mb-8">
              <p className="label mb-4">Material Composition</p>
              <MaterialBreakdown fibers={result.item.materials} />
              {result.item.manufacturing_country && (
                <p className="text-xs font-body mt-4" style={{ color: "var(--text-muted)" }}>
                  Likely manufactured in{" "}
                  <span style={{ color: "var(--text-warm)" }}>{result.item.manufacturing_country}</span>
                </p>
              )}
            </section>
          )}

          {/* Pillar bars */}
          {pillars.length > 0 && (
            <section className="mb-8" style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
              <p className="label mb-5">Score Breakdown</p>
              <div className="flex flex-col gap-5">
                {pillars.map((p, i) => (
                  <PillarBar key={p.label} label={p.label} score={p.score} maxScore={p.max} icon={p.icon} delay={i * 80} />
                ))}
              </div>
            </section>
          )}

          {/* Brand card */}
          {result.brand && (
            <section className="mb-8 py-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="label">Brand</p>
                <Link href={`/brand/${result.brand.slug}`}>
                  <span className="text-xs font-body" style={{ color: "var(--text-warm)", letterSpacing: "0.08em" }}>
                    Full profile ›
                  </span>
                </Link>
              </div>
              <div className="flex items-center justify-between px-4 py-4"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 4 }}>
                <div>
                  <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{result.brand.name}</p>
                  <p className="text-xs font-body mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {result.brand.certifications.slice(0, 2).join("  ·  ") || result.brand.country_of_hq}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg italic" style={{ color: result.score?.gradeColor ?? "var(--text-cream)" }}>
                    {result.brand.indigo_score}
                  </p>
                  <p className="label" style={{ color: result.score?.gradeColor ?? "var(--text-muted)" }}>
                    {result.brand.grade}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Analysis notes */}
          {result.item?.analysis_notes && (
            <section className="mb-8">
              <p className="label mb-3">Analysis</p>
              <p className="text-sm font-body leading-relaxed" style={{ color: "var(--text-warm)" }}>
                {result.item.analysis_notes}
              </p>
            </section>
          )}

          {/* Green flags */}
          {(result.score?.greenFlags ?? []).length > 0 && (
            <section className="mb-8">
              <p className="label mb-4">Positive Indicators</p>
              <div className="flex flex-col gap-2">
                {result.score!.greenFlags.slice(0, 4).map((flag, i) => (
                  <FlagCard key={i} type="green" title={flag.title} explanation={flag.explanation} />
                ))}
              </div>
            </section>
          )}

          {/* Red flags */}
          {(result.score?.redFlags ?? []).length > 0 && (
            <section className="mb-8">
              <p className="label mb-4">Areas of Concern</p>
              <div className="flex flex-col gap-2">
                {result.score!.redFlags.slice(0, 5).map((flag, i) => (
                  <FlagCard key={i} type="red" title={flag.title} explanation={flag.explanation} severity={(flag.severity as "high" | "medium" | "low") ?? "medium"} />
                ))}
              </div>
            </section>
          )}

          {/* No score fallback */}
          {!result.score && !result.item && result.brand && (
            <section className="mb-8 py-6" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="label mb-3">Brand Overview</p>
              <p className="text-sm font-body" style={{ color: "var(--text-warm)" }}>
                Indigo Score: <span className="font-display italic" style={{ fontSize: "1.1em" }}>{result.brand.indigo_score}</span> — {result.brand.grade}
              </p>
              <Link href={`/brand/${result.brand.slug}`}>
                <button className="mt-4 w-full py-3 text-xs font-body"
                  style={{ border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  View Full Brand Report
                </button>
              </Link>
            </section>
          )}

          <p className="text-xs font-body leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Material composition is estimated from typical industry standards for this brand and item type.
            Actual garment composition may vary. Scan the clothing tag for exact materials.
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingDots />}>
      <SearchInner />
    </Suspense>
  );
}
