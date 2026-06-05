import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { seedBrands } from "@/data/seedBrands";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 50);
  const slug = searchParams.get("slug");

  // Try Supabase first; fall back to seed data
  try {
    if (slug) {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) {
        return NextResponse.json({ brand: data });
      }
    }

    if (q) {
      const { data, error } = await supabase
        .from("brands")
        .select("id,name,slug,indigo_score,grade,certifications")
        .ilike("name", `%${q}%`)
        .limit(limit);

      if (!error && data && data.length > 0) {
        return NextResponse.json({ brands: data });
      }
    }
  } catch {}

  // Fall back to in-memory seed data
  if (slug) {
    const brand = seedBrands.find((b) => b.slug === slug);
    if (brand) {
      return NextResponse.json({
        brand: { ...brand, id: brand.slug, logo_url: null, sources: [] },
      });
    }
    return NextResponse.json({ error: "Brand not found" }, { status: 404 });
  }

  if (q) {
    const lower = q.toLowerCase();
    const matches = seedBrands
      .filter((b) => b.name.toLowerCase().includes(lower))
      .slice(0, limit)
      .map((b) => ({
        id: b.slug,
        name: b.name,
        slug: b.slug,
        indigo_score: b.indigo_score,
        grade: b.grade,
        certifications: b.certifications,
      }));
    return NextResponse.json({ brands: matches });
  }

  // Return all brands paginated
  const offset = Number(searchParams.get("offset") ?? "0");
  const tier = searchParams.get("tier");
  let filtered = [...seedBrands];
  if (tier) {
    const ranges: Record<string, [number, number]> = {
      "a-plus": [85, 100],
      a: [70, 84],
      b: [55, 69],
      c: [40, 54],
      d: [25, 39],
      f: [0, 24],
    };
    const range = ranges[tier];
    if (range) {
      filtered = filtered.filter(
        (b) => b.indigo_score >= range[0] && b.indigo_score <= range[1]
      );
    }
  }
  filtered.sort((a, b) => b.indigo_score - a.indigo_score);

  return NextResponse.json({
    brands: filtered.slice(offset, offset + limit).map((b) => ({
      id: b.slug,
      name: b.name,
      slug: b.slug,
      indigo_score: b.indigo_score,
      grade: b.grade,
      certifications: b.certifications,
      red_flags: b.red_flags,
      green_flags: b.green_flags,
    })),
    total: filtered.length,
  });
}
