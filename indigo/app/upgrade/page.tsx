"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/forever",
    cta: "Current Plan",
    disabled: true,
    features: [
      { label: "10 scans per day", included: true },
      { label: "Basic score + 3 pillars", included: true },
      { label: "Brand search (top 200)", included: true },
      { label: "Wardrobe (up to 20 items)", included: true },
      { label: "Full 5-pillar breakdown", included: false },
      { label: "Full flag explanations", included: false },
      { label: "Clean alternatives", included: false },
      { label: "Unlimited scans", included: false },
      { label: "Export impact report", included: false },
    ],
  },
  {
    id: "plus",
    name: "Indigo+",
    price: "$4.99",
    priceAnnual: "$3.33",
    period: "/month",
    cta: "Start 14-Day Free Trial",
    highlight: true,
    features: [
      { label: "Unlimited scans", included: true },
      { label: "Full 5-pillar breakdown", included: true },
      { label: "Full flag explanations with sources", included: true },
      { label: "Clean alternatives with links", included: true },
      { label: "Unlimited wardrobe", included: true },
      { label: "Export wardrobe impact report", included: true },
      { label: "Web extension (30 items/mo)", included: true },
      { label: "API access", included: false },
      { label: "Priority re-rating requests", included: false },
    ],
  },
  {
    id: "pro",
    name: "Indigo Pro",
    price: "$9.99",
    priceAnnual: "$8.33",
    period: "/month",
    cta: "Start Free Trial",
    features: [
      { label: "Everything in Indigo+", included: true },
      { label: "Unlimited web extension", included: true },
      { label: "API access for personal use", included: true },
      { label: "Priority re-rating requests", included: true },
      { label: "Early access to new features", included: true },
      { label: "", included: false },
      { label: "", included: false },
      { label: "", included: false },
      { label: "", included: false },
    ],
  },
];

export default function UpgradePage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0A1E] pb-28">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 text-center max-w-2xl mx-auto">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-xs font-body text-[#9B7FE8] mb-6"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-display font-bold text-[#F7F5FF] mb-2">
          Upgrade Indigo
        </h1>
        <p className="text-sm font-body text-[#9B7FE8]">
          Support transparent fashion data. No credit card required for trial.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm font-body ${!annual ? "text-[#F7F5FF]" : "text-[#9B7FE8]"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              annual ? "bg-[#5B3FBF]" : "bg-[rgba(155,127,232,0.2)]"
            }`}
            aria-pressed={annual}
            aria-label="Toggle annual billing"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                annual ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
          <span className={`text-sm font-body ${annual ? "text-[#F7F5FF]" : "text-[#9B7FE8]"}`}>
            Annual
          </span>
          {annual && (
            <span className="text-xs font-body px-2 py-0.5 rounded-full bg-[rgba(45,184,122,0.15)] text-[#2DB87A] border border-[rgba(45,184,122,0.3)]">
              Save 33%
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col gap-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-5 border ${
                plan.highlight
                  ? "bg-gradient-to-br from-[rgba(91,63,191,0.3)] to-[rgba(45,27,105,0.4)] border-[#5B3FBF] shadow-xl shadow-[rgba(91,63,191,0.2)]"
                  : "bg-[rgba(45,27,105,0.2)] border-[rgba(155,127,232,0.15)]"
              }`}
            >
              {plan.highlight && (
                <div className="flex justify-center mb-3">
                  <span className="text-xs font-body font-medium px-3 py-1 rounded-full bg-[#5B3FBF] text-[#C8B8FF]">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-base font-display font-bold text-[#F7F5FF]">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-bold text-[#9B7FE8]">
                      {annual && plan.priceAnnual ? plan.priceAnnual : plan.price}
                    </span>
                    <span className="text-xs font-body text-[rgba(155,127,232,0.5)]">
                      {plan.period}
                    </span>
                  </div>
                  {annual && plan.priceAnnual && (
                    <p className="text-[10px] font-body text-[rgba(155,127,232,0.5)] mt-0.5">
                      billed annually
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {plan.features
                  .filter((f) => f.label)
                  .map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className={`text-xs flex-shrink-0 ${
                          feature.included ? "text-[#2DB87A]" : "text-[rgba(155,127,232,0.3)]"
                        }`}
                      >
                        {feature.included ? "✓" : "–"}
                      </span>
                      <span
                        className={`text-xs font-body ${
                          feature.included ? "text-[#C8B8FF]" : "text-[rgba(155,127,232,0.3)]"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </div>
                  ))}
              </div>

              <button
                disabled={plan.disabled}
                className={`w-full py-3 rounded-xl text-sm font-body font-medium transition-all ${
                  plan.disabled
                    ? "bg-[rgba(155,127,232,0.1)] text-[rgba(155,127,232,0.4)] cursor-not-allowed"
                    : plan.highlight
                    ? "bg-gradient-to-r from-[#5B3FBF] to-[#2D1B69] text-white shadow-lg shadow-[rgba(91,63,191,0.3)] hover:shadow-[rgba(91,63,191,0.5)]"
                    : "border border-[rgba(155,127,232,0.3)] text-[#9B7FE8] hover:bg-[rgba(155,127,232,0.1)]"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] font-body text-[rgba(155,127,232,0.3)] mt-6 mb-2">
          14-day free trial · Cancel any time · Secure payment via Stripe
        </p>
        <p className="text-center text-[10px] font-body text-[rgba(155,127,232,0.2)]">
          By upgrading you help fund independent research into fashion supply chains.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
