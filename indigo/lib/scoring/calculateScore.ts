import {
  FIBER_SCORES,
  FIBER_WATER_SCORES,
  SYNTHETIC_FIBERS,
} from "./fiberScores";
import { COUNTRY_SCORES } from "./countryScores";
import { CHEMICAL_FLAGS, CERTIFICATION_CHEMICAL_CLEARANCES } from "./chemicalFlags";
import { detectGreenwashing } from "./greenwashDetector";

export interface FiberComposition {
  fiber: string;
  percentage: number;
}

export interface BrandEthicsData {
  publishesSustainabilityReport: boolean;
  publishesFactoryList: boolean;
  bCorp: boolean;
  fashionPactSignatory: boolean;
  noGreenwashingViolations: boolean;
  carbonNeutralCertified: boolean;
  fastFashionModel: boolean;
  collectionsPerYear?: number;
  documentedGreenwashing: boolean;
  documentedLaborViolations: boolean;
  unverifiedEcoClaims: boolean;
}

export interface ScoringInput {
  fibers: FiberComposition[];
  countryOfManufacture: string;
  certifications: string[];
  performanceClaims: string[];
  brandEthicsData?: BrandEthicsData;
  brandName?: string;
  brandScore?: number;
}

export interface RedFlag {
  id: string;
  title: string;
  explanation: string;
  severity: "high" | "medium" | "low";
  source?: string;
}

export interface GreenFlag {
  id: string;
  title: string;
  explanation: string;
  source?: string;
}

export interface IndigoScore {
  total: number;
  grade: string;
  gradeLabel: string;
  gradeColor: string;
  materialScore: number;
  laborScore: number;
  chemicalScore: number;
  environmentalScore: number;
  brandEthicsScore: number;
  redFlags: RedFlag[];
  greenFlags: GreenFlag[];
}

// ── Material Score (0–25) ──────────────────────────────────────────────────
function calculateMaterialScore(
  fibers: FiberComposition[],
  certifications: string[]
): number {
  const totalPct = fibers.reduce((s, f) => s + f.percentage, 0) || 100;
  const baseScore = fibers.reduce((score, f) => {
    const fiberKey = f.fiber.toLowerCase().replace(/[^a-z_]/g, "_");
    const fiberScore = FIBER_SCORES[fiberKey] ?? FIBER_SCORES["cotton"] ?? 10;
    return score + (fiberScore * f.percentage) / totalPct;
  }, 0);

  // Certification bonuses (max +5)
  let certBonus = 0;
  if (certifications.some((c) => ["GOTS"].includes(c))) certBonus += 3;
  if (certifications.some((c) => c.includes("OEKO-TEX") || c.includes("STANDARD 100"))) certBonus += 2;
  if (certifications.some((c) => c.includes("bluesign"))) certBonus += 2;
  if (certifications.some((c) => c.includes("Cradle to Cradle"))) certBonus += 3;
  certBonus = Math.min(certBonus, 5);

  return Math.min(25, Math.round(baseScore + certBonus));
}

// ── Labor Score (0–25) ────────────────────────────────────────────────────
function calculateLaborScore(
  country: string,
  certifications: string[]
): number {
  const countryScore = COUNTRY_SCORES[country] ?? COUNTRY_SCORES["Unknown"] ?? 3;
  let certBonus = 0;

  if (certifications.some((c) => c.includes("SA8000"))) certBonus += 5;
  if (certifications.some((c) => c.includes("Fair Trade"))) certBonus += 5;
  if (certifications.some((c) => c.includes("B Corp"))) certBonus += 3;
  if (certifications.some((c) => c.includes("Factory list") || c.includes("factory list"))) certBonus += 3;
  if (certifications.some((c) => c.includes("Living Wage"))) certBonus += 4;

  if (certifications.length === 0 && country === "Unknown") certBonus -= 3;

  return Math.min(25, Math.max(0, countryScore + certBonus));
}

// ── Chemical Score (0–20) ─────────────────────────────────────────────────
function calculateChemicalScore(
  fibers: FiberComposition[],
  performanceClaims: string[],
  certifications: string[]
): number {
  const totalPct = fibers.reduce((s, f) => s + f.percentage, 0) || 100;
  const syntheticPct = fibers
    .filter((f) => SYNTHETIC_FIBERS.has(f.fiber.toLowerCase()))
    .reduce((s, f) => s + f.percentage, 0);

  const isPerformance = performanceClaims.some((c) =>
    ["waterproof", "water-repellent", "stain-resistant", "moisture-wicking", "wrinkle-free"].includes(c.toLowerCase())
  );

  let base = 20;
  if (isPerformance) base = 8;
  else if (syntheticPct / totalPct > 0.5) base = 12;

  // Determine which flags are cleared by certifications
  const clearedFlags = new Set<string>();
  for (const cert of certifications) {
    const clears = CERTIFICATION_CHEMICAL_CLEARANCES[cert] ?? [];
    clears.forEach((f) => clearedFlags.add(f));
  }

  let deductions = 0;
  for (const flag of CHEMICAL_FLAGS) {
    if (clearedFlags.has(flag.id)) continue;

    const triggered =
      (flag.id === "pfas" && isPerformance) ||
      (flag.id === "azo_dyes" && syntheticPct / totalPct > 0.3) ||
      (flag.id === "formaldehyde" &&
        performanceClaims.some((c) =>
          ["wrinkle-free", "anti-shrink", "easy-care"].includes(c.toLowerCase())
        )) ||
      (flag.id === "heavy_metals" && syntheticPct / totalPct > 0.4) ||
      (flag.id === "phthalates" &&
        performanceClaims.some((c) => ["pvc", "printed", "screen-print"].includes(c.toLowerCase()))) ||
      (flag.id === "voc" && syntheticPct / totalPct > 0.6);

    if (triggered) deductions += flag.deduction;
  }

  return Math.min(20, Math.max(0, base - deductions));
}

