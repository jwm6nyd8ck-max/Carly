import { notFound } from "next/navigation";
import Link from "next/link";
import IndigoScoreRing from "@/components/IndigoScoreRing";
import PillarBar from "@/components/PillarBar";
import FlagCard from "@/components/FlagCard";
import BottomNav from "@/components/BottomNav";
import { seedBrands } from "@/data/seedBrands";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return seedBrands.map((b) => ({ slug: b.slug }));
}

export default function BrandPage({ params }: Props) {
  const brand = seedBrands.find((b) => b.slug === params.slug);
  if (!brand) notFound();

  const pillars = [
    { label: "Material Integrity", score: brand.material_score, max: 25, icon: "🌿" },
    { label: "Origin & Labor", score: brand.labor_score, max: 25, icon: "👷" },
    { label: "Chemical Safety", score: brand.chemical_score, max: 20, icon: "🧪" },
    { label: "Environmental Impact", score: brand.environmental_score, max: 20, icon: "🌍" },
    { label: "Brand Ethics", score: brand.brand_ethics_score, max: 10, icon: "🏢" },
  ];

  const dataConfidence =
    brand.certifications.length >= 3
      ? { icon: "🟢", label: "High", note: "Third-party certified data" }
      : brand.certifications.length >= 1
      ? { icon: "🟡", label: "Medium", note: "Mix of certified and self-reported data" }
      : { icon: "🔴", label: "Low", note: "Estimated based on industry averages" };

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-28">
      {/* Back header */}
      <div className="sticky top-0 z-40 bg-[rgba(15,10,30,0.9)] backdrop-blur-md border-b border-[rgba(155,127,232,0.1)]">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-[rgba(155,127,232,0.1)] flex items-center justify-center text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.2)] transition-colors"
            aria-label="Back"
          >
            ←
          </Link>
          <h1 className="font-display font-bold text-[#F7F5FF] flex-1 truncate">
            {brand.name}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Hero score section */}
        <div className="flex flex-col items-center py-8 gap-4">
          <IndigoScoreRing score={brand.indigo_score} size="lg" animated />
          <div className="text-center">
            <p className="text-xs font-body text-[#9B7FE8] mb-1">
              {brand.country_of_hq} headquarters
            </p>
            <p className="text-xs font-body text-[rgba(155,127,232,0.6)]">
              Last verified: {brand.last_updated}
            </p>
          </div>
        </div>

        {/* Data confidence badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(45,27,105,0.3)] border border-[rgba(155,127,232,0.15)]">
            <span>{dataConfidence.icon}</span>
            <span className="text-xs font-body text-[#9B7FE8]">
              Data Confidence: <strong className="text-[#F7F5FF]">{dataConfidence.label}</strong> — {dataConfidence.note}
            </span>
          </div>
        </div>

        {/* 5 Pillars */}
        <section className="glass rounded-2xl p-5 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-4">
            Score Breakdown
          </h2>
          <div className="flex flex-col gap-4">
            {pillars.map((p, i) => (
              <PillarBar
                key={p.label}
                label={p.label}
                score={p.score}
                maxScore={p.max}
                icon={p.icon}
                delay={i * 100}
              />
            ))}
          </div>
        </section>

        {/* Manufacturing countries */}
        <section className="glass rounded-2xl p-5 mb-5">
          <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-3">
            Manufacturing Countries
          </h2>
          <div className="flex flex-wrap gap-2">
            {brand.primary_manufacturing_countries.map((c) => (
              <span
                key={c}
                className="text-xs font-body px-3 py-1.5 rounded-full bg-[rgba(45,27,105,0.4)] border border-[rgba(155,127,232,0.2)] text-[#C8B8FF]"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="text-[10px] font-body text-[rgba(155,127,232,0.5)] mt-3 leading-relaxed">
            Country score reflects average labor law enforcement, not individual factory conditions.
            A factory in Bangladesh with SA8000 certification may outperform an uncertified US factory.
          </p>
        </section>

        {/* Certifications */}
        {brand.certifications.length > 0 && (
          <section className="glass rounded-2xl p-5 mb-5">
            <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-3">
              Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {brand.certifications.map((cert) => (
                <span
                  key={cert}
                  className="text-xs font-body px-3 py-1.5 rounded-full bg-[rgba(45,184,122,0.1)] border border-[rgba(45,184,122,0.25)] text-[#2DB87A]"
                >
                  ✓ {cert}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Green flags */}
        {brand.green_flags.length > 0 && (
          <section className="mb-5">
            <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-3 px-1">
              What they&apos;re doing right
            </h2>
            <div className="flex flex-col gap-2">
              {brand.green_flags.map((flag, i) => (
                <FlagCard
                  key={i}
                  type="green"
                  title={flag}
                  explanation=""
                />
              ))}
            </div>
          </section>
        )}

        {/* Red flags */}
        {brand.red_flags.length > 0 && (
          <section className="mb-5">
            <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-3 px-1">
              Areas of concern
            </h2>
            <div className="flex flex-col gap-2">
              {brand.red_flags.map((flag, i) => (
                <FlagCard
                  key={i}
                  type="red"
                  title={flag}
                  explanation=""
                  severity="medium"
                />
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {brand.notes && (
          <section className="glass rounded-2xl p-5 mb-5">
            <h2 className="text-sm font-display font-semibold text-[#F7F5FF] mb-2">
              Analyst Notes
            </h2>
            <p className="text-sm font-body text-[#9B7FE8] leading-relaxed">
              {brand.notes}
            </p>
          </section>
        )}

        {/* Anti-bias disclaimer */}
        <div className="rounded-xl p-4 bg-[rgba(45,27,105,0.2)] border border-[rgba(155,127,232,0.1)] mb-5">
          <p className="text-[10px] font-body text-[rgba(155,127,232,0.6)] leading-relaxed">
            Indigo scores brands on publicly verifiable criteria. Brands can improve their score by
            obtaining certifications and publishing supply chain data. This score is not a definitive
            judgment — data accuracy depends on what brands publicly disclose.
          </p>
        </div>

        {/* Request re-rating */}
        <button className="w-full py-3 rounded-xl border border-[rgba(155,127,232,0.3)] text-sm font-body text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.1)] transition-colors mb-8">
          Request a Re-rating
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
