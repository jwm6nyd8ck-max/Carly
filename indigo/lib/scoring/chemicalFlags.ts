export interface ChemicalFlag {
  id: string;
  name: string;
  description: string;
  deduction: number;
  severity: "high" | "medium" | "low";
}

export const CHEMICAL_FLAGS: ChemicalFlag[] = [
  {
    id: "pfas",
    name: "PFAS / Forever Chemicals",
    description:
      "Waterproof, stain-resistant, or water-repellent finishes likely use per- and polyfluoroalkyl substances (PFAS). These accumulate in the body and environment permanently. Look for OEKO-TEX or bluesign certification to confirm PFAS-free.",
    deduction: 8,
    severity: "high",
  },
  {
    id: "azo_dyes",
    name: "Azo Dye Risk",
    description:
      "Cheap synthetic dyes used in fast fashion can release carcinogenic aromatic amines when they decompose. Particularly common in bright, vivid colors without certification.",
    deduction: 5,
    severity: "high",
  },
  {
    id: "formaldehyde",
    name: "Formaldehyde Treatment",
    description:
      "Wrinkle-free, anti-shrink, and easy-care finishes often use formaldehyde-releasing resins. A Group 1 carcinogen at high exposure levels.",
    deduction: 4,
    severity: "medium",
  },
  {
    id: "heavy_metals",
    name: "Heavy Metal Dyes",
    description:
      "Bright synthetic colors may use chromium VI, lead, or cadmium-based dyes. These can absorb through skin contact and are toxic to aquatic environments.",
    deduction: 4,
    severity: "medium",
  },
  {
    id: "phthalates",
    name: "Phthalate Risk",
    description:
      "PVC prints and plastisol screen prints often contain phthalates — endocrine disruptors linked to hormone disruption. Common in printed logos and designs.",
    deduction: 3,
    severity: "medium",
  },
  {
    id: "voc",
    name: "VOC Off-Gassing",
    description:
      "New synthetic fabrics can off-gas volatile organic compounds during manufacturing and initial wear. Includes solvents, dye fixatives, and softening agents.",
    deduction: 2,
    severity: "low",
  },
];

export const CERTIFICATION_CHEMICAL_CLEARANCES: Record<string, string[]> = {
  "OEKO-TEX Standard 100": ["pfas", "azo_dyes", "formaldehyde", "heavy_metals", "phthalates", "voc"],
  "STANDARD 100 by OEKO-TEX": ["pfas", "azo_dyes", "formaldehyde", "heavy_metals", "phthalates", "voc"],
  bluesign: ["pfas", "azo_dyes", "voc"],
  "bluesign®": ["pfas", "azo_dyes", "voc"],
  GOTS: ["azo_dyes", "heavy_metals"],
};