// ── Environmental Score (0–20) ────────────────────────────────────────────
function calculateEnvironmentalScore(
  fibers: FiberComposition[],
  certifications: string[]
): number {
  const totalPct = fibers.reduce((s, f) => s + f.percentage, 0) || 100;

  // Water intensity score (0–7)
  const waterScore =
    fibers.reduce((score, f) => {
      const ws = FIBER_WATER_SCORES[f.fiber.toLowerCase()] ?? 3;
      return score + (ws * f.percentage) / totalPct;
    }, 0);

  // Dyeing process (0–7)
  let dyeScore = 3; // default unknown
  if (certifications.some((c) => c.includes("GOTS") || c.includes("bluesign"))) dyeScore = 6;
  else if (certifications.some((c) => c.includes("OEKO-TEX"))) dyeScore = 5;

  // End-of-life design (0–6)
  const fiberTypes = new Set(fibers.map((f) => f.fiber.toLowerCase()));
  const hasElastane = fiberTypes.has("elastane") || fiberTypes.has("spandex") || fiberTypes.has("lycra");
  const isSingleFiber = fiberTypes.size === 1;
  let endOfLifeScore = 2;
  if (isSingleFiber && !hasElastane) endOfLifeScore = 6;
  else if (hasElastane) endOfLifeScore = 1;

  const takeBack = certifications.some((c) => c.includes("Take-back") || c.includes("Repair"));
  if (takeBack) endOfLifeScore = Math.min(8, endOfLifeScore + 2);

  return Math.min(20, Math.round(waterScore + dyeScore + endOfLifeScore));
}

// ── Brand Ethics Score (0–10) ─────────────────────────────────────────────
function calculateBrandEthicsScore(data: BrandEthicsData): number {
  let score = 0;
  if (data.publishesSustainabilityReport) score += 2;
  if (data.publishesFactoryList) score += 2;
  if (data.bCorp) score += 2;
  if (data.fashionPactSignatory) score += 1;
  if (data.noGreenwashingViolations) score += 2;
  if (data.carbonNeutralCertified) score += 1;

  if (data.fastFashionModel) score -= 4;
  if (data.documentedGreenwashing) score -= 3;
  if (data.documentedLaborViolations) score -= 3;
  if (data.unverifiedEcoClaims) score -= 1;

  return Math.min(10, Math.max(0, score));
}

// ── Grade helpers ─────────────────────────────────────────────────────────
export function getGrade(score: number): {
  grade: string;
  label: string;
  color: string;
} {
  if (score >= 85) return { grade: "A+", label: "Exceptional", color: "#6B8C5F" };
  if (score >= 70) return { grade: "A",  label: "Excellent",   color: "#7FA870" };
  if (score >= 55) return { grade: "B",  label: "Good",        color: "#C4974A" };
  if (score >= 40) return { grade: "C",  label: "Fair",        color: "#B8863A" };
  if (score >= 25) return { grade: "D",  label: "Poor",        color: "#A0513A" };
  return                  { grade: "F",  label: "Avoid",       color: "#7A3020" };
}

