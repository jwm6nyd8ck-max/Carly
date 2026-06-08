import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { seedBrands } from "@/data/seedBrands";
import { calculateIndigoScore, getGrade } from "@/lib/scoring/calculateScore";
import { FIBER_LABELS } from "@/lib/scoring/fiberScores";

const FIBER_KEYS = Object.keys(FIBER_LABELS).join(", ");

interface FiberComp {
  fiber: string;
  percentage: number;
}

interface ItemAnalysis {
  brand: string | null;
  item_name: string;
  item_type: string;
  estimated_materials: FiberComp[];
  likely_manufacturing_country: string;
  performance_claims: string[];
  confidence: "high" | "medium" | "low";
  analysis_notes: string;
}

async function analyzeWithClaude(query: string): Promise<ItemAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });

  const systemPrompt = `You are an expert in sustainable fashion and textile manufacturing.

Given any clothing item description, brand name, or product name, return ONLY a valid JSON object with no markdown or explanation:
{
  "brand": string | null,
  "item_name": string,
  "item_type": string,
  "estimated_materials": [{ "fiber": string, "percentage": number }],
  "likely_manufacturing_country": string,
  "performance_claims": string[],
  "confidence": "high" | "medium" | "low",
  "analysis_notes": string
}

Rules:
- fiber values MUST only be from this list: ${FIBER_KEYS}
- all percentages must sum to exactly 100
- item_type: use "t-shirt", "jeans", "dress", "jacket", "shoes", "sweater", "activewear", "swimwear", "underwear", "socks", "coat", "blazer", "shorts", "skirt", "hoodie", or similar
- performance_claims: only include from ["waterproof", "moisture-wicking", "stain-resistant", "wrinkle-free", "water-repellent"] when clearly applicable
- analysis_notes: 1-2 sentences on specific sustainability considerations for this item/brand combo
- confidence: "high" if brand+item is specific, "medium" if just brand name, "low" if very generic

Brand knowledge:
- Fast fashion (Shein, Zara, H&M, Primark, Forever 21, ASOS): high polyester/acrylic, manufactured in Bangladesh/China/Vietnam
- Outdoor/performance (Patagonia, Arc'teryx, REI, Columbia): recycled polyester, nylon, performance claims common
- Luxury (Gucci, Louis Vuitton, Burberry, Prada): natural fibers (wool, silk, linen, cotton), Italy/France/UK manufacturing
- Athleisure (Lululemon, Nike, Adidas, Under Armour): nylon/polyester blends, moisture-wicking, China/Vietnam/Indonesia
- Denim brands (Levi's, Wrangler, Gap): mostly cotton with small elastane %, Bangladesh/Mexico/USA
- Sustainable brands (Patagonia, Everlane, Eileen Fisher, Cuyana): recycled/organic materials, certifications
- If only a brand name given (no specific item): estimate for their most common product category`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: query }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned) as ItemAnalysis;

    // Validate fibers sum to 100
    const total = parsed.estimated_materials.reduce((s, f) => s + f.percentage, 0);
    if (total !== 100 && parsed.estimated_materials.length > 0) {
      const last = parsed.estimated_materials[parsed.estimated_materials.length - 1];
      last.percentage += 100 - total;
    }

    return parsed;
  } catch {
    return null;
  }
}

