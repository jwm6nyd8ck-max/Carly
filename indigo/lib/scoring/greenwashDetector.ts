export interface GreenwashFlag {
  id: string;
  flag: string;
  severity: "high" | "medium" | "low";
  source?: string;
}

export interface GreenwashInput {
  performanceClaims: string[];
  certifications: string[];
  brandName?: string;
  brandScore?: number;
  collectionsPerYear?: number;
  fibers?: Array<{ fiber: string; percentage: number }>;
}

const GREENWASH_RULES: Array<{
  id: string;
  check: (input: GreenwashInput) => boolean;
  flag: string;
  severity: "high" | "medium" | "low";
}> = [
  {
    id: "unverified_eco",
    check: (i) =>
      i.performanceClaims.some((c) =>
        ["eco-friendly", "eco friendly", "ecological", "green"].includes(
          c.toLowerCase()
        )
      ) && i.certifications.length === 0,
    flag: "Unverified eco claim — 'Eco-friendly' without certification is a marketing term, not a standard. Any brand can call itself eco-friendly.",
    severity: "medium",
  },
  {
    id: "sustainable_brand_low_score",
    check: (i) =>
      Boolean(
        i.brandName &&
          i.brandName.toLowerCase().includes("sustain") &&
          i.brandScore !== undefined &&
          i.brandScore < 50
      ),
    flag: "Brand uses 'sustainable' branding but scores below 50/100 on the Indigo system. Sustainability claims are not backed by measurable data.",
    severity: "high",
  },
  {
    id: "natural_misleading",
    check: (i) =>
      i.performanceClaims.some((c) => c.toLowerCase() === "natural") &&
      Boolean(
        i.fibers?.some(
          (f) =>
            ["polyester", "acrylic", "nylon", "spandex", "elastane"].includes(
              f.fiber
            ) && f.percentage > 50
        )
      ),
    flag: "'Natural' claim is misleading — majority synthetic composition. The dominant fiber is petroleum-derived.",
    severity: "high",
  },
  {
    id: "bci_fast_fashion",
    check: (i) =>
      Boolean(i.collectionsPerYear && i.collectionsPerYear > 12) &&
      i.certifications.includes("Better Cotton Initiative"),
    flag: "Better Cotton Initiative (BCI) membership does not offset fast fashion production volume. BCI is a sourcing standard, not a sustainability certification.",
    severity: "medium",
  },
  {
    id: "recycled_synthetic_eco",
    check: (i) =>
      i.performanceClaims.some((c) =>
        c.toLowerCase().includes("recycled")
      ) &&
      Boolean(
        i.fibers?.some(
          (f) =>
            ["recycled_polyester", "recycled_nylon"].includes(f.fiber) &&
            f.percentage > 0
        )
      ) &&
      i.certifications.length === 0,
    flag: "Recycled synthetic claims without third-party certification. 'Recycled' polyester still sheds microplastics and is difficult to verify without audit.",
    severity: "low",
  },
  {
    id: "organic_unverified",
    check: (i) =>
      i.performanceClaims.some((c) => c.toLowerCase().includes("organic")) &&
      !i.certifications.some((c) =>
        ["GOTS", "OCS", "USDA Organic"].includes(c)
      ),
    flag: "Organic claim without GOTS or OCS certification. 'Organic' on clothing is unregulated without a recognized standard.",
    severity: "medium",
  },
];

export function detectGreenwashing(input: GreenwashInput): GreenwashFlag[] {
  return GREENWASH_RULES.filter((rule) => rule.check(input)).map((rule) => ({
    id: rule.id,
    flag: rule.flag,
    severity: rule.severity,
  }));
}
