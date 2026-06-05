"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Scanner from "@/components/Scanner";
import BottomNav from "@/components/BottomNav";

export default function ScanPage() {
  const router = useRouter();
  const [result, setResult] = useState<{
    brand?: { name: string; slug: string; indigo_score: number; grade: string };
    error?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (value: string) => {
    setLoading(true);
    try {
      const isBarcode = /^\d{8,14}$/.test(value);
      const url = isBarcode
        ? `/api/scan?barcode=${encodeURIComponent(value)}`
        : `/api/scan?brand=${encodeURIComponent(value)}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.data) {
        router.push(`/brand/${data.data.slug}`);
      } else {
        setResult({ error: `No results found for "${value}"` });
      }
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-24">
      <Scanner onResult={handleScan} />
      {loading && (
        <div className="fixed inset-0 z-50 bg-[rgba(15,10,30,0.9)] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[#9B7FE8] border-t-transparent animate-spin" />
          <p className="text-sm font-body text-[#9B7FE8]">Looking up…</p>
        </div>
      )}
      {result?.error && (
        <div className="fixed bottom-24 left-4 right-4 z-50 rounded-xl p-4 bg-[rgba(232,68,51,0.1)] border border-[rgba(232,68,51,0.3)]">
          <p className="text-sm font-body text-[#E84433] text-center">{result.error}</p>
          <button
            onClick={() => setResult(null)}
            className="w-full mt-2 text-xs font-body text-[rgba(155,127,232,0.7)] underline"
          >
            Dismiss
          </button>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