function findBrand(name: string) {
  const lower = name.toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
  return seedBrands.find(
    (b) =>
      b.name.toLowerCase() === lower ||
      b.name.toLowerCase().includes(lower) ||
      lower.includes(b.name.toLowerCase()) ||
      b.slug.replace(/-/g, " ") === lower
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const barcode = searchParams.get("barcode") ?? "";
  const query = q || barcode;

  if (!query.trim()) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  // 1. Try direct brand match from query text
  const directBrandMatch = findBrand(query);

  // 2. AI analysis
  const analysis = await analyzeWithClaude(query);

  // 3. Brand lookup — prefer AI-identified brand, fall back to direct match
  let brand = directBrandMatch;
  if (!brand && analysis?.brand) {
    brand = findBrand(analysis.brand);
  }

  // 4. Calculate item-specific score using material composition
  let itemScore = null;
  const materials = analysis?.estimated_materials ?? [];

  if (materials.length > 0) {
    const isKnownFastFashion = brand
      ? brand.red_flags.some(
          (f) =>
            f.toLowerCase().includes("fast fashion") ||
            f.toLowerCase().includes("overproduction") ||
            f.toLowerCase().includes("labour violation")
        )
      : false;

    const scoringInput = {
      fibers: materials,
      countryOfManufacture: analysis?.likely_manufacturing_country || "Unknown",
      certifications: brand?.certifications ?? [],
      performanceClaims: analysis?.performance_claims ?? [],
      brandName: brand?.name ?? analysis?.brand ?? undefined,
      brandScore: brand?.indigo_score,
      brandEthicsData: brand
        ? {
            publishesSustainabilityReport: brand.green_flags.some(
              (f) => f.toLowerCase().includes("transparency") || f.toLowerCase().includes("report")
            ),
            publishesFactoryList: brand.green_flags.some((f) =>
              f.toLowerCase().includes("factory")
            ),
            bCorp: brand.certifications.some((c) => c.includes("B Corp")),
            fashionPactSignatory: false,
            noGreenwashingViolations: !brand.red_flags.some((f) =>
              f.toLowerCase().includes("greenwash")
            ),
            carbonNeutralCertified: brand.certifications.some((c) =>
              c.toLowerCase().includes("carbon")
            ),
            fastFashionModel: isKnownFastFashion,
            collectionsPerYear: brand.collections_per_year,
            documentedGreenwashing: brand.red_flags.some((f) =>
              f.toLowerCase().includes("greenwash")
            ),
            documentedLaborViolations: brand.red_flags.some(
              (f) =>
                f.toLowerCase().includes("labor") ||
                f.toLowerCase().includes("labour") ||
                f.toLowerCase().includes("wage") ||
                f.toLowerCase().includes("worker")
            ),
            unverifiedEcoClaims: brand.red_flags.some((f) =>
              f.toLowerCase().includes("unverified") || f.toLowerCase().includes("claim")
            ),
          }
        : undefined,
    };

    itemScore = calculateIndigoScore(scoringInput);
  }

  // 5. Blend item score with brand baseline
  let finalScore: number | null = null;
  if (itemScore && brand) {
    finalScore = Math.round(itemScore.total * 0.6 + brand.indigo_score * 0.4);
  } else if (itemScore) {
    finalScore = itemScore.total;
  } else if (brand) {
    finalScore = brand.indigo_score;
  }

  const gradeInfo =
    finalScore !== null
      ? getGrade(finalScore)
      : { grade: "?", label: "Unknown", color: "#6B6150" };

  // Merge brand flags into score flags
  const redFlags = [
    ...(itemScore?.redFlags ?? []),
    ...(brand?.red_flags.map((f, i) => ({ id: `brand_${i}`, title: f, explanation: "", severity: "medium" as const })) ?? []),
  ];
  const greenFlags = [
    ...(itemScore?.greenFlags ?? []),
    ...(brand?.green_flags.map((f, i) => ({ id: `brand_g_${i}`, title: f, explanation: "" })) ?? []),
  ];

  return NextResponse.json({
    query,
    item: analysis
      ? {
          name: analysis.item_name,
          type: analysis.item_type,
          brand: analysis.brand,
          materials: analysis.estimated_materials,
          manufacturing_country: analysis.likely_manufacturing_country,
          performance_claims: analysis.performance_claims,
          confidence: analysis.confidence,
          analysis_notes: analysis.analysis_notes,
        }
      : null,
    brand: brand
      ? {
          name: brand.name,
          slug: brand.slug,
          indigo_score: brand.indigo_score,
          grade: brand.grade,
          certifications: brand.certifications,
          red_flags: brand.red_flags,
          green_flags: brand.green_flags,
          country_of_hq: brand.country_of_hq,
        }
      : null,
    score:
      finalScore !== null
        ? {
            total: finalScore,
            grade: gradeInfo.grade,
            gradeLabel: gradeInfo.label,
            gradeColor: gradeInfo.color,
            pillars: itemScore
              ? {
                  material: itemScore.materialScore,
                  labor: itemScore.laborScore,
                  chemical: itemScore.chemicalScore,
                  environmental: itemScore.environmentalScore,
                  ethics: itemScore.brandEthicsScore,
                }
              : null,
            redFlags,
            greenFlags,
          }
        : null,
    ai_powered: !!analysis,
  });
}
