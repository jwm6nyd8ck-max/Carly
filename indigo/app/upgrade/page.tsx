"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    disabled: true,
    cta: "Current Plan",
    features: ["10 scans per day", "Basic score overview", "Brand search", "Wardrobe up to 20 items"],
    missing: ["Full 5-pillar breakdown", "Flag explanations with sources", "Clean alternatives", "Unlimited scans"],
  },
  {
    id: "plus",
    name: "Indigo+",
    monthly: "$4.99",
    annual: "$3.33",
    cta: "Start 14-Day Free Trial",
    highlight: true,
    features: ["Unlimited scans", "Full 5-pillar breakdown", "Flag explanations with sources", "Clean alternatives with links", "Unlimited wardrobe", "Wardrobe impact report"],
    missing: ["API access", "Priority re-rating requests"],
  },
  {
    id: "pro",
    name: "Indigo Pro",
    monthly: "$9.99",
    annual: "$8.33",
    cta: "Start Free Trial",
    features: ["Everything in Indigo+", "API access for personal use", "Priority re-rating requests", "Early access to new features", "Unlimited web extension"],
    missing: [],
  },
];

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-deep)" }}>
      <div className="px-6 pt-12 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <Link href="/profile">
          <span className="label" style={{ color: "var(--text-warm)" }}>Back</span>
        </Link>
        <h1 className="font-display text-2xl mt-4" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
          Support Transparency
        </h1>
        <p className="text-sm font-body mt-2" style={{ color: "var(--text-warm)" }}>
          No credit card required for your 14-day trial.
        </p>
      </div>

      <div className="max-w-xl mx-auto px-6">
        {/* Billing toggle */}
        <div className="flex items-center gap-4 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="label">Billing</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setAnnual(false)}
              className="text-xs font-body" style={{ color: annual ? "var(--text-muted)" : "var(--text-cream)" }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(!annual)}
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{ background: annual ? "#6B8C5F" : "var(--bg-raised)", border: "1px solid var(--border)" }}>
              <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                style={{ transform: annual ? "translateX(20px)" : "translateX(2px)" }} />
            </button>
            <button onClick={() => setAnnual(true)}
              className="text-xs font-body" style={{ color: annual ? "var(--text-cream)" : "var(--text-muted)" }}>
              Annual <span style={{ color: "#6B8C5F" }}>— save 33%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="flex flex-col gap-4 py-6">
          {PLANS.map(plan => (
            <div key={plan.id} className="p-5"
              style={{
                background: plan.highlight ? "var(--bg-raised)" : "var(--bg-card)",
                border: `1px solid ${plan.highlight ? "rgba(180,160,110,0.35)" : "var(--border)"}`,
                borderRadius: 4,
              }}>
              {plan.highlight && (
                <p className="label mb-3" style={{ color: "#B8A060" }}>Most Popular</p>
              )}
              <div className="flex items-end justify-between mb-4">
                <p className="font-display text-xl" style={{ color: "var(--text-cream)", fontWeight: 300 }}>
                  {plan.name}
                </p>
                <div className="text-right">
                  <p className="font-display text-2xl italic" style={{ color: "var(--text-cream)" }}>
                    {plan.id === "free" ? plan.price : annual ? plan.annual : plan.monthly}
                  </p>
                  {plan.id !== "free" && (
                    <p className="label">{annual ? "per month, billed annually" : "per month"}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {plan.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-xs flex-shrink-0" style={{ color: "#6B8C5F" }}>+</span>
                    <span className="text-xs font-body" style={{ color: "var(--text-warm)" }}>{f}</span>
                  </div>
                ))}
                {plan.missing.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>—</span>
                    <span className="text-xs font-body" style={{ color: "var(--text-muted)" }}>{f}</span>
                  </div>
                ))}
              </div>

              <button disabled={plan.disabled}
                className="w-full py-3 text-xs font-body transition-all"
                style={{
                  background: plan.disabled ? "transparent" : plan.highlight ? "rgba(180,160,110,0.12)" : "transparent",
                  border: `1px solid ${plan.disabled ? "var(--border)" : "rgba(180,160,110,0.3)"}`,
                  borderRadius: 2,
                  color: plan.disabled ? "var(--text-muted)" : "var(--text-cream)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: plan.disabled ? "not-allowed" : "pointer",
                }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs font-body py-4 mb-6" style={{ color: "var(--text-muted)" }}>
          Cancel any time · Secure payment via Stripe · Proceeds fund independent supply chain research
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
