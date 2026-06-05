"use client";

import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const STATS = [
  { label: "Total Scans", value: "47", icon: "📷" },
  { label: "Avg Score", value: "71", icon: "⭐" },
  { label: "Items Saved", value: "4", icon: "👗" },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-28">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="pt-12 pb-6">
          <h1 className="text-2xl font-display font-bold text-[#F7F5FF]">
            Profile
          </h1>
        </div>

        {/* User card */}
        <div className="glass rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B3FBF] to-[#2D1B69] flex items-center justify-center text-2xl shadow-lg shadow-[rgba(91,63,191,0.3)]">
            👤
          </div>
          <div className="flex-1">
            <p className="text-sm font-body font-semibold text-[rgba(155,127,232,0.5)]">
              Not signed in
            </p>
            <p className="text-xs font-body text-[rgba(155,127,232,0.4)] mt-1">
              Sign in to sync your wardrobe across devices
            </p>
          </div>
        </div>

        {/* Auth buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#5B3FBF] to-[#2D1B69] text-sm font-body font-medium text-white shadow-lg shadow-[rgba(91,63,191,0.3)] hover:shadow-[rgba(91,63,191,0.5)] transition-all">
            Sign in with Email
          </button>
          <button className="w-full py-3 rounded-xl border border-[rgba(155,127,232,0.25)] text-sm font-body text-[#C8B8FF] hover:bg-[rgba(155,127,232,0.1)] transition-colors flex items-center justify-center gap-2">
            <span>G</span>
            Sign in with Google
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {STATS.map(({ label, value, icon }) => (
            <div
              key={label}
              className="glass rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-xl">{icon}</span>
              <p className="text-lg font-mono font-bold text-[#9B7FE8]">{value}</p>
              <p className="text-[9px] font-body text-[rgba(155,127,232,0.5)] uppercase tracking-wider text-center leading-tight">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Subscription card */}
        <div className="rounded-2xl p-5 bg-gradient-to-br from-[rgba(45,27,105,0.4)] to-[rgba(91,63,191,0.2)] border border-[rgba(155,127,232,0.2)] mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-body text-[#9B7FE8]">Current plan</p>
              <p className="text-base font-display font-bold text-[#F7F5FF]">
                Indigo Free
              </p>
            </div>
            <span className="px-2 py-1 rounded-full bg-[rgba(155,127,232,0.1)] text-xs font-body text-[#9B7FE8] border border-[rgba(155,127,232,0.2)]">
              Free
            </span>
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            {[
              { label: "Scans per day", free: "10", plus: "Unlimited" },
              { label: "Wardrobe items", free: "20", plus: "Unlimited" },
              { label: "Full flag explanations", free: "—", plus: "✓" },
              { label: "Clean alternatives", free: "—", plus: "✓" },
            ].map(({ label, free, plus }) => (
              <div key={label} className="flex items-center justify-between text-xs font-body">
                <span className="text-[#9B7FE8]">{label}</span>
                <span className="text-[rgba(155,127,232,0.5)]">
                  {free} <span className="mx-1 opacity-30">→</span>
                  <span className="text-[#2DB87A]">{plus}</span>
                </span>
              </div>
            ))}
          </div>
          <Link href="/upgrade">
            <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5B3FBF] to-[#2D1B69] text-sm font-body font-medium text-white shadow-lg shadow-[rgba(91,63,191,0.3)] hover:shadow-[rgba(91,63,191,0.5)] transition-all">
              Upgrade to Indigo+ — $4.99/mo
            </button>
          </Link>
        </div>

        {/* Settings list */}
        <div className="glass rounded-2xl overflow-hidden mb-6">
          {[
            { icon: "🔔", label: "Notifications" },
            { icon: "🌐", label: "Language" },
            { icon: "📤", label: "Export Wardrobe Report" },
            { icon: "💬", label: "Suggest a Brand" },
            { icon: "⭐", label: "Rate Indigo" },
            { icon: "📄", label: "Privacy Policy" },
            { icon: "❓", label: "Help & Support" },
          ].map(({ icon, label }) => (
            <button
              key={label}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[rgba(155,127,232,0.05)] transition-colors border-b border-[rgba(155,127,232,0.08)] last:border-b-0 text-left"
            >
              <span className="text-base w-6 text-center">{icon}</span>
              <span className="text-sm font-body text-[#C8B8FF] flex-1">{label}</span>
              <span className="text-[rgba(155,127,232,0.3)]">›</span>
            </button>
          ))}
        </div>

        <p className="text-center text-[10px] font-body text-[rgba(155,127,232,0.3)] mb-8">
          Indigo v1.0.0 · Built on the principle that consumers deserve to know.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