// ── Flag detectors ────────────────────────────────────────────────────────
function detectRedFlags(input: ScoringInput): RedFlag[] {
  const flags: RedFlag[] = [];
  const hasCert = (substr: string) =>
    input.certifications.some((c) => c.toLowerCase().includes(substr.toLowerCase()));

  const syntheticPct =
    input.fibers
      .filter((f) => SYNTHETIC_FIBERS.has(f.fiber.toLowerCase()))
      .reduce((s, f) => s + f.percentage, 0) /
    (input.fibers.reduce((s, f) => s + f.percentage, 0) || 100);

  const isPerformance = input.performanceClaims.some((c) =>
    ["waterproof", "water-repellent", "stain-resistant"].includes(c.toLowerCase())
  );

  if (isPerformance && !hasCert("oeko-tex") && !hasCert("bluesign")) {
    flags.push({
      id: "pfas",
      title: "PFAS / Forever Chemical Risk",
      explanation:
        "This item's waterproof or stain-resistant finish likely uses per- and polyfluoroalkyl substances (PFAS). These accumulate permanently in the body and environment. Look for OEKO-TEX Standard 100 or bluesign® certification to confirm PFAS-free.",
      severity: "high",
      source: "https://www.niehs.nih.gov/health/topics/agents/pfc",
    });
  }

  if (syntheticPct > 0.3 && !hasCert("oeko-tex") && !hasCert("gots")) {
    flags.push({
      id: "azo_dyes",
      title: "Azo Dye Risk",
      explanation:
        "Synthetic dyes without certification may include azo compounds that release carcinogenic aromatic amines. Common in mass-market synthetics without independent testing.",
      severity: "medium",
    });
  }

  if (
    input.performanceClaims.some((c) =>
      ["wrinkle-free", "easy-care", "anti-shrink"].includes(c.toLowerCase())
    ) &&
    !hasCert("oeko-tex")
  ) {
    flags.push({
      id: "formaldehyde",
      title: "Formaldehyde Treatment Likely",
      explanation:
        "Wrinkle-free and anti-shrink finishes typically use formaldehyde-releasing resins. The WHO classifies formaldehyde as a Group 1 carcinogen at elevated exposures.",
      severity: "medium",
    });
  }

  const greenwashFlags = detectGreenwashing({
    performanceClaims: input.performanceClaims,
    certifications: input.certifications,
    brandName: input.brandName,
    brandScore: input.brandScore,
    fibers: input.fibers,
  });

  for (const gf of greenwashFlags) {
    flags.push({
      id: `greenwash_${gf.id}`,
      title: "Greenwashing Alert",
      explanation: gf.flag,
      severity: gf.severity,
    });
  }

  return flags;
}

function detectGreenFlags(input: ScoringInput): GreenFlag[] {
  const flags: GreenFlag[] = [];
  const hasCert = (substr: string) =>
    input.certifications.some((c) => c.toLowerCase().includes(substr.toLowerCase()));

  if (hasCert("gots")) {
    flags.push({
      id: "gots",
      title: "GOTS Certified",
      explanation:
        "The Global Organic Textile Standard (GOTS) is the world's leading processing standard for organic fibres. It confirms organic fibre sourcing and restricted chemical use throughout production.",
      source: "https://global-standard.org",
    });
  }
  if (hasCert("oeko-tex") || hasCert("standard 100")) {
    flags.push({
      id: "oeko_tex",
      title: "OEKO-TEX Standard 100 Certified",
      explanation:
        "Every component of this item has been tested for harmful substances. Certified by the OEKO-TEX Association — one of the world's best-known labels for textiles tested for harmful substances.",
      source: "https://www.oeko-tex.com",
    });
  }
  if (hasCert("fair trade")) {
    flags.push({
      id: "fair_trade",
      title: "Fair Trade Certified",
      explanation:
        "Fair Trade certification ensures workers received fair wages, safe working conditions, and community investment funds. Verified by Fairtrade International.",
      source: "https://www.fairtrade.net",
    });
  }
  if (hasCert("b corp")) {
    flags.push({
      id: "b_corp",
      title: "B Corp Certified Brand",
      explanation:
        "B Corporation certification means this brand has met rigorous social and environmental performance standards, verified by B Lab. Requires recertification every 3 years.",
      source: "https://www.bcorporation.net",
    });
  }
  if (hasCert("bluesign")) {
    flags.push({
      id: "bluesign",
      title: "bluesign® Certified",
      explanation:
        "bluesign® certification ensures responsible use of resources and safe chemical management throughout the entire textile supply chain.",
      source: "https://www.bluesign.com",
    });
  }
  if (hasCert("sa8000")) {
    flags.push({
      id: "sa8000",
      title: "SA8000 Certified Factory",
      explanation:
        "SA8000 is the world's leading social certification program. It verifies that workers are treated fairly and factories meet international labor standards.",
      source: "https://sa-intl.org/programs/sa8000/",
    });
  }

  return flags;
}

// ── Main export ───────────────────────────────────────────────────────────
export function calculateIndigoScore(input: ScoringInput): IndigoScore {
  const materialScore = calculateMaterialScore(input.fibers, input.certifications);
  const laborScore = calculateLaborScore(input.countryOfManufacture, input.certifications);
  const chemicalScore = calculateChemicalScore(input.fibers, input.performanceClaims, input.certifications);
  const environmentalScore = calculateEnvironmentalScore(input.fibers, input.certifications);
  const brandEthicsScore = input.brandEthicsData
    ? calculateBrandEthicsScore(input.brandEthicsData)
    : 5;

  const total = Math.min(
    100,
    materialScore + laborScore + chemicalScore + environmentalScore + brandEthicsScore
  );

  const { grade, label, color } = getGrade(total);

  return {
    total,
    grade,
    gradeLabel: label,
    gradeColor: color,
    materialScore,
    laborScore,
    chemicalScore,
    environmentalScore,
    brandEthicsScore,
    redFlags: detectRedFlags(input),
    greenFlags: detectGreenFlags(input),
  };
}
