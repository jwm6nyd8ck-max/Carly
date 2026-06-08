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

export default function BrandSearchBar({ placeholder = "Search brands…", autoFocus = false, onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BrandResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/brands?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.brands ?? []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 280);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (brand: BrandResult) => {
    setOpen(false); setQuery("");
    if (onSelect) onSelect(brand);
    else router.push(`/brand/${brand.slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full px-4 py-3 text-sm font-body transition-colors"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 4,
            color: "var(--text-cream)",
            outline: "none",
            letterSpacing: "0.02em",
          }}
          onFocusCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "rgba(180,160,110,0.4)"; }}
          onBlurCapture={(e) => { (e.target as HTMLInputElement).style.borderColor = "var(--border)"; }}
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--text-warm)" }}>
            ...
          </span>
        )}
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 overflow-hidden"
          style={{ background: "var(--bg-raised)", border: "1px solid var(--border)", borderRadius: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          {results.map((brand) => {
            const { color } = getGrade(brand.indigo_score ?? 0);
            return (
              <button key={brand.id} onClick={() => handleSelect(brand)}
                className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(180,160,110,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                <p className="text-sm font-body" style={{ color: "var(--text-cream)" }}>{brand.name}</p>
                {brand.indigo_score !== null && (
                  <span className="text-sm font-display italic ml-3" style={{ color }}>{brand.indigo_score}</span>
                )}
              </button>
            );
          })}
          <button
            onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
            className="w-full px-4 py-3 text-left text-xs font-body"
            style={{ color: "var(--text-warm)", letterSpacing: "0.06em" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(180,160,110,0.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            Search &ldquo;{query}&rdquo; as item →
          </button>
        </div>
      )}
    </div>
  );
}
