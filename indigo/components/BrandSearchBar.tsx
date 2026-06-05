"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getGrade } from "@/lib/scoring/calculateScore";

interface BrandResult {
  id: string;
  name: string;
  slug: string;
  indigo_score: number | null;
  grade: string | null;
  certifications: string[] | null;
}

interface Props {
  placeholder?: string;
  autoFocus?: boolean;
  onSelect?: (brand: BrandResult) => void;
}

export default function BrandSearchBar({
  placeholder = "Search brands…",
  autoFocus = false,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BrandResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/brands?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.brands ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (brand: BrandResult) => {
    setOpen(false);
    setQuery("");
    if (onSelect) {
      onSelect(brand);
    } else {
      router.push(`/brand/${brand.slug}`);
    }
  };

  const gradeColor = (score: number | null) => {
    if (score === null) return "#9B7FE8";
    return getGrade(score).color;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9B7FE8] text-lg">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-[rgba(45,27,105,0.3)] border border-[rgba(155,127,232,0.2)] text-[#F7F5FF] placeholder-[#9B7FE8] font-body text-sm focus:outline-none focus:border-[#9B7FE8] focus:ring-1 focus:ring-[rgba(155,127,232,0.3)] transition-colors"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9B7FE8] animate-pulse text-xs">
            ···
          </span>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A0F3A] border border-[rgba(155,127,232,0.2)] rounded-xl overflow-hidden z-50 shadow-xl shadow-black/40">
          {results.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleSelect(brand)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[rgba(91,63,191,0.2)] transition-colors text-left border-b border-[rgba(155,127,232,0.08)] last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-[#F7F5FF] truncate">
                  {brand.name}
                </p>
                {brand.certifications && brand.certifications.length > 0 && (
                  <p className="text-xs text-[#9B7FE8] mt-0.5 truncate">
                    {brand.certifications.slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
              {brand.indigo_score !== null && (
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <span
                    className="text-xs font-mono font-bold tabular-nums"
                    style={{ color: gradeColor(brand.indigo_score) }}
                  >
                    {brand.indigo_score}
                  </span>
                  <span
                    className="text-xs font-display font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      color: gradeColor(brand.indigo_score),
                      backgroundColor: `${gradeColor(brand.indigo_score)}20`,
                    }}
                  >
                    {brand.grade}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
