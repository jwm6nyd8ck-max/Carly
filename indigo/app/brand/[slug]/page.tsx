import { notFound } from "next/navigation";
import Link from "next/link";
import IndigoScoreRing from "@/components/IndigoScoreRing";
import PillarBar from "@/components/PillarBar";
import FlagCard from "@/components/FlagCard";
import BottomNav from "@/components/BottomNav";
import { seedBrands } from "@/data/seedBrands";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return seedBrands.map(b => ({ slug: b.slug }));
}

export default function BrandPage({ params }: Props) {
  const brand = seedBrands.find(b => b.slug === params.slug);
  if (!brand) notFound();

  const pillars = [
    { label: "Material Integrity",    score: brand.material_score,      max: 25, icon: "I" },
    { label: "Origin & Labor",        score: brand.labor_score,          max: 25, icon: "II" },
    { label: "Chemical Safety",       score: brand.chemical_score,       max: 20, icon: "III" },
    { label: "Environmental Impact",  score: brand.environmental_score,  max: 20, icon: "IV" },
    { label: "Brand Ethics",          score: brand.brand_ethics_score,   max: 10, icon: "V" },
  ];

  const confidence = brand.certifications.length >= 3
    ? { mark: "High",   note: "Third-party certified data" }
    : brand.certifications.length >= 1
    ? { mark: "Medium", note: "Mix of certified and self-reported" }
    : { mark: "Low",    note: "Estimated from industry averages" };

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      {/* Nav */}
      <div className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4"
        style={{ background: "rgba(24,23,15,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)" }}>
        <Link href="/" className="text-xs font-body" style={{ color: "var(--text-warm)", letterSpacing: "0.08em" }}>
          Back
        </Link>
        <h1 className="font-display text-lg flex-1" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
          {brand.name}
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-6">
        {/* Score hero */}
        <div className="flex flex-col items-center py-10 gap-2">
          <IndigoScoreRing score={brand.indigo_score} size="lg" animated />
          <p className="label mt-2">{brand.country_of_hq}</p>
          <p className="text-xs font-body" style={{ color: "var(--text-muted)" }}>
            Last verified {brand.last_updated}
          </p>
        </div>

        {/* Confidence */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 text-xs font-body"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2 }}>
            <span style={{ color: "var(--text-warm)" }}>Data confidence:</span>
            <span style={{ color: "var(--text-cream)" }}>{confidence.mark}</span>
            <span style={{ color: "var(--text-muted)" }}>— {confidence.note}</span>
          </div>
        </div>

        {/* Score breakdown */}
        <section className="mb-8">
          <p className="label mb-5">Score Breakdown</p>
          <div className="flex flex-col gap-5">
            {pillars.map((p, i) => (
              <PillarBar key={p.label} label={p.label} score={p.score} maxScore={p.max} icon={p.icon} delay={i * 80} />
            ))}
          </div>
        </section>

        {/* Manufacturing */}
        <section className="mb-8 py-6" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
          <p className="label mb-4">Manufacturing Countries</p>
          <div className="flex flex-wrap gap-2">
            {brand.primary_manufacturing_countries.map(c => (
              <span key={c} className="text-xs font-body px-3 py-1.5"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)" }}>
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs font-body mt-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Country score reflects average labour law enforcement, not individual factory conditions.
          </p>
        </section>

        {/* Certifications */}
        {brand.certifications.length > 0 && (
          <section className="mb-8">
            <p className="label mb-4">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {brand.certifications.map(cert => (
                <span key={cert} className="text-xs font-body px-3 py-1.5"
                  style={{ background: "rgba(107,140,95,0.08)", border: "1px solid rgba(107,140,95,0.25)", borderRadius: 2, color: "#7FA870" }}>
                  {cert}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Green flags */}
        {brand.green_flags.length > 0 && (
          <section className="mb-8">
            <p className="label mb-4">What they&apos;re doing right</p>
            <div className="flex flex-col gap-2">
              {brand.green_flags.map((flag, i) => (
                <FlagCard key={i} type="green" title={flag} explanation="" />
              ))}
            </div>
          </section>
        )}

        {/* Red flags */}
        {brand.red_flags.length > 0 && (
          <section className="mb-8">
            <p className="label mb-4">Areas of concern</p>
            <div className="flex flex-col gap-2">
              {brand.red_flags.map((flag, i) => (
                <FlagCard key={i} type="red" title={flag} explanation="" severity="medium" />
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {brand.notes && (
          <section className="mb-8 py-6" style={{ borderTop: "1px solid var(--border)" }}>
            <p className="label mb-3">Analyst Notes</p>
            <p className="text-sm font-body leading-relaxed" style={{ color: "var(--text-warm)" }}>
              {brand.notes}
            </p>
          </section>
        )}

        {/* Disclaimer */}
        <p className="text-xs font-body leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
          Indigo scores brands on publicly verifiable criteria. Brands improve their score by obtaining
          certifications and publishing supply chain data. Last verified {brand.last_updated}.
        </p>

        <button className="w-full py-3 text-xs font-body mb-8 transition-colors"
          style={{ border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Request a Re-rating
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
