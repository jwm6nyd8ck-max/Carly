"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      <div className="px-6 pt-12 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <p className="label mb-1">Account</p>
        <h1 className="font-display text-2xl" style={{ color: "var(--text-cream)", fontWeight: 300 }}>Profile</h1>
      </div>

      <div className="max-w-xl mx-auto px-6">
        {/* Auth */}
        <div className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="text-sm font-body mb-1" style={{ color: "var(--text-warm)" }}>Not signed in</p>
          <p className="text-xs font-body mb-6" style={{ color: "var(--text-muted)" }}>
            Sign in to sync your wardrobe across devices and access your scan history.
          </p>
          <div className="flex flex-col gap-3">
            <button className="w-full py-3.5 text-xs font-body transition-colors"
              style={{ background: "var(--bg-raised)", border: "1px solid rgba(180,160,110,0.3)", borderRadius: 2, color: "var(--text-cream)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Sign in with Email
            </button>
            <button className="w-full py-3.5 text-xs font-body transition-colors"
              style={{ border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Continue with Google
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="label mb-5">Activity</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "47", label: "Scans" },
              { value: "71", label: "Avg Score" },
              { value: "4",  label: "Saved" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-3xl italic" style={{ color: "var(--text-cream)" }}>{value}</p>
                <p className="label mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plan */}
        <div className="py-8" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="label">Current Plan</p>
            <span className="text-xs font-body px-2.5 py-1"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-warm)" }}>
              Free
            </span>
          </div>
          <p className="text-sm font-body mb-6" style={{ color: "var(--text-warm)" }}>10 scans/day · 20 wardrobe items</p>
          <Link href="/upgrade">
            <button className="w-full py-3 text-xs font-body"
              style={{ background: "var(--bg-card)", border: "1px solid rgba(180,160,110,0.25)", borderRadius: 2, color: "var(--text-cream)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              View Upgrade Options
            </button>
          </Link>
        </div>

        {/* Settings */}
        <div className="py-6">
          {[
            "Notifications",
            "Suggest a Brand",
            "Export Wardrobe Report",
            "Privacy Policy",
            "Help & Support",
          ].map((item, i, arr) => (
            <button key={item}
              className="w-full flex items-center justify-between py-4 text-left transition-colors"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none" }}>
              <span className="text-sm font-body" style={{ color: "var(--text-warm)" }}>{item}</span>
              <span style={{ color: "var(--text-muted)" }}>›</span>
            </button>
          ))}
        </div>

        <p className="text-center text-xs font-body py-6" style={{ color: "var(--text-muted)" }}>
          Indigo v1.0 — built for transparency in fashion
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
