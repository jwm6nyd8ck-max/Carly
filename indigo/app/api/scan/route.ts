import { NextRequest, NextResponse } from "next/server";
import { seedBrands } from "@/data/seedBrands";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode") ?? "";
  const brandName = searchParams.get("brand") ?? "";

  // Try barcode lookup in items table
  if (barcode) {
    try {
      const { data: item } = await supabase
        .from("items")
        .select("*, brands(*)")
        .eq("barcode", barcode)
        .single();

      if (item) {
        return NextResponse.json({ type: "item", data: item });
      }
    } catch {}
  }

  // Search brand by name or barcode prefix
  const query = brandName || barcode;
  if (query) {
    const lower = query.toLowerCase().replace(/[^a-z0-9 ]/g, "");
    const brand = seedBrands.find(
      (b) =>
        b.name.toLowerCase().includes(lower) ||
        b.slug.replace(/-/g, " ").includes(lower)
    );

    if (brand) {
      return NextResponse.json({
        type: "brand",
        data: {
          ...brand,
          id: brand.slug,
          logo_url: null,
          sources: [],
        },
      });
    }
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
