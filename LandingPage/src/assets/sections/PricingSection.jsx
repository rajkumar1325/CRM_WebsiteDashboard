// ─── sections/PricingSection.jsx ─────────────────────────────────────────────
// 3-plan pricing grid with toggler and hover selection.
// Props: focusAuthCard — scrolls to auth card when CTA clicked

import { useState } from "react";
import { Icon } from "../shared/Icons";
import { PLANS } from "../data";

export default function PricingSection({ focusAuthCard }) {
  const [selectedPlan, setSelectedPlan] = useState("Growth");

  return (
    <section id="pricing" className="py-14 border-t border-white/5">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/60 mb-3">
          Pricing
        </p>
        <h2 className="lp-display text-2xl sm:text-3xl font-bold text-white">
          Simple, honest pricing.
        </h2>
        <p className="text-sm text-white/35 mt-2">Scale from solo to enterprise. Pay as you grow.</p>
      </div>

      {/* Plan toggler */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-white/4 border border-white/6 rounded-full p-1 gap-1">
          {PLANS.map(plan => (
            <button
              key={plan.key}
              onClick={() => setSelectedPlan(plan.key)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                selectedPlan === plan.key
                  ? "lp-btn-primary text-black"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {plan.key}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {PLANS.map(plan => (
          <div
            key={plan.key}
            onClick={() => setSelectedPlan(plan.key)}
            className={`glass-card rounded-2xl p-5 flex flex-col cursor-pointer lp-card-hover transition-all duration-300 ${
              selectedPlan === plan.key ? "scale-[1.02]" : ""
            }`}
            style={{
              borderColor: selectedPlan === plan.key ? plan.border : "rgba(255,255,255,0.06)",
              boxShadow:   selectedPlan === plan.key ? `0 0 40px ${plan.accent}20` : "none",
            }}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="inline-flex items-center self-start gap-1 rounded-full px-2.5 py-1 mb-3 text-[10px] font-bold text-black lp-btn-primary">
                Most popular
              </div>
            )}

            <h3 className="lp-display text-base font-bold text-white mb-1">{plan.key}</h3>
            <p className="text-xs text-white/35 mb-4">{plan.sub}</p>

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-bold" style={{ color: plan.accent }}>
                {plan.price}
              </span>
              {plan.key !== "Scale" && (
                <span className="text-xs text-white/30">/ user / mo</span>
              )}
            </div>

            {/* Feature list */}
            <ul className="space-y-2 mb-6 flex-1">
              {plan.points.map((pt, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${plan.accent}15`, color: plan.accent }}
                  >
                    <Icon.Check />
                  </div>
                  {pt}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={e => { e.stopPropagation(); focusAuthCard(); }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                plan.popular
                  ? "lp-btn-primary text-black"
                  : "border text-white/60 hover:text-white hover:border-white/25"
              }`}
              style={!plan.popular ? { borderColor: "rgba(255,255,255,0.1)" } : {}}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
