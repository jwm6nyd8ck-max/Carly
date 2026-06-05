import { NextRequest, NextResponse } from "next/server";
import { calculateIndigoScore } from "@/lib/scoring/calculateScore";
import type { ScoringInput } from "@/lib/scoring/calculateScore";

export async function POST(req: NextRequest) {
  try {
    const body: ScoringInput = await req.json();

    if (!body.fibers || !Array.isArray(body.fibers)) {
      return NextResponse.json(
        { error: "fibers array required" },
        { status: 400 }
      );
    }

    const score = calculateIndigoScore(body);
    return NextResponse.json(score);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
